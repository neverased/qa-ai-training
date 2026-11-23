'use strict';

(() => {
  // A small, self-contained PDF writer for the fixed layout of this confirmation.
  const euros = cents => 'EUR ' + (cents / 100).toLocaleString('en-GB', {
    minimumFractionDigits: 2, maximumFractionDigits: 2
  });
  const literal = text => String(text).replace(/[^\x20-\x7e]/g, ' ').replace(/[()\\]/g, char => '\\' + char);
  const line = (text, x, y, size = 11, bold = false) =>
    'BT /' + (bold ? 'F2' : 'F1') + ' ' + size + ' Tf 0.10 0.19 0.19 rg 1 0 0 1 ' +
    x + ' ' + y + ' Tm (' + literal(text) + ') Tj ET\n';

  function createPdf(order) {
    const batchSize = 8;
    const groups = [];
    for (let i = 0; i < order.quote.lines.length; i += batchSize) groups.push(order.quote.lines.slice(i, i + batchSize));
    const objects = [
      '<< /Type /Catalog /Pages 2 0 R >>',
      '<< /Type /Pages /Count ' + groups.length + ' /Kids [' + groups.map((_, i) => (5 + i * 2) + ' 0 R').join(' ') + '] >>',
      '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
      '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>'
    ];
    groups.forEach((items, page) => {
      let content = line('ColourHub Trade Portal', 45, 790, 14, true) +
        line('Order confirmation', 45, 746, 25, true) +
        line(order.id + '   /   Build ' + order.build, 45, 716) +
        line('Order status: ' + order.status, 45, 692, 14, true) +
        line(order.delivery + ' delivery on ' + order.deliveryDate, 45, 670) +
        line('Product and pack', 45, 622, 10, true) +
        line('Packs', 278, 622, 10, true) + line('Discount', 342, 622, 10, true) + line('Line net', 451, 622, 10, true);
      items.forEach((item, i) => {
        const y = 594 - i * 49;
        const product = window.ColourHub.products.find(p => p.sku === item.sku);
        content += line(product.name + ' / ' + item.pack + ' L', 45, y, 12, true) +
          line(item.sku + ' at ' + euros(item.unitCents) + (item.tint ? ' / ' + item.tint : ''), 45, y - 16, 9) +
          line(item.qty, 278, y) + line(item.discountPercent + '%', 347, y) + line(euros(item.netCents), 451, y);
      });
      if (page === groups.length - 1) {
        const y = 580 - items.length * 49;
        content += line('Line subtotal', 45, y) + line(euros(order.quote.grossCents), 350, y) +
          line('Volume discount', 45, y - 20) + line(euros(order.quote.discountCents), 350, y - 20) +
          line('Order net total', 45, y - 48, 15, true) + line(euros(order.quote.netCents), 350, y - 48, 15, true);
      }
      content += line('Fictional training order. All prices exclude tax.', 45, 51, 9) +
        line((page + 1) + ' / ' + groups.length, 507, 51, 9);
      const streamId = 6 + page * 2;
      objects.push('<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ' + streamId + ' 0 R >>');
      objects.push('<< /Length ' + content.length + ' >>\nstream\n' + content + 'endstream');
    });
    let body = '%PDF-1.4\n';
    const offsets = [0];
    objects.forEach((obj, i) => { offsets.push(body.length); body += (i + 1) + ' 0 obj\n' + obj + '\nendobj\n'; });
    const start = body.length;
    body += 'xref\n0 ' + offsets.length + '\n0000000000 65535 f \n' +
      offsets.slice(1).map(pos => String(pos).padStart(10, '0') + ' 00000 n \n').join('') +
      'trailer\n<< /Size ' + offsets.length + ' /Root 1 0 R >>\nstartxref\n' + start + '\n%%EOF\n';
    return new Blob([body], {type:'application/pdf'});
  }
  window.downloadColourHubConfirmation = order => {
    const url = URL.createObjectURL(createPdf(order));
    const anchor = document.createElement('a');
    anchor.href = url; anchor.download = 'ColourHub-' + order.id + '.pdf';
    document.body.append(anchor); anchor.click(); anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 10000);
  };
})();
