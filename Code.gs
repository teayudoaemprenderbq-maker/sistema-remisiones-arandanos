const SPREADSHEET_ID = '1O4LqLbH2LbFLmVRgMQ1kbQYR4uVjrZ84zvq9kS61QCo';

function doGet() {
  return HtmlService.createTemplateFromFile('index')
    .evaluate()
    .setTitle('Arándanos de Vida - Sistema de Remisiones')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function getSpreadsheet() {
  try {
    return SpreadsheetApp.openById(SPREADSHEET_ID);
  } catch (error) {
    throw new Error('No se pudo acceder a la hoja de cálculo. Verifique el ID y permisos. Detalle: ' + error.message);
  }
}

function obtenerUltimoConsecutivo() {
  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName('CONSECUTIVO');
  if (!sheet) {
    throw new Error("La pestaña 'CONSECUTIVO' no existe.");
  }
  const valor = sheet.getRange('A1').getValue();
  const numero = parseInt(valor, 10);
  return isNaN(numero) ? 0 : numero;
}

function incrementarConsecutivo() {
  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName('CONSECUTIVO');
  if (!sheet) {
    throw new Error("La pestaña 'CONSECUTIVO' no existe.");
  }
  const actual = obtenerUltimoConsecutivo();
  const nuevo = actual + 1;
  sheet.getRange('A1').setValue(nuevo);
  SpreadsheetApp.flush();
  return nuevo;
}

function obtenerClientes() {
  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName('CLIENTES');
  if (!sheet) {
    throw new Error("La pestaña 'CLIENTES' no existe.");
  }
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];
  
  const headers = data[0].map(h => h.toString().toLowerCase().trim());
  const clientes = [];
  
  for (let i = 1; i < data.length; i++) {
    let row = data[i];
    let cliente = {};
    headers.forEach((header, index) => {
      cliente[header] = row[index];
    });
    if (cliente.id && cliente.nombre) {
      clientes.push(cliente);
    }
  }
  return clientes;
}

function obtenerProductos() {
  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName('PRODUCTOS');
  if (!sheet) {
    throw new Error("La pestaña 'PRODUCTOS' no existe.");
  }
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];
  
  const headers = data[0].map(h => h.toString().toLowerCase().trim());
  const productos = [];
  
  for (let i = 1; i < data.length; i++) {
    let row = data[i];
    let producto = {};
    headers.forEach((header, index) => {
      producto[header] = row[index];
    });
    if (producto.id && producto.nombre) {
      productos.push(producto);
    }
  }
  return productos;
}

function guardarRemision(remisionData) {
  const ss = getSpreadsheet();
  let sheet = ss.getSheetByName('REMISIONES');
  
  if (!sheet) {
    sheet = ss.insertSheet('REMISIONES');
    const headers = [
      'consecutivo', 'fecha', 'cliente_id', 'cliente_nombre', 'cliente_nit', 
      'cliente_direccion', 'cliente_telefono', 'producto_id', 'producto_nombre', 
      'cantidad', 'precio_unitario', 'subtotal', 'iva_19', 'total', 'estado'
    ];
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold').setBackground('#1e3a8a').setFontColor('#ffffff');
  }
  
  const nuevaFila = [
    remisionData.consecutivo,
    remisionData.fecha,
    remisionData.cliente_id,
    remisionData.cliente_nombre,
    remisionData.cliente_nit,
    remisionData.cliente_direccion,
    remisionData.cliente_telefono,
    remisionData.producto_id,
    remisionData.producto_nombre,
    Number(remisionData.cantidad),
    Number(remisionData.precio_unitario),
    Number(remisionData.subtotal),
    Number(remisionData.iva_19),
    Number(remisionData.total),
    remisionData.estado || 'Activa'
  ];
  
  sheet.appendRow(nuevaFila);
  SpreadsheetApp.flush();
  return remisionData.consecutivo;
}
