import { useState, useMemo, useEffect } from "react";

// ════════════════════════════════════════════════════════
//  ECOSYSTEM DATA
// ════════════════════════════════════════════════════════

const ecosystemLayers = [
  {
    id: "security", name: "Security", color: "#f5f5f5", accent: "#C62828", icon: "🛡",
    description: "Protección perimetral, identidad, endpoints y autenticación multifactor",
    items: [
      { name: "FortiGate", type: "Firewall / UTM", icon: "🔥" },
      { name: "Microsoft Defender", type: "Endpoint Protection", icon: "🛡" },
      { name: "LastPass", type: "Password Manager", icon: "🔑" },
      { name: "Duo", type: "MFA / Autenticación", icon: "🔐" },
    ]
  },
  {
    id: "data", name: "Data", color: "#f5f5f5", accent: "#0097A7", icon: "🗄",
    description: "Almacenamiento, inteligencia de negocios, respaldos y calidad de datos",
    items: [
      { name: "Power BI / Fabric", type: "BI & Analytics", icon: "📊" },
      { name: "Ifx Cloud Codisa", type: "Back Up", icon: "☁" },
      { name: "Réplicas SQL Server", type: "Base de datos réplica", icon: "🔁" },
      { name: "Cubos OLAP", type: "Data Management", icon: "🧊" },
    ]
  },
  {
    id: "infrastructure", name: "Infrastructure", color: "#f5f5f5", accent: "#2E7D32", icon: "🖥",
    description: "Infraestructura de servidores on-premises y servicios cloud",
    items: [
      { name: "On Premises", type: "Servidores físicos CR + VE", icon: "🖥" },
      { name: "AWS", type: "Cloud Services", icon: "☁" },
    ]
  },
  {
    id: "middleware", name: "Integration / Middleware", color: "#f5f5f5", accent: "#6A1B9A", icon: "🔗",
    description: "Capa de integración y orquestación entre sistemas del ecosistema",
    items: [
      { name: "Middleware / API", type: "Orquestación de datos", icon: "🔗" },
      { name: "n8n", type: "Workflow Automation", icon: "⚙" },
      { name: "dl_intercambio", type: "Staging SQL Server", icon: "🗃" },
    ]
  },
];

const businessDomains = [
  {
    name: "Gestión de Ventas", color: "#16a085",
    items: [
      { name: "AFV", type: "Automatización Fuerza de Ventas — pedidos, cobros, visitas en ruta" },
      { name: "FR", type: "Formularios / Registro — captura de datos de venta" },
      { name: "Catálogo Digital", type: "E-commerce" },
      { name: "Portal Pedidos", type: "Portal web" },
      { name: "Portal de Clientes", type: "Self-service" },
    ]
  },
  {
    name: "Gestión de Crédito y Cobro", color: "#27ae60",
    items: [
      { name: "Sage XRT", type: "Conciliación bancaria" },
      { name: "Host to Host", type: "Conexión bancaria H2H" },
      { name: "The Factory HKA", type: "Imprenta digital / DTE" },
      { name: "GTI / FE", type: "Factura Electrónica" },
      { name: "Galac", type: "Nómina / Fiscal Venezuela" },
      { name: "SPI", type: "Pagos interbancarios" },
    ]
  },
  {
    name: "Gestión de Despacho y Transporte", color: "#2980b9",
    items: [
      { name: "WMS ePrac", type: "Warehouse Management" },
      { name: "Torre de Control", type: "Planificador de viajes y rutas" },
      { name: "Trade", type: "Comercio exterior" },
      { name: "Última milla", type: "Logística last mile" },
    ]
  },
  {
    name: "Gestión de Compras", color: "#d35400",
    items: [
      { name: "Streamline GMDH", type: "Demand Planning / Pronósticos" },
      { name: "Portal de Proveedores", type: "Portal web MPPV" },
    ]
  },
  {
    name: "Data Entry & EDI", color: "#8e44ad",
    items: [
      { name: "AFV", type: "Pedidos, cobros, visitas desde ruta" },
      { name: "Portal Pedidos", type: "Pedidos desde clientes web" },
      { name: "EDI", type: "Intercambio electrónico de datos" },
      { name: "Google Workspace", type: "Productividad corporativa" },
    ]
  },
  {
    name: "Marketing & Comunicación", color: "#e74c3c",
    items: [
      { name: "Respond.io", type: "Mensajería omnicanal" },
      { name: "Planable", type: "Contenido / Social media" },
    ]
  },
  {
    name: "Plataformas Internas", color: "#f39c12",
    items: [
      { name: "SIM", type: "Sistema de indicadores de gestión" },
      { name: "Portal Interno", type: "Intranet corporativa" },
      { name: "Agente Cobranza", type: "Bot automatización cobranza" },
      { name: "Agente Imprenta", type: "Bot documentos fiscales" },
    ]
  },
  {
    name: "HelpDesk & Proyectos", color: "#e67e22",
    items: [
      { name: "Monday.com", type: "Gestión de proyectos" },
      { name: "GLPI", type: "IT Service Management" },
    ]
  },
  {
    name: "AI & Automatización", color: "#9b59b6",
    items: [
      { name: "Lovable", type: "AI Dev Platform" },
      { name: "Colab", type: "Notebooks / ML" },
      { name: "n8n", type: "Workflow Automation" },
    ]
  },
];

const customDevelopments = [
  { id:1, name:"DM de Fletes", desc:"Tarifas de fletes por sector, tipo de cliente y destino", domain:"Logística", modules:["FA","CI"], color:"#0097A7" },
  { id:2, name:"DM de Promociones", desc:"Promociones personalizadas por clasificación/cliente", domain:"Ventas", modules:["FA","CI"], color:"#16a085" },
  { id:3, name:"DM Presupuesto", desc:"Control presupuestal integrado con módulos ERP", domain:"Control", modules:["CO","CP","CI","CG"], color:"#e74c3c" },
  { id:4, name:"Torre de Control", desc:"Planificador de viajes y rutas de despacho", domain:"Logística", modules:["FA","CI"], color:"#2980b9" },
  { id:5, name:"DM Atributos", desc:"Medición de interacción de colaboradores en campo", domain:"RRHH", modules:["CN"], color:"#e74c3c" },
  { id:6, name:"eFLOW WMS", desc:"Sistema de gestión de almacenes integrado", domain:"Logística", modules:["CI","CO"], color:"#2980b9" },
  { id:7, name:"Automatizaciones Personal", desc:"Portal unificado de seguimiento de candidatos", domain:"RRHH", modules:["CN"], color:"#e74c3c" },
  { id:8, name:"Apagado Triggers Dif. Cambiario", desc:"Gestión de triggers de diferencial cambiario", domain:"Financiero", modules:["CG","CB"], color:"#c0392b" },
  { id:9, name:"Gestión de Proyectos", desc:"Portal de seguimiento de proyectos e iniciativas", domain:"Sistemas", modules:["CG"], color:"#f39c12" },
  { id:10, name:"Visualizador de Documentos", desc:"Búsqueda y gestión documental multi-empresa", domain:"Sistemas", modules:["FA","CC","CP"], color:"#f39c12" },
  { id:11, name:"DM Auditorías", desc:"Portal de auditorías de venta y procesos", domain:"Control", modules:["CG","CC","CP"], color:"#c0392b" },
  { id:12, name:"DM Conciliaciones", desc:"Monitoreo de conciliaciones bancarias automático", domain:"Control", modules:["CB","CG"], color:"#c0392b" },
  { id:13, name:"Cargador de Precios", desc:"Portal de carga masiva de precios Cofersa", domain:"Ventas", modules:["CI","FA"], color:"#16a085" },
  { id:14, name:"Gestión Mensual", desc:"Análisis con IA del desempeño del equipo", domain:"RRHH", modules:["CN"], color:"#e74c3c" },
  { id:15, name:"Imprenta Digital DM", desc:"Ver y descargar facturas y documentos fiscales", domain:"Control", modules:["FA","CC"], color:"#2E7D32" },
  { id:16, name:"DM GALAC", desc:"Integración nómina Venezuela con sistema fiscal Galac", domain:"RRHH", modules:["CN","CB"], color:"#e74c3c" },
  { id:17, name:"Facturas MPPV", desc:"Modelo de pago post ventas para Portal Proveedores", domain:"Ventas", modules:["FA","CC","CP"], color:"#16a085" },
];

// ════════════════════════════════════════════════════════
//  ERP MODULE DATA
// ════════════════════════════════════════════════════════

const modules = {
  AS: { name:"Administración del Sistema", abbr:"AS", color:"#1a1a2e", textColor:"#e0e0ff", type:"base",
    description:"Módulo base. Provee tablas maestras: monedas, tipos de cambio, países, impuestos, condiciones de pago, bodegas, centros de costo, usuarios, períodos contables.",
    connections:[], x:400, y:40 },
  CG: { name:"Contabilidad General", abbr:"CG", color:"#c0392b", textColor:"#fff", type:"core",
    description:"Corazón financiero del ERP. Captura e integra las transacciones contables de todos los módulos auxiliares. Maneja diferencias cambiarias, cierre anual, consolidación y estados financieros.",
    connections:["AS"], x:400, y:160 },
  CB: { name:"Control Bancario", abbr:"CB", color:"#2980b9", textColor:"#fff", type:"finance",
    description:"Gestiona cuentas bancarias, cheques, depósitos y transferencias. Genera movimientos contables en CG. Recibe documentos de CC (cobros) y CP (pagos). Procesa pagos de planilla de CN.",
    connections:["AS","CG","CC","CP","CN"], x:160, y:290 },
  CC: { name:"Cuentas por Cobrar", abbr:"CC", color:"#27ae60", textColor:"#fff", type:"finance",
    description:"Auxiliar de CG. Maneja documentos pendientes de cobro y pagos de clientes. Recibe facturas a crédito de FA. Los cobros (depósitos, transferencias) aumentan saldos en CB.",
    connections:["AS","CG","CB","FA"], x:640, y:290 },
  CP: { name:"Cuentas por Pagar", abbr:"CP", color:"#8e44ad", textColor:"#fff", type:"finance",
    description:"Auxiliar de CG. Maneja documentos pendientes de pago a proveedores. Recibe facturas de compra desde CO. Los pagos (cheques, transferencias) reducen saldos en CB.",
    connections:["AS","CG","CB","CO"], x:160, y:430 },
  CO: { name:"Compras", abbr:"CO", color:"#d35400", textColor:"#fff", type:"logistics",
    description:"Gestiona solicitudes, órdenes de compra y embarques. Actualiza existencias en CI al recibir mercadería. Genera facturas que se registran en CP.",
    connections:["AS","CG","CI","CP","CN"], x:160, y:570 },
  CI: { name:"Control de Inventarios", abbr:"CI", color:"#f39c12", textColor:"#1a1a2e", type:"logistics",
    description:"Controla artículos, existencias, costos y bodegas. Recibe ingresos de CO (compras) y FA (devoluciones). Provee artículos a FA para ventas. Múltiples métodos de costeo.",
    connections:["AS","CG","CO","FA"], x:400, y:500 },
  FA: { name:"Facturación", abbr:"FA", color:"#16a085", textColor:"#fff", type:"sales",
    description:"Genera facturas de venta, pedidos, remisiones y devoluciones. Crea asientos de Ventas y Costo de Ventas en CG. Transfiere facturas a crédito a CC. Lee y actualiza existencias en CI.",
    connections:["AS","CG","CI","CC"], x:640, y:430 },
  CN: { name:"Control de Nóminas", abbr:"CN", color:"#e74c3c", textColor:"#fff", type:"hr",
    description:"Calcula y paga nóminas. Genera asientos de planilla en CG. Emite cheques y transferencias vía CB. Crea liquidaciones de pago en CP. Integrado con Galac (Venezuela).",
    connections:["AS","CG","CB","CP"], x:40, y:160 },
  AF: { name:"Activos Fijos", abbr:"AF", color:"#7f8c8d", textColor:"#fff", type:"finance",
    description:"Auxiliar de CG. Controla el registro, depreciación, revaluación y baja de activos fijos. Genera asientos de depreciación y ajustes en Contabilidad General.",
    connections:["AS","CG"], x:760, y:160 },
  CF: { name:"Flujo de Caja", abbr:"CF", color:"#0284c7", textColor:"#fff", type:"finance",
    description:"Proyección y control de liquidez. Consolida documentos de CC, CP, CB, FA y CO para proyectar entradas y salidas de efectivo a corto y mediano plazo.",
    connections:["CB","CC","CP"], x:760, y:290 },
  EV: { name:"Estadísticas de Ventas", abbr:"EV", color:"#be185d", textColor:"#fff", type:"sales",
    description:"Reportes analíticos de facturas, devoluciones y bonificaciones desde FA. Análisis de ventas por vendedor, artículo, cliente y período.",
    connections:["FA"], x:640, y:570 },
};

const typeLabels = {
  base:      { label:"Base del Sistema", color:"#1a1a2e" },
  core:      { label:"Núcleo Contable",  color:"#c0392b" },
  finance:   { label:"Financiero",       color:"#2980b9" },
  logistics: { label:"Logística",        color:"#d35400" },
  sales:     { label:"Ventas",           color:"#16a085" },
  hr:        { label:"Recursos Humanos", color:"#e74c3c" },
};

const externalModules = [
  { name:"Recursos Humanos (RH)", connects:["CN","CB","CO"] },
  { name:"Flujo de Caja",         connects:["CB","CC","CP"] },
  { name:"Control Presupuestal",  connects:["CN","CP","CI","CG"] },
  { name:"Estadísticas de Venta", connects:["FA"] },
  { name:"Planificador (SP)",     connects:["CO","CI"] },
  { name:"Producción y Costos",   connects:["CI"] },
];

const integrationFlows = [
  { flow:"Ventas → ERP",          detail:"AFV (pedidos en ruta) → FA (Facturación) → CI (Inventario) → CC (Cuentas por Cobrar) · Portal Pedidos / Catálogo Digital",    color:"#16a085" },
  { flow:"Crédito y Cobro → ERP", detail:"Sage XRT / H2H → CB (Control Bancario) → CC (Cuentas Cobrar) → CG (Contabilidad)",                                           color:"#27ae60" },
  { flow:"Compras → ERP",         detail:"Streamline (Pronósticos) → SP (Planificador) → CO (Compras) → CI (Inventario) → CP (Cuentas por Pagar)",                     color:"#d35400" },
  { flow:"Despacho → ERP",        detail:"WMS ePrac / Torre de Control → CI (Inventario) → FA (Facturación — remisiones y despachos)",                                 color:"#2980b9" },
  { flow:"Nómina → ERP",          detail:"Galac (VE) → CN (Control Nóminas) → CB (Control Bancario) → CG (Contabilidad)",                                              color:"#e74c3c" },
  { flow:"BI ← ERP",              detail:"Softland → Réplicas SQL / Cubos OLAP → Power BI / Fabric — reportería, dashboards y análisis multi-empresa",                 color:"#3498db" },
  { flow:"DMs ↔ ERP",             detail:"17 Desarrollos a Medida integrados vía API/SQL: DM Fletes, Presupuesto, Torre Control, WMS, Imprenta Digital, Auditorías…", color:"#e67e22" },
];

// ════════════════════════════════════════════════════════
//  COMPANIES DATA (10 empresas, 2 países, 2 instancias SQL)
// ════════════════════════════════════════════════════════

const companies = [
  { name:"MUNDIPARTES",  schema:"MUNDIAL",    tables:1059, country:"🇨🇴 Colombia",    instance:"CO", color:"#3498db"  },
  { name:"COFERSA",      schema:"COFER",      tables:1208, country:"🇨🇷 Costa Rica",  instance:"CR", color:"#2E7D32"  },
  { name:"FEBECA (CR)",  schema:"FEBECA",     tables:602,  country:"🇨🇷 Costa Rica",  instance:"CR", color:"#1abc9c"  },
  { name:"HHG",          schema:"HHG",        tables:288,  country:"🇨🇷 Costa Rica",  instance:"CR", color:"#27ae60"  },
  { name:"DSBTEC",       schema:"DSBTEC",     tables:602,  country:"🇨🇷 Costa Rica",  instance:"CR", color:"#16a085"  },
  { name:"FEBECA (VE)",  schema:"FEBECA",     tables:854,  country:"🇻🇪 Venezuela",   instance:"VE", color:"#e74c3c"  },
  { name:"BEVAL",        schema:"BEVAL",      tables:835,  country:"🇻🇪 Venezuela",   instance:"VE", color:"#c0392b"  },
  { name:"SILLACA",      schema:"SILLACA",    tables:773,  country:"🇻🇪 Venezuela",   instance:"VE", color:"#e67e22"  },
  { name:"TREXA",        schema:"TREXA",      tables:674,  country:"🇻🇪 Venezuela",   instance:"VE", color:"#d35400"  },
  { name:"PRISMA",       schema:"PRISMA",     tables:642,  country:"🇻🇪 Venezuela",   instance:"VE", color:"#f39c12"  },
];

// ════════════════════════════════════════════════════════
//  UDF DATA (633 UDFs reales del diccionario)
// ════════════════════════════════════════════════════════

const udfByModule = {
  // Fuente: MAYOREO_UDF_Actualizado_10_12_2025.pdf — 344 UDFs únicos documentados
  CI: 79,   // ARTICULO: atributos de producto, clasificaciones, flags logísticos y comerciales
  FA: 46,   // FACTURA + PEDIDO: campos de factura, pedidos, fletes y auditoría
  CC: 51,   // CLIENTE + DOCUMENTOS_CC: segmentación, crédito, conciliación y cobros
  CO: 46,   // ORDEN_COMPRA + EMBARQUE_LINEA + PROVEEDOR: importaciones, tracking y proveedores
  CN: 13,   // EMPLEADO: atributos de personal, nómina y datos Venezuela
  CB: 8,    // CUENTA_BANCARIA: conciliación bancaria y referencias XRT
  CP: 11,   // DOCUMENTO_CP: retenciones, GALAC y control fiscal
  CG: 12,   // ASIENTO + tablas presupuestales: presupuesto por marca y concepto
  AS: 44,   // Administración del Sistema: configuración global
  "DM Presupuesto": 67, "DM Fletes": 21, "FR": 23, "WMS": 13, "DM Atributos": 4, "DM GALAC": 4,
};

const udfByCompany = {
  COFERSA: 420, FEBECA: 262, BEVAL: 255, SILLACA: 253, MUNDIPARTES: 203,
};

const topUdfTables = [
  { table:"ARTICULO",       udfs:79,  mod:"CI", desc:"Atributos de producto: Clasificación BDF (N=Nuevo, L=Ocasional, P=Pedido Especial) (sistema de clasificación de artículos: N=Nuevo, L=Ocasional, P=Pedido Especial), marcas comerciales, flags logísticos, origen, familia, rotación y stock de seguridad (cantidad mínima para evitar faltantes)" },
  { table:"CLIENTE",        udfs:51,  mod:"CC", desc:"Segmentación comercial: canal, sector, ruta AFV, magnitud, supervisor y condiciones de crédito por empresa" },
  { table:"FACTURA",        udfs:46,  mod:"FA", desc:"Campos adicionales de factura: fletes PS, auditoría imprenta, descuentos LPV, nivel PS y referencias de cobrador" },
  { table:"ORDEN_COMPRA",   udfs:26,  mod:"CO", desc:"Trazabilidad de importación: fechas de embarque, arribo, DUA, aduana, agente y tiempos de backorder" },
  { table:"DOCUMENTOS_CC",  udfs:20,  mod:"CC", desc:"Control de cobros: conciliación bancaria, instrumentos de pago, anexos XRT y referencias de retención" },
  { table:"PEDIDO",         udfs:12,  mod:"FA", desc:"Control de pedidos: estado en AFV, referencias externas, número de control y tipo de operación" },
  { table:"EMBARQUE_LINEA", udfs:11,  mod:"CO", desc:"Líneas de embarque: fechas de recibo, estado de devolución, montos y referencias de reclamo" },
  { table:"DOCUMENTO_CP",   udfs:11,  mod:"CP", desc:"Cuentas por pagar: crédito fiscal, retenciones GALAC, NIT, número de expediente y plantilla fiscal" },
  { table:"EMPLEADO",       udfs:13,  mod:"CN", desc:"Datos de personal: paso salarial, especialización, tipo de documento, tipopersona y país (CR/VE)" },
  { table:"PROVEEDOR",      udfs:9,   mod:"CO", desc:"Atributos de proveedor: agrupación, categoría, código AFV, correo de compras y zona de abastecimiento" },
];

const sampleUdfs = {
  ARTICULO: [
    { ud:"BAJO_MARGEN",           cos:["FEBECA","SILLACA","BEVAL","COFERSA","MUNDIPARTES"], db:"U_BAJO_MARGEN" },
    { ud:"MARGEN",                cos:["FEBECA","SILLACA","BEVAL","COFERSA","MUNDIPARTES"], db:"U_MARGEN" },
    { ud:"MARGEN_MIN_MARCA",      cos:["FEBECA","SILLACA","BEVAL","COFERSA"],               db:"U_MARGEN_MIN_MARCA" },
    { ud:"COD_AFV",               cos:["FEBECA","SILLACA","BEVAL","COFERSA","MUNDIPARTES"], db:"U_COD_AFV" },
    { ud:"CAT_PROVEEDOR",         cos:["FEBECA","SILLACA","BEVAL","COFERSA","MUNDIPARTES"], db:"U_CAT_PROVEEDOR" },
    { ud:"GRUPO_COMPRA",          cos:["FEBECA","SILLACA","BEVAL","COFERSA","MUNDIPARTES"], db:"U_GRUPO_COMPRA" },
    { ud:"GRUPO_MARCA",           cos:["FEBECA","SILLACA","BEVAL","COFERSA","MUNDIPARTES"], db:"U_GRUPO_MARCA" },
    { ud:"MARCA",                 cos:["FEBECA","SILLACA","BEVAL","COFERSA","MUNDIPARTES"], db:"U_MARCA" },
    { ud:"MARCACOMER",            cos:["FEBECA","SILLACA","BEVAL","COFERSA","MUNDIPARTES"], db:"U_MARCACOMER" },
    { ud:"MARCAPPTO",             cos:["FEBECA","SILLACA","BEVAL","COFERSA","MUNDIPARTES"], db:"U_MARCAPPTO" },
    { ud:"FAMILIA_DE_PRODUCTO",   cos:["BEVAL","MUNDIPARTES"],                              db:"U_FAMILIA_DE_PRODUCTO" },
    { ud:"ORIGEN",                cos:["FEBECA","SILLACA","BEVAL","COFERSA","MUNDIPARTES"], db:"U_ORIGEN" },
    { ud:"RAMO_COMPRA",           cos:["FEBECA","SILLACA","BEVAL","COFERSA","MUNDIPARTES"], db:"U_RAMO_COMPRA" },
    { ud:"FABRICA",               cos:["FEBECA","SILLACA","BEVAL","COFERSA","MUNDIPARTES"], db:"U_FABRICA" },
    { ud:"FABRICACION",           cos:["COFERSA","MUNDIPARTES"],                            db:"U_FABRICACION" },
    { ud:"MATERIAL",              cos:["FEBECA","SILLACA","BEVAL","COFERSA","MUNDIPARTES"], db:"U_MATERIAL" },
    { ud:"MATERIAL_ARTICULO",     cos:["COFERSA"],                                          db:"U_MATERIAL_ARTICULO" },
    { ud:"ENTREGA",               cos:["FEBECA","SILLACA","BEVAL","COFERSA","MUNDIPARTES"], db:"U_ENTREGA" },
    { ud:"FRECUENCIA",            cos:["FEBECA","SILLACA","BEVAL","COFERSA","MUNDIPARTES"], db:"U_FRECUENCIA" },
    { ud:"STOCK_SEGURIDAD",       cos:["FEBECA","SILLACA","BEVAL","COFERSA","MUNDIPARTES"], db:"U_STOCK_SEGURIDAD" },
    { ud:"ROTACION",              cos:["FEBECA","SILLACA","BEVAL","COFERSA","MUNDIPARTES"], db:"U_ROTACION" },
    { ud:"CANT_EN_TRANSITO",      cos:["FEBECA","SILLACA","BEVAL","COFERSA","MUNDIPARTES"], db:"U_CANT_EN_TRANSITO" },
    { ud:"CANT_MIN_DESC",         cos:["FEBECA","SILLACA","BEVAL","COFERSA","MUNDIPARTES"], db:"U_CANT_MIN_DESC" },
    { ud:"BULTO",                 cos:["FEBECA","SILLACA","BEVAL","COFERSA","MUNDIPARTES"], db:"U_BULTO" },
    { ud:"BULTO_J",               cos:["COFERSA"],                                          db:"U_BULTO_J" },
    { ud:"BULTO_M",               cos:["COFERSA"],                                          db:"U_BULTO_M" },
    { ud:"BULTO_N",               cos:["COFERSA"],                                          db:"U_BULTO_N" },
    { ud:"BULTO_O",               cos:["COFERSA"],                                          db:"U_BULTO_O" },
    { ud:"BULTO_P",               cos:["COFERSA"],                                          db:"U_BULTO_P" },
    { ud:"BULTO_T",               cos:["COFERSA"],                                          db:"U_BULTO_T" },
    { ud:"BULTO_X",               cos:["COFERSA"],                                          db:"U_BULTO_X" },
    { ud:"PESADO",                cos:["FEBECA","SILLACA","BEVAL","COFERSA","MUNDIPARTES"], db:"U_PESADO" },
    { ud:"DIMENSION",             cos:["COFERSA","MUNDIPARTES"],                            db:"U_DIMENSION" },
    { ud:"DESC_EMPAQUE",          cos:["FEBECA","SILLACA","BEVAL","COFERSA","MUNDIPARTES"], db:"U_DESC_EMPAQUE" },
    { ud:"SKU",                   cos:["COFERSA","MUNDIPARTES"],                            db:"U_SKU" },
    { ud:"REF",                   cos:["FEBECA","SILLACA","BEVAL","COFERSA","MUNDIPARTES"], db:"U_REF" },
    { ud:"REDONDEO",              cos:["FEBECA","SILLACA","BEVAL","COFERSA","MUNDIPARTES"], db:"U_REDONDEO" },
    { ud:"REPOSITOR",             cos:["FEBECA","SILLACA","BEVAL","COFERSA","MUNDIPARTES"], db:"U_REPOSITOR" },
    { ud:"AGRUPACION",            cos:["FEBECA","SILLACA","BEVAL","COFERSA","MUNDIPARTES"], db:"U_AGRUPACION" },
    { ud:"CATALOGO",              cos:["COFERSA"],                                          db:"U_CATALOGO" },
    { ud:"CATEGORIA",             cos:["FEBECA","SILLACA","BEVAL","COFERSA","MUNDIPARTES"], db:"U_CATEGORIA" },
    { ud:"ATRIBUTO1",             cos:["COFERSA"],                                          db:"U_ATRIBUTO1" },
    { ud:"ATRIBUTO2",             cos:["COFERSA"],                                          db:"U_ATRIBUTO2" },
    { ud:"ATRIBUTO3",             cos:["COFERSA"],                                          db:"U_ATRIBUTO3" },
    { ud:"FOCO",                  cos:["COFERSA","MUNDIPARTES"],                            db:"U_FOCO" },
    { ud:"FUERA_ESCALA",          cos:["COFERSA"],                                          db:"U_FUERA_ESCALA" },
    { ud:"MAGNITUD_COMERCIAL",    cos:["FEBECA","SILLACA","BEVAL","COFERSA","MUNDIPARTES"], db:"U_MAGNITUD_COMERCIAL" },
    { ud:"NACIONAL",              cos:["COFERSA"],                                          db:"U_NACIONAL" },
    { ud:"NACIONALIDAD_ARTICULO", cos:["FEBECA","SILLACA","BEVAL"],                         db:"U_NACIONALIDAD_ARTICULO" },
    { ud:"COLOR_UDF",             cos:["COFERSA","MUNDIPARTES"],                            db:"U_COLOR_UDF" },
    { ud:"ESTADO",                cos:["FEBECA","SILLACA","BEVAL","COFERSA","MUNDIPARTES"], db:"U_ESTADO" },
    { ud:"ESCOLAR",               cos:["COFERSA"],                                          db:"U_ESCOLAR" },
    { ud:"USO",                   cos:["FEBECA","SILLACA","BEVAL","COFERSA","MUNDIPARTES"], db:"U_USO" },
    { ud:"TIPO_COMP",             cos:["COFERSA","MUNDIPARTES"],                            db:"U_TIPO_COMP" },
    { ud:"TRANSPORTE",            cos:["COFERSA"],                                          db:"U_TRANSPORTE" },
    { ud:"FCH_ULT_EMB_RECIBIDO",  cos:["FEBECA","SILLACA","BEVAL"],                         db:"U_FCH_ULT_EMB_RECIBIDO" },
    { ud:"FCH_ULT_SINC_COMPRAS",  cos:["COFERSA"],                                          db:"U_FCH_ULT_SINC_COMPRAS" },
    { ud:"UNIDAD_MEDIDA",         cos:["FEBECA","SILLACA","BEVAL","COFERSA","MUNDIPARTES"], db:"U_UNIDAD_MEDIDA" },
    { ud:"UBICACION_WMS",         cos:["COFERSA"],                                          db:"U_UBICACION_WMS" },
    { ud:"SUBTIPO",               cos:["COFERSA","MUNDIPARTES"],                            db:"U_SUBTIPO" },
    { ud:"ART_REFERENCIA",        cos:["COFERSA"],                                          db:"U_ART_REFERENCIA" },
    { ud:"AVALUO",                cos:["COFERSA","MUNDIPARTES"],                            db:"U_AVALUO" },
    { ud:"PRECIO_FIJO",           cos:["COFERSA"],                                          db:"U_PRECIO_FIJO" },
    { ud:"MAXIMO",                cos:["COFERSA"],                                          db:"U_MAXIMO" },
    { ud:"MINIMO",                cos:["COFERSA"],                                          db:"U_MINIMO" },
  ],
  FACTURA: [
    { ud:"AB_PLAZO_CONTADO",                  cos:["FEBECA","SILLACA","BEVAL","COFERSA"],               db:"U_AB_PLAZO_CONTADO" },
    { ud:"BOLETA",                            cos:["COFERSA","MUNDIPARTES"],                            db:"U_BOLETA" },
    { ud:"D151",                              cos:["COFERSA"],                                          db:"U_D151" },
    { ud:"COBRADOR",                          cos:["FEBECA","SILLACA","BEVAL","COFERSA","MUNDIPARTES"], db:"U_COBRADOR" },
    { ud:"VENDEDOR",                          cos:["FEBECA","SILLACA","BEVAL","COFERSA","MUNDIPARTES"], db:"U_VENDEDOR" },
    { ud:"ESTATUS",                           cos:["FEBECA","SILLACA","BEVAL","COFERSA"],               db:"U_ESTATUS" },
    { ud:"ESTATUS_VENDEDOR",                  cos:["FEBECA","SILLACA","BEVAL","COFERSA"],               db:"U_ESTATUS_VENDEDOR" },
    { ud:"RUTA",                              cos:["FEBECA","SILLACA","BEVAL","COFERSA","MUNDIPARTES"], db:"U_RUTA" },
    { ud:"IMPUESTO",                          cos:["COFERSA"],                                          db:"U_IMPUESTO" },
    { ud:"IMPUESTO2",                         cos:["COFERSA"],                                          db:"U_IMPUESTO2" },
    { ud:"IMPUESTO_EXCLUIDO",                 cos:["COFERSA"],                                          db:"U_IMPUESTO_EXCLUIDO" },
    { ud:"DCTO_LPV1",                         cos:["COFERSA"],                                          db:"U_DCTO_LPV1" },
    { ud:"DCTO_LPV2",                         cos:["COFERSA"],                                          db:"U_DCTO_LPV2" },
    { ud:"DCTO_LPV3",                         cos:["COFERSA"],                                          db:"U_DCTO_LPV3" },
    { ud:"DCTO_LPV4",                         cos:["COFERSA"],                                          db:"U_DCTO_LPV4" },
    { ud:"DCTO_LPV5",                         cos:["COFERSA"],                                          db:"U_DCTO_LPV5" },
    { ud:"DCTO_LPV6",                         cos:["COFERSA"],                                          db:"U_DCTO_LPV6" },
    { ud:"ESTADO_IMPRENTA",                   cos:["COFERSA","MUNDIPARTES"],                            db:"U_ESTADO_IMPRENTA" },
    { ud:"JM_CANT_IMPR",                      cos:["COFERSA"],                                          db:"U_JM_CANT_IMPR" },
    { ud:"JM_ESTADO_IMPR",                    cos:["COFERSA"],                                          db:"U_JM_ESTADO_IMPR" },
    { ud:"JM_IMPRENTA_CORREO",                cos:["COFERSA"],                                          db:"U_JM_IMPRENTA_CORREO" },
    { ud:"JM_PROV_CON",                       cos:["COFERSA"],                                          db:"U_JM_PROV_CON" },
    { ud:"LINEA_FLETE_FAC",                   cos:["BEVAL","COFERSA","FEBECA","SILLACA"],               db:"U_LINEA_FLETE_FAC" },
    { ud:"PS_MONTO_FLETE",                    cos:["BEVAL","COFERSA","FEBECA","SILLACA"],               db:"U_PS_MONTO_FLETE" },
    { ud:"PS_MONTO_FLETE_SIN_DESCUENTO",      cos:["BEVAL","COFERSA","FEBECA","SILLACA"],               db:"U_PS_MONTO_FLETE_SIN_DESCUENTO" },
    { ud:"PS_DESCUENTO_FLETE_PORCENTAJE",     cos:["BEVAL","COFERSA","FEBECA","SILLACA"],               db:"U_PS_DESCUENTO_FLETE_PORCENTAJE" },
    { ud:"PS_TARIFA_FLETE_PORCENTAJE",        cos:["BEVAL","COFERSA","FEBECA","SILLACA"],               db:"U_PS_TARIFA_FLETE_PORCENTAJE" },
    { ud:"PS_TARIFA_FLETE_PORC_SIN_DESC",     cos:["BEVAL","COFERSA","FEBECA","SILLACA"],               db:"U_PS_TARIFA_FLETE_PORC_SIN_DESC" },
    { ud:"PS_NIVEL",                          cos:["BEVAL","COFERSA","FEBECA","SILLACA"],               db:"U_PS_NIVEL" },
    { ud:"PS_TIPO",                           cos:["BEVAL","COFERSA","FEBECA","SILLACA"],               db:"U_PS_TIPO" },
    { ud:"PS_ESTADO_WEB",                     cos:["COFERSA"],                                          db:"U_PS_ESTADO_WEB" },
    { ud:"REGLA_FLETE",                       cos:["BEVAL","COFERSA"],                                  db:"U_REGLA_FLETE" },
    { ud:"REGLA_DETALLE",                     cos:["BEVAL","COFERSA"],                                  db:"U_REGLA_DETALLE" },
    { ud:"REGLA_ID",                          cos:["BEVAL","COFERSA"],                                  db:"U_REGLA_ID" },
  ],
  PEDIDO: [
    { ud:"AB_ESTADO_EMBARQUE",   cos:["COFERSA"],                                          db:"U_AB_ESTADO_EMBARQUE" },
    { ud:"ESTADO_DEV",           cos:["FEBECA","SILLACA","BEVAL","COFERSA"],               db:"U_ESTADO_DEV" },
    { ud:"ESTADO_DEV_LIN",       cos:["FEBECA","SILLACA","BEVAL","COFERSA"],               db:"U_ESTADO_DEV_LIN" },
    { ud:"ESTADO_EPRAC",         cos:["COFERSA"],                                          db:"U_ESTADO_EPRAC" },
    { ud:"FECHA_EPRAC",          cos:["COFERSA"],                                          db:"U_FECHA_EPRAC" },
    { ud:"NUM_CONTROL",          cos:["COFERSA","MUNDIPARTES"],                            db:"U_NUM_CONTROL" },
    { ud:"NUMERO_CONTROL",       cos:["COFERSA","MUNDIPARTES"],                            db:"U_NUMERO_CONTROL" },
    { ud:"PEDIDO_PADRE",         cos:["COFERSA"],                                          db:"U_PEDIDO_PADRE" },
    { ud:"PRIORIDAD",            cos:["COFERSA"],                                          db:"U_PRIORIDAD" },
    { ud:"TIPO_OPERAC_FAC",      cos:["COFERSA"],                                          db:"U_TIPO_OPERAC_FAC" },
    { ud:"TIPO_OPERAC_NC",       cos:["COFERSA"],                                          db:"U_TIPO_OPERAC_NC" },
    { ud:"TIPO_OPERAC_ND",       cos:["COFERSA"],                                          db:"U_TIPO_OPERAC_ND" },
  ],
  CLIENTE: [
    { ud:"AB_PLAZO_CONTADO",    cos:["FEBECA","SILLACA","BEVAL","COFERSA"],               db:"U_AB_PLAZO_CONTADO" },
    { ud:"CANAL",               cos:["FEBECA","SILLACA","BEVAL","COFERSA","MUNDIPARTES"], db:"U_CANAL" },
    { ud:"CATEGORIA",           cos:["FEBECA","SILLACA","BEVAL","COFERSA","MUNDIPARTES"], db:"U_CATEGORIA" },
    { ud:"COD_AFV",             cos:["FEBECA","SILLACA","BEVAL","COFERSA","MUNDIPARTES"], db:"U_COD_AFV" },
    { ud:"COD_MINAMT",          cos:["COFERSA","MUNDIPARTES"],                            db:"U_COD_MINAMT" },
    { ud:"COD1",                cos:["COFERSA"],                                          db:"U_COD1" },
    { ud:"COD2",                cos:["COFERSA"],                                          db:"U_COD2" },
    { ud:"COD3",                cos:["COFERSA"],                                          db:"U_COD3" },
    { ud:"COBRADOR",            cos:["FEBECA","SILLACA","BEVAL","COFERSA","MUNDIPARTES"], db:"U_COBRADOR" },
    { ud:"VENDEDOR",            cos:["FEBECA","SILLACA","BEVAL","COFERSA","MUNDIPARTES"], db:"U_VENDEDOR" },
    { ud:"VENDEDOR_PRINCIPAL",  cos:["FEBECA","SILLACA","BEVAL","COFERSA","MUNDIPARTES"], db:"U_VENDEDOR_PRINCIPAL" },
    { ud:"SECTOR",              cos:["FEBECA","SILLACA","BEVAL","COFERSA","MUNDIPARTES"], db:"U_SECTOR" },
    { ud:"RUTA",                cos:["FEBECA","SILLACA","BEVAL","COFERSA","MUNDIPARTES"], db:"U_RUTA" },
    { ud:"ZONA",                cos:["FEBECA","SILLACA","BEVAL","COFERSA","MUNDIPARTES"], db:"U_ZONA" },
    { ud:"ZONA_VTA",            cos:["COFERSA","MUNDIPARTES"],                            db:"U_ZONA_VTA" },
    { ud:"SEGMENTO",            cos:["FEBECA","SILLACA","BEVAL","COFERSA","MUNDIPARTES"], db:"U_SEGMENTO" },
    { ud:"SUPERVISOR",          cos:["FEBECA","SILLACA","BEVAL","COFERSA","MUNDIPARTES"], db:"U_SUPERVISOR" },
    { ud:"JEFE_VENTAS",         cos:["COFERSA"],                                          db:"U_JEFE_VENTAS" },
    { ud:"JEFE_REGIONAL",       cos:["COFERSA"],                                          db:"U_JEFE_REGIONAL" },
    { ud:"TIPO_CLIENTE",        cos:["COFERSA","MUNDIPARTES"],                            db:"U_TIPO_CLIENTE" },
    { ud:"TIPO_ESCALA",         cos:["COFERSA","MUNDIPARTES"],                            db:"U_TIPO_ESCALA" },
    { ud:"RAMO_DEL_NEGOCIO",    cos:["COFERSA","MUNDIPARTES"],                            db:"U_RAMO_DEL_NEGOCIO" },
    { ud:"REGION_VTA",          cos:["COFERSA","MUNDIPARTES"],                            db:"U_REGION_VTA" },
    { ud:"LOCALIDAD",           cos:["COFERSA"],                                          db:"U_LOCALIDAD" },
    { ud:"MAGNITUD_COMERCIAL",  cos:["FEBECA","SILLACA","BEVAL","COFERSA","MUNDIPARTES"], db:"U_MAGNITUD_COMERCIAL" },
    { ud:"DIASBLOQUEO",         cos:["COFERSA","MUNDIPARTES"],                            db:"U_DIASBLOQUEO" },
    { ud:"MOV_ESCALAS",         cos:["COFERSA"],                                          db:"U_MOV_ESCALAS" },
    { ud:"NOMBRE_REPR",         cos:["COFERSA","MUNDIPARTES"],                            db:"U_NOMBRE_REPR" },
    { ud:"ESTATUS",             cos:["FEBECA","SILLACA","BEVAL","COFERSA","MUNDIPARTES"], db:"U_ESTATUS" },
    { ud:"PS_SECTOR_NO_EXISTE", cos:["COFERSA"],                                          db:"U_PS_SECTOR_NO_EXISTE" },
  ],
  ORDEN_COMPRA: [
    { ud:"ADUANA",                       cos:["COFERSA"],                                          db:"U_ADUANA" },
    { ud:"AGENTE",                       cos:["COFERSA"],                                          db:"U_AGENTE" },
    { ud:"BOOKING",                      cos:["COFERSA","MUNDIPARTES"],                            db:"U_BOOKING" },
    { ud:"DIRECC_EMBARQUE",              cos:["COFERSA"],                                          db:"U_DIRECC_EMBARQUE" },
    { ud:"DSB",                          cos:["COFERSA"],                                          db:"U_DSB" },
    { ud:"DUA",                          cos:["COFERSA"],                                          db:"U_DUA" },
    { ud:"EMAIL_COMPRAS",                cos:["COFERSA"],                                          db:"U_EMAIL_COMPRAS" },
    { ud:"FCH_ARRIBO_ESTIMADA",          cos:["COFERSA","MUNDIPARTES"],                            db:"U_FCH_ARRIBO_ESTIMADA" },
    { ud:"FCH_ARRIBO_REAL",              cos:["COFERSA","MUNDIPARTES"],                            db:"U_FCH_ARRIBO_REAL" },
    { ud:"FCH_BACKORDER",                cos:["COFERSA"],                                          db:"U_FCH_BACKORDER" },
    { ud:"FCH_CARGA_LISTA_ESTIMADA",     cos:["COFERSA","MUNDIPARTES"],                            db:"U_FCH_CARGA_LISTA_ESTIMADA" },
    { ud:"FCH_CARGA_LISTA_REAL",         cos:["COFERSA","MUNDIPARTES"],                            db:"U_FCH_CARGA_LISTA_REAL" },
    { ud:"FCH_DISPONIBLE_BODEGA_ESTIMADA",cos:["COFERSA","MUNDIPARTES"],                           db:"U_FCH_DISPONIBLE_BODEGA_ESTIMADA" },
    { ud:"FCH_DISPONIBLE_BODEGA_REAL",   cos:["COFERSA","MUNDIPARTES"],                            db:"U_FCH_DISPONIBLE_BODEGA_REAL" },
    { ud:"FCH_DUA",                      cos:["COFERSA"],                                          db:"U_FCH_DUA" },
    { ud:"FCH_EMBARQUE_ESTIMADA",        cos:["COFERSA","MUNDIPARTES"],                            db:"U_FCH_EMBARQUE_ESTIMADA" },
    { ud:"FCH_EMBARQUE_REAL",            cos:["COFERSA","MUNDIPARTES"],                            db:"U_FCH_EMBARQUE_REAL" },
    { ud:"FCH_LLEGADA_EMBARQUE",         cos:["COFERSA"],                                          db:"U_FCH_LLEGADA_EMBARQUE" },
    { ud:"FCH_SALIDA_EMBARQUE",          cos:["COFERSA"],                                          db:"U_FCH_SALIDA_EMBARQUE" },
    { ud:"FCH_ULT_SINC_COMPRAS",         cos:["COFERSA"],                                          db:"U_FCH_ULT_SINC_COMPRAS" },
    { ud:"GRUPO_BODEGA",                 cos:["COFERSA","MUNDIPARTES"],                            db:"U_GRUPO_BODEGA" },
    { ud:"NACIONALIZACION",              cos:["COFERSA"],                                          db:"U_NACIONALIZACION" },
    { ud:"NO_DUA",                       cos:["COFERSA"],                                          db:"U_NO_DUA" },
    { ud:"TIEMPO_BACKORDER",             cos:["COFERSA","MUNDIPARTES"],                            db:"U_TIEMPO_BACKORDER" },
    { ud:"TRANSITO",                     cos:["COFERSA","MUNDIPARTES"],                            db:"U_TRANSITO" },
    { ud:"ZONA_FRANCA",                  cos:["COFERSA"],                                          db:"U_ZONA_FRANCA" },
  ],
  EMPLEADO: [
    { ud:"ESCOLAR",                  cos:["COFERSA"],                                          db:"U_ESCOLAR" },
    { ud:"ESPECIALIZACION",          cos:["COFERSA"],                                          db:"U_ESPECIALIZACION" },
    { ud:"HABIL",                    cos:["COFERSA","MUNDIPARTES"],                            db:"U_HABIL" },
    { ud:"MAIL",                     cos:["FEBECA","SILLACA","BEVAL","COFERSA","MUNDIPARTES"], db:"U_MAIL" },
    { ud:"NIVEL_ORGANIZACIONAL",     cos:["COFERSA"],                                          db:"U_NIVEL_ORGANIZACIONAL" },
    { ud:"PAIS",                     cos:["COFERSA","MUNDIPARTES"],                            db:"U_PAIS" },
    { ud:"PASO_SALARIAL",            cos:["COFERSA"],                                          db:"U_PASO_SALARIAL" },
    { ud:"ROL",                      cos:["COFERSA"],                                          db:"U_ROL" },
    { ud:"SUPERVISOR",               cos:["FEBECA","SILLACA","BEVAL","COFERSA","MUNDIPARTES"], db:"U_SUPERVISOR" },
    { ud:"TDEP",                     cos:["COFERSA","MUNDIPARTES"],                            db:"U_TDEP" },
    { ud:"TELEFONO",                 cos:["COFERSA","MUNDIPARTES"],                            db:"U_TELEFONO" },
    { ud:"TIPO_DOCUMENTO_IDENTIDAD", cos:["COFERSA","MUNDIPARTES"],                            db:"U_TIPO_DOCUMENTO_IDENTIDAD" },
    { ud:"TIPOPERSONA",              cos:["FEBECA","SILLACA","BEVAL","COFERSA","MUNDIPARTES"], db:"U_TIPOPERSONA" },
  ],
};

// ════════════════════════════════════════════════════════
//  PROJECTS DATA (66 proyectos reales)
// ════════════════════════════════════════════════════════

const projects = [
  ["Push Money","Comercialización/Mkt","Alta","Iniciado"],
  ["Reporte Importaciones Cofersa","Comercialización/Mkt","Alta","Iniciado"],
  ["Reporte Importación Mundial de Partes","Comercialización/Mkt","Alta","Iniciado"],
  ["Indicadores potencial de venta SIM","Comercialización/Mkt","Media","Iniciado"],
  ["Formato SIM","Comercialización/Mkt","Media","Iniciado"],
  ["Automatización de Redes Sociales","Comercialización/Mkt","Media","Iniciado"],
  ["Amazon Lens (Búsqueda visual)","Comercialización/Mkt","Alta",""],
  ["Chatbot de Whatsapp (Producto ganador)","Comercialización/Mkt","Media",""],
  ["Integración con Imprenta digital","Control","Alta","Iniciado"],
  ["Limpieza de Saldos","Control","Alta","Iniciado"],
  ["Sugerencia de Auditorias de venta","Control","Media","Iniciado"],
  ["Diferencial cambiario Cofersa","Control","Media",""],
  ["Corrida BDF y Ajustes de Clasificación","Compras","Media","Iniciado"],
  ["Reporte 4 y Disponibilidad","Logística","Alta","Iniciado"],
  ["Optimización de Streamline GMDH","Logística","Alta","Iniciado"],
  ["Creación Bodega Nueva Esparta Venezuela","Logística","Alta","Iniciado"],
  ["Indicadores de logística en SIM","Logística","Alta","Iniciado"],
  ["Data Lake Logístico","Logística","Alta","Iniciado"],
  ["Combo, Kit, Maquila y Transformación","Logística","Baja","Iniciado"],
  ["Trabajar con diferentes bodegas de despacho","Logística","Baja","Iniciado"],
  ["Diseño del plan estratégico Silo Logística","Logística","Baja","Iniciado"],
  ["Peso, cubicaje y código de barras","Logística","Media","Iniciado"],
  ["Plan de transporte eficiente","Logística","Media","Iniciado"],
  ["CRM para gestión de tickets de servicio","Logística","Media","Iniciado"],
  ["Automatizaciones de Personal","Personal","Alta","Iniciado"],
  ["Modelo de RH Venezuela","Personal","Alta","Iniciado"],
  ["Evaluaciones de desempeño","Personal","Media","Iniciado"],
  ["Catálogo Digital (e-commerce)","Ventas/e-comm","Alta","Iniciado"],
  ["AFV Venezuela","Ventas/e-comm","Alta","Iniciado"],
  ["Implementación FR Venezuela","Ventas/e-comm","Alta","Iniciado"],
  ["Portal de Clientes","Ventas/e-comm","Media","Iniciado"],
  ["Push Money por AFV","Ventas/e-comm","Media","Iniciado"],
  ["Respond.io","Ventas/e-comm","Media","Iniciado"],
  ["Actualización SIM","Sistemas","Alta","Iniciado"],
  ["SIM Venezuela","Sistemas","Alta","Iniciado"],
  ["Reportería Contable","Sistemas","Media","Iniciado"],
  ["Portal Proveedores MPPV","Sistemas","Media","Iniciado"],
  ["Análisis de Rentabilidad","Procesos","Alta","Iniciado"],
  ["Flujo de pago","Procesos","Media","Iniciado"],
];

const unitColors = {
  "Logística":           "#0097A7",
  "Control":             "#C62828",
  "Comercialización/Mkt":"#7B1FA2",
  "Sistemas":            "#f39c12",
  "Ventas/e-comm":       "#00796B",
  "Personal":            "#e67e22",
  "Procesos":            "#1abc9c",
  "Compras":             "#E65100",
};

// ════════════════════════════════════════════════════════
//  ECOSYSTEM VIEW
// ════════════════════════════════════════════════════════

function EcosystemView() {
  const [dmFilter, setDmFilter] = useState(null);
  const dmDomains = [...new Set(customDevelopments.map(d => d.domain))];
  const filteredDMs = dmFilter ? customDevelopments.filter(d => d.domain === dmFilter) : customDevelopments;

  const totalSystems = businessDomains.reduce((s, d) => s + d.items.length, 0);

  return (
    <div>
      {/* KPIs */}
      <div style={{ display:"flex", gap:12, marginBottom:20, flexWrap:"wrap" }}>
        {[
          { label:"Empresas",          value:"10",   color:"#f39c12"  },
          { label:"Países",            value:"2",    color:"#3498db"  },
          { label:"Módulos ERP",       value:"12",   color:"#27ae60"  },
          { label:"Tablas BD totales", value:"7.5k+",color:"#9b59b6"  },
          { label:"UDFs únicos",       value:"633",  color:"#e74c3c"  },
          { label:"DMs activos",       value:"17",   color:"#e67e22"  },
          { label:"Sistemas satélite", value:`${totalSystems}`, color:"#16a085" },
          { label:"Proyectos / DMs",   value:"66",   color:"#1abc9c"  },
        ].map(s => (
          <div key={s.label} style={{ background:"#ffffff", border:"1px solid #e0e0e0", borderRadius:10, padding:"10px 16px", flex:"1 1 100px", minWidth:90 }}>
            <div style={{ fontSize:24, fontWeight:800, color:s.color }}>{s.value}</div>
            <div style={{ fontSize:10, color:"#888" }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ background:"rgba(243,156,18,0.08)", border:"1px solid rgba(243,156,18,0.2)", borderRadius:8, padding:"10px 14px", marginBottom:24, fontSize:12, color:"#d4a944", lineHeight:1.6 }}>
        <strong>Ecosistema tecnológico — Grupo Mayoreo</strong> · 10 empresas en Costa Rica y Venezuela, 2 instancias SQL Server (CR + VE), 12 módulos Softland ERP v7.00, 17 desarrollos a medida, 19+ sistemas satélite.
      </div>

      {/* ──── LAYER STACK ──── */}
      <div style={{ display:"flex", flexDirection:"column", gap:0, marginBottom:32 }}>

        {/* Aplicaciones de Negocio */}
        <div style={{ background:"linear-gradient(135deg,rgba(22,160,133,0.08),rgba(39,174,96,0.05))", border:"1px solid rgba(22,160,133,0.2)", borderRadius:"12px 12px 0 0", padding:20 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
            <span style={{ fontSize:20 }}>🏢</span>
            <div>
              <div style={{ fontSize:16, fontWeight:700, color:"#16a085" }}>Aplicaciones de Negocio</div>
              <div style={{ fontSize:11, color:"#777" }}>{businessDomains.length} dominios · {totalSystems} sistemas satélite integrados con el ERP</div>
            </div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(240px, 1fr))", gap:8 }}>
            {businessDomains.map(domain => (
              <div key={domain.name} style={{ background:"#f5f5f5", border:"1px solid "+domain.color+"44", borderRadius:8, overflow:"hidden", borderLeft:"3px solid "+domain.color }}>
                <div style={{ background:domain.color+"18", padding:"7px 12px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <span style={{ fontSize:11, fontWeight:700, color:domain.color }}>{domain.name}</span>
                  <span style={{ fontSize:9, color:"#666", background:"#f5f5f5", padding:"1px 5px", borderRadius:4 }}>{domain.items.length}</span>
                </div>
                <div style={{ padding:"5px 12px" }}>
                  {domain.items.map(item => (
                    <div key={item.name} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"3px 0", borderBottom:"1px solid #e0e0e0" }}>
                      <span style={{ fontSize:11, color:"#666", fontWeight:600 }}>{item.name}</span>
                      <span style={{ fontSize:9, color:"#666", fontStyle:"italic", textAlign:"right", maxWidth:160 }}>{item.type}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* DMs */}
        <div style={{ background:"linear-gradient(135deg,rgba(230,126,34,0.1),rgba(211,84,0,0.05))", border:"1px solid rgba(230,126,34,0.25)", borderTop:"none", padding:20 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
            <span style={{ fontSize:20 }}>🔧</span>
            <div>
              <div style={{ fontSize:16, fontWeight:700, color:"#e67e22" }}>Desarrollos a Medida (DMs)</div>
              <div style={{ fontSize:11, color:"#777" }}>{customDevelopments.length} soluciones custom que cierran brechas funcionales del ERP estándar</div>
            </div>
          </div>
          <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:12 }}>
            <button onClick={() => setDmFilter(null)} style={{ background:!dmFilter?"rgba(230,126,34,0.2)":"rgba(255,255,255,0.04)", border:"1px solid rgba(230,126,34,0.2)", color:!dmFilter?"#e67e22":"#888", padding:"4px 10px", borderRadius:6, cursor:"pointer", fontSize:10, fontWeight:600 }}>
              Todos ({customDevelopments.length})
            </button>
            {dmDomains.map(d => {
              const count = customDevelopments.filter(dm => dm.domain === d).length;
              return (
                <button key={d} onClick={() => setDmFilter(dmFilter===d?null:d)} style={{ background:dmFilter===d?"rgba(230,126,34,0.15)":"rgba(255,255,255,0.04)", border:"1px solid #e0e0e0", color:dmFilter===d?"#e67e22":"#888", padding:"4px 10px", borderRadius:6, cursor:"pointer", fontSize:10, fontWeight:600 }}>
                  {d} ({count})
                </button>
              );
            })}
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(280px, 1fr))", gap:8 }}>
            {filteredDMs.map(dm => (
              <div key={dm.id} style={{ background:"#f5f5f5", border:"1px solid rgba(230,126,34,0.15)", borderRadius:8, padding:"10px 14px", borderLeft:"3px solid "+dm.color }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:4 }}>
                  <div style={{ fontSize:12, fontWeight:700, color:"#E65100" }}>{dm.name}</div>
                  <span style={{ fontSize:9, color:"#886633", background:"rgba(230,126,34,0.12)", padding:"2px 7px", borderRadius:10, whiteSpace:"nowrap", marginLeft:6 }}>{dm.domain}</span>
                </div>
                <div style={{ fontSize:10, color:"#888", marginBottom:6, lineHeight:1.5 }}>{dm.desc}</div>
                <div style={{ display:"flex", gap:4, flexWrap:"wrap" }}>
                  <span style={{ fontSize:9, color:"#666" }}>ERP:</span>
                  {dm.modules.map(m => (
                    <span key={m} style={{ background:"rgba(243,156,18,0.15)", border:"1px solid rgba(243,156,18,0.25)", borderRadius:4, padding:"1px 5px", fontSize:9, fontWeight:700, color:"#f5d89a" }}>{m}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ERP Core */}
        <div style={{ background:"linear-gradient(135deg,rgba(243,156,18,0.1),rgba(241,196,15,0.04))", border:"1px solid rgba(243,156,18,0.25)", borderTop:"none", padding:20 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
            <span style={{ fontSize:20 }}>⬡</span>
            <div>
              <div style={{ fontSize:16, fontWeight:700, color:"#f39c12" }}>ERP — Softland v7.00</div>
              <div style={{ fontSize:11, color:"#777" }}>12 módulos · 10 empresas · 2 países · multi-schema SQL Server</div>
            </div>
          </div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
            {Object.entries(modules).map(([key, mod]) => (
              <div key={key} style={{ background:"rgba(243,156,18,0.12)", border:"1px solid rgba(243,156,18,0.25)", borderRadius:6, padding:"6px 12px", display:"flex", alignItems:"center", gap:6 }}>
                <span style={{ fontSize:12, fontWeight:700, color:"#f5d89a" }}>{mod.abbr}</span>
                <span style={{ fontSize:9, color:"#998855" }}>{mod.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Middleware */}
        <div style={{ background:"linear-gradient(135deg,rgba(155,89,182,0.08),rgba(142,68,173,0.04))", border:"1px solid rgba(155,89,182,0.2)", borderTop:"none", padding:"12px 20px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, justifyContent:"space-between", flexWrap:"wrap" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <span style={{ fontSize:16 }}>🔗</span>
              <div style={{ fontSize:14, fontWeight:700, color:"#9b59b6" }}>Integration / Middleware</div>
            </div>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              {ecosystemLayers.find(l=>l.id==="middleware").items.map(item => (
                <span key={item.name} style={{ background:"rgba(155,89,182,0.12)", border:"1px solid rgba(155,89,182,0.25)", borderRadius:5, padding:"3px 10px", fontSize:11, fontWeight:600, color:"#c39bd3" }}>{item.icon} {item.name}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Infrastructure */}
        <div style={{ background:"linear-gradient(135deg,rgba(39,174,96,0.08),rgba(46,204,113,0.04))", border:"1px solid rgba(39,174,96,0.2)", borderTop:"none", padding:"12px 20px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, justifyContent:"space-between", flexWrap:"wrap" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <span style={{ fontSize:16 }}>🖥</span>
              <div style={{ fontSize:14, fontWeight:700, color:"#27ae60" }}>Infrastructure</div>
            </div>
            <div style={{ display:"flex", gap:8 }}>
              {ecosystemLayers.find(l=>l.id==="infrastructure").items.map(item => (
                <span key={item.name} style={{ background:"#E8F5E9", border:"1px solid rgba(39,174,96,0.25)", borderRadius:5, padding:"3px 10px", fontSize:11, fontWeight:600, color:"#7dcea0" }}>{item.icon} {item.name}</span>
              ))}
              <span style={{ background:"#E8F5E9", border:"1px solid rgba(39,174,96,0.25)", borderRadius:5, padding:"3px 10px", fontSize:11, fontWeight:600, color:"#7dcea0" }}>🗃 SQL Server (CR) · SQL Server (VE)</span>
            </div>
          </div>
        </div>

        {/* Data */}
        <div style={{ background:"linear-gradient(135deg,rgba(52,152,219,0.08),rgba(41,128,185,0.04))", border:"1px solid rgba(52,152,219,0.2)", borderTop:"none", padding:"12px 20px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, justifyContent:"space-between", flexWrap:"wrap" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <span style={{ fontSize:16 }}>🗄</span>
              <div style={{ fontSize:14, fontWeight:700, color:"#3498db" }}>Data & BI</div>
            </div>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              {ecosystemLayers.find(l=>l.id==="data").items.map(item => (
                <span key={item.name} style={{ background:"rgba(52,152,219,0.12)", border:"1px solid rgba(52,152,219,0.25)", borderRadius:5, padding:"3px 10px", fontSize:11, fontWeight:600, color:"#85c1e9" }}>{item.icon} {item.name}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Security */}
        <div style={{ background:"linear-gradient(135deg,rgba(231,76,60,0.08),rgba(192,57,43,0.04))", border:"1px solid rgba(231,76,60,0.2)", borderTop:"none", borderRadius:"0 0 12px 12px", padding:"12px 20px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, justifyContent:"space-between", flexWrap:"wrap" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <span style={{ fontSize:16 }}>🛡</span>
              <div style={{ fontSize:14, fontWeight:700, color:"#e74c3c" }}>Security</div>
            </div>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              {ecosystemLayers.find(l=>l.id==="security").items.map(item => (
                <span key={item.name} style={{ background:"rgba(231,76,60,0.12)", border:"1px solid rgba(231,76,60,0.25)", borderRadius:5, padding:"3px 10px", fontSize:11, fontWeight:600, color:"#f1948a" }}>{item.icon} {item.name}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Flujos de integración */}
      <h3 style={{ fontSize:16, fontWeight:700, color:"#666", marginBottom:4 }}>Flujos de Integración Principales</h3>
      <p style={{ fontSize:12, color:"#777", marginBottom:14 }}>Cómo se conectan los dominios de negocio con el ERP Softland</p>
      <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
        {integrationFlows.map((f,i) => (
          <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:12, background:"#fafafa", border:"1px solid #e0e0e0", borderRadius:8, padding:"10px 14px", borderLeft:"3px solid "+f.color }}>
            <div style={{ fontSize:12, fontWeight:700, color:f.color, minWidth:180, whiteSpace:"nowrap" }}>{f.flow}</div>
            <div style={{ fontSize:11, color:"#888", lineHeight:1.5 }}>{f.detail}</div>
          </div>
        ))}
      </div>

      {/* Empresas del grupo */}
      <h3 style={{ fontSize:16, fontWeight:700, color:"#666", marginTop:28, marginBottom:4 }}>Empresas del Grupo Mayoreo</h3>
      <p style={{ fontSize:12, color:"#777", marginBottom:14 }}>2 instancias SQL Server · arquitectura multi-schema (un schema por empresa)</p>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(200px, 1fr))", gap:8 }}>
        {companies.map(c => (
          <div key={c.name} style={{ background:"#fafafa", border:"1px solid "+c.color+"44", borderRadius:8, padding:"10px 14px", borderLeft:"3px solid "+c.color }}>
            <div style={{ fontSize:14, fontWeight:700, color:c.color }}>{c.name}</div>
            <div style={{ fontSize:10, color:"#888", marginTop:2 }}>Schema: <span style={{ color:"#777", fontFamily:"monospace" }}>{c.schema}</span></div>
            <div style={{ fontSize:10, color:"#888" }}>{c.tables.toLocaleString()} tablas · {c.country}</div>
            <div style={{ fontSize:9, color:"#666", marginTop:2 }}>Instancia SQL: {c.instance}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════
//  ARCHITECTURE VIEW (Módulos ERP)
// ════════════════════════════════════════════════════════

// ── Datos de módulos para la matriz (extraídos de manuales Softland v7) ──
const moduleMatrix = [
  {
    code:"AS", name:"Administración del Sistema", area:"infraestructura",
    color:"#455A64",
    desc:"Base del sistema. Gestiona compañías, usuarios, permisos, tipos de cambio, monedas, períodos contables, centros de costo y parámetros globales. Requerido para implementar cualquier otro módulo.",
    funciones:["Gestión de usuarios y grupos de seguridad","Configuración de compañías y períodos contables","Tipos de cambio y monedas","Centros de costo y tablas globales","Bitácora de auditoría de procesos","Sincronización con Softland CRM Avanzado"],
    integra:["CG","CB","CC","CP","CI","FA","CO","CN","AF","CF","CR","CH"],
    tipo:"Infraestructura",
  },
  {
    code:"CG", name:"Contabilidad General", area:"financiero",
    color:"#c0392b",
    desc:"Corazón del área financiera. Organiza todas las transacciones contables del grupo, traduce el efecto de operaciones sobre la posición financiera. Auxiliar de todos los demás módulos.",
    funciones:["Plan de cuentas y centros de costo","Asientos manuales y automáticos","Cierre contable por período","Doble moneda y diferencias cambiarias","Doble contabilidad fiscal/corporativa","Reportes financieros y complemento Excel (CGXL)","Consolidación multi-empresa"],
    integra:["AS","CB","CC","CP","CI","FA","CO","CN","AF","CF","CR","CH"],
    tipo:"Financiero",
  },
  {
    code:"CB", name:"Control Bancario", area:"financiero",
    color:"#2980b9",
    desc:"Gestiona todas las cuentas bancarias de la empresa. Registra cheques, transferencias y depósitos. Integrado con CC, CP, CN para el flujo completo de cobros y pagos.",
    funciones:["Administración de cuentas bancarias","Registro de cheques y transferencias electrónicas","Conciliación bancaria","Integración con CC (depósitos de clientes)","Integración con CP (pagos a proveedores)","Integración con CN (pago de nómina)","Participación en Flujo de Caja"],
    integra:["CG","CC","CP","CN","CF","CH"],
    tipo:"Financiero",
  },
  {
    code:"CC", name:"Cuentas por Cobrar", area:"financiero",
    color:"#27ae60",
    desc:"Auxiliar contable para gestión de clientes. Controla documentos pendientes de cobro, aplica pagos, maneja crédito, multimoneda, retenciones e intereses. Alimentado por Facturación.",
    funciones:["Maestro de clientes con límite de crédito","Documentos de débito y crédito por cobrar","Aplicación de pagos y anticipos","Cálculo de intereses de mora","Diferencias cambiarias automáticas","Antigüedad de saldos y días promedio de atraso","Integración con CB para depósitos y TEF","Alimentado por FA (facturas de venta)"],
    integra:["AS","CG","CB","FA","CF"],
    tipo:"Financiero",
  },
  {
    code:"CP", name:"Cuentas por Pagar", area:"financiero",
    color:"#8e44ad",
    desc:"Auxiliar contable para gestión de proveedores. Controla saldos, genera cheques/TEF, maneja anticipos y retenciones. Se alimenta de Compras y descarga a Control Bancario.",
    funciones:["Maestro de proveedores con condiciones de pago","Documentos de crédito y débito a pagar","Cancelación por cheques y transferencias electrónicas","Impresión de cheques","Retenciones y ajustes cambiarios","Apartados presupuestales vía Contrarecibos","Integración con CO para facturas de compra","Integración con CB para pagos bancarios"],
    integra:["AS","CG","CB","CO","CF","CR"],
    tipo:"Financiero",
  },
  {
    code:"CF", name:"Flujo de Caja", area:"financiero",
    color:"#0097A7",
    desc:"Proyecta entradas y salidas de efectivo consolidando documentos pendientes de CC, CP, CB, FA y CO. Permite escenarios, proyecciones e inversiones para planificación de liquidez.",
    funciones:["Flujos de caja comprometidos y proyectados","Carga automática desde CC, CP, FA, CO","Saldos iniciales desde CB y Caja Chica","Escenarios y proyecciones manuales","Exportación a Excel","Integración con Control Presupuestal"],
    integra:["CG","CC","CP","CB","FA","CO","CR","CH"],
    tipo:"Financiero",
  },
  {
    code:"CR", name:"Control Presupuestal", area:"financiero",
    color:"#7B1FA2",
    desc:"Gestiona el presupuesto operativo por partidas y centros de costo. Genera movimientos presupuestales a partir de asientos contables de todos los módulos. Soporta presupuesto base cero y descentralizado.",
    funciones:["Formulación de presupuesto inicial y ampliaciones","Presupuesto base cero o incremental","Registro descentralizado con consolidación central","Validación de techos presupuestales","Solicitud y aprobación de fondos","Apartados presupuestales","Comparativo contable-presupuestal en Excel","Flujos de efectivo por estado presupuestal"],
    integra:["AS","CG","CC","CP","CI","FA","CO","CN","AF","CB","CF","CH"],
    tipo:"Financiero",
  },
  {
    code:"AF", name:"Activos Fijos", area:"financiero",
    color:"#7f8c8d",
    desc:"Administra el ciclo completo de activos fijos: ingreso, depreciación, revaluación y retiro. Genera asientos automáticos hacia Contabilidad General y alimenta el presupuesto.",
    funciones:["Registro y catalogación de activos","Depreciación automática por múltiples métodos","Revaluación de activos (R.E.I. para inflación)","Retiros y ventas de activos","Asientos contables automáticos","Integración con Control Presupuestal"],
    integra:["AS","CG","CR"],
    tipo:"Financiero",
  },
  {
    code:"CH", name:"Caja Chica", area:"financiero",
    color:"#B8860B",
    desc:"Controla el fondo de caja chica: vales, reembolsos y mayorización contable. Se asocia a una cuenta bancaria en CB y alimenta el saldo inicial de Flujo de Caja.",
    funciones:["Gestión de vales de caja chica","Reembolso y arqueo del fondo","Mayorización de movimientos contables","Asociación con cuentas bancarias (CB)","Participación en Flujo de Caja","Apartados presupuestales desde vales definitivos"],
    integra:["CG","CB","CP","CF","CR"],
    tipo:"Financiero",
  },
  {
    code:"FA", name:"Facturación", area:"operacional",
    color:"#16a085",
    desc:"Gestiona el ciclo completo de ventas: pedidos, remisiones y facturas. Controla precios, descuentos, límites de crédito y stock. Actualiza CC e inventario automáticamente.",
    funciones:["Elaboración de pedidos y facturas (línea/batch)","Manejo de remisiones y devoluciones","Múltiples listas de precios y descuentos","Control de límite de crédito en tiempo real","Facturación de kits y bonificaciones","Soporte multimoneda y multi-bodega","Lotes y localizaciones de artículos","Backorder y facturación parcial","Integración con CC (documentos por cobrar)","Integración con CI (actualización de stock)"],
    integra:["AS","CG","CC","CI","CF","CR"],
    tipo:"Operacional",
  },
  {
    code:"CO", name:"Compras", area:"operacional",
    color:"#d35400",
    desc:"Gestiona el ciclo completo de abastecimiento: solicitudes, órdenes de compra y recepción. Actualiza inventario y genera documentos en CP. Incluye manejo de importaciones.",
    funciones:["Solicitudes y órdenes de compra","Recepción de mercadería y control de embarques","Liquidación de importaciones y costos adicionales","Multimoneda y manejo de proveedores","Integración con CP (facturas de proveedor)","Integración con CI (ingreso al inventario)","Órdenes de compra en Flujo de Caja"],
    integra:["AS","CG","CP","CI","CF","CR"],
    tipo:"Operacional",
  },
  {
    code:"CI", name:"Control de Inventarios", area:"operacional",
    color:"#f39c12",
    desc:"Gestiona existencias, valoración y movimientos de artículos. Soporta múltiples bodegas, lotes, localizaciones y métodos de costeo. Núcleo del ciclo de abastecimiento y venta.",
    funciones:["Maestro de artículos con UDFs extensos","Múltiples bodegas y localizaciones","Control de lotes y series","Métodos de costeo (PEPS, promedio, estándar)","Ajustes de inventario y conteos físicos","Transferencias entre bodegas","Integración con FA (salidas por venta)","Integración con CO (ingresos por compra)","Clasificación ABC y políticas de stock"],
    integra:["AS","CG","FA","CO","CR"],
    tipo:"Operacional",
  },
  {
    code:"CN", name:"Control de Nómina", area:"rrhh",
    color:"#e74c3c",
    desc:"Administra el ciclo de nómina del personal: cálculo de salarios, deducciones, liquidaciones y aportes patronales. Integrado con CB para pagos y CG para asientos de planilla.",
    funciones:["Cálculo de planilla por empleado","Deducciones legales y voluntarias","Liquidaciones de empleados","Aportes patronales y cargas sociales","Generación de cheques y TEF de nómina (→CB)","Asiento contable de planilla (→CG)","Historial laboral y de salarios","Integración con Control Presupuestal"],
    integra:["AS","CG","CB","CR"],
    tipo:"RRHH",
  },
];

// ════════════════════════════════════════════════════════
//  MATRIZ DE RELACIONES ENTRE MÓDULOS (fuente: Manuales Softland v7)
// ════════════════════════════════════════════════════════
// type: "contable" | "operacional" | "datos" | "financiero"
const moduleRelations = [
  // ── AS como proveedor de datos base ──
  { from:"AS", to:"CG", type:"datos",       desc:"CG toma de AS la configuración de compañías, períodos contables, centros de costo y tipos de cambio necesarios para operar." },
  { from:"AS", to:"CB", type:"datos",       desc:"CB toma de AS los parámetros de entidades financieras, tipos de cambio y configuración de cuentas bancarias." },
  { from:"AS", to:"CC", type:"datos",       desc:"CC toma de AS países, tipos de cambio, códigos de impuesto y condiciones de pago para la gestión de clientes." },
  { from:"AS", to:"CP", type:"datos",       desc:"CP toma de AS categorías de proveedores, tipos de cambio, NIT, monedas y condiciones de pago." },
  { from:"AS", to:"CI", type:"datos",       desc:"CI toma de AS tablas de datos globales, configuración de bodegas y reglas de seguridad por usuario." },
  { from:"AS", to:"FA", type:"datos",       desc:"FA toma de AS parámetros globales, tipos de cambio e impuestos para los procesos de facturación." },
  { from:"AS", to:"CO", type:"datos",       desc:"CO toma de AS países, tipos de cambio, códigos de impuesto, monedas y condiciones de pago para compras." },
  { from:"AS", to:"CN", type:"datos",       desc:"CN toma de AS la configuración global del sistema y los parámetros de seguridad." },
  { from:"AS", to:"AF", type:"datos",       desc:"AF toma de AS los parámetros del sistema y la configuración de períodos contables para el cálculo de depreciaciones." },
  { from:"AS", to:"CF", type:"datos",       desc:"CF toma de AS los parámetros globales del sistema para su configuración base." },
  { from:"AS", to:"CR", type:"datos",       desc:"CR toma de AS la configuración de períodos contables y centros de costo para el control presupuestal." },
  { from:"AS", to:"CH", type:"datos",       desc:"CH toma de AS los parámetros generales del sistema para su operación." },

  // ── CG como receptor de asientos de todos los módulos ──
  { from:"CB", to:"CG", type:"contable",    desc:"CB genera asientos contables en CG por los movimientos bancarios: cheques, transferencias, depósitos y diferencias cambiarias." },
  { from:"CC", to:"CG", type:"contable",    desc:"CC es auxiliar contable de CG; registra los movimientos de la cuenta de clientes en el cuadro de cuentas contables." },
  { from:"CP", to:"CG", type:"contable",    desc:"CP es auxiliar contable de CG; registra los movimientos de la cuenta de proveedores en el mayor de CG." },
  { from:"CI", to:"CG", type:"contable",    desc:"CI genera asientos contables en CG para todas las transacciones de inventario: ingresos, salidas, ajustes y conteos físicos." },
  { from:"FA", to:"CG", type:"contable",    desc:"FA genera asientos contables de ventas en CG al procesar facturas, notas de crédito y devoluciones." },
  { from:"CO", to:"CG", type:"contable",    desc:"CO genera asientos contables en CG por compras, embarques y liquidaciones de importación." },
  { from:"CN", to:"CG", type:"contable",    desc:"CN genera el asiento contable de planilla en CG, incluyendo salarios, cargas sociales y deducciones." },
  { from:"AF", to:"CG", type:"contable",    desc:"AF genera asientos automáticos en CG por depreciaciones periódicas, adquisición, revaluación y retiro de activos." },
  { from:"CH", to:"CG", type:"contable",    desc:"CH genera asientos contables en CG al procesar reembolsos y mayorizar movimientos de caja chica." },
  { from:"CR", to:"CG", type:"contable",    desc:"CR se integra con CG para generar el comparativo contable-presupuestal y validar asientos contra presupuesto." },
  { from:"CF", to:"CG", type:"financiero",  desc:"CF consulta saldos y movimientos contables de CG para construir proyecciones de flujo de efectivo." },

  // ── CC ↔ FA: ciclo de ventas y cobros ──
  { from:"FA", to:"CC", type:"operacional", desc:"FA genera facturas de venta que se cargan automáticamente a CC como documentos pendientes de cobro para los clientes." },
  { from:"CC", to:"CB", type:"financiero",  desc:"Los pagos y depósitos de clientes registrados en CC reducen los saldos bancarios en CB vía cheques o transferencias electrónicas." },
  { from:"CC", to:"CF", type:"financiero",  desc:"CF toma los documentos pendientes de cobro de CC para incorporarlos en la proyección comprometida del flujo de efectivo." },

  // ── CP ↔ CO: ciclo de compras y pagos ──
  { from:"CO", to:"CP", type:"operacional", desc:"CO genera facturas de compra que se registran automáticamente en CP, actualizando los saldos de proveedores pendientes de pago." },
  { from:"CP", to:"CB", type:"financiero",  desc:"Los pagos a proveedores (cheques y TEF) procesados en CP reducen saldos en las cuentas bancarias controladas por CB." },
  { from:"CP", to:"CF", type:"financiero",  desc:"CF toma los documentos pendientes de pago de CP para incorporarlos en la proyección comprometida de egresos de efectivo." },
  { from:"CP", to:"CR", type:"financiero",  desc:"CP carga apartados presupuestales a CR a partir de contrarecibos, comprometiendo presupuesto antes del pago efectivo." },
  { from:"CP", to:"CH", type:"datos",       desc:"CP comparte el maestro de proveedores con CH, que usa dicha información en el detalle de los vales definitivos de caja chica." },

  // ── CI ↔ FA / CO ──
  { from:"FA", to:"CI", type:"operacional", desc:"FA reserva artículos en CI al crear pedidos, impidiendo doble compromiso, y actualiza las existencias al procesar las facturas de venta." },
  { from:"CO", to:"CI", type:"operacional", desc:"CO actualiza los niveles de existencias en CI cuando se recepciona mercancía de los proveedores (embarques aprobados)." },
  { from:"CI", to:"CR", type:"financiero",  desc:"CI integra con CR para asociar presupuesto a documentos de consumo de inventario, disminuyendo el presupuesto seleccionado." },

  // ── CB ↔ CN / CH ──
  { from:"CN", to:"CB", type:"financiero",  desc:"CN genera pagos de nómina (cheques y TEF) que se registran y controlan en las cuentas bancarias de CB." },
  { from:"CH", to:"CB", type:"financiero",  desc:"Los reembolsos de caja chica se asocian a una cuenta bancaria específica en CB para controlar el movimiento del fondo." },

  // ── CF ↔ FA / CO / CR ──
  { from:"FA", to:"CF", type:"financiero",  desc:"FA alimenta CF con los pedidos y facturas de venta comprometidas para proyección de entradas de efectivo futuras." },
  { from:"CO", to:"CF", type:"financiero",  desc:"CO alimenta CF con las órdenes de compra comprometidas para proyección de salidas de efectivo por pagar a proveedores." },
  { from:"CF", to:"CR", type:"financiero",  desc:"CF integra con CR para generar proyecciones de flujo de efectivo clasificadas por estado presupuestal." },

  // ── AF ↔ CO / CR ──
  { from:"CO", to:"AF", type:"operacional", desc:"CO puede registrar la adquisición de activos fijos mediante órdenes de compra que se contabilizan directamente en AF." },
  { from:"AF", to:"CR", type:"financiero",  desc:"AF integra con CR para control presupuestal de adquisiciones y depreciaciones de activos fijos." },

  // ── CN → CO ──
  { from:"CN", to:"CO", type:"datos",       desc:"CO toma el registro de empleados (compradores) del módulo CN — Control de Nómina para asignarlos a las órdenes de compra y solicitudes." },
];

// Helper: obtener relación entre dos módulos
const getRelation = (from, to) =>
  moduleRelations.find(r => r.from === from && r.to === to) ||
  moduleRelations.find(r => r.from === to && r.to === from && (() => false)()) ||
  null;

const getRelationDirected = (from, to) =>
  moduleRelations.find(r => r.from === from && r.to === to) || null;

const relationTypeColors = {
  contable:    { bg:"#fde8e8", border:"#e74c3c", dot:"#c0392b",  label:"Contable"    },
  operacional: { bg:"#e8f5e9", border:"#27ae60", dot:"#1e8449",  label:"Operacional" },
  datos:       { bg:"#e3f2fd", border:"#2980b9", dot:"#1a5276",  label:"Datos base"  },
  financiero:  { bg:"#fff3e0", border:"#f39c12", dot:"#d35400",  label:"Financiero"  },
};

const areaColors = {
  infraestructura:"#455A64", financiero:"#c0392b",
  operacional:"#16a085",     rrhh:"#e74c3c",
};
const areaLabels = {
  infraestructura:"Infraestructura",
  financiero:"Financiero-Contable",
  operacional:"Operacional",
  rrhh:"RRHH",
};


// ════════════════════════════════════════════════════════
//  DATOS — RELACIONES ENTRE SISTEMAS (6 SILOS BPA)
// ════════════════════════════════════════════════════════
const BPA_SYS = {
  erp: {bg:"#ECEFF1", bdr:"#455A64", dot:"#263238", tag:"ERP Softland"},
  ext: {bg:"#E3F2FD", bdr:"#1565C0", dot:"#0D47A1", tag:"Sistema Externo"},
  dm:  {bg:"#F3E5F5", bdr:"#7B1FA2", dot:"#4A148C", tag:"DM / Automático"},
  bi:  {bg:"#E8F5E9", bdr:"#2E7D32", dot:"#1B5E20", tag:"Analytics / BI"},
};

const SILOS_BPA = [

  // ═══════════════════════════════════════════════════════ COMPRAS
  { id:"CO", label:"Compras", color:"#E65100", icon:"🛒",
    macroprocesos:[

      { id:"DS", label:"Definición de Surtido",
        procesos:[
          { id:"DS-1", name:"Clasificación BDF (CVP01)",
            nota:"Corrida semestral automatizada. Actualiza estado y tipo de surtido en Softland. BDF: N=Nuevo, L=Ocasional, P=Pedido Especial.",
            sistemas:[
              {name:"ERP — CI", type:"erp", entidades:[
                {t:"ARTICULO", campos:["ARTICULO","ACTIVO","CLASE_ABC","CLASIFICACION_1","CLASIFICACION_2","U_ROTACION","U_MARGEN","U_CAT_PROVEEDOR","U_BAJO_MARGEN","CANT_DISPONIBLE_ACTUAL"]}
              ]},
              {name:"AFV", type:"ext", entidades:[
                {t:"ARTICULO_AFV", campos:["COD_ARTICULO","CLASIFICACION_BDF","ESTADO_ARTICULO","TIPO_SURTIDO","VENTAS_NETAS"]}
              ]},
              {name:"Catálogo Digital", type:"ext", entidades:[
                {t:"PRODUCTO_CAT", campos:["COD_ARTICULO","CLASIFICACION_BDF","ESTADO","VENTAS_NETAS","CARTERA_ACTIVA_PCT"]}
              ]},
            ]},
          { id:"DS-2", name:"Depuración de Surtido",
            opp:"Proceso manual sin trazabilidad. Oportunidad: workflow automático con criterios de eliminación basados en BDF + rotación + margen.",
            sistemas:[
              {name:"ERP — CI", type:"erp", entidades:[
                {t:"ARTICULO", campos:["ARTICULO","ACTIVO","CLASE_ABC","U_ROTACION","U_MARGEN","CANT_DISPONIBLE_ACTUAL","CLASIFICACION_1"]}
              ]},
              {name:"AFV", type:"ext", entidades:[
                {t:"ARTICULO_AFV", campos:["COD_ARTICULO","ESTADO_ARTICULO","TIPO_SURTIDO"]}
              ]},
            ]},
        ]},

      { id:"EF", label:"Estudio de Factibilidad",
        procesos:[
          { id:"EF-1", name:"Evaluación de oportunidad",
            opp:"Sin sistema dedicado. Oportunidad: scorecard de factibilidad automático en Power BI con criterios de margen, rotación y demanda.",
            sistemas:[
              {name:"Power BI / Fabric", type:"bi", entidades:[
                {t:"DS_FACTIBILIDAD", campos:["COD_ARTICULO","DEMANDA_ESTIMADA","RENTABILIDAD_EST","MARGEN_PROYECTADO","SCORE_FACTIBILIDAD"]}
              ]},
            ]},
          { id:"EF-2", name:"Análisis de proveedores",
            sistemas:[
              {name:"ERP — CO", type:"erp", entidades:[
                {t:"PROVEEDOR", campos:["PROVEEDOR","NOMBRE","CONDICION_PAGO","U_CATEGORIA","DESCUENTO","PAIS","ACTIVO","MONEDA","U_AGRUPACION"]},
                {t:"ARTICULO_PROVEEDOR", campos:["ARTICULO","PROVEEDOR","PLAZO_REABASTECIMI","LOTE_MINIMO","MULTIPLO_COMPRA","FACTOR_CONVERSION","CODIGO_CATALOGO","PAIS"]}
              ]},
              {name:"SIM", type:"bi", entidades:[
                {t:"RANKING_PROVEEDOR", campos:["COD_PROVEEDOR","SCORE_TOTAL","NIVEL_SERVICIO","PUNTUALIDAD","FILL_RATE"]}
              ]},
            ]},
          { id:"EF-3", name:"Aprobación de artículos",
            opp:"Aprobación manual sin trazabilidad. Oportunidad: workflow digital (n8n / Monday) con aprobación en cadena y auditoría.",
            sistemas:[
              {name:"ERP — CI", type:"erp", entidades:[
                {t:"ARTICULO", campos:["ARTICULO","ACTIVO","CLASIFICACION_1","CLASIFICACION_2","U_CAT_PROVEEDOR","U_GRUPO_COMPRA"]}
              ]},
            ]},
          { id:"CA-1", name:"Creación de artículos",
            nota:"El artículo se crea SIN precio. AFV lee la versión aprobada de Nivel de Precios en Softland.",
            sistemas:[
              {name:"ERP — CI", type:"erp", entidades:[
                {t:"ARTICULO", campos:["ARTICULO","DESCRIPCION","MARCA","CATEGORIA","CLASIFICACION_1","CLASIFICACION_2","PROVEEDOR","BODEGA","CUENTA","IMPUESTO","MOVILIDAD","TIPO_TRANSACCION","U_COD_AFV","U_BODEGA","U_CANT_MIN_DESC","U_DESC_EMPAQUE","U_FRECUENCIA","U_LEAD_TIME","U_MARGEN","U_ORIGEN","U_REDONDEO","U_ROTACION","U_STOCK_SEGURIDAD","U_USO"]},
                {t:"ARTICULO_PROVEEDOR", campos:["ARTICULO","PROVEEDOR","LOTE_MINIMO","MULTIPLO_COMPRA","FACTOR_CONVERSION","CODIGO_CATALOGO","PAIS","PLAZO_REABASTECIMI"]}
              ]},
              {name:"AFV", type:"ext", entidades:[
                {t:"ARTICULO_AFV", campos:["COD_ARTICULO","U_COD_AFV","ALMACENAMIENTO","BODEGA","U_CANT_MIN_DESC","CATEGORIA","CODIGO_BARRAS_INVT","DESCRIPCION","U_DESC_EMPAQUE","DISPONIBILIDAD","MARCA","MULTIPLO_VENTA","PRECIO_VENTA","SUBCATEGORIA","U_USO"]}
              ]},
              {name:"Catálogo Digital", type:"ext", entidades:[
                {t:"PRODUCTO_CAT", campos:["COD_ARTICULO","U_COD_AFV","BDF","CATEGORIA","DESCRIPCION","DISPONIBILIDAD","IMAGEN","MARCA","MULTIPLO_VENTA","PRECIO_VENTA","SUBCATEGORIA","U_USO"]}
              ]},
              {name:"Eprac / WMS", type:"ext", entidades:[
                {t:"ARTICULO_WMS", campos:["COD_ARTICULO","COD_BARRAS_DET","COD_BARRAS_ALM","ZONA_ALMACENAJE","DETALLE_ALMACENAJE","DISPONIBILIDAD","MARCA","PESO_BRUTO","PESO_NETO","VOLUMEN","SUBCATEGORIA"]}
              ]},
              {name:"Streamline GMDH", type:"ext", entidades:[
                {t:"ARTICULO_SL", campos:["COD_ARTICULO","BODEGA","BDF","CATEGORIA","COD_BARRAS_DET","COD_BARRAS_ALM","DESCRIPCION","DISPONIBILIDAD","U_FRECUENCIA","U_LEAD_TIME","MARCA","MULTIPLO_VENTA","U_ORIGEN","PESO_BRUTO","PESO_NETO","PRECIO_VENTA","PROVEEDOR","U_REDONDEO","U_ROTACION","SUBCATEGORIA","VOLUMEN","ZONA_ALMACENAJE"]}
              ]},
              {name:"Portal de Pedidos", type:"ext", entidades:[
                {t:"PRODUCTO_PORTAL", campos:["COD_ARTICULO","BDF","CATEGORIA","COD_ARTICULO_PROVEEDOR","COD_BARRAS_DET","DESCRIPCION","DETALLE_ALMACENAJE","FICHA_TECNICA","IMAGEN","MARCA","MULTIPLO_VENTA","NOTAS","ORIGEN","SUBCATEGORIA","DISPONIBILIDAD","U_USO"]}
              ]},
              {name:"MPPV — Portal Proveedores", type:"ext", entidades:[
                {t:"ARTICULO_MPPV", campos:["COD_ARTICULO","BODEGA","DESCRIPCION","DISPONIBILIDAD","PROVEEDOR","REFERENCIA_PROVEEDOR"]}
              ]},
              {name:"Cargador Imagen DM", type:"dm", entidades:[
                {t:"U_IMAGEN_ART", campos:["COD_ARTICULO","URL_IMAGEN","FORMATO","FECHA_CARGA"]}
              ]},
            ]},
          { id:"CA-2", name:"Fijación de precios",
            sistemas:[
              {name:"ERP — CO / CI", type:"erp", entidades:[
                {t:"ARTICULO_PROVEEDOR", campos:["ARTICULO","PROVEEDOR","COSTO_ARTICULO","PLAZO_REABASTECIMI","LOTE_MINIMO","MULTIPLO_COMPRA"]},
                {t:"NIVEL_DE_PRECIOS", campos:["NIVEL_PRECIO","ARTICULO","LISTA","MONEDA","VERSION","PRECIO_VENTA","CONDICION_PAGO","ESQUEMA_TRABAJO","SUGERIR_DESCUENTO","SINC_MOVIL"]}
              ]},
              {name:"Cargador de Precios DM", type:"dm", entidades:[
                {t:"U_PRECIO_CARGA", campos:["COD_ARTICULO","COSTO_ARTICULO","PRECIO_VENTA","MONEDA","VERSION"]}
              ]},
              {name:"AFV", type:"ext", entidades:[
                {t:"PRECIO_AFV", campos:["COD_ARTICULO","NIVEL_PRECIO","MONEDA","VERSION","PRECIO_VENTA"]}
              ]},
            ]},
          { id:"CA-3", name:"Revisión de precios",
            sistemas:[
              {name:"ERP — FA", type:"erp", entidades:[
                {t:"NIVEL_DE_PRECIOS", campos:["NIVEL_PRECIO","ARTICULO","LISTA","MONEDA","VERSION","PRECIO_VENTA","FACTOR_CALCULO"]}
              ]},
              {name:"AFV", type:"ext", entidades:[
                {t:"PRECIO_AFV", campos:["COD_ARTICULO","NIVEL_PRECIO","FACTOR_CALCULO","PRECIO_VENTA"]}
              ]},
              {name:"Catálogo Digital", type:"ext", entidades:[
                {t:"PRECIO_CAT", campos:["COD_ARTICULO","NIVEL_PRECIO","PRECIO_VENTA","MONEDA"]}
              ]},
            ]},
        ]},

      { id:"NEG", label:"Negociación con Proveedores",
        procesos:[
          { id:"NEG-1", name:"Definición de condiciones comerciales",
            opp:"Negociación completamente manual. Oportunidad: portal proveedor con condiciones digitales, contratos y aprobaciones en línea.",
            sistemas:[
              {name:"ERP — CO / CP", type:"erp", entidades:[
                {t:"PROVEEDOR", campos:["PROVEEDOR","NOMBRE","CONDICION_PAGO","U_CATEGORIA","DESCUENTO","PAIS","ACTIVO","MONEDA"]},
                {t:"CONDICION_PAGO", campos:["CONDICION_PAGO","DESCRIPCION","DIAS_PAGO","FORMA_PAGO","METODO_PAGO"]}
              ]},
            ]},
          { id:"NEG-2", name:"Análisis de pedidos",
            sistemas:[
              {name:"Streamline GMDH", type:"ext", entidades:[
                {t:"SUGERIDO_COMPRA", campos:["COD_ARTICULO","BODEGA","CANTIDAD_SUGERIDA","PROVEEDOR","FECHA_REQ","PRIORIDAD","LEAD_TIME","MULTIPLO_COMPRA"]}
              ]},
              {name:"ERP — CO", type:"erp", entidades:[
                {t:"ORDEN_COMPRA", campos:["ORDEN_COMPRA","PROVEEDOR","CONDICION_PAGO","ESTADO","FECHA","BODEGA","MONEDA","CONFIRMADA","COMPRADOR","PRIORIDAD"]}
              ]},
            ]},
          { id:"NEG-3", name:"Presupuesto de Compras",
            sistemas:[
              {name:"ERP — CO / CR", type:"erp", entidades:[
                {t:"PARTIDA_PRESUPUESTAL", campos:["PARTIDA","DESCRIPCION","CUENTA_CONTABLE","CENTRO_COSTO","TIPO_FLUJO_CAJA"]}
              ]},
              {name:"DM Presupuesto", type:"dm", entidades:[
                {t:"U_PRESUPUESTO_CO", campos:["PERIODO","PROVEEDOR","CATEGORIA","MONTO_PLAN","MONTO_EJEC","VARIACION"]}
              ]},
            ]},
        ]},

      { id:"CM", label:"Compra",
        procesos:[
          { id:"CM-1", name:"Compra MCG — Cofersa / Mundial (CVP04)",
            nota:"Cofersa / Mundial: generación en Streamline, transmisión a Softland CO. Venezuela: OC directo en Softland CO.",
            sistemas:[
              {name:"Streamline GMDH", type:"ext", entidades:[
                {t:"ORDEN_SL", campos:["COD_ARTICULO","BODEGA","CANTIDAD","COMPRADOR","FECHA_ORDEN","FECHA_REQUERIDA","NOMBRE_PROVEEDOR","ORDEN_COMPRA","PAIS_ORIGEN","PRIORIDAD","PROVEEDOR","TOTAL"]}
              ]},
              {name:"ERP — CO", type:"erp", entidades:[
                {t:"ORDEN_COMPRA", campos:["ORDEN_COMPRA","PROVEEDOR","CONDICION_PAGO","ESTADO","FECHA","BODEGA","MONEDA","CONFIRMADA","COMPRADOR","PRIORIDAD","U_BOOKING","U_TIEMPO_BACKORDER","U_ZONA_FRANCA"]},
                {t:"DETALLE_OC", campos:["ARTICULO","BODEGA","CANTIDAD_ORDENADA","PRECIO_UNIT_DOLAR","CUENTA_CONTABLE","COMENTARIO","U_PAIS_ORIGEN","U_FCH_EMBARQUE_ESTIMADA","U_FCH_ARRIBO_ESTIMADA","U_FCH_DISPONIBLE_BODEGA_ESTIMADA"]}
              ]},
            ]},
          { id:"CM-2", name:"Compra Nacional / Importado",
            sistemas:[
              {name:"ERP — CO / CI / CP", type:"erp", entidades:[
                {t:"ORDEN_COMPRA", campos:["ORDEN_COMPRA","PROVEEDOR","CONDICION_PAGO","ESTADO","FECHA","BODEGA","MONEDA","CONFIRMADA","U_ADUANA","U_AGENTE_ADUANAL","U_DUA","U_NO_DUA","U_NACIONALIZACION","U_FCH_DUA"]},
                {t:"RECEPCION_MERCIA", campos:["EMBARQUE","ARTICULO","BODEGA","CANTIDAD_RECIBIDA","CANTIDAD_EMBARCADA","CANTIDAD_RECHAZADA","ESTADO","FECHA_HORA"]},
                {t:"DOCUMENTO_CP", campos:["DOCUMENTO","PROVEEDOR","TIPO_DOCUMENTO","MONTO","SALDO","FECHA_VENC","ASIENTO","MONEDA"]}
              ]},
              {name:"DM Fletes", type:"dm", entidades:[
                {t:"U_LIQUIDACION_FLETE", campos:["NUM_OC","PROVEEDOR_FLETE","COSTO_FLETE","INCOTERM","PAIS_ORIGEN","U_REGLA_FLETE","U_REGLA_FLETE_DET"]}
              ]},
            ]},
        ]},

      { id:"SP", label:"Seguimiento Proveedores",
        procesos:[
          { id:"SP-1", name:"Seguimiento de la OC (CVP05)",
            sistemas:[
              {name:"ERP — CO", type:"erp", entidades:[
                {t:"ORDEN_COMPRA", campos:["ORDEN_COMPRA","PROVEEDOR","CONDICION_PAGO","ESTADO","FECHA","BODEGA","MONEDA","CONFIRMADA","U_FCH_EMBARQUE_ESTIMADA","U_FCH_EMBARQUE_REAL","U_FCH_ARRIBO_ESTIMADA","U_FCH_ARRIBO_REAL","U_FCH_CARGA_LISTA_ESTIMADA","U_FCH_CARGA_LISTA_REAL","U_FCH_DISPONIBLE_BODEGA_ESTIMADA","U_FCH_DISPONIBLE_BODEGA_REAL"]},
                {t:"DETALLE_OC", campos:["ARTICULO","BODEGA","CANTIDAD_ORDENADA","CANTIDAD_RECIBIDA","CANTIDAD_EMBARCADA","PRECIO_UNIT_DOLAR","COMENTARIO"]}
              ]},
              {name:"DM Tracking OC", type:"dm", entidades:[
                {t:"U_SEGUIMIENTO_OC", campos:["ORDEN_COMPRA","ARTICULO","PROVEEDOR","CANTIDAD_ORDENADA","CANTIDAD_RECIBIDA","DIFERENCIA","FECHA","U_FCH_LLEGADA_EMBARQUE","U_FCH_SALIDA_EMBARQUE"]}
              ]},
            ]},
          { id:"SP-2", name:"Evaluación de desempeño proveedor",
            opp:"KPIs de proveedor calculados manualmente. Oportunidad: scorecard automático desde CO + CP + CI.",
            sistemas:[
              {name:"Power BI / Fabric", type:"bi", entidades:[
                {t:"KPI_PROVEEDOR", campos:["COD_PROVEEDOR","OTD_PCT","FILL_RATE","CALIDAD_PCT","PERIODO"]}
              ]},
              {name:"SIM", type:"bi", entidades:[
                {t:"INDICADOR_PROV", campos:["PROVEEDOR","KPI","VALOR","META","ALERTA"]}
              ]},
            ]},
          { id:"SP-3", name:"Ranking de proveedores",
            opp:"Sin sistema dedicado. Oportunidad: ranking dinámico alimentado por KPIs automáticos.",
            sistemas:[
              {name:"Power BI / Fabric", type:"bi", entidades:[
                {t:"RANKING_PROV", campos:["POSICION","COD_PROVEEDOR","SCORE_GLOBAL","TENDENCIA","PERIODO","FILL_RATE","OTD_PCT"]}
              ]},
            ]},
          { id:"SP-4", name:"Reclamos y garantías",
            opp:"Gestión manual sin trazabilidad. Oportunidad: módulo de reclamos integrado con portal proveedor y NC automáticas.",
            sistemas:[
              {name:"ERP — CO / CP", type:"erp", entidades:[
                {t:"DOCUMENTO_CP", campos:["DOCUMENTO","PROVEEDOR","TIPO_DOCUMENTO","MONTO","SALDO","FECHA_VENC","ASIENTO","MONEDA","U_CODIGO_RECLAMO","U_AD_AM_NUMERO_RECLAMO"]},
                {t:"NC_PROVEEDOR", campos:["NUM_NC","NUM_OC","COD_ARTICULO","MOTIVO","VALOR","U_AD_AM_FECHA_RECLAMO","U_AD_AM_NUMERO_RECEPCION"]}
              ]},
            ]},
        ]},
    ]},

  // ═══════════════════════════════════════════════════════ VENTAS
  { id:"VE", label:"Ventas", color:"#1B5E20", icon:"📈",
    macroprocesos:[

      { id:"OC", label:"Oferta Comercial",
        procesos:[
          { id:"OC-1", name:"Oferta del Producto (CVP07)",
            sistemas:[
              {name:"ERP — FA / CI", type:"erp", entidades:[
                {t:"NIVEL_DE_PRECIOS", campos:["NIVEL_PRECIO","ARTICULO","LISTA","MONEDA","VERSION","PRECIO_VENTA","CONDICION_PAGO","ESQUEMA_TRABAJO","SUGERIR_DESCUENTO","SINC_MOVIL"]},
                {t:"ARTICULO", campos:["ARTICULO","ACTIVO","CLASIFICACION_1","MARCA","U_BDF","U_CANT_MIN_DESC","U_FRECUENCIA","U_COD_AFV","CANT_DISPONIBLE_ACTUAL"]}
              ]},
              {name:"AFV", type:"ext", entidades:[
                {t:"PRECIO_AFV", campos:["COD_ARTICULO","NIVEL_PRECIO","FACTOR_CALCULO","PRECIO_VENTA"]},
                {t:"PROMO_AFV", campos:["COD_PROMO","COD_ARTICULO","DESCUENTO","VIGENCIA","TOPE"]}
              ]},
              {name:"Catálogo Digital", type:"ext", entidades:[
                {t:"PRODUCTO_CAT", campos:["COD_ARTICULO","PRECIO_VENTA","IMAGEN","DISPONIBILIDAD","BDF","MARCA","DESCRIPCION"]}
              ]},
              {name:"DM Promociones", type:"dm", entidades:[
                {t:"U_PROMOCION", campos:["COD_PROMO","COD_ARTICULO","TIPO","DESCUENTO","INICIO","FIN"]}
              ]},
            ]},
          { id:"OC-2", name:"Potencial de la Zona (CVP09)",
            sistemas:[
              {name:"ERP — FA / CI", type:"erp", entidades:[
                {t:"FACTURA", campos:["FACTURA","CLIENTE","CONDICION_PAGO","COBRADOR","VENDEDOR","FECHA","BASE_IMPUESTO1","ANULADA","U_ESTATUS","U_COBRADOR"]},
                {t:"ESTADISTICA_VTA", campos:["CLIENTE","ARTICULO","PERIODO","MONTO_VENTA","MONTO_DOLAR","VENDEDOR","BODEGA","CLASIFICACION_1"]}
              ]},
              {name:"SIM", type:"bi", entidades:[
                {t:"POTENCIAL_ZONA", campos:["ZONA","CLIENTE","VENTA_REAL","POTENCIAL_USD","BRECHA","PENETRACION_PCT"]}
              ]},
            ]},
        ]},

      { id:"GC", label:"Gestión de Clientes",
        procesos:[
          { id:"GC-1", name:"Administración de Clientes (CVP08)",
            sistemas:[
              {name:"ERP — CC / CB / CG", type:"erp", entidades:[
                {t:"CLIENTE", campos:["CLIENTE","CONDICION_PAGO","CATEGORIA_CLIENTE","COBRADOR","VENDEDOR","LIMITE_CREDITO","CLASE_ABC","ACTIVO","U_CANAL","U_SECTOR","U_RUTA","U_ZONA","U_SEGMENTO","U_SUPERVISOR","U_COD_AFV","U_MAGNITUD_COMERCIAL","U_TIPO_CLIENTE"]},
                {t:"DOCUMENTO_CC", campos:["DOCUMENTO","CLIENTE","TIPO_DOCUMENTO","MONTO","SALDO","FECHA_VENC","ASIENTO","APROBADO","U_CONCILIACION_ANEXO","U_INSTRUMENTO_PAGO","U_NUMERO_ANEXO"]}
              ]},
              {name:"AFV", type:"ext", entidades:[
                {t:"CLIENTE_AFV", campos:["COD_CLIENTE","LIMITE_CREDITO","SALDO","ULTIMA_VISITA","ESTADO","U_FRECUENCIA_VISITA"]}
              ]},
              {name:"Agente Cobranza DM", type:"dm", entidades:[
                {t:"U_ALERTA_COBRO", campos:["COD_CLIENTE","DIAS_VENCIDO","MONTO_VENC","ESTADO_GESTION","RESPONSABLE"]}
              ]},
            ]},
          { id:"GC-2", name:"Administración de Ventas (CVP10)",
            sistemas:[
              {name:"ERP — FA / CC", type:"erp", entidades:[
                {t:"PEDIDO", campos:["PEDIDO","CLIENTE","CONDICION_PAGO","VENDEDOR","BODEGA","AUTORIZADO","CLASE_PEDIDO","BACKORDER","U_ESTADO_DEV","U_PRIORIDAD","U_PEDIDO_PADRE"]},
                {t:"FACTURA", campos:["FACTURA","CLIENTE","CONDICION_PAGO","COBRADOR","VENDEDOR","FECHA","BASE_IMPUESTO1","ANULADA","U_BOLETA","U_D151","U_RUTA","U_LINEA_FLETE_FAC"]}
              ]},
              {name:"AFV", type:"ext", entidades:[
                {t:"PEDIDO_AFV", campos:["COD_PEDIDO","COD_CLIENTE","COD_VENDEDOR","ESTADO","FECHA","TOTAL_LOCAL","TOTAL_DOLAR"]}
              ]},
            ]},
        ]},

      { id:"CV", label:"Captura y Facturación",
        procesos:[
          { id:"CV-1", name:"Captura de Pedidos — AFV (CVP11)",
            nota:"Pedidos capturados en ruta por el Agente (vendedor/cobrador) vía dispositivo móvil AFV.",
            sistemas:[
              {name:"AFV", type:"ext", entidades:[
                {t:"PEDIDO_AFV", campos:["COD_PEDIDO","COD_CLIENTE","COD_VENDEDOR","COD_ARTICULO","CANTIDAD","PRECIO_VENTA","DESCUENTO","ESTADO","U_REFERENCIA_CLIENTE","U_ESTADO_AFV"]}
              ]},
              {name:"ERP — FA / CI", type:"erp", entidades:[
                {t:"PEDIDO", campos:["PEDIDO","CLIENTE","CONDICION_PAGO","VENDEDOR","BODEGA","AUTORIZADO","CLASE_PEDIDO","BACKORDER","U_PRIORIDAD"]},
                {t:"DETALLE_PEDIDO", campos:["PEDIDO","ARTICULO","CANTIDAD","PRECIO_UNIT","DESCUENTO","BACKORDER","BODEGA"]}
              ]},
            ]},
          { id:"CV-2", name:"Facturación (CVP12)",
            sistemas:[
              {name:"ERP — FA / CI / CC", type:"erp", entidades:[
                {t:"FACTURA", campos:["FACTURA","CLIENTE","CONDICION_PAGO","COBRADOR","VENDEDOR","FECHA","BASE_IMPUESTO1","ANULADA","U_BOLETA","U_ESTATUS","U_RUTA","U_PS_MONTO_FLETE","U_PS_DESCUENTO_FLETE_PORCENTAJE","U_PS_NIVEL","U_REGLA_FLETE"]},
                {t:"DETALLE_FACTURA", campos:["FACTURA","ARTICULO","CANTIDAD","PRECIO_UNIT","DESCUENTO","BODEGA","CUENTA_CONTABLE","CENTRO_COSTO"]},
                {t:"DOCUMENTO_CC", campos:["DOCUMENTO","CLIENTE","TIPO_DOCUMENTO","MONTO","SALDO","FECHA_VENC","ASIENTO"]}
              ]},
              {name:"Imprenta Digital DM", type:"dm", entidades:[
                {t:"U_JM_ESTADO_IMPR", campos:["FACTURA","U_JM_ESTADO_IMPR","U_JM_CANT_IMPR","U_JM_IMPRENTA_CORREO"]}
              ]},
              {name:"GTI / Factura Electrónica", type:"ext", entidades:[
                {t:"DTE_FACTURA", campos:["NUM_FACTURA","XML_DTE","CLAVE_NUMERICA","ESTADO_HACIENDA","FECHA_EMISION"]}
              ]},
            ]},
        ]},

      { id:"CA2", label:"Cobro y Aplicación",
        procesos:[
          { id:"CA2-1", name:"Cobro y Aplicación de Pagos (CVP13)",
            sistemas:[
              {name:"ERP — CC / CB / CG", type:"erp", entidades:[
                {t:"DOCUMENTO_CC", campos:["DOCUMENTO","CLIENTE","TIPO_DOCUMENTO","MONTO","SALDO","FECHA_VENC","ASIENTO","APROBADO","U_CONCILIACION_ANEXO","U_NUMERO_ANEXO","U_INSTRUMENTO_PAGO","U_FECHA_ANEXO","U_REFERENCIA_REAL_BANCARIA"]},
                {t:"MOV_BANCARIO", campos:["CUENTA_BANCO","TIPO_MOV","MONTO","FECHA","REFERENCIA","U_INT_FECHA_VALOR_XRT","U_FECHA_VALOR_XRT_CONCAT"]}
              ]},
              {name:"Sage XRT", type:"ext", entidades:[
                {t:"CONCILIACION_XRT", campos:["REFERENCIA","MONTO","FECHA_VALOR","BANCO","ESTADO_CONCILIACION"]}
              ]},
              {name:"Host to Host", type:"ext", entidades:[
                {t:"PAGO_H2H", campos:["NUM_PAGO","CLIENTE","MONTO","BANCO","FECHA_TEF","ESTADO"]}
              ]},
            ]},
        ]},
    ]},

  // ═══════════════════════════════════════════════════════ LOGÍSTICA
  { id:"LO", label:"Logística", color:"#0D47A1", icon:"🚛",
    macroprocesos:[

      { id:"PI", label:"Planificación de Inventario",
        procesos:[
          { id:"PI-1", name:"Control de Inventario (SOP03)",
            sistemas:[
              {name:"ERP — CI / CO / CG", type:"erp", entidades:[
                {t:"INVENTARIO", campos:["ARTICULO","BODEGA","CANT_DISPONIBLE","CANT_RESERVADA","CANT_PEDIDA","CANT_TRANSITO","COSTO_PROM_COMPARATIVO_LOC","CONGELADO","U_STOCK_SEGURIDAD"]},
                {t:"MOVIMIENTO_CI", campos:["DOCUMENTO_INV","ARTICULO","BODEGA","CANTIDAD","COSTO_TOTAL_LOCAL","COSTO_TOTAL_DOLAR","CUENTA_CONTABLE","CENTRO_COSTO"]}
              ]},
              {name:"WMS — Eprac", type:"ext", entidades:[
                {t:"UBICACION_WMS", campos:["BODEGA","PASILLO","NIVEL","POSICION","COD_ARTICULO","CANTIDAD","ZONA_ALMACENAJE"]},
                {t:"CONTEO_FISICO", campos:["RECIBO","ARTICULO","LINEA","CANT_APROBADA","CANT_RECHAZADA","MOTIVO_RECHAZO","ID_PDA"]}
              ]},
              {name:"SIM", type:"bi", entidades:[
                {t:"KPI_INVENTARIO", campos:["COD_ARTICULO","U_ROTACION","DIAS_INVENTARIO","COBERTURA","CLASE_ABC"]}
              ]},
            ]},
          { id:"PI-2", name:"Reabastecimiento",
            sistemas:[
              {name:"Streamline GMDH", type:"ext", entidades:[
                {t:"SUGERIDO_REABAST", campos:["COD_ARTICULO","BODEGA","STOCK_ACTUAL","PUNTO_REORDEN","CANT_SUGERIDA","U_LEAD_TIME","PROVEEDOR","MULTIPLO_COMPRA"]}
              ]},
              {name:"ERP — CO / CI", type:"erp", entidades:[
                {t:"ORDEN_COMPRA", campos:["ORDEN_COMPRA","PROVEEDOR","CONDICION_PAGO","ESTADO","FECHA","BODEGA","MONEDA","CONFIRMADA","COMPRADOR","U_TIEMPO_BACKORDER"]},
                {t:"INVENTARIO", campos:["ARTICULO","BODEGA","CANT_DISPONIBLE","CANT_RESERVADA","CANT_PEDIDA","CANT_TRANSITO","U_STOCK_SEGURIDAD"]}
              ]},
            ]},
          { id:"PI-3", name:"Corrida BDF y Ajustes de Clasificación",
            sistemas:[
              {name:"ERP — CI", type:"erp", entidades:[
                {t:"ARTICULO", campos:["ARTICULO","ACTIVO","CLASIFICACION_1","CLASIFICACION_2","CANT_DISPONIBLE_ACTUAL","U_ROTACION","U_MARGEN","U_BAJO_MARGEN"]}
              ]},
              {name:"DM Corrida BDF", type:"dm", entidades:[
                {t:"U_RESULTADO_BDF", campos:["COD_ARTICULO","CLASE_BDF","CONTRIBUCION","U_ROTACION","DECISION","PERIODO"]}
              ]},
            ]},
        ]},

      { id:"OA", label:"Operaciones de Almacén",
        procesos:[
          { id:"OA-1", name:"Recepción de Mercancía (CVP06)",
            sistemas:[
              {name:"ERP — CO / CI", type:"erp", entidades:[
                {t:"RECEPCION_MERCIA", campos:["EMBARQUE","ARTICULO","BODEGA","CANTIDAD_RECIBIDA","CANTIDAD_EMBARCADA","CANTIDAD_RECHAZADA","ESTADO","FECHA_HORA","U_FCH_ARRIBO_REAL","U_FCH_DISPONIBLE_BODEGA_REAL"]},
                {t:"INVENTARIO", campos:["ARTICULO","BODEGA","CANT_DISPONIBLE","CANT_RESERVADA","CANT_PEDIDA","CANT_TRANSITO"]}
              ]},
              {name:"WMS — Eprac", type:"ext", entidades:[
                {t:"RECEPCION_WMS", campos:["NUM_RECEPCION","COD_ARTICULO","UBICACION","CANTIDAD","QC_STATUS","FECHA","ZONA_ALMACENAJE"]}
              ]},
            ]},
          { id:"OA-2", name:"Picking y Alistado",
            sistemas:[
              {name:"WMS — Eprac", type:"ext", entidades:[
                {t:"ORDEN_PICKING", campos:["NUM_PEDIDO","COD_ARTICULO","UBICACION","CANTIDAD","OPERARIO","STATUS","ZONA_ALMACENAJE"]},
                {t:"DESPACHO_WMS", campos:["NUM_DESPACHO","BULTOS","PESO_TOTAL","STATUS_EMBALAJE"]}
              ]},
              {name:"ERP — FA / CI", type:"erp", entidades:[
                {t:"PEDIDO", campos:["PEDIDO","CLIENTE","CONDICION_PAGO","VENDEDOR","BODEGA","AUTORIZADO","CLASE_PEDIDO","BACKORDER","U_ESTADO_EPRAC","U_FECHA_EPRAC"]},
                {t:"MOVIMIENTO_CI", campos:["DOCUMENTO_INV","ARTICULO","BODEGA","CANTIDAD","COSTO_TOTAL_LOCAL","COSTO_TOTAL_DOLAR","CUENTA_CONTABLE"]}
              ]},
              {name:"eFLOW WMS DM", type:"dm", entidades:[
                {t:"U_FLUJO_WMS", campos:["PASO","RESPONSABLE","ESTADO","TIEMPO","ANOMALIA"]}
              ]},
            ]},
        ]},

      { id:"DT", label:"Distribución y Transporte",
        procesos:[
          { id:"DT-1", name:"Despacho y Transporte (CVP15)",
            sistemas:[
              {name:"ERP — FA / CI", type:"erp", entidades:[
                {t:"FACTURA", campos:["FACTURA","CLIENTE","CONDICION_PAGO","COBRADOR","VENDEDOR","FECHA","BASE_IMPUESTO1","ANULADA","U_ESTATUS","U_RUTA"]},
                {t:"REMISION", campos:["NUM_REMISION","NUM_FAC","UNIDADES","PESO","ESTADO"]}
              ]},
              {name:"Torre de Control", type:"ext", entidades:[
                {t:"VIAJE", campos:["ID_VIAJE","VEHICULO","CONDUCTOR","RUTA","STATUS","FECHA_SALIDA","FECHA_LLEGADA","U_TIPO_VEHICULO","U_ORIGEN_VEHICULO"]},
                {t:"ENTREGA", campos:["ID_ENTREGA","NUM_FAC","COD_CLIENTE","STATUS","FIRMA_DIGITAL","GPS_ENTREGA"]}
              ]},
              {name:"DM Fletes", type:"dm", entidades:[
                {t:"U_LIQUIDACION_FLETE", campos:["ID_VIAJE","RUTA","TARIFA","COSTO_TOTAL","ESTADO_PAGO","U_REGLA_FLETE","U_PS_MONTO_FLETE","U_PS_TARIFA_FLETE_PORCENTAJE"]}
              ]},
            ]},
          { id:"DT-2", name:"Última Milla",
            opp:"Sin plataforma dedicada. Oportunidad: TMS de última milla con notificaciones en tiempo real al cliente (SMS / WhatsApp via Respond.io).",
            sistemas:[
              {name:"Respond.io", type:"ext", entidades:[
                {t:"NOTIFICACION_OMNI", campos:["CLIENTE","CANAL","MENSAJE","TEMPLATE","STATUS","TIMESTAMP","NUM_FAC"]}
              ]},
            ]},
          { id:"DT-3", name:"Liquidación de Viajes",
            opp:"Proceso manual sin sistema integrado. Oportunidad: automatizar liquidación desde Torre de Control.",
            sistemas:[
              {name:"ERP — CP / CG", type:"erp", entidades:[
                {t:"DOCUMENTO_CP", campos:["DOCUMENTO","PROVEEDOR","TIPO_DOCUMENTO","MONTO","SALDO","FECHA_VENC","ASIENTO","MONEDA"]}
              ]},
            ]},
        ]},

      { id:"CE", label:"Comercio Exterior",
        procesos:[
          { id:"CE-1", name:"Importaciones (SOP04)",
            sistemas:[
              {name:"ERP — CO / CI / CP / CG", type:"erp", entidades:[
                {t:"ORDEN_COMPRA", campos:["ORDEN_COMPRA","PROVEEDOR","CONDICION_PAGO","ESTADO","FECHA","BODEGA","MONEDA","CONFIRMADA","U_BOOKING","U_ADUANA","U_AGENTE_ADUANAL","U_DUA","U_NO_DUA","U_FCH_EMBARQUE_ESTIMADA","U_FCH_EMBARQUE_REAL","U_FCH_ARRIBO_ESTIMADA","U_FCH_ARRIBO_REAL"]},
                {t:"COSTO_IMPORTACION", campos:["ARTICULO","BODEGA","CANTIDAD_RECIBIDA","COST_UN_COMP_DOLAR","COST_UN_ESTI_DOLAR","COSTO_TOTAL_DOLAR","CODIGO_ARANCEL","CONCEPTO_ME"]}
              ]},
              {name:"EDI", type:"ext", entidades:[
                {t:"MENSAJE_EDI", campos:["TIPO_MSG","NUM_OC","PROVEEDOR","FECHA","STATUS","REFERENCIA"]}
              ]},
              {name:"DM Tracking OC", type:"dm", entidades:[
                {t:"U_FLETE_INT", campos:["NUM_OC","NAVIERA","BL","CONTENEDOR","ETA","ETD","ESTADO","U_FCH_SALIDA_EMBARQUE","U_FCH_LLEGADA_EMBARQUE"]}
              ]},
            ]},
        ]},
    ]},

  // ═══════════════════════════════════════════════════════ FINANCIERO / CONTROL
  { id:"FI", label:"Control", color:"#C62828", icon:"🛡",
    macroprocesos:[

      { id:"CF", label:"Control Financiero",
        procesos:[
          { id:"CF-1", name:"Ejecución y Control del Plan Financiero (SOP01)",
            sistemas:[
              {name:"ERP — CG / CB / CC / CP / AF / CF", type:"erp", entidades:[
                {t:"ASIENTO", campos:["ASIENTO","PAQUETE","FECHA","ORIGEN","CLASE_ASIENTO","MARCADO","PERIODO"]},
                {t:"CUENTA", campos:["CUENTA","NOMBRE","TIPO","NIVEL","SALDO_LOCAL","SALDO_DOLAR","CENTRO_COSTO"]},
                {t:"MOV_BANCARIO", campos:["CUENTA_BANCO","TIPO_MOV","MONTO","FECHA","REFERENCIA","U_CONSECUTIVO_BNCR","U_REFERENCIA_REAL_BANCARIA"]}
              ]},
              {name:"Sage XRT", type:"ext", entidades:[
                {t:"CONCILIACION_XRT", campos:["REFERENCIA","MONTO","FECHA_VALOR","BANCO","ESTADO_CONCILIACION","U_FECHA_VALOR_XRT_CONCAT"]}
              ]},
              {name:"DM Conciliaciones", type:"dm", entidades:[
                {t:"U_CONCILIACION_ANEXO", campos:["DOCUMENTO","BANCO","FECHA","MONTO","ESTADO","U_CONVENIOQANEXO","U_CUENTA_ANEXO"]}
              ]},
            ]},
          { id:"CF-2", name:"Registro y Control de Operaciones Contables (SOP02)",
            sistemas:[
              {name:"ERP — CG / AF / CB / CC / CP", type:"erp", entidades:[
                {t:"ASIENTO", campos:["ASIENTO","PAQUETE","FECHA","ORIGEN","CLASE_ASIENTO","MARCADO"]},
                {t:"PARTIDA_PRESUPUESTAL", campos:["PARTIDA","DESCRIPCION","CUENTA_CONTABLE","CENTRO_COSTO","TIPO_FLUJO_CAJA","CONVERSION"]},
                {t:"ACTIVO_FIJO", campos:["ACTIVO","NOMBRE","FECHA_COMPRA","COSTO","DEPRECIACION_ACUM","VALOR_EN_LIBROS","CUENTA_CONTABLE"]}
              ]},
              {name:"DM Presupuesto", type:"dm", entidades:[
                {t:"U_PPTO_VTA_ART", campos:["PERIODO","COD_ARTICULO","COBRADOR","MONTO_PLAN","MONTO_EJEC","VARIACION"]},
                {t:"U_PPTO_MARGEN_ART", campos:["PERIODO","COD_ARTICULO","MARGEN_PLAN","MARGEN_EJEC"]}
              ]},
            ]},
        ]},

      { id:"CCC", label:"Crédito y Cobro",
        procesos:[
          { id:"CCC-1", name:"Gestión de Crédito y Cobro",
            sistemas:[
              {name:"ERP — CC / CB / CG", type:"erp", entidades:[
                {t:"CLIENTE", campos:["CLIENTE","CONDICION_PAGO","LIMITE_CREDITO","ACTIVO","U_CANAL","U_SECTOR","U_RUTA","U_SEGMENTO"]},
                {t:"DOCUMENTO_CC", campos:["DOCUMENTO","CLIENTE","TIPO_DOCUMENTO","MONTO","SALDO","FECHA_VENC","ASIENTO","APROBADO","U_NUMERO_ANEXO","U_INSTRUMENTO_PAGO","U_CONCILIACION_ANEXO","U_FECHA_RETENCION","U_FECHA_VALOR_XRT_CONCAT"]}
              ]},
              {name:"Sage XRT / H2H", type:"ext", entidades:[
                {t:"PAGO_BANCARIO", campos:["REFERENCIA","CLIENTE","MONTO","FECHA_VALOR","BANCO","ESTADO","U_REFERENCIA_REAL_BANCARIA"]}
              ]},
              {name:"DM Imprenta Digital", type:"dm", entidades:[
                {t:"U_JM_ESTADO_IMPR", campos:["DOCUMENTO","U_JM_ESTADO_IMPR","U_JM_CANT_IMPR","U_JM_IMPRENTA_CORREO","U_JM_PROV_CON"]}
              ]},
            ]},
        ]},

      { id:"TP", label:"Tesorería y Pagos",
        procesos:[
          { id:"TP-1", name:"Gestión de Pagos a Proveedores",
            sistemas:[
              {name:"ERP — CP / CB / CG", type:"erp", entidades:[
                {t:"DOCUMENTO_CP", campos:["DOCUMENTO","PROVEEDOR","TIPO_DOCUMENTO","MONTO","SALDO","FECHA_VENC","ASIENTO","MONEDA","U_CREDITO_FISCAL","U_ES_EXENTA","U_NIT","U_NUM_EXPEDIENTE","U_NUM_PLANTILLA","U_NUMERO_CONTROL","U_RETENCION_GALAC","U_PS_GALAC_NUM_COMP","U_PS_FECHA_CONTABLE","U_PS_FECHA_APLICACION_RET"]},
                {t:"CHEQUE", campos:["CHEQUE","CUENTA_BANCO","BENEFICIARIO","MONTO","FECHA","ESTADO"]}
              ]},
              {name:"SPI / Pagos Interbancarios", type:"ext", entidades:[
                {t:"TRANSFERENCIA_SPI", campos:["NUM_PAGO","PROVEEDOR","MONTO","BANCO","NUM_CUENTA","FECHA_TEF","ESTADO"]}
              ]},
            ]},
        ]},
    ]},

  // ═══════════════════════════════════════════════════════ PERSONAL / RRHH
  { id:"RH", label:"Personal", color:"#e67e22", icon:"👥",
    macroprocesos:[

      { id:"GT", label:"Gestión del Talento",
        procesos:[
          { id:"GT-1", name:"Reclutamiento y Selección",
            opp:"Sin ATS integrado. Oportunidad: sistema de tracking de candidatos conectado a CN para onboarding automático.",
            sistemas:[
              {name:"Portal Interno", type:"ext", entidades:[
                {t:"SOLICITUD_EMPLEO", campos:["ID_SOL","PUESTO","AREA","CIA","CANDIDATO","ETAPA","EVALUADOR","STATUS"]}
              ]},
              {name:"GLPI", type:"ext", entidades:[
                {t:"TICKET_RRHH", campos:["NUM_TICKET","TIPO","AREA","DESCRIPCION","PRIORIDAD","STATUS"]}
              ]},
            ]},
          { id:"GT-2", name:"Gestión de Personal (SOP06)",
            sistemas:[
              {name:"ERP — CN / CG / CP", type:"erp", entidades:[
                {t:"EMPLEADO", campos:["EMPLEADO","DEPARTAMENTO","CENTRO_COSTO","ESTADO_EMPLEADO","ENTIDAD_FINANCIERA","CTA_ELECTRONICA","DIVISION_GEOGRAFICA1","ACTIVO","U_ESCOLAR","U_ESPECIALIZACION","U_HABIL","U_MAIL","U_NIVEL_ORGANIZACIONAL","U_PAIS","U_PASO_SALARIAL","U_ROL","U_SUPERVISOR","U_TDEP","U_TIPOPERSONA","U_TIPO_DOCUMENTO_IDENTIDAD"]},
                {t:"CONTRATO", campos:["COD_EMPLEADO","TIPO_CONTRATO","FECHA_INICIO","FECHA_FIN","SALARIO"]},
                {t:"CONCEPTO_NOMINA", campos:["CONCEPTO","DESCRIPCION","CONTABILIZACION","CARGA_HORAS","DIAS_PERIODO","CANT_EDITABLE","CALCULO_POR_DLL"]}
              ]},
              {name:"Google Workspace", type:"ext", entidades:[
                {t:"EMPLEADO_GSUITE", campos:["EMAIL","GRUPOS","UNIDAD_ORG","ESTADO","ULTIMO_ACCESO"]}
              ]},
              {name:"DM Atributos RH", type:"dm", entidades:[
                {t:"U_ATRIBUTO_EMPLEADO", campos:["COD_EMPLEADO","ATRIBUTO","VALOR","VIGENCIA","APROBADOR"]}
              ]},
            ]},
        ]},

      { id:"NOM", label:"Nómina y Compensación",
        procesos:[
          { id:"NOM-1", name:"Nómina Costa Rica",
            sistemas:[
              {name:"ERP — CN / CB / CG", type:"erp", entidades:[
                {t:"NOMINA", campos:["NOMINA","DESCRIPCION","PERIODO_NOMINA","ESTADO","MONEDA","CUENTA_BANCO","CTA_NOMINA","MODALIDAD_ASIENTO"]},
                {t:"LINEA_NOMINA", campos:["LIQUIDACION","CONCEPTO","LINEA","MONTO","TIPO_CONCEPTO","CUENTA_CONTABLE","CENTRO_COSTO","DESCRIPCION"]},
                {t:"PAGO_NOMINA_CB", campos:["NUM_PAGO","COD_EMPLEADO","MONTO","BANCO","NUM_CUENTA","FECHA_TEF"]}
              ]},
              {name:"DM Gestión Mensual", type:"dm", entidades:[
                {t:"U_RESUMEN_NOMINA", campos:["CIA","PERIODO","AREA","TOTAL_BRUTO","CARGAS_SOC","NETO","VARIACION"]}
              ]},
            ]},
          { id:"NOM-2", name:"Nómina Venezuela",
            nota:"Venezuela usa Galac como sistema primario por complejidad fiscal: IVSS, FAOV, LOCTI, cestaticket, dualidad cambiaria.",
            sistemas:[
              {name:"Galac Nómina", type:"ext", entidades:[
                {t:"NOMINA_GALAC", campos:["PERIODO","COD_EMPLEADO","SALARIO_INTEGRAL","CESTATICKET","BONO_VAC","UTILIDADES","IVSS","FAOV","NETO"]},
                {t:"ASIENTO_GALAC", campos:["PERIODO","COD_CUENTA_CG","DEBITO","CREDITO","DESCRIPCION"]}
              ]},
              {name:"ERP — CG / CB", type:"erp", entidades:[
                {t:"ASIENTO", campos:["ASIENTO","PAQUETE","FECHA","ORIGEN","CLASE_ASIENTO","MARCADO"]},
                {t:"PAGO_EMPLEADO", campos:["COD_EMPLEADO","MONTO_BS","MONTO_USD","BANCO","TASA_CAMBIO","U_PS_GALAC_NUM_COMP","U_RETENCION_GALAC"]}
              ]},
            ]},
        ]},
    ]},

  // ═══════════════════════════════════════════════════════ SOPORTE / SISTEMAS
  { id:"SO", label:"Soporte", color:"#B8860B", icon:"⚙",
    macroprocesos:[

      { id:"SIS", label:"Procesos y Sistemas",
        procesos:[
          { id:"SIS-1", name:"Administración del ERP y Configuración (SOP08)",
            sistemas:[
              {name:"ERP — AS / CG / AF", type:"erp", entidades:[
                {t:"COMPANIA", campos:["COMPANIA","NOMBRE","MONEDA_LOCAL","TIPO_CAMBIO_REF","INSTANCIA","ESQUEMA_BD"]},
                {t:"USUARIO", campos:["USUARIO","NOMBRE","EMAIL","ACTIVO","GRUPO","ULTIMO_ACCESO"]},
                {t:"PARAMETRO_MODULO", campos:["MODULO","PARAMETRO","VALOR","DESCRIPCION"]}
              ]},
              {name:"Monday.com", type:"ext", entidades:[
                {t:"PROYECTO_TI", campos:["ID_PROYECTO","NOMBRE","ESTADO","RESPONSABLE","FECHA_INICIO","FECHA_FIN","PROGRESO"]}
              ]},
              {name:"GLPI", type:"ext", entidades:[
                {t:"TICKET_IT", campos:["NUM_TICKET","TIPO","DESCRIPCION","PRIORIDAD","STATUS","TECNICO","FECHA_APERTURA","FECHA_CIERRE"]}
              ]},
              {name:"n8n", type:"dm", entidades:[
                {t:"WORKFLOW_AUTO", campos:["ID_WORKFLOW","NOMBRE","TRIGGER","ESTADO","ULTIMA_EJECUCION","RESULTADO"]}
              ]},
            ]},
          { id:"SIS-2", name:"Gestión de Desarrollos a Medida",
            sistemas:[
              {name:"DM Visualizador de Documentos", type:"dm", entidades:[
                {t:"U_BUSQUEDA_DOC", campos:["EMPRESA","MODULO","DOCUMENTO","FECHA","CLIENTE_PROVEEDOR","MONTO","URL_PDF"]}
              ]},
              {name:"DM Auditorías", type:"dm", entidades:[
                {t:"U_AUDITORIA_VENTA", campos:["CIA","FACTURA","CLIENTE","VENDEDOR","MONTO","FECHA","TIPO_AUDITORIA","RESULTADO"]}
              ]},
            ]},
        ]},

      { id:"MKT", label:"Comunicación y Mercadeo",
        procesos:[
          { id:"MKT-1", name:"Comunicación Omnicanal (SOP10)",
            sistemas:[
              {name:"Respond.io", type:"ext", entidades:[
                {t:"CONTACTO_OMNI", campos:["CLIENTE","CANAL","ULTIMO_MENSAJE","ESTADO_CONV","AGENTE","FECHA"]},
                {t:"MENSAJE", campos:["ID_MSG","CONTACTO","CANAL","CONTENIDO","TEMPLATE","STATUS","TIMESTAMP"]}
              ]},
              {name:"ERP — FA / CC", type:"erp", entidades:[
                {t:"CLIENTE", campos:["CLIENTE","NOMBRE","EMAIL","U_RUTA","U_CANAL","U_SECTOR","U_COD_AFV"]},
                {t:"FACTURA", campos:["FACTURA","CLIENTE","FECHA","BASE_IMPUESTO1","VENDEDOR"]}
              ]},
            ]},
        ]},
    ]},

];



// ════════════════════════════════════════════════════════
//  HELPER: extrae tablas/campos de un módulo ERP en SILOS_BPA
// ════════════════════════════════════════════════════════

function getModuleTablesFromBPA(moduleCode) {
  const tablesMap = {};   // tableName → Set<campo>
  const usedIn   = [];    // { silo, macro, proc }

  SILOS_BPA.forEach(silo => {
    silo.macroprocesos.forEach(macro => {
      macro.procesos.forEach(proc => {
        let found = false;
        proc.sistemas.forEach(sys => {
          if (sys.type !== "erp") return;
          // El nombre puede ser "ERP — CI" o "ERP — CO / CI / CP / CG"
          const rawCodes = sys.name.replace(/^ERP\s*[—-]\s*/,"").split(/\s*\/\s*/);
          if (!rawCodes.includes(moduleCode)) return;
          found = true;
          sys.entidades.forEach(ent => {
            if (!tablesMap[ent.t]) tablesMap[ent.t] = new Set();
            ent.campos.forEach(c => tablesMap[ent.t].add(c));
          });
        });
        if (found) usedIn.push({ silo: silo.label, siloColor: silo.color, macro: macro.label, proc: proc.name, procId: proc.id });
      });
    });
  });

  const tables = Object.entries(tablesMap).map(([t, campos]) => ({ t, campos: [...campos].sort() }));
  return { tables, usedIn };
}

// ════════════════════════════════════════════════════════
//  SUBCOMPONENTE: Fila de tabla acordeón con campos expandibles
// ════════════════════════════════════════════════════════

function TableAccordionRow({ tbl, color, search, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen || false);

  const q = (search || "").toLowerCase();
  const matchesTable = tbl.t.toLowerCase().includes(q);
  const matchedCampos = tbl.campos.filter(c => !q || c.toLowerCase().includes(q) || matchesTable);
  const hasMatch = matchedCampos.length > 0;

  if (!hasMatch) return null;

  // Agrupar campos: UDFs (empiezan con U_) vs campos nativos
  const nativeCampos = matchedCampos.filter(c => !c.startsWith("U_"));
  const udfCampos    = matchedCampos.filter(c =>  c.startsWith("U_"));

  return (
    <div style={{
      border:`1px solid ${color}33`,
      borderLeft:`4px solid ${open ? color : color+"66"}`,
      borderRadius:8, overflow:"hidden",
      marginBottom:6,
      transition:"border-color 0.2s",
      background:"#fff",
    }}>
      {/* Cabecera clicable */}
      <div
        onClick={() => setOpen(o => !o)}
        style={{
          display:"flex", alignItems:"center", gap:10,
          padding:"10px 14px",
          background: open ? color+"12" : "#fafafa",
          cursor:"pointer",
          userSelect:"none",
          transition:"background 0.18s",
        }}
      >
        {/* Icono expand */}
        <div style={{
          width:20, height:20, borderRadius:4,
          background: open ? color : color+"22",
          display:"flex", alignItems:"center", justifyContent:"center",
          flexShrink:0, transition:"background 0.18s",
        }}>
          <span style={{ color: open ? "#fff" : color, fontSize:13, lineHeight:1, fontWeight:700 }}>
            {open ? "−" : "+"}
          </span>
        </div>

        {/* Nombre tabla */}
        <span style={{
          fontSize:13, fontWeight:800, fontFamily:"monospace",
          color: open ? color : "#1D1D1B",
          flex:1, letterSpacing:0.3,
        }}>
          {tbl.t}
        </span>

        {/* Badges conteo */}
        <div style={{ display:"flex", gap:5, alignItems:"center", flexShrink:0 }}>
          {nativeCampos.length > 0 && (
            <span style={{
              background:color+"18", color:color,
              border:`1px solid ${color}44`,
              borderRadius:12, padding:"2px 9px",
              fontSize:9, fontWeight:700,
            }}>
              {nativeCampos.length} campo{nativeCampos.length!==1?"s":""}
            </span>
          )}
          {udfCampos.length > 0 && (
            <span style={{
              background:"#B8860B18", color:"#B8860B",
              border:"1px solid #B8860B44",
              borderRadius:12, padding:"2px 9px",
              fontSize:9, fontWeight:700,
            }}>
              {udfCampos.length} UDF{udfCampos.length!==1?"s":""}
            </span>
          )}
          <span style={{ fontSize:10, color:"#bbb" }}>{open ? "▲" : "▼"}</span>
        </div>
      </div>

      {/* Panel de campos expandido */}
      {open && (
        <div style={{ padding:"12px 16px", background:"#fff", borderTop:`1px solid ${color}22` }}>

          {/* Campos nativos */}
          {nativeCampos.length > 0 && (
            <div style={{ marginBottom: udfCampos.length > 0 ? 14 : 0 }}>
              <div style={{
                fontSize:9, fontWeight:800, color:color,
                textTransform:"uppercase", letterSpacing:1,
                marginBottom:8, display:"flex", alignItems:"center", gap:6,
              }}>
                <span style={{ width:6, height:6, borderRadius:"50%", background:color, display:"inline-block" }}/>
                Campos nativos de la tabla
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(190px, 1fr))", gap:"3px 10px" }}>
                {nativeCampos.map((c, idx) => {
                  const match = q && c.toLowerCase().includes(q);
                  return (
                    <div key={c} style={{
                      display:"flex", alignItems:"center", gap:6,
                      padding:"4px 8px",
                      borderRadius:4,
                      background: match ? color+"12" : idx%2===0 ? "#f8f9fa" : "#fff",
                      border: match ? `1px solid ${color}44` : "1px solid transparent",
                    }}>
                      <span style={{
                        width:16, height:16, borderRadius:3,
                        background: color+"22",
                        display:"flex", alignItems:"center", justifyContent:"center",
                        flexShrink:0,
                        fontSize:9, fontWeight:800, color:color,
                      }}>≡</span>
                      <span style={{
                        fontSize:11, fontFamily:"monospace",
                        color: match ? color : "#333",
                        fontWeight: match ? 700 : 500,
                        wordBreak:"break-all",
                      }}>{c}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* UDFs */}
          {udfCampos.length > 0 && (
            <div>
              <div style={{
                fontSize:9, fontWeight:800, color:"#B8860B",
                textTransform:"uppercase", letterSpacing:1,
                marginBottom:8, display:"flex", alignItems:"center", gap:6,
              }}>
                <span style={{ width:6, height:6, borderRadius:2, background:"#B8860B", display:"inline-block", transform:"rotate(45deg)" }}/>
                Campos personalizados UDF (User Defined Fields)
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(190px, 1fr))", gap:"3px 10px" }}>
                {udfCampos.map((c, idx) => {
                  const match = q && c.toLowerCase().includes(q);
                  return (
                    <div key={c} style={{
                      display:"flex", alignItems:"center", gap:6,
                      padding:"4px 8px",
                      borderRadius:4,
                      background: match ? "#B8860B12" : idx%2===0 ? "#fffdf2" : "#fff",
                      border: match ? "1px solid #B8860B44" : "1px solid #f0e68c44",
                    }}>
                      <span style={{
                        width:16, height:16, borderRadius:3,
                        background:"#B8860B22",
                        display:"flex", alignItems:"center", justifyContent:"center",
                        flexShrink:0,
                        fontSize:9, fontWeight:800, color:"#B8860B",
                      }}>⬡</span>
                      <span style={{
                        fontSize:11, fontFamily:"monospace",
                        color: match ? "#B8860B" : "#7a6000",
                        fontWeight: match ? 700 : 500,
                        wordBreak:"break-all",
                      }}>{c}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════
//  COMPONENTE: PANEL DE TABLAS Y CAMPOS DE UN MÓDULO ERP
// ════════════════════════════════════════════════════════

function ModuleTablesPanel({ moduleCode, onClose }) {
  const mod   = moduleMatrix.find(m => m.code === moduleCode) || {};
  const color = mod.color || "#455A64";
  const { tables, usedIn } = getModuleTablesFromBPA(moduleCode);
  const [search, setSearch]   = useState("");
  const [expandAll, setExpandAll] = useState(false);

  const q = search.toLowerCase();
  const visibleTables = tables.filter(t =>
    !q ||
    t.t.toLowerCase().includes(q) ||
    t.campos.some(c => c.toLowerCase().includes(q))
  );

  const totalCampos = tables.reduce((s,t) => s + t.campos.length, 0);
  const totalUDFs   = tables.reduce((s,t) => s + t.campos.filter(c=>c.startsWith("U_")).length, 0);

  return (
    <div style={{
      position:"fixed", inset:0, zIndex:9999,
      background:"rgba(0,0,0,0.58)",
      display:"flex", alignItems:"flex-start", justifyContent:"center",
      padding:"28px 16px", overflowY:"auto",
    }} onClick={onClose}>
      <div style={{
        background:"#fff", borderRadius:14, maxWidth:860, width:"100%",
        boxShadow:"0 12px 56px rgba(0,0,0,0.32)", overflow:"hidden",
      }} onClick={e => e.stopPropagation()}>

        {/* ── Header ── */}
        <div style={{ background:color, padding:"16px 22px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ flex:1 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:6 }}>
                <span style={{ background:"rgba(255,255,255,0.2)", color:"#fff", borderRadius:6, padding:"3px 11px", fontSize:13, fontWeight:800, letterSpacing:0.5 }}>{moduleCode}</span>
                <span style={{ fontSize:17, fontWeight:700, color:"#fff" }}>{mod.name || moduleCode}</span>
              </div>
              {/* KPIs del módulo */}
              <div style={{ display:"flex", gap:14, flexWrap:"wrap" }}>
                {[
                  { label:"Tablas",           val:tables.length,  icon:"⊞" },
                  { label:"Campos totales",    val:totalCampos,    icon:"≡" },
                  { label:"UDFs personalizados", val:totalUDFs,    icon:"⬡" },
                  { label:"Procesos BPA",      val:usedIn.length,  icon:"◈" },
                ].map(k => (
                  <div key={k.label} style={{ display:"flex", alignItems:"center", gap:5 }}>
                    <span style={{ fontSize:11, color:"rgba(255,255,255,0.6)" }}>{k.icon}</span>
                    <span style={{ fontSize:13, fontWeight:800, color:"#fff" }}>{k.val}</span>
                    <span style={{ fontSize:10, color:"rgba(255,255,255,0.65)" }}>{k.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <button onClick={onClose} style={{
              background:"rgba(255,255,255,0.15)", border:"none", color:"#fff",
              width:32, height:32, borderRadius:7, cursor:"pointer",
              fontSize:16, display:"flex", alignItems:"center", justifyContent:"center",
              flexShrink:0,
            }}>✕</button>
          </div>
        </div>

        <div style={{ padding:"16px 22px", maxHeight:"78vh", overflowY:"auto" }}>

          {/* ── Controles ── */}
          <div style={{ display:"flex", gap:8, marginBottom:14, alignItems:"center" }}>
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setExpandAll(!!e.target.value); }}
              placeholder="🔍  Buscar tabla o campo…"
              style={{
                flex:1, padding:"8px 12px",
                border:`1.5px solid ${color}55`, borderRadius:7,
                fontSize:12, outline:"none", boxSizing:"border-box",
              }}
            />
            <button onClick={() => setExpandAll(v=>!v)} style={{
              background: expandAll ? color : "#f0f0f0",
              border:`1px solid ${expandAll ? color : "#ddd"}`,
              color: expandAll ? "#fff" : "#555",
              borderRadius:7, padding:"8px 14px",
              fontSize:11, fontWeight:700, cursor:"pointer", whiteSpace:"nowrap",
            }}>
              {expandAll ? "⊟ Colapsar todo" : "⊞ Expandir todo"}
            </button>
          </div>

          {/* ── Procesos donde aparece ── */}
          {usedIn.length > 0 && (
            <div style={{ marginBottom:16, background:"#f8f9fa", borderRadius:8, padding:"10px 14px" }}>
              <div style={{ fontSize:10, fontWeight:800, color:color, textTransform:"uppercase", letterSpacing:0.8, marginBottom:7 }}>
                📌 Procesos BPA donde interviene este módulo
              </div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
                {usedIn.map((u,i) => (
                  <span key={i} style={{
                    background:u.siloColor+"14", border:`1px solid ${u.siloColor}44`,
                    color:u.siloColor, borderRadius:5, padding:"3px 9px",
                    fontSize:10, fontWeight:600,
                  }}>
                    {u.silo} › {u.macro} › {u.proc}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* ── Leyenda ── */}
          <div style={{ display:"flex", gap:14, marginBottom:12, flexWrap:"wrap" }}>
            <div style={{ display:"flex", alignItems:"center", gap:5, fontSize:10, color:"#666" }}>
              <span style={{ width:14, height:14, borderRadius:3, background:color+"22", display:"flex", alignItems:"center", justifyContent:"center", fontSize:8, color:color, fontWeight:800 }}>≡</span>
              Campo nativo Softland
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:5, fontSize:10, color:"#666" }}>
              <span style={{ width:14, height:14, borderRadius:3, background:"#B8860B22", display:"flex", alignItems:"center", justifyContent:"center", fontSize:8, color:"#B8860B", fontWeight:800 }}>⬡</span>
              Campo UDF personalizado (Grupo Mayoreo)
            </div>
            <div style={{ fontSize:10, color:"#bbb", marginLeft:"auto" }}>
              {visibleTables.length} tabla{visibleTables.length!==1?"s":""} · haz clic en una tabla para ver sus campos
            </div>
          </div>

          {/* ── Lista acordeón de tablas ── */}
          {visibleTables.length === 0 ? (
            <div style={{ textAlign:"center", color:"#bbb", fontSize:13, padding:"40px 0" }}>
              {tables.length === 0
                ? "No se encontraron tablas documentadas para este módulo en los procesos BPA."
                : "Sin coincidencias para la búsqueda."}
            </div>
          ) : (
            <div>
              {visibleTables.map(tbl => (
                <TableAccordionRow
                  key={tbl.t}
                  tbl={tbl}
                  color={color}
                  search={search}
                  defaultOpen={expandAll}
                />
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════
//  COMPONENTE: RELACIONES ENTRE SISTEMAS
// ════════════════════════════════════════════════════════
// Flecha doble ↔ para conexión con ERP (fuente única de datos)
function SRConnector({ label }) {
  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
                 padding:"0 6px", flexShrink:0, minWidth:52, gap:3}}>
      <svg width="52" height="16" viewBox="0 0 52 16">
        <defs>
          <marker id="arr-r" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <polygon points="0,0 6,3 0,6" fill="#90A4AE"/>
          </marker>
          <marker id="arr-l" markerWidth="6" markerHeight="6" refX="1" refY="3" orient="auto">
            <polygon points="6,0 0,3 6,6" fill="#90A4AE"/>
          </marker>
        </defs>
        <line x1="6" y1="8" x2="46" y2="8" stroke="#90A4AE" strokeWidth="1.5"
              markerStart="url(#arr-l)" markerEnd="url(#arr-r)"/>
      </svg>
      {label && <span style={{fontSize:8,color:"#90A4AE",whiteSpace:"nowrap",letterSpacing:0.3}}>{label}</span>}
    </div>
  );
}

function SRSysCard({ sys, onModuleClick }) {
  const st = BPA_SYS[sys.type];

  // Extrae códigos ERP del nombre, ej: "ERP — CI / FA" → ["CI","FA"]
  const erpCodes = sys.type === "erp"
    ? sys.name.replace(/^ERP\s*[—-]\s*/,"").split(/\s*\/\s*/).map(s=>s.trim()).filter(Boolean)
    : [];

  return (
    <div style={{
      minWidth:180, maxWidth:210, flexShrink:0,
      border:`1px solid ${st.bdr}`, borderTop:`3px solid ${st.bdr}`,
      borderRadius:6, background:st.bg, overflow:"hidden",
    }}>
      <div style={{padding:"6px 10px", borderBottom:`1px solid ${st.bdr}33`}}>
        <div style={{fontSize:11, fontWeight:800, color:st.dot}}>{sys.name}</div>
        <div style={{fontSize:9, color:st.bdr, fontWeight:600, letterSpacing:0.5, textTransform:"uppercase"}}>{st.tag}</div>
        {/* Badges de módulo ERP clicables */}
        {erpCodes.length > 0 && (
          <div style={{display:"flex", flexWrap:"wrap", gap:3, marginTop:5}}>
            {erpCodes.map(code => {
              const mod = moduleMatrix.find(m=>m.code===code);
              return (
                <button key={code} onClick={()=> onModuleClick && onModuleClick(code)}
                  title={`Ver tablas y campos de ${mod?.name||code}`}
                  style={{
                    background:(mod?.color||"#455A64")+"22",
                    border:`1px solid ${mod?.color||"#455A64"}66`,
                    color: mod?.color||"#455A64",
                    borderRadius:4, padding:"2px 7px", fontSize:9, fontWeight:800,
                    cursor:"pointer", display:"flex", alignItems:"center", gap:3,
                  }}>
                  {code} <span style={{fontSize:8,opacity:0.7}}>⬡</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
      {sys.entidades.map(e => (
        <div key={e.t} style={{padding:"7px 10px 8px", borderTop:`1px solid #e0e0e0`}}>
          <div style={{fontSize:10, fontWeight:700, color:st.dot, fontFamily:"monospace", marginBottom:4}}>{e.t}</div>
          {e.campos.map(c => (
            <div key={c} style={{display:"flex",alignItems:"flex-start",gap:3,lineHeight:1.5}}>
              <span style={{color:st.bdr,fontSize:10,fontWeight:700,flexShrink:0,marginTop:1}}>+</span>
              <span style={{fontSize:9,color:"#424242",fontFamily:"monospace"}}>{c}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function SRProcBlock({ proc, color, onModuleClick }) {
  const hasOpp = !!proc.opp;

  // Separate ERP (hub) from external/DM/BI systems (spokes)
  const erpSystems = proc.sistemas.filter(s => s.type === "erp");
  const extSystems = proc.sistemas.filter(s => s.type !== "erp");
  const hasERP = erpSystems.length > 0;

  return (
    <div style={{
      border:`1px solid #e0e0e0`, borderTop:`3px solid ${hasOpp?"#FB8C00":color}`,
      borderRadius:8, background:"#fff", overflow:"hidden", marginBottom:14,
    }}>
      {/* Header */}
      <div style={{
        padding:"8px 14px",
        background: hasOpp ? "#FFF8F0" : color+"0a",
        borderBottom:`1px solid #e0e0e0`,
        display:"flex", alignItems:"center", gap:8, flexWrap:"wrap",
      }}>
        <span style={{fontSize:12, fontWeight:800, color:"#1D1D1B"}}>{proc.name}</span>
        {hasOpp ? (
          <span style={{background:"#E65100",color:"#fff",fontSize:9,fontWeight:700,borderRadius:12,padding:"2px 8px",letterSpacing:0.5}}>⚡ OPORTUNIDAD</span>
        ) : (
          <span style={{background:color+"22",color:color,fontSize:9,fontWeight:700,borderRadius:12,padding:"2px 8px"}}>✓ SOPORTADO</span>
        )}
        {hasERP && extSystems.length > 0 && (
          <span style={{marginLeft:"auto",fontSize:9,color:"#90A4AE",fontStyle:"italic"}}>
            ↔ Softland ERP — fuente única de datos
          </span>
        )}
      </div>

      {/* Opportunity notice */}
      {hasOpp && (
        <div style={{padding:"7px 14px", background:"#FFF3E0", borderBottom:`1px solid #FFCC80`}}>
          <span style={{fontSize:10, fontWeight:700, color:"#E65100"}}>⚡ </span>
          <span style={{fontSize:11, color:"#5D4037"}}>{proc.opp}</span>
        </div>
      )}

      {/* Hub-and-spoke layout: ERP center ↔ external systems */}
      <div style={{overflowX:"auto", padding:"14px 16px"}}>
        {hasERP && extSystems.length > 0 ? (
          /* Hub layout: ERP on left, externals stacked on right */
          <div style={{display:"inline-flex", alignItems:"flex-start", gap:0, minWidth:"max-content"}}>
            {/* ERP hub — shown once even if multiple ERP entries */}
            <div style={{display:"flex", flexDirection:"column", gap:8}}>
              {erpSystems.map((sys, i) => (
                <SRSysCard key={sys.name+i} sys={sys} onModuleClick={onModuleClick} />
              ))}
            </div>

            {/* Connector column */}
            <div style={{display:"flex", flexDirection:"column", justifyContent:"center",
                         alignSelf:"stretch", padding:"0 4px", gap:0}}>
              {extSystems.map((sys, i) => {
                const typeLabels = {ext:"Sistema Externo", dm:"DM/Auto", bi:"Analytics"};
                return (
                  <div key={i} style={{
                    flex:1, display:"flex", alignItems:"center", justifyContent:"center",
                    minHeight:60,
                  }}>
                    <SRConnector label={typeLabels[sys.type]||""} />
                  </div>
                );
              })}
            </div>

            {/* External/DM/BI systems stacked */}
            <div style={{display:"flex", flexDirection:"column", gap:8}}>
              {extSystems.map((sys, i) => (
                <SRSysCard key={sys.name+i} sys={sys} onModuleClick={onModuleClick} />
              ))}
            </div>
          </div>
        ) : (
          /* No ERP or only externals: linear fallback */
          <div style={{display:"inline-flex", alignItems:"flex-start", gap:8, minWidth:"max-content", flexWrap:"wrap"}}>
            {proc.sistemas.map((sys, i) => (
              <SRSysCard key={sys.name+i} sys={sys} onModuleClick={onModuleClick} />
            ))}
          </div>
        )}
      </div>

      {/* Note */}
      {proc.nota && (
        <div style={{padding:"7px 14px", background:"#E3F2FD", borderTop:`1px solid #BBDEFB`}}>
          <span style={{fontSize:10, fontWeight:700, color:"#0D47A1"}}>📌 </span>
          <span style={{fontSize:11, color:"#1A237E"}}>{proc.nota}</span>
        </div>
      )}
    </div>
  );
}

function SistRelView({ onModuleClick }) {
  const [siloId, setSiloId]     = useState("CO");
  const [macroIdx, setMacroIdx] = useState(0);

  const silo  = SILOS_BPA.find(s => s.id === siloId);
  const macro = silo.macroprocesos[macroIdx];

  const handleSilo = (id) => { setSiloId(id); setMacroIdx(0); };

  const oppCount   = (s) => s.macroprocesos.flatMap(m => m.procesos).filter(p => p.opp).length;
  const totalCount = (s) => s.macroprocesos.flatMap(m => m.procesos).length;

  // KPIs globales
  const allProcs = SILOS_BPA.flatMap(s => s.macroprocesos.flatMap(m => m.procesos));
  const totalOpps = allProcs.filter(p => p.opp).length;

  return (
    <div style={{fontFamily:"Arial,Helvetica,sans-serif", color:"#1D1D1B"}}>

      {/* ── Leyenda + KPIs globales ── */}
      <div style={{display:"flex", gap:10, flexWrap:"wrap", alignItems:"center", marginBottom:16,
                   padding:"12px 4px"}}>
        <div style={{flex:1, minWidth:200}}>
          <div style={{fontSize:10, color:"#555", fontWeight:700, letterSpacing:1.5, textTransform:"uppercase", marginBottom:4}}>
            Ecosistema · Sistemas por Proceso de Negocio
          </div>
          <div style={{display:"flex", gap:12, flexWrap:"wrap"}}>
            {[
              {label:"ERP Softland",           color:"#455A64"},
              {label:"Sistema Externo",         color:"#1565C0"},
              {label:"DM / Automatización",     color:"#7B1FA2"},
              {label:"Analytics / BI",          color:"#2E7D32"},
              {label:"⚡ Sin sistema → Oportunidad", color:"#E65100"},
            ].map(l => (
              <div key={l.label} style={{display:"flex",alignItems:"center",gap:5}}>
                <div style={{width:8,height:8,borderRadius:2,background:l.color,flexShrink:0}}/>
                <span style={{fontSize:9,color:"#444"}}>{l.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{display:"flex", gap:10, flexWrap:"wrap"}}>
          {[
            {label:"Procesos totales", val:allProcs.length, col:"#0097A7"},
            {label:"Con sistema",      val:allProcs.length-totalOpps, col:"#2E7D32"},
            {label:"Oportunidades",    val:totalOpps, col:"#FB8C00"},
            {label:"Silos cubiertos",  val:SILOS_BPA.length, col:"#9b59b6"},
          ].map(k => (
            <div key={k.label} style={{textAlign:"center", padding:"4px 14px", minWidth:80}}>
              <div style={{fontSize:22, fontWeight:800, color:k.col}}>{k.val}</div>
              <div style={{fontSize:9, color:"#666"}}>{k.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Silo tabs ── */}
      <div style={{display:"flex", gap:0, borderBottom:"2px solid #e0e0e0", marginBottom:0, overflowX:"auto"}}>
        {SILOS_BPA.map(s => {
          const opps  = oppCount(s);
          const total = totalCount(s);
          const active = siloId === s.id;
          return (
            <button key={s.id} onClick={() => handleSilo(s.id)} style={{
              background: active ? s.color+"15" : "transparent",
              border:"none", borderBottom: active ? `3px solid ${s.color}` : "3px solid transparent",
              color: active ? "#1D1D1B" : "#777",
              padding:"9px 16px", cursor:"pointer", whiteSpace:"nowrap",
              display:"flex", flexDirection:"column", alignItems:"center", gap:2, minWidth:100,
              transition:"all 0.15s",
            }}>
              <div style={{display:"flex",alignItems:"center",gap:5}}>
                <span style={{fontSize:14}}>{s.icon}</span>
                <span style={{fontSize:11, fontWeight:active?800:400}}>{s.label}</span>
              </div>
              <div style={{fontSize:9, color:"#888"}}>
                {total-opps}/{total} soportados
                {opps>0 && <span style={{color:"#FB8C00",marginLeft:4}}>⚡{opps}</span>}
              </div>
            </button>
          );
        })}
      </div>

      {/* ── Layout dos columnas ── */}
      <div style={{display:"flex", gap:0, marginTop:0, minHeight:420, border:"1px solid #e0e0e0", borderTop:"none", borderRadius:"0 0 8px 8px", overflow:"hidden"}}>

        {/* Sidebar macroprocesos */}
        <div style={{width:210, flexShrink:0, borderRight:`1px solid #e0e0e0`, background:"#fff", overflowY:"auto"}}>
          <div style={{
            padding:"7px 12px", background:silo.color+"18",
            borderBottom:`2px solid ${silo.color}`,
            fontSize:10, fontWeight:800, color:silo.color,
            textTransform:"uppercase", letterSpacing:0.8,
          }}>
            {silo.icon} Macroprocesos
          </div>
          {silo.macroprocesos.map((m, mi) => {
            const active = macroIdx === mi;
            const opps   = m.procesos.filter(p=>p.opp).length;
            return (
              <div key={m.id} onClick={() => setMacroIdx(mi)} style={{
                padding:"9px 12px", cursor:"pointer",
                background: active ? silo.color+"18" : "transparent",
                borderLeft: active ? `3px solid ${silo.color}` : "3px solid transparent",
                borderBottom:`1px solid #e0e0e0`,
              }}>
                <div style={{fontSize:11, fontWeight:active?700:400, color:active?silo.color:"#6B7280", lineHeight:1.3}}>
                  {m.label}
                </div>
                <div style={{marginTop:3, display:"flex", gap:5, alignItems:"center", flexWrap:"wrap"}}>
                  <span style={{fontSize:9, color:"#aaa"}}>{m.procesos.length} procesos</span>
                  {opps>0 && <span style={{fontSize:9, color:"#FB8C00", fontWeight:600}}>⚡ {opps} opp.</span>}
                </div>
                {active && m.procesos.map(p => (
                  <div key={p.id} style={{
                    marginTop:4, paddingLeft:10, fontSize:10,
                    color: p.opp ? "#E65100" : "#555", lineHeight:1.4,
                    display:"flex", alignItems:"flex-start", gap:4,
                  }}>
                    <span style={{flexShrink:0, marginTop:1}}>{p.opp?"⚡":"·"}</span>
                    <span>{p.name}</span>
                  </div>
                ))}
              </div>
            );
          })}
        </div>

        {/* Panel principal */}
        <div style={{flex:1, overflowY:"auto", padding:"16px 20px", background:"#f8f9fa"}}>
          {/* Breadcrumb */}
          <div style={{
            display:"flex", alignItems:"center", gap:8, marginBottom:14,
            background:"#fff", border:`1px solid #e0e0e0`,
            borderLeft:`4px solid ${silo.color}`, borderRadius:6, padding:"8px 14px", flexWrap:"wrap",
          }}>
            <span style={{fontSize:10, color:silo.color, fontWeight:700}}>{silo.icon} {silo.label}</span>
            <span style={{fontSize:12, color:"#6B7280"}}>›</span>
            <span style={{fontSize:13, fontWeight:800, color:"#1D1D1B"}}>{macro.label}</span>
            <div style={{marginLeft:"auto", display:"flex", gap:6}}>
              <span style={{fontSize:10, background:silo.color+"18", color:silo.color, borderRadius:12, padding:"2px 10px", fontWeight:700}}>
                {macro.procesos.length} procesos
              </span>
              {macro.procesos.filter(p=>p.opp).length > 0 && (
                <span style={{fontSize:10, background:"#FFF3E0", color:"#E65100", borderRadius:12, padding:"2px 10px", fontWeight:700}}>
                  ⚡ {macro.procesos.filter(p=>p.opp).length} sin sistema
                </span>
              )}
            </div>
          </div>

          {macro.procesos.map(proc => (
            <SRProcBlock key={proc.id} proc={proc} color={silo.color} onModuleClick={onModuleClick} />
          ))}
        </div>
      </div>
    </div>
  );
}


// ════════════════════════════════════════════════════════
//  COMPONENTE: MATRIZ DE RELACIONES INTER-MÓDULOS
// ════════════════════════════════════════════════════════
function RelationsMatrixView() {
  const [hoveredCell, setHoveredCell] = useState(null); // { from, to, rel }
  const [pinnedCell,  setPinnedCell]  = useState(null);
  const [filterType,  setFilterType]  = useState("ALL");
  const [highlightMod, setHighlightMod] = useState(null);

  const codes = moduleMatrix.map(m => m.code);

  // Determina si una relación cumple el filtro
  const relVisible = (rel) =>
    filterType === "ALL" || rel.type === filterType;

  // Cuenta relaciones por módulo (para el highlight de header)
  const relCount = (code) =>
    moduleRelations.filter(r => (r.from === code || r.to === code) && relVisible(r)).length;

  const activeCell = pinnedCell || hoveredCell;

  const getModColor = (code) => moduleMatrix.find(m => m.code === code)?.color || "#888";
  const getModName  = (code) => moduleMatrix.find(m => m.code === code)?.name  || code;

  return (
    <div style={{ fontFamily:"Arial, sans-serif" }}>
      {/* Leyenda y filtros */}
      <div style={{ display:"flex", gap:12, flexWrap:"wrap", alignItems:"center", marginBottom:18 }}>
        <span style={{ fontSize:11, color:"#999", fontWeight:600 }}>Tipo de relación:</span>
        {[["ALL","Todos","#1D1D1B"], ...Object.entries(relationTypeColors).map(([k,v]) => [k, v.label, v.dot])].map(([k, label, col]) => (
          <button key={k} onClick={() => setFilterType(k)} style={{
            background: filterType===k ? col : "transparent",
            border: `1px solid ${filterType===k ? col : "#ddd"}`,
            color: filterType===k ? "#fff" : "#666",
            padding:"3px 12px", borderRadius:20, cursor:"pointer", fontSize:11,
            fontWeight: filterType===k ? 700 : 400, transition:"all 0.15s",
          }}>{label}</button>
        ))}
        <span style={{ fontSize:10, color:"#bbb", marginLeft:"auto" }}>
          {moduleRelations.filter(r => filterType==="ALL" || r.type===filterType).length} relaciones · hover o clic para detalle
        </span>
      </div>

      {/* Panel de detalle de celda seleccionada/hovereada */}
      <div style={{
        minHeight: 68, background: activeCell ? "#fff" : "#f8f9fa",
        border: `1px solid ${activeCell ? (relationTypeColors[activeCell.rel?.type]?.border || "#e0e0e0") : "#e8e8e8"}`,
        borderLeft: `4px solid ${activeCell ? (relationTypeColors[activeCell.rel?.type]?.dot || "#ccc") : "#e8e8e8"}`,
        borderRadius: 8, padding:"12px 18px", marginBottom: 18, transition:"all 0.2s",
      }}>
        {activeCell && activeCell.rel ? (
          <>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
              <span style={{ background: getModColor(activeCell.from), color:"#fff", borderRadius:5, padding:"2px 9px", fontSize:11, fontWeight:700 }}>{activeCell.from}</span>
              <span style={{ fontSize:13, color:"#999" }}>→</span>
              <span style={{ background: getModColor(activeCell.to), color:"#fff", borderRadius:5, padding:"2px 9px", fontSize:11, fontWeight:700 }}>{activeCell.to}</span>
              <span style={{ fontSize:11, color:getModColor(activeCell.from), fontWeight:600 }}>{getModName(activeCell.from)}</span>
              <span style={{ fontSize:11, color:"#bbb" }}>→</span>
              <span style={{ fontSize:11, color:getModColor(activeCell.to), fontWeight:600 }}>{getModName(activeCell.to)}</span>
              <span style={{
                background: relationTypeColors[activeCell.rel.type]?.bg, border:`1px solid ${relationTypeColors[activeCell.rel.type]?.border}`,
                color: relationTypeColors[activeCell.rel.type]?.dot, borderRadius:20, padding:"1px 9px", fontSize:10, fontWeight:700, marginLeft:4,
              }}>{relationTypeColors[activeCell.rel.type]?.label}</span>
              {pinnedCell && (
                <button onClick={() => setPinnedCell(null)} style={{ marginLeft:"auto", background:"none", border:"none", color:"#bbb", cursor:"pointer", fontSize:14 }}>✕</button>
              )}
            </div>
            <p style={{ fontSize:12, color:"#444", lineHeight:1.65, margin:0 }}>{activeCell.rel.desc}</p>
          </>
        ) : (
          <p style={{ fontSize:12, color:"#bbb", margin:0, lineHeight:2 }}>
            Mueve el cursor sobre una celda coloreada para ver la descripción de la relación,<br/>
            o haz <strong>clic</strong> para anclarla.
          </p>
        )}
      </div>

      {/* Matriz cruzada */}
      <div style={{ overflowX:"auto", overflowY:"auto", maxHeight:560 }}>
        <table style={{ borderCollapse:"collapse", minWidth:600 }}>
          <thead>
            <tr>
              {/* Celda vacía esquina */}
              <th style={{ width:90, minWidth:90, background:"#fff", position:"sticky", top:0, left:0, zIndex:10, borderBottom:"2px solid #e0e0e0" }}>
                <div style={{ fontSize:9, color:"#bbb", textAlign:"center", lineHeight:1.3 }}>ORIGEN →<br/>DESTINO ↓</div>
              </th>
              {codes.map(col => {
                const mod = moduleMatrix.find(m => m.code===col);
                const isHL = highlightMod === col;
                return (
                  <th key={col}
                    onMouseEnter={() => setHighlightMod(col)}
                    onMouseLeave={() => setHighlightMod(null)}
                    style={{
                      position:"sticky", top:0, zIndex:5,
                      background: isHL ? mod.color+"22" : "#fff",
                      borderBottom:"2px solid #e0e0e0",
                      padding:"4px 2px", textAlign:"center", cursor:"default",
                      transition:"background 0.15s",
                    }}
                    title={mod?.name}
                  >
                    <div style={{
                      fontSize:10, fontWeight:700, color: isHL ? mod.color : "#555",
                      background: isHL ? mod.color+"18" : "transparent",
                      borderRadius:4, padding:"2px 5px", whiteSpace:"nowrap",
                    }}>{col}</div>
                    {relCount(col) > 0 && (
                      <div style={{ fontSize:8, color:"#bbb" }}>{relCount(col)}</div>
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {codes.map((rowCode, ri) => {
              const rowMod = moduleMatrix.find(m => m.code===rowCode);
              const isHLRow = highlightMod === rowCode;
              return (
                <tr key={rowCode}>
                  {/* Encabezado de fila */}
                  <td
                    onMouseEnter={() => setHighlightMod(rowCode)}
                    onMouseLeave={() => setHighlightMod(null)}
                    style={{
                      position:"sticky", left:0, zIndex:4,
                      background: isHLRow ? rowMod.color+"22" : (ri%2===0 ? "#fff" : "#fafafa"),
                      borderRight:"2px solid #e0e0e0",
                      padding:"4px 8px", whiteSpace:"nowrap", cursor:"default",
                      transition:"background 0.15s",
                    }}
                  >
                    <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                      <span style={{
                        background: rowMod.color, color:"#fff",
                        borderRadius:4, padding:"2px 7px", fontSize:10, fontWeight:700,
                      }}>{rowCode}</span>
                      <span style={{ fontSize:10, color:"#777", maxWidth:120, overflow:"hidden", textOverflow:"ellipsis" }}>
                        {rowMod?.name.split(" ").slice(0,3).join(" ")}
                      </span>
                    </div>
                  </td>
                  {/* Celdas de relación */}
                  {codes.map((colCode) => {
                    if (rowCode === colCode) {
                      return (
                        <td key={colCode} style={{
                          background: rowMod.color+"11",
                          borderBottom:`1px solid ${rowMod.color}22`,
                          textAlign:"center", width:38, height:36,
                        }}>
                          <div style={{ width:8, height:8, borderRadius:"50%", background: rowMod.color+"66", margin:"0 auto" }} />
                        </td>
                      );
                    }
                    const rel = getRelationDirected(rowCode, colCode);
                    const relRev = getRelationDirected(colCode, rowCode);
                    const hasRel = rel && relVisible(rel);
                    const hasRelRev = relRev && relVisible(relRev);
                    const isActive = activeCell &&
                      ((activeCell.from===rowCode && activeCell.to===colCode) ||
                       (activeCell.from===colCode && activeCell.to===rowCode));
                    const isHLModCell = highlightMod && (highlightMod===rowCode || highlightMod===colCode);
                    const bg = hasRel
                      ? (isActive ? relationTypeColors[rel.type].border+"22" : relationTypeColors[rel.type].bg)
                      : (hasRelRev
                        ? (isActive ? relationTypeColors[relRev.type].border+"11" : "#fafafa")
                        : (isHLModCell ? "#f5f5f5" : (ri%2===0 ? "#fff" : "#fafafa")));

                    return (
                      <td key={colCode}
                        onMouseEnter={() => {
                          if (!pinnedCell) {
                            if (hasRel) setHoveredCell({ from:rowCode, to:colCode, rel });
                            else if (hasRelRev) setHoveredCell({ from:colCode, to:rowCode, rel:relRev });
                            else setHoveredCell(null);
                          }
                        }}
                        onMouseLeave={() => { if (!pinnedCell) setHoveredCell(null); }}
                        onClick={() => {
                          if (hasRel) setPinnedCell(p => (p?.from===rowCode && p?.to===colCode) ? null : { from:rowCode, to:colCode, rel });
                          else if (hasRelRev) setPinnedCell(p => (p?.from===colCode && p?.to===rowCode) ? null : { from:colCode, to:rowCode, rel:relRev });
                        }}
                        style={{
                          background: bg,
                          border: isActive ? `1.5px solid ${(rel||relRev) ? relationTypeColors[(rel||relRev).type].border : "#ccc"}` : "1px solid #f0f0f0",
                          textAlign:"center", width:38, height:36,
                          cursor: (hasRel || hasRelRev) ? "pointer" : "default",
                          transition:"all 0.12s",
                          position:"relative",
                        }}
                        title={
                          hasRel ? `${rowCode}→${colCode}: ${rel.desc}` :
                          hasRelRev ? `${colCode}→${rowCode}: ${relRev.desc}` : ""
                        }
                      >
                        {hasRel && (
                          <div style={{
                            width:10, height:10, borderRadius:"50%",
                            background: relationTypeColors[rel.type].dot,
                            margin:"0 auto", boxShadow: isActive ? `0 0 0 3px ${relationTypeColors[rel.type].dot}33` : "none",
                          }} />
                        )}
                        {!hasRel && hasRelRev && (
                          <div style={{
                            width:7, height:7, borderRadius:2,
                            background: relationTypeColors[relRev.type].dot+"88",
                            margin:"0 auto",
                          }} />
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Leyenda de iconos */}
      <div style={{ display:"flex", gap:20, marginTop:14, flexWrap:"wrap" }}>
        <div style={{ display:"flex", alignItems:"center", gap:6 }}>
          <div style={{ width:10, height:10, borderRadius:"50%", background:"#555" }} />
          <span style={{ fontSize:10, color:"#888" }}>Relación directa (fila → columna)</span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:6 }}>
          <div style={{ width:7, height:7, borderRadius:2, background:"#aaa" }} />
          <span style={{ fontSize:10, color:"#888" }}>Relación inversa (columna → fila)</span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:6 }}>
          <div style={{ width:8, height:8, borderRadius:"50%", background:"#bbb" }} />
          <span style={{ fontSize:10, color:"#888" }}>Mismo módulo</span>
        </div>
        {Object.entries(relationTypeColors).map(([k,v]) => (
          <div key={k} style={{ display:"flex", alignItems:"center", gap:5 }}>
            <div style={{ width:10, height:10, borderRadius:"50%", background:v.dot }} />
            <span style={{ fontSize:10, color:"#888" }}>{v.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ArchitectureView() {
  const [selected, setSelected] = useState(null);
  const [viewMode, setViewMode] = useState("matrix"); // "matrix" | "diagram"
  const [showExternal, setShowExternal] = useState(false);
  const [matrixFilter, setMatrixFilter] = useState("ALL");

  // ── Diagrama (mantener lógica original) ──
  const getConnectionKey = (a, b) => [a,b].sort().join("-");
  const isHighlighted = (modKey) => {
    if (!selected) return true;
    if (modKey === selected) return true;
    const mod = modules[selected];
    if (mod.connections.includes(modKey)) return true;
    const otherMod = modules[modKey];
    if (otherMod && otherMod.connections.includes(selected)) return true;
    return false;
  };
  const getConnections = () => {
    const conns = []; const seen = new Set();
    Object.entries(modules).forEach(([key, mod]) => {
      mod.connections.forEach(targetKey => {
        const connKey = getConnectionKey(key, targetKey);
        if (!seen.has(connKey) && modules[targetKey]) {
          seen.add(connKey); conns.push({ from:key, to:targetKey, key:connKey });
        }
      });
    });
    return conns;
  };
  const connections = getConnections();
  const isConnectionHighlighted = (conn) => !selected || conn.from===selected || conn.to===selected;
  const nodeW = 100; const nodeH = 52;

  // ── Matriz filtrada ──
  const filteredModules = matrixFilter === "ALL"
    ? moduleMatrix
    : moduleMatrix.filter(m => m.area === matrixFilter);

  const selectedMod = selected ? moduleMatrix.find(m => m.code === selected) : null;

  return (
    <>
      {/* Sub-navegación: Matriz / Diagrama */}
      <div style={{ display:"flex", gap:4, marginBottom:20, borderBottom:"1px solid #e8e8e8" }}>
        {[
          { id:"matrix",    label:"▦ Catálogo de Módulos" },
          { id:"relations", label:"⊛ Matriz de Relaciones" },
          { id:"diagram", label:"◎ Diagrama de Integración" },
        ].map(v => (
          <button key={v.id} onClick={() => { setViewMode(v.id); setSelected(null); }} style={{
            background:"transparent", border:"none",
            borderBottom: viewMode===v.id ? "2px solid #1D1D1B" : "2px solid transparent",
            color: viewMode===v.id ? "#1D1D1B" : "#999",
            padding:"8px 18px", cursor:"pointer", fontSize:13,
            fontWeight: viewMode===v.id ? 700 : 400, transition:"all 0.15s",
          }}>{v.label}</button>
        ))}
      </div>

      {/* ══════════════ VISTA: MATRIZ ══════════════ */}
      {viewMode === "matrix" && (
        <>
          {/* Filtro de área */}
          <div style={{ display:"flex", gap:6, marginBottom:18, flexWrap:"wrap", alignItems:"center" }}>
            <span style={{ fontSize:11, color:"#999" }}>Área:</span>
            {["ALL","infraestructura","financiero","operacional","rrhh"].map(k => {
              const label = k==="ALL" ? "Todos" : areaLabels[k];
              const col = k==="ALL" ? "#1D1D1B" : areaColors[k];
              return (
                <button key={k} onClick={() => { setMatrixFilter(k); setSelected(null); }} style={{
                  background: matrixFilter===k ? col : "transparent",
                  border: `1px solid ${matrixFilter===k ? col : "#ddd"}`,
                  color: matrixFilter===k ? "#fff" : "#666",
                  padding:"4px 12px", borderRadius:5, cursor:"pointer", fontSize:11,
                  fontWeight: matrixFilter===k ? 700 : 400,
                }}>{label}</button>
              );
            })}
            <span style={{ fontSize:10, color:"#bbb", marginLeft:4 }}>· Haz clic en una fila para ampliar el detalle del módulo</span>
          </div>

          {/* Panel de detalle del módulo seleccionado */}
          {selectedMod && (
            <div style={{
              background:"#fff", border:`1px solid ${selectedMod.color}33`,
              borderLeft:`4px solid ${selectedMod.color}`,
              borderRadius:10, padding:"16px 20px", marginBottom:20,
            }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
                <div>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <span style={{ fontSize:11, fontWeight:700, color:"#fff", background:selectedMod.color, borderRadius:5, padding:"2px 9px", letterSpacing:0.5 }}>{selectedMod.code}</span>
                    <span style={{ fontSize:16, fontWeight:700, color:"#1D1D1B" }}>{selectedMod.name}</span>
                    <span style={{ fontSize:10, color:"#fff", background: areaColors[selectedMod.area]+"cc", borderRadius:4, padding:"1px 7px" }}>{areaLabels[selectedMod.area]}</span>
                  </div>
                  <p style={{ fontSize:12, color:"#555", lineHeight:1.65, margin:"8px 0 0" }}>{selectedMod.desc}</p>
                </div>
                <button onClick={() => setSelected(null)} style={{ background:"none", border:"none", color:"#aaa", cursor:"pointer", fontSize:18 }}>✕</button>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(260px, 1fr))", gap:12 }}>
                {/* Funciones principales */}
                <div style={{ background:"#f8f9fa", borderRadius:8, padding:"10px 14px" }}>
                  <div style={{ fontSize:10, fontWeight:700, color:selectedMod.color, textTransform:"uppercase", letterSpacing:0.8, marginBottom:8 }}>Funciones principales</div>
                  {selectedMod.funciones.map(f => (
                    <div key={f} style={{ fontSize:11, color:"#444", padding:"3px 0", borderBottom:"1px solid #eee", display:"flex", gap:6 }}>
                      <span style={{ color:selectedMod.color, flexShrink:0 }}>·</span>{f}
                    </div>
                  ))}
                </div>
                {/* Módulos con los que integra */}
                <div style={{ background:"#f8f9fa", borderRadius:8, padding:"10px 14px" }}>
                  <div style={{ fontSize:10, fontWeight:700, color:"#0097A7", textTransform:"uppercase", letterSpacing:0.8, marginBottom:8 }}>Integración con módulos</div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
                    {selectedMod.integra.map(code => {
                      const m = moduleMatrix.find(x => x.code===code);
                      return (
                        <span key={code} onClick={() => setSelected(code)} style={{
                          background:(m?.color||"#888")+"18", border:`1px solid ${(m?.color||"#888")}44`,
                          color: m?.color||"#888", borderRadius:5, padding:"3px 9px",
                          fontSize:11, fontWeight:700, cursor:"pointer",
                        }} title={m?.name}>{code}</span>
                      );
                    })}
                  </div>
                  {udfByModule[selectedMod.code] && (
                    <div style={{ marginTop:10, fontSize:11, color:"#B8860B", display:"flex", alignItems:"center", gap:5 }}>
                      <span>⬡</span>
                      <span><strong>{udfByModule[selectedMod.code]}</strong> UDFs documentados en este módulo · Grupo Mayoreo</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Tabla / Matriz */}
          <div style={{ overflowX:"auto" }}>
            <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
              <thead>
                <tr style={{ borderBottom:"2px solid #e0e0e0" }}>
                  <th style={{ textAlign:"left", padding:"8px 10px", color:"#888", fontWeight:600, fontSize:10, textTransform:"uppercase", letterSpacing:0.8, width:60 }}>Código</th>
                  <th style={{ textAlign:"left", padding:"8px 10px", color:"#888", fontWeight:600, fontSize:10, textTransform:"uppercase", letterSpacing:0.8, minWidth:170 }}>Módulo</th>
                  <th style={{ textAlign:"left", padding:"8px 10px", color:"#888", fontWeight:600, fontSize:10, textTransform:"uppercase", letterSpacing:0.8, minWidth:280 }}>Descripción funcional</th>
                  <th style={{ textAlign:"left", padding:"8px 10px", color:"#888", fontWeight:600, fontSize:10, textTransform:"uppercase", letterSpacing:0.8, width:80 }}>Área</th>
                  <th style={{ textAlign:"center", padding:"8px 10px", color:"#888", fontWeight:600, fontSize:10, textTransform:"uppercase", letterSpacing:0.8, width:60 }}>UDFs</th>
                  <th style={{ textAlign:"left", padding:"8px 10px", color:"#888", fontWeight:600, fontSize:10, textTransform:"uppercase", letterSpacing:0.8 }}>Integra con</th>
                </tr>
              </thead>
              <tbody>
                {filteredModules.map((mod, i) => {
                  const isSel = selected === mod.code;
                  return (
                    <tr key={mod.code}
                      onClick={() => setSelected(isSel ? null : mod.code)}
                      style={{
                        background: isSel ? mod.color+"0d" : i%2===0 ? "#fff" : "#fafafa",
                        borderBottom: `1px solid ${isSel ? mod.color+"33" : "#efefef"}`,
                        cursor:"pointer",
                        borderLeft: isSel ? `3px solid ${mod.color}` : "3px solid transparent",
                        transition:"background 0.15s",
                      }}
                    >
                      <td style={{ padding:"10px 10px" }}>
                        <span style={{
                          display:"inline-block", background:mod.color, color:"#fff",
                          borderRadius:5, padding:"2px 8px", fontSize:11, fontWeight:700, letterSpacing:0.4,
                        }}>{mod.code}</span>
                      </td>
                      <td style={{ padding:"10px 10px", fontWeight:600, color:"#1D1D1B", fontSize:12 }}>{mod.name}</td>
                      <td style={{ padding:"10px 10px", color:"#555", fontSize:11, lineHeight:1.5 }}>{mod.desc}</td>
                      <td style={{ padding:"10px 10px" }}>
                        <span style={{ fontSize:9, color:areaColors[mod.area], background:areaColors[mod.area]+"18", border:`1px solid ${areaColors[mod.area]}33`, borderRadius:4, padding:"2px 6px", fontWeight:700, whiteSpace:"nowrap" }}>
                          {areaLabels[mod.area]}
                        </span>
                      </td>
                      <td style={{ padding:"10px 10px", textAlign:"center" }}>
                        {udfByModule[mod.code]
                          ? <span style={{ fontSize:11, fontWeight:700, color:"#B8860B" }}>{udfByModule[mod.code]}</span>
                          : <span style={{ fontSize:10, color:"#ccc" }}>—</span>}
                      </td>
                      <td style={{ padding:"10px 10px" }}>
                        <div style={{ display:"flex", flexWrap:"wrap", gap:3 }}>
                          {mod.integra.map(c => {
                            const m2 = moduleMatrix.find(x=>x.code===c);
                            return (
                              <span key={c} style={{
                                fontSize:9, fontWeight:700, color:m2?.color||"#888",
                                background:(m2?.color||"#888")+"18",
                                border:`1px solid ${(m2?.color||"#888")}33`,
                                borderRadius:3, padding:"1px 5px",
                              }}>{c}</span>
                            );
                          })}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Leyenda de áreas */}
          <div style={{ marginTop:16, display:"flex", gap:16, flexWrap:"wrap" }}>
            {Object.entries(areaLabels).map(([k,v]) => (
              <div key={k} style={{ display:"flex", alignItems:"center", gap:5, fontSize:11, color:"#888" }}>
                <div style={{ width:10, height:10, borderRadius:2, background:areaColors[k] }}/>
                {v}
              </div>
            ))}
          </div>
        </>
      )}

      {/* ══════════════ VISTA: MATRIZ DE RELACIONES ══════════════ */}
      {viewMode === "relations" && (
        <RelationsMatrixView />
      )}

      {/* ══════════════ VISTA: DIAGRAMA (original) ══════════════ */}
      {viewMode === "diagram" && (
        <>
          <div style={{ display:"flex", gap:16, flexWrap:"wrap", marginBottom:16 }}>
            {Object.entries(typeLabels).map(([key, val]) => (
              <div key={key} style={{ display:"flex", alignItems:"center", gap:6, fontSize:12 }}>
                <div style={{ width:12, height:12, borderRadius:3, background:val.color, border:"1px solid #e0e0e0" }} />
                <span style={{ color:"#777" }}>{val.label}</span>
              </div>
            ))}
          </div>

          <button onClick={() => setShowExternal(!showExternal)} style={{
            background:"transparent", border:"1px solid #ddd",
            color:"#888", padding:"5px 12px", borderRadius:5, cursor:"pointer", fontSize:11, marginBottom:16
          }}>
            {showExternal ? "▼" : "▶"} Módulos externos / satélites ({externalModules.length})
          </button>

          {showExternal && (
            <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:16 }}>
              {externalModules.map(em => (
                <div key={em.name} style={{ background:"#fafafa", border:"1px dashed #e0e0e0", borderRadius:6, padding:"6px 12px" }}>
                  <div style={{ fontSize:11, fontWeight:600, color:"#555" }}>{em.name}</div>
                  <div style={{ fontSize:10, color:"#888", marginTop:2 }}>→ {em.connects.join(", ")}</div>
                </div>
              ))}
            </div>
          )}

          {selected && modules[selected] && (
            <div style={{ background:"#f8f8f8", border:"1px solid #e0e0e0", borderRadius:10, padding:"14px 18px", marginBottom:20 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                <div>
                  <div style={{ fontSize:16, fontWeight:700, color:modules[selected].color }}>{modules[selected].name}</div>
                  <div style={{ fontSize:12, color:"#777", marginTop:4, lineHeight:1.6 }}>{modules[selected].description}</div>
                </div>
                <button onClick={() => setSelected(null)} style={{ background:"none", border:"none", color:"#aaa", cursor:"pointer", fontSize:18 }}>✕</button>
              </div>
              <div style={{ marginTop:10, display:"flex", gap:8, flexWrap:"wrap" }}>
                <span style={{ fontSize:11, color:"#888" }}>Conectado con:</span>
                {modules[selected].connections.map(c => (
                  <span key={c} style={{ background:modules[c].color+"22", border:"1px solid "+modules[c].color+"44", borderRadius:5, padding:"2px 8px", fontSize:11, color:modules[c].color, fontWeight:600 }}>{c}</span>
                ))}
                {Object.entries(modules).filter(([k,m]) => m.connections.includes(selected)).map(([k]) => (
                  k !== selected && !modules[selected].connections.includes(k) &&
                  <span key={k} style={{ background:modules[k].color+"22", border:"1px dashed "+modules[k].color+"44", borderRadius:5, padding:"2px 8px", fontSize:11, color:modules[k].color }}>← {k}</span>
                ))}
              </div>
              {udfByModule[selected] && (
                <div style={{ marginTop:8, fontSize:11, color:"#B8860B" }}>⬡ {udfByModule[selected]} UDFs documentados en este módulo</div>
              )}
            </div>
          )}

          <div style={{ position:"relative", overflowX:"auto" }}>
            <svg width="900" height="750" style={{ display:"block", background:"#fafafa", borderRadius:10, border:"1px solid #eee" }}>
              <defs>
                {Object.entries(modules).map(([key, mod]) => (
                  <marker key={key} id={"arrow-"+key} markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                    <path d="M0,0 L0,6 L8,3 z" fill={mod.color} opacity="0.7" />
                  </marker>
                ))}
                <marker id="arrow-default" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                  <path d="M0,0 L0,6 L8,3 z" fill="#ccc" />
                </marker>
              </defs>

              {connections.map(conn => {
                const from = modules[conn.from]; const to = modules[conn.to];
                const x1 = from.x + nodeW/2; const y1 = from.y + nodeH/2;
                const x2 = to.x + nodeW/2;   const y2 = to.y + nodeH/2;
                const highlighted = isConnectionHighlighted(conn);
                return (
                  <line key={conn.key} x1={x1} y1={y1} x2={x2} y2={y2}
                    stroke={highlighted ? from.color : "#e0e0e0"}
                    strokeWidth={highlighted ? 2 : 1}
                    strokeOpacity={highlighted ? 0.7 : 0.5}
                    strokeDasharray={highlighted ? "none" : "4,4"}
                    markerEnd={highlighted ? `url(#arrow-${conn.from})` : "url(#arrow-default)"}
                  />
                );
              })}

              {Object.entries(modules).map(([key, mod]) => {
                const highlighted = isHighlighted(key);
                const isSelected = selected === key;
                return (
                  <g key={key} onClick={() => setSelected(selected===key ? null : key)} style={{ cursor:"pointer" }}
                    transform={`translate(${mod.x}, ${mod.y})`}>
                    <rect width={nodeW} height={nodeH} rx={8}
                      fill={isSelected ? mod.color : mod.color+(highlighted ? "22" : "0d")}
                      stroke={mod.color}
                      strokeWidth={isSelected ? 2 : 1}
                      strokeOpacity={highlighted ? 1 : 0.3}
                    />
                    <text x={nodeW/2} y={nodeH/2-6} textAnchor="middle"
                      fill={isSelected ? "#fff" : (highlighted ? mod.color : "#bbb")}
                      fontSize={15} fontWeight="700">{mod.abbr}</text>
                    <text x={nodeW/2} y={nodeH/2+9} textAnchor="middle"
                      fill={isSelected ? "rgba(255,255,255,0.85)" : (highlighted ? "#555" : "#ccc")}
                      fontSize={7.5}>{mod.name.split(" ").slice(0,2).join(" ")}</text>
                    {udfByModule[key] && highlighted && (
                      <text x={nodeW/2} y={nodeH-5} textAnchor="middle" fill="#B8860B" fontSize={8}>
                        {udfByModule[key]} UDFs
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>
          <p style={{ fontSize:11, color:"#999", marginTop:8 }}>Haz clic en un módulo para ver sus conexiones. Los badges amarillos indican UDFs del Grupo Mayoreo.</p>
        </>
      )}
    </>
  );
}

// ════════════════════════════════════════════════════════
//  DATA MODEL VIEW (UDFs, tablas, proyectos, empresas)
// ════════════════════════════════════════════════════════


// ════════════════════════════════════════════════════════
//  CATÁLOGO DE TABLAS — Fuente: diccionarios SQL Server
// ════════════════════════════════════════════════════════
const TABLE_CATALOG = {"ACC_PER_IMPRESION":{"m":"","d":"","f":[{"n":"NUMERO_ACCION","t":"INT"},{"n":"USUARIO","t":"VARCHAR(50)"}]},"ACT_ECONO_SGRL":{"m":"","d":"","f":[{"n":"ACTIVIDAD","t":"VARCHAR(7)"},{"n":"DESCRIPCION","t":"VARCHAR(4000)"}]},"ACT_ECONOMICA_GUA":{"m":"","d":"","f":[{"n":"ACTIVIDAD","t":"VARCHAR(25)"},{"n":"DESCRIPCION","t":"VARCHAR(254)"}]},"ACTIVIDAD_COMERCIAL":{"m":"","d":"Tabla de catálogo/maestro de referencia con código y descripción.","f":[{"n":"CODIGO","t":"VARCHAR(10)"},{"n":"DESCRIPCION","t":"VARCHAR(254)"},{"n":"SUB_CLASE","t":"VARCHAR(10)"},{"n":"TITULO_SUB_CLASE","t":"VARCHAR(254)"}]},"ACTIVO_ACCION":{"m":"AF","d":"","f":[{"n":"ACTIVO_ACCION","t":"INT"},{"n":"ACTIVO_FIJO","t":"VARCHAR(10)"},{"n":"ESTADO_ACCION","t":"VARCHAR(1)"},{"n":"ESTADO_ACTIVO","t":"VARCHAR(4)"},{"n":"ESTADO_ACTIVO_ANT","t":"VARCHAR(4)"},{"n":"FECHA","t":"DATETIME"},{"n":"FECHA_APLICACION","t":"DATETIME"},{"n":"FECHA_APROBACION","t":"DATETIME"},{"n":"FECHA_CREACION","t":"DATETIME"},{"n":"FECHA_RIGE","t":"DATETIME"},{"n":"FECHA_VENCE","t":"DATETIME"},{"n":"NOTAS","t":"TEXT"},{"n":"RESPONSABLE","t":"VARCHAR(20)"},{"n":"RUBRO1_ACTIVO","t":"VARCHAR(40)"},{"n":"RUBRO10_ACTIVO","t":"VARCHAR(40)"},{"n":"RUBRO11_ACTIVO","t":"VARCHAR(40)"},{"n":"RUBRO12_ACTIVO","t":"VARCHAR(40)"},{"n":"RUBRO13_ACTIVO","t":"VARCHAR(40)"},{"n":"RUBRO14_ACTIVO","t":"VARCHAR(40)"},{"n":"RUBRO15_ACTIVO","t":"VARCHAR(40)"},{"n":"RUBRO2_ACTIVO","t":"VARCHAR(40)"},{"n":"RUBRO3_ACTIVO","t":"VARCHAR(40)"},{"n":"RUBRO4_ACTIVO","t":"VARCHAR(40)"},{"n":"RUBRO5_ACTIVO","t":"VARCHAR(40)"},{"n":"RUBRO6_ACTIVO","t":"VARCHAR(40)"}]},"ACTIVO_CENTRO":{"m":"AF","d":"","f":[{"n":"ACTIVO_CENTRO","t":"INT"},{"n":"ACTIVO_FIJO","t":"VARCHAR(10)"},{"n":"CENTRO_COSTO","t":"VARCHAR(25)"},{"n":"FASE","t":"VARCHAR(25)"},{"n":"PORCENTAJE","t":"FLOAT"}]},"ACTIVO_DESMANTELAMIENTO":{"m":"AF","d":"","f":[{"n":"ACTIVO_FIJO","t":"VARCHAR(10)"},{"n":"ACUM_DETERIORO_DOL_C","t":"DECIMAL"},{"n":"ACUM_DETERIORO_DOL_F","t":"DECIMAL"},{"n":"ACUM_DETERIORO_LOC_C","t":"DECIMAL"},{"n":"ACUM_DETERIORO_LOC_F","t":"DECIMAL"},{"n":"ACUM_REVAL_DOL_C","t":"DECIMAL"},{"n":"ACUM_REVAL_DOL_F","t":"DECIMAL"},{"n":"ACUM_REVAL_LOC_C","t":"DECIMAL"},{"n":"ACUM_REVAL_LOC_F","t":"DECIMAL"},{"n":"ASIENTO_INGRESO","t":"VARCHAR(10)"},{"n":"ASIENTO_INGRESO_F","t":"VARCHAR(10)"},{"n":"ASIENTO_RETIRO_C","t":"VARCHAR(10)"},{"n":"ASIENTO_RETIRO_F","t":"VARCHAR(10)"},{"n":"CODIGO_BARRAS","t":"VARCHAR(20)"},{"n":"COSTO_ORIG_COM_DOLAR","t":"DECIMAL"},{"n":"COSTO_ORIG_COM_LOCAL","t":"DECIMAL"},{"n":"COSTO_ORIG_FIS_DOLAR","t":"DECIMAL"},{"n":"COSTO_ORIG_FIS_LOCAL","t":"DECIMAL"},{"n":"DEP_ACUM_DESMANTELA_DOL_C","t":"DECIMAL"},{"n":"DEP_ACUM_DESMANTELA_DOL_F","t":"DECIMAL"},{"n":"DEP_ACUM_DESMANTELA_LOC_C","t":"DECIMAL"},{"n":"DEP_ACUM_DESMANTELA_LOC_F","t":"DECIMAL"},{"n":"DEP_ACUM_REVAL_DOL_C","t":"DECIMAL"},{"n":"DEP_ACUM_REVAL_DOL_F","t":"DECIMAL"},{"n":"DEP_ACUM_REVAL_LOC_C","t":"DECIMAL"}]},"ACTIVO_FIJO":{"m":"AF","d":"Activos fijos: código, descripción, grupo, valor histórico y vida útil.","f":[{"n":"ACTIVO_FIJO","t":"VARCHAR(10)"},{"n":"ARRE_FINANCIERO","t":"VARCHAR(1)"},{"n":"CLASIFICACION","t":"VARCHAR(1)"},{"n":"DESCRIPCION","t":"VARCHAR(60)"},{"n":"ESTADO_ACTIVO","t":"VARCHAR(4)"},{"n":"FECHA_ARRENDAMIENTO","t":"DATETIME"},{"n":"FECHA_CONTRATO","t":"DATETIME"},{"n":"FECHA_PROX_MANT","t":"DATETIME"},{"n":"FECHA_ULT_MANT","t":"DATETIME"},{"n":"MONTO_ARRE_ME","t":"DECIMAL"},{"n":"MONTO_ARRE_MN","t":"DECIMAL"},{"n":"NUMERO_CONTRATO","t":"VARCHAR(20)"},{"n":"NUMERO_CUOTAS","t":"INT"},{"n":"TASA_DEPRECIACION_C","t":"DECIMAL"},{"n":"TASA_DEPRECIACION_F","t":"DECIMAL"},{"n":"TIPO_ACTIVO","t":"VARCHAR(4)"},{"n":"UBICACION","t":"VARCHAR(8)"},{"n":"USA_COMPONENTE","t":"VARCHAR(1)"}]},"ACTIVO_HIST_MANT":{"m":"AF","d":"Tabla transaccional con montos e información de fechas del proceso.","f":[{"n":"ACTIVO_FIJO","t":"VARCHAR(10)"},{"n":"DESCRIPCION","t":"VARCHAR(40)"},{"n":"FECHA","t":"DATETIME"},{"n":"MONTO","t":"DECIMAL"},{"n":"TIPO_MANTENIMIENTO","t":"VARCHAR(1)"}]},"ACTIVO_HIST_REVAL":{"m":"AF","d":"","f":[{"n":"ACTIVO_FIJO","t":"VARCHAR(10)"},{"n":"AJU_INFLAC_DEPREC_C","t":"DECIMAL"},{"n":"AJU_INFLAC_DEPREC_F","t":"DECIMAL"},{"n":"AJUSTE_INFLA_C","t":"VARCHAR(1)"},{"n":"AJUSTE_INFLA_F","t":"VARCHAR(1)"},{"n":"ASIENTO_COMP","t":"VARCHAR(10)"},{"n":"ASIENTO_FISCAL","t":"VARCHAR(10)"},{"n":"COMENTARIO","t":"VARCHAR(254)"},{"n":"CONSEC_DEPR_C","t":"INT"},{"n":"CONSEC_DEPR_F","t":"INT"},{"n":"DESMANTELAMIENTO","t":"VARCHAR(10)"},{"n":"FECHA","t":"DATETIME"},{"n":"FECHA_HORA","t":"DATETIME"},{"n":"HIST_REVALUACION","t":"INT"},{"n":"MEJORA","t":"VARCHAR(10)"},{"n":"METODO","t":"VARCHAR(1)"},{"n":"METODO_C","t":"VARCHAR(1)"},{"n":"REVAL_DEPR_ACUM_C","t":"DECIMAL"},{"n":"REVAL_DEPR_ACUM_F","t":"DECIMAL"},{"n":"REVAL_VALOR","t":"DECIMAL"},{"n":"REVAL_VALOR_C","t":"DECIMAL"},{"n":"TIPO_CAMBIO","t":"DECIMAL"},{"n":"USUARIO","t":"VARCHAR(50)"}]},"ACTIVO_MEJORA":{"m":"AF","d":"","f":[{"n":"ACTIVO_FIJO","t":"VARCHAR(10)"},{"n":"ACTIVO_ORIGEN","t":"VARCHAR(10)"},{"n":"ACUM_DESMANTELA_DOL_C","t":"DECIMAL"},{"n":"ACUM_DESMANTELA_DOL_F","t":"DECIMAL"},{"n":"ACUM_DESMANTELA_LOC_C","t":"DECIMAL"},{"n":"ACUM_DESMANTELA_LOC_F","t":"DECIMAL"},{"n":"ACUM_DETERIORO_DOL_C","t":"DECIMAL"},{"n":"ACUM_DETERIORO_DOL_F","t":"DECIMAL"},{"n":"ACUM_DETERIORO_LOC_C","t":"DECIMAL"},{"n":"ACUM_DETERIORO_LOC_F","t":"DECIMAL"},{"n":"ACUM_REVAL_DOL_C","t":"DECIMAL"},{"n":"ACUM_REVAL_DOL_F","t":"DECIMAL"},{"n":"ACUM_REVAL_LOC_C","t":"DECIMAL"},{"n":"ACUM_REVAL_LOC_F","t":"DECIMAL"},{"n":"AJUSTE_INFLA_C","t":"VARCHAR(1)"},{"n":"AJUSTE_INFLA_F","t":"VARCHAR(1)"},{"n":"ASIENTO_INGRESO","t":"VARCHAR(10)"},{"n":"ASIENTO_INGRESO_C","t":"VARCHAR(10)"},{"n":"ASIENTO_RETIRO_C","t":"VARCHAR(10)"},{"n":"ASIENTO_RETIRO_F","t":"VARCHAR(10)"},{"n":"CLASIFICACION_ACTIVO","t":"VARCHAR(1)"},{"n":"COD_CAT_UTILIZADO_1","t":"VARCHAR(4)"},{"n":"COD_CAT_UTILIZADO_2","t":"VARCHAR(4)"},{"n":"COD_EXISTENCIA","t":"VARCHAR(30)"},{"n":"COD_TIPO_ACTIVO","t":"VARCHAR(2)"}]},"ADICIONAL":{"m":"","d":"","f":[{"n":"ADICIONAL","t":"VARCHAR(40)"},{"n":"DECIMALES","t":"INT"},{"n":"LONGITUD","t":"INT"},{"n":"MODIFICABLE","t":"VARCHAR(1)"},{"n":"TIPO","t":"VARCHAR(1)"}]},"ADICIONAL_NOMINA":{"m":"CN","d":"","f":[{"n":"ADICIONAL","t":"VARCHAR(40)"},{"n":"DECIMALES","t":"INT"},{"n":"LONGITUD","t":"INT"},{"n":"MODIFICABLE","t":"VARCHAR(1)"},{"n":"TIPO","t":"VARCHAR(1)"}]},"ADICIONAL_NOMINA_VALOR":{"m":"CN","d":"","f":[{"n":"ADICIONAL","t":"VARCHAR(40)"},{"n":"VALOR","t":"VARCHAR(60)"}]},"ADICIONAL_VALOR":{"m":"","d":"","f":[{"n":"ADICIONAL","t":"VARCHAR(40)"},{"n":"VALOR","t":"VARCHAR(60)"}]},"ADICIONALEMPLEADO":{"m":"CN","d":"","f":[{"n":"ADICIONAL","t":"VARCHAR(40)"},{"n":"EMPLEADO","t":"VARCHAR(20)"},{"n":"VALOR","t":"VARCHAR(60)"}]},"ADICIONALNOMINA":{"m":"CN","d":"","f":[{"n":"ADICIONAL","t":"VARCHAR(40)"},{"n":"NOMINA","t":"VARCHAR(4)"},{"n":"VALOR","t":"VARCHAR(60)"}]},"ADMIN_CONCEPTO":{"m":"","d":"","f":[{"n":"ADMINISTRADORA","t":"VARCHAR(10)"},{"n":"CONCEPTO","t":"VARCHAR(20)"}]},"ADMIN_COTIZANTE":{"m":"","d":"","f":[{"n":"ADMINISTRADORA","t":"VARCHAR(10)"},{"n":"CONSECUTIVO","t":"INT"},{"n":"EMPLEADO","t":"VARCHAR(20)"},{"n":"FECHA_INGRESO","t":"DATETIME"},{"n":"FECHA_SALIDA","t":"DATETIME"},{"n":"NUMERO_ACCION","t":"INT"}]},"ADMINISTRADORA":{"m":"","d":"","f":[{"n":"ADMINISTRADORA","t":"VARCHAR(10)"},{"n":"AGRUPA_APORTE","t":"VARCHAR(1)"},{"n":"DEPARTAMENTO","t":"VARCHAR(4)"},{"n":"DESC_SUCURSAL","t":"VARCHAR(40)"},{"n":"DESCRIPCION","t":"VARCHAR(40)"},{"n":"DIRECCION","t":"VARCHAR(254)"},{"n":"DV_NIT_ADMINISTRA","t":"VARCHAR(1)"},{"n":"MUNICIPIO","t":"VARCHAR(4)"},{"n":"NIT","t":"VARCHAR(20)"},{"n":"SUCURSAL","t":"VARCHAR(10)"},{"n":"TIPO_ADMINISTRADORA","t":"VARCHAR(4)"}]},"ADQUISICION":{"m":"","d":"","f":[{"n":"ADQUISICION","t":"VARCHAR(4)"},{"n":"DESCRIPCION","t":"VARCHAR(50)"}]},"ADUANA":{"m":"","d":"","f":[{"n":"ADUANA","t":"VARCHAR(12)"},{"n":"DESCRIPCION","t":"VARCHAR(254)"}]},"AEROPUERTOS_SUNAT":{"m":"","d":"Tabla de catálogo/maestro de referencia con código y descripción.","f":[{"n":"CODIGO","t":"VARCHAR(10)"},{"n":"DESCRIPCION","t":"VARCHAR(50)"},{"n":"DIRECCION","t":"VARCHAR(100)"},{"n":"UBIGEO","t":"VARCHAR(20)"}]},"AGENTE_ADUANAL":{"m":"","d":"","f":[{"n":"AGENTE_ADUANAL","t":"VARCHAR(12)"},{"n":"DESCRIPCION","t":"VARCHAR(254)"}]},"AJUSTE_ACC_SALDO":{"m":"CG","d":"Saldos acumulados por período, cuenta y dimensión de análisis.","f":[{"n":"CONSECUTIVO","t":"INT"},{"n":"DIAS_APLICADOS","t":"DECIMAL"},{"n":"NOMINA","t":"VARCHAR(4)"},{"n":"NUMERO_ACCION","t":"INT"},{"n":"NUMERO_NOMINA","t":"INT"}]},"AJUSTE_CONFIG":{"m":"","d":"Ajustes de inventario: correcciones por diferencias entre conteo y sistema.","f":[{"n":"ACTIVA","t":"VARCHAR(1)"},{"n":"AJUSTE_BASE","t":"VARCHAR(1)"},{"n":"AJUSTE_CONFIG","t":"VARCHAR(4)"},{"n":"DESCRIPCION","t":"VARCHAR(15)"},{"n":"GEN_DOC_ELE","t":"VARCHAR(1)"},{"n":"INGRESO","t":"VARCHAR(1)"}]},"AJUSTE_SUBSUBTIPO":{"m":"","d":"Ajustes de inventario: correcciones por diferencias entre conteo y sistema.","f":[{"n":"AJUSTE_CONFIG","t":"VARCHAR(4)"},{"n":"SUBSUBTIPO","t":"VARCHAR(1)"}]},"AJUSTE_SUBTIPO":{"m":"","d":"Ajustes de inventario: correcciones por diferencias entre conteo y sistema.","f":[{"n":"AJUSTE_CONFIG","t":"VARCHAR(4)"},{"n":"SUBTIPO","t":"VARCHAR(1)"}]},"ALARMA":{"m":"","d":"","f":[{"n":"ACTIVA","t":"VARCHAR(1)"},{"n":"ALARMA","t":"INT"},{"n":"ALARMA_BASE","t":"INT"},{"n":"ALARMA_PLANTILLA","t":"INT"},{"n":"ALMACENAR_AVISOS","t":"VARCHAR(1)"},{"n":"DIA_DEL_MES","t":"INT"},{"n":"DIAS_SEMANA_FRECUENCIA","t":"VARCHAR(7)"},{"n":"ENVIA_MENSAJE_TEXTO","t":"VARCHAR(1)"},{"n":"ENVIAR_CORREOS","t":"VARCHAR(1)"},{"n":"FECHA_INICIO_NOTIFICACION","t":"DATETIME"},{"n":"FECHA_LIMITE_NOTIFICACION","t":"DATETIME"},{"n":"FECHA_PROX_NOTIFICACION","t":"DATETIME"},{"n":"FECHA_ULT_NOTIFICACION","t":"DATETIME"},{"n":"FILTRO","t":"TEXT"},{"n":"FORMATO_ENVIO","t":"VARCHAR(10)"},{"n":"IMPORTANCIA","t":"VARCHAR(1)"},{"n":"INTERVALO_FRECUENCIA","t":"INT"},{"n":"MES_FRECUENCIA","t":"INT"},{"n":"NOTIFICAR_MOVIL","t":"VARCHAR(1)"},{"n":"NOTIFICAR_SIN_DATOS","t":"VARCHAR(1)"},{"n":"ORDINAL_FRECUENCIA","t":"VARCHAR(1)"},{"n":"SUBTIPO_FRECUENCIA","t":"VARCHAR(1)"},{"n":"TEXTO_MENSAJE","t":"VARCHAR(160)"},{"n":"TIPO","t":"INT"},{"n":"TIPO_FRECUENCIA","t":"VARCHAR(1)"}]},"ALARMA_BASE":{"m":"","d":"","f":[{"n":"ALARMA_BASE","t":"INT"},{"n":"CONSULTA","t":"TEXT"},{"n":"DOCUMENTO_SENTENCIA","t":"XML"},{"n":"ESTADO","t":"VARCHAR(1)"},{"n":"MODULO","t":"VARCHAR(4)"},{"n":"NOMBRE","t":"VARCHAR(50)"},{"n":"OBJETIVO","t":"VARCHAR(254)"},{"n":"REFRESCA_AUTOMATICO","t":"VARCHAR(1)"},{"n":"VERSION","t":"VARCHAR(10)"}]},"ALARMA_BASE_COLUMNA":{"m":"","d":"","f":[{"n":"ALARMA_BASE","t":"INT"},{"n":"COLUMNA","t":"VARCHAR(80)"},{"n":"COLUMNA_F1","t":"VARCHAR(1)"},{"n":"COLUMNA_RELACIONADA","t":"VARCHAR(50)"},{"n":"COLUMNA_SQL","t":"VARCHAR(32)"},{"n":"CONSECUTIVO","t":"INT"},{"n":"DESCRIPCION","t":"VARCHAR(254)"},{"n":"ES_FILTRO","t":"VARCHAR(1)"},{"n":"ORDEN_SUGERIDO","t":"INT"},{"n":"PERMITE_FILTRAR","t":"VARCHAR(1)"},{"n":"TABLA_RELACIONADA","t":"VARCHAR(50)"},{"n":"TIPO","t":"VARCHAR(1)"}]},"ALARMA_COLUMNA":{"m":"","d":"","f":[{"n":"ALARMA","t":"INT"},{"n":"ALARMA_BASE","t":"INT"},{"n":"CONSECUTIVO","t":"INT"},{"n":"ORDENAMIENTO","t":"INT"}]},"ALARMA_DESTINATARIO":{"m":"","d":"","f":[{"n":"ALARMA","t":"INT"},{"n":"DESTINATARIO","t":"INT"},{"n":"ENVIA_MENSAJE_TEXTO","t":"VARCHAR(1)"},{"n":"ENVIAR_CORREO","t":"VARCHAR(1)"}]},"ALARMA_FORMATO_IMP":{"m":"","d":"","f":[{"n":"ALARMA","t":"INT"},{"n":"FORMATO_IMPRESION","t":"TEXT"}]},"ALARMA_MOVIL":{"m":"","d":"","f":[{"n":"compania","t":"VARCHAR(50)"},{"n":"consulta","t":"VARCHAR(50)"},{"n":"destinatario","t":"VARCHAR(100)"},{"n":"estado","t":"BIT"},{"n":"fechaultima","t":"DATETIME"},{"n":"id","t":"INT"},{"n":"prioridad","t":"VARCHAR(50)"},{"n":"titulo","t":"VARCHAR(500)"},{"n":"vista","t":"VARCHAR(50)"}]},"ALARMA_NOLEIDA":{"m":"","d":"","f":[{"n":"compania","t":"VARCHAR(100)"},{"n":"destinatario","t":"VARCHAR(100)"},{"n":"estado","t":"BIT"},{"n":"fecha","t":"DATETIME"},{"n":"id","t":"INT"}]},"ALARMA_PLANT_COL":{"m":"","d":"","f":[{"n":"ALARMA_BASE","t":"INT"},{"n":"ALARMA_PLANTILLA","t":"INT"},{"n":"CONSECUTIVO","t":"INT"},{"n":"ORDENAMIENTO","t":"INT"}]},"ALARMA_PLANTILLA":{"m":"","d":"","f":[{"n":"ALARMA_BASE","t":"INT"},{"n":"ALARMA_PLANTILLA","t":"INT"},{"n":"FILTRO","t":"TEXT"},{"n":"NOMBRE","t":"VARCHAR(50)"},{"n":"OBJETIVO","t":"VARCHAR(254)"},{"n":"VERSION","t":"VARCHAR(10)"}]},"ALARMA_RTF":{"m":"","d":"","f":[{"n":"ALARMA","t":"INT"},{"n":"TEXTO_RTF","t":"TEXT"}]},"ALARMA_USUARIO":{"m":"","d":"Usuarios del sistema: credenciales, perfil, estado y auditoría.","f":[{"n":"ALARMA","t":"INT"},{"n":"ENVIA_MENSAJE_TEXTO","t":"VARCHAR(1)"},{"n":"ENVIAR_CORREO","t":"VARCHAR(1)"},{"n":"GUARDAR_AVISO","t":"VARCHAR(1)"},{"n":"USUARIO","t":"VARCHAR(50)"}]},"ALIAS_PRODUCCION":{"m":"","d":"","f":[{"n":"ALIAS_PRODUCCION","t":"VARCHAR(25)"},{"n":"ARTICULO","t":"VARCHAR(20)"},{"n":"DESCRIPCION","t":"VARCHAR(50)"}]},"ANTICIPO_MARCA_FACT":{"m":"CP","d":"","f":[{"n":"DOCUMENTO_CC","t":"VARCHAR(50)"},{"n":"FECHA","t":"DATETIME"},{"n":"TIPO","t":"VARCHAR(3)"},{"n":"USUARIO","t":"VARCHAR(50)"}]},"ANULACION_SECUENCIA":{"m":"","d":"Control de consecutivos y numeración automática de documentos.","f":[{"n":"ARCHIVO_JSON","t":"VARCHAR"},{"n":"CANTIDAD_NCF_ANULADOS","t":"INT"},{"n":"CONSECUTIVO","t":"VARCHAR(50)"},{"n":"FECHA_ANULACION","t":"DATETIME"},{"n":"INACTIVAR_SECUENCIA","t":"VARCHAR(1)"},{"n":"RNC_EMISOR","t":"VARCHAR(20)"},{"n":"SECUENCIA_DESDE","t":"VARCHAR(50)"},{"n":"SECUENCIA_HASTA","t":"VARCHAR(50)"},{"n":"TIPO_COMPROBANTE_FISCAL","t":"VARCHAR(2)"}]},"APERTURA_CAJA":{"m":"","d":"","f":[{"n":"CAJA","t":"VARCHAR(10)"},{"n":"ESTADO","t":"VARCHAR(1)"},{"n":"FCH_HORA_APERTURA","t":"DATETIME"},{"n":"FCH_HORA_CIERRE","t":"DATETIME"},{"n":"NOTAS","t":"TEXT"},{"n":"NUM_APERTURA","t":"INT"},{"n":"SALDO_FINAL_DOL","t":"DECIMAL"},{"n":"SALDO_FINAL_LOC","t":"DECIMAL"},{"n":"SALDO_INICIAL_DOL","t":"DECIMAL"},{"n":"SALDO_INICIAL_LOC","t":"DECIMAL"},{"n":"SALDO_RECIBO_DOL","t":"DECIMAL"},{"n":"SALDO_RECIBO_LOC","t":"DECIMAL"},{"n":"USUARIO","t":"VARCHAR(50)"}]},"ARANCEL_IMPUESTO":{"m":"CO","d":"Configuración de impuestos: tasas, tipos y reglas de aplicación.","f":[{"n":"CODIGO_ARANCEL","t":"VARCHAR(15)"},{"n":"IMPUESTO_COMPRA","t":"VARCHAR(20)"},{"n":"UTILIZADO_SIEMPRE","t":"VARCHAR(1)"}]},"ARCHIVOS_RESPUESTA_NE":{"m":"","d":"","f":[{"n":"ARCHIVO","t":"VARCHAR"},{"n":"CONSECUTIVO","t":"INT"},{"n":"FECHA_HORA","t":"DATETIME"},{"n":"NOMBRE_ARCHIVO","t":"VARCHAR(254)"},{"n":"PROCESADO","t":"VARCHAR(1)"}]},"ART_UND_DISTRIBUCI":{"m":"","d":"","f":[{"n":"ARTICULO","t":"VARCHAR(20)"},{"n":"CODIGO_BARRAS","t":"VARCHAR(20)"},{"n":"FACTOR_CONVERSION","t":"DECIMAL"},{"n":"UND_DISTRIBUCION","t":"VARCHAR(6)"}]},"ARTICULO":{"m":"CI","d":"Catálogo maestro de artículos/productos. Contiene código, descripción, unidad de medida, precios, clasificaciones y parámetros logísticos.","f":[{"n":"ACTIVO","t":"VARCHAR(1)"},{"n":"ARTICULO","t":"VARCHAR(20)"},{"n":"ARTICULO_CUENTA","t":"VARCHAR(4)"},{"n":"ARTICULO_DEL_PROV","t":"VARCHAR(30)"},{"n":"ARTICULO_ENVASE","t":"VARCHAR(20)"},{"n":"BULTOS","t":"INT"},{"n":"CALC_PERCEP","t":"VARCHAR(1)"},{"n":"CANASTA_BASICA","t":"VARCHAR(1)"},{"n":"CATALOGO_EXISTENCIA","t":"VARCHAR(4)"},{"n":"CLASE_ABC","t":"VARCHAR(1)"},{"n":"CLASIFICACION_1","t":"VARCHAR(12)"},{"n":"CLASIFICACION_2","t":"VARCHAR(12)"},{"n":"CLASIFICACION_3","t":"VARCHAR(12)"},{"n":"CLASIFICACION_4","t":"VARCHAR(12)"},{"n":"CLASIFICACION_5","t":"VARCHAR(12)"},{"n":"CLASIFICACION_6","t":"VARCHAR(12)"},{"n":"CODIGO_BARRAS_INVT","t":"VARCHAR(20)"},{"n":"CODIGO_BARRAS_VENT","t":"VARCHAR(20)"},{"n":"CODIGO_DETRACCION_COMPRA","t":"VARCHAR(4)"},{"n":"CODIGO_DETRACCION_VENTA","t":"VARCHAR(4)"},{"n":"CODIGO_HACIENDA","t":"VARCHAR(50)"},{"n":"CODIGO_RETENCION","t":"VARCHAR(4)"},{"n":"COLOR","t":"VARCHAR(5)"},{"n":"COSTO_COMPARATIVO","t":"VARCHAR(1)"},{"n":"COSTO_FISCAL","t":"VARCHAR(1)"}]},"ARTICULO_ALTERNO":{"m":"CI","d":"","f":[{"n":"ALTERNO","t":"VARCHAR(20)"},{"n":"ARTICULO","t":"VARCHAR(20)"},{"n":"PRIORIDAD","t":"INT"}]},"ARTICULO_ALTERNO_SINCRO":{"m":"CI","d":"","f":[{"n":"ALTERNO","t":"VARCHAR(20)"},{"n":"ARTICULO","t":"VARCHAR(20)"},{"n":"ID_PDA","t":"VARCHAR(15)"},{"n":"ID_SINCRO","t":"VARCHAR(15)"},{"n":"PRIORIDAD","t":"INT"}]},"ARTICULO_COLOR":{"m":"CI","d":"","f":[{"n":"CODIGO_BARRAS","t":"VARCHAR(5)"},{"n":"COLOR","t":"VARCHAR(5)"},{"n":"DESCRIPCION","t":"VARCHAR(50)"}]},"ARTICULO_COMPRA":{"m":"CI","d":"","f":[{"n":"ACEPTA_BACKORDER_MONTO","t":"VARCHAR(1)"},{"n":"ARTICULO","t":"VARCHAR(20)"},{"n":"BODEGA","t":"VARCHAR(4)"},{"n":"CODIGO_ARANCEL","t":"VARCHAR(15)"},{"n":"CODIGO_CORPORATIVO","t":"VARCHAR(20)"},{"n":"DESCRIPCION","t":"VARCHAR(254)"},{"n":"IMP1_AFECTA_COSTO","t":"VARCHAR(1)"},{"n":"IMPUESTO","t":"VARCHAR(4)"},{"n":"PORC_VARIAC_CANT","t":"DECIMAL"},{"n":"RECIBIR_MAS","t":"VARCHAR(1)"},{"n":"TIPO_COMPRA","t":"VARCHAR(1)"},{"n":"ULT_FECHA_COTIZA","t":"DATETIME"},{"n":"ULT_MONEDA","t":"VARCHAR(4)"},{"n":"ULT_PREC_UNITARIO","t":"DECIMAL"},{"n":"ULT_PROVEEDOR","t":"VARCHAR(20)"},{"n":"USA_CTA_TRANSITO","t":"VARCHAR(1)"}]},"ARTICULO_CUENTA":{"m":"CI","d":"","f":[{"n":"ARTICULO_CUENTA","t":"VARCHAR(4)"},{"n":"CTA_COMPRA_IMP","t":"VARCHAR(25)"},{"n":"CTA_COMPRA_LOC","t":"VARCHAR(25)"},{"n":"CTA_COMPRA_MERC_EXT","t":"VARCHAR(25)"},{"n":"CTA_COMPRA_MERC_LOC","t":"VARCHAR(25)"},{"n":"CTA_COMS_COBRO_EXP","t":"VARCHAR(25)"},{"n":"CTA_COMS_COBRO_LOC","t":"VARCHAR(25)"},{"n":"CTA_COMS_VENTA_EXP","t":"VARCHAR(25)"},{"n":"CTA_COMS_VENTA_LOC","t":"VARCHAR(25)"},{"n":"CTA_CONS_DESPERDIC","t":"VARCHAR(25)"},{"n":"CTA_CONS_GASTO","t":"VARCHAR(25)"},{"n":"CTA_CONS_NORMAL","t":"VARCHAR(25)"},{"n":"CTA_CONS_RETRABAJO","t":"VARCHAR(25)"},{"n":"CTA_COST_DESC_EXP","t":"VARCHAR(25)"},{"n":"CTA_COST_DESC_LOC","t":"VARCHAR(25)"},{"n":"CTA_COST_VENTA_EXP","t":"VARCHAR(25)"},{"n":"CTA_COST_VENTA_LOC","t":"VARCHAR(25)"},{"n":"CTA_CTB_AJU","t":"VARCHAR(25)"},{"n":"CTA_CTB_AJU_CMV","t":"VARCHAR(25)"},{"n":"CTA_CTB_CPGAR","t":"VARCHAR(25)"},{"n":"CTA_CTB_ING_DEVOLUC","t":"VARCHAR(25)"},{"n":"CTA_CTB_PERD_DEVOLUC","t":"VARCHAR(25)"},{"n":"CTA_CTB_PUGAR","t":"VARCHAR(25)"},{"n":"CTA_CTB_RET_ASUM","t":"VARCHAR(25)"},{"n":"CTA_DESC_BONIF_EXP","t":"VARCHAR(25)"}]},"ARTICULO_ENSAMBLE":{"m":"CI","d":"","f":[{"n":"ARTICULO_HIJO","t":"VARCHAR(20)"},{"n":"ARTICULO_PADRE","t":"VARCHAR(20)"},{"n":"CANTIDAD","t":"DECIMAL"}]},"ARTICULO_ESPE":{"m":"CI","d":"","f":[{"n":"ARTICULO","t":"VARCHAR(25)"},{"n":"ATRIBUTO","t":"VARCHAR(20)"},{"n":"CHEQUEAR_INGRESO","t":"VARCHAR(1)"},{"n":"HEREDAR_LOTES","t":"VARCHAR(1)"},{"n":"id_cat_ARTICULO_ESPE","t":"INT"},{"n":"MAXIMA","t":"DECIMAL"},{"n":"MINIMA","t":"DECIMAL"},{"n":"NORMAL","t":"DECIMAL"},{"n":"NOTAS","t":"TEXT"},{"n":"UNIDAD","t":"VARCHAR(6)"},{"n":"VALOR","t":"VARCHAR(20)"}]},"ARTICULO_ESPE_DELETED":{"m":"CI","d":"","f":[{"n":"ARTICULO","t":"VARCHAR(25)"},{"n":"ATRIBUTO","t":"VARCHAR(20)"},{"n":"DELETEDATE","t":"DATETIME"},{"n":"ID","t":"INT"},{"n":"id_cat_ARTICULO_ESPE","t":"INT"},{"n":"ID_STATUS","t":"INT"}]},"ARTICULO_ESTILO":{"m":"CI","d":"","f":[{"n":"CODIGO_BARRAS","t":"VARCHAR(5)"},{"n":"DESCRIPCION","t":"VARCHAR(50)"},{"n":"ESTILO","t":"VARCHAR(5)"}]},"ARTICULO_FOTO":{"m":"CI","d":"","f":[{"n":"ARCHIVO","t":"VARCHAR(254)"},{"n":"ARTICULO","t":"VARCHAR(20)"},{"n":"DESCRIPCION","t":"VARCHAR(254)"},{"n":"FECHA_ULT_MODIF","t":"DATETIME"},{"n":"FOTO","t":"IMAGE(214748364"},{"n":"id_cat_ARTICULO_FOTO","t":"INT"},{"n":"PRIORIDAD","t":"INT"},{"n":"SECUENCIA","t":"INT"}]},"ARTICULO_FOTO_DELETED":{"m":"CI","d":"","f":[{"n":"ARTICULO","t":"VARCHAR(20)"},{"n":"DELETEDATE","t":"DATETIME"},{"n":"ID","t":"INT"},{"n":"id_cat_ARTICULO_FOTO","t":"INT"},{"n":"ID_STATUS","t":"INT"},{"n":"PRIORIDAD","t":"INT"},{"n":"SECUENCIA","t":"INT"}]},"ARTICULO_PADRE_HIJO":{"m":"CI","d":"","f":[{"n":"ARTICULO_HIJO","t":"VARCHAR(20)"},{"n":"ARTICULO_PADRE","t":"VARCHAR(20)"}]},"ARTICULO_PRECIO":{"m":"CI","d":"Lista de precios: tarifas por artículo, cliente o segmento.","f":[{"n":"ARTICULO","t":"VARCHAR(20)"},{"n":"ESQUEMA_TRABAJO","t":"VARCHAR(1)"},{"n":"FECHA_FIN","t":"DATETIME"},{"n":"FECHA_INICIO","t":"DATETIME"},{"n":"FECHA_ULT_MODIF","t":"DATETIME"},{"n":"id_cat_ARTICULO_PRECIO","t":"INT"},{"n":"MARGEN_MULR","t":"DECIMAL"},{"n":"MARGEN_UTILIDAD","t":"DECIMAL"},{"n":"MARGEN_UTILIDAD_MIN","t":"DECIMAL"},{"n":"MONEDA","t":"VARCHAR(1)"},{"n":"NIVEL_PRECIO","t":"VARCHAR(12)"},{"n":"PRECIO","t":"DECIMAL"},{"n":"USUARIO_ULT_MODIF","t":"VARCHAR(50)"},{"n":"VERSION","t":"INT"},{"n":"VERSION_ARTICULO","t":"INT"}]},"ARTICULO_PROVEEDOR":{"m":"CI","d":"","f":[{"n":"ARTICULO","t":"VARCHAR(20)"},{"n":"CANT_ECONOMICA_COM","t":"DECIMAL"},{"n":"CODIGO_CATALOGO","t":"VARCHAR(30)"},{"n":"DESCRIP_CATALOGO","t":"VARCHAR(254)"},{"n":"FACTOR_CONVERSION","t":"DECIMAL"},{"n":"FECHA_ULT_COTIZACI","t":"DATETIME"},{"n":"IMPUESTO","t":"VARCHAR(4)"},{"n":"LOTE_ESTANDAR","t":"DECIMAL"},{"n":"LOTE_MINIMO","t":"DECIMAL"},{"n":"MULTIPLO_COMPRA","t":"DECIMAL"},{"n":"NOTAS","t":"TEXT"},{"n":"PAIS","t":"VARCHAR(4)"},{"n":"PESO_MINIMO_ORDEN","t":"DECIMAL"},{"n":"PLAZO_REABASTECIMI","t":"INT"},{"n":"PORC_AJUSTE_COSTO","t":"DECIMAL"},{"n":"PROVEEDOR","t":"VARCHAR(20)"},{"n":"TIPO","t":"VARCHAR(1)"},{"n":"UNIDAD_MEDIDA_COMP","t":"VARCHAR(6)"}]},"ARTICULO_PROVEEDOR_TEMPIVA":{"m":"CI","d":"","f":[{"n":"ARTICULO","t":"VARCHAR(20)"},{"n":"IMPUESTO","t":"VARCHAR(4)"},{"n":"PROVEEDOR","t":"VARCHAR(20)"},{"n":"ROWPOINTER","t":"GUID"}]},"ARTICULO_SINCRO":{"m":"CI","d":"","f":[{"n":"ARTICULO","t":"VARCHAR(20)"},{"n":"ARTICULO_CUENTA","t":"VARCHAR(4)"},{"n":"ARTICULO_DEL_PROV","t":"VARCHAR(20)"},{"n":"CLASIFICACION_1","t":"VARCHAR(4)"},{"n":"CLASIFICACION_2","t":"VARCHAR(4)"},{"n":"CLASIFICACION_3","t":"VARCHAR(4)"},{"n":"CODIGO_BARRAS_INVT","t":"VARCHAR(20)"},{"n":"CODIGO_BARRAS_VENT","t":"VARCHAR(20)"},{"n":"COSTO_FISCAL","t":"DECIMAL"},{"n":"CREADO_EN_PDA","t":"VARCHAR(1)"},{"n":"DESCRIPCION","t":"VARCHAR(254)"},{"n":"DIAS_CUARENTENA","t":"INT"},{"n":"FACTOR_EMPAQUE","t":"DECIMAL"},{"n":"FACTOR_VENTA","t":"DECIMAL"},{"n":"ID_PDA","t":"VARCHAR(15)"},{"n":"ID_SINCRO","t":"VARCHAR(15)"},{"n":"IMPUESTO","t":"VARCHAR(4)"},{"n":"MODIFICADO_EN_PDA","t":"VARCHAR(1)"},{"n":"OBLIGA_CUARENTENA","t":"VARCHAR(1)"},{"n":"PLANTILLA_SERIE","t":"VARCHAR(4)"},{"n":"PROVEEDOR","t":"VARCHAR(20)"},{"n":"UNIDAD_ALMACEN","t":"VARCHAR(6)"},{"n":"UNIDAD_EMPAQUE","t":"VARCHAR(6)"},{"n":"UNIDAD_VENTA","t":"VARCHAR(6)"},{"n":"USA_LOTES","t":"VARCHAR(1)"}]},"ARTICULO_TALLA":{"m":"CI","d":"","f":[{"n":"CODIGO_BARRAS","t":"VARCHAR(5)"},{"n":"DESCRIPCION","t":"VARCHAR(50)"},{"n":"TALLA","t":"VARCHAR(5)"}]},"ARTICULO_TEMPIVA":{"m":"CI","d":"","f":[{"n":"ARTICULO","t":"VARCHAR(20)"},{"n":"CANASTA_BASICA","t":"VARCHAR(1)"},{"n":"ES_OTRO_CARGO","t":"VARCHAR(1)"},{"n":"IMPUESTO_COMPRA","t":"VARCHAR(4)"},{"n":"IMPUESTO_VENTA","t":"VARCHAR(4)"},{"n":"NIT","t":"VARCHAR(20)"},{"n":"ROWPOINTER","t":"GUID"},{"n":"TIPO","t":"VARCHAR(1)"},{"n":"TIPO_DOC_IVA","t":"VARCHAR(2)"}]},"ASIENTO_DE_DIARIO":{"m":"CG","d":"Cabecera de asientos contables generados por módulos auxiliares o manual.","f":[{"n":"ASIENTO","t":"VARCHAR(10)"},{"n":"CLASE_ASIENTO","t":"VARCHAR(1)"},{"n":"CONTABILIDAD","t":"VARCHAR(1)"},{"n":"DEPENDENCIA","t":"VARCHAR(10)"},{"n":"DOCUMENTO_GLOBAL","t":"VARCHAR(50)"},{"n":"FECHA","t":"DATETIME"},{"n":"FECHA_CREACION","t":"DATETIME"},{"n":"FECHA_ULT_MODIF","t":"DATETIME"},{"n":"MARCADO","t":"VARCHAR(1)"},{"n":"NOTAS","t":"TEXT"},{"n":"ORIGEN","t":"VARCHAR(4)"},{"n":"PAQUETE","t":"VARCHAR(4)"},{"n":"TIPO_ASIENTO","t":"VARCHAR(4)"},{"n":"TOTAL_CONTROL_DOL","t":"DECIMAL"},{"n":"TOTAL_CONTROL_LOC","t":"DECIMAL"},{"n":"TOTAL_CREDITO_DOL","t":"DECIMAL"},{"n":"TOTAL_CREDITO_LOC","t":"DECIMAL"},{"n":"TOTAL_DEBITO_DOL","t":"DECIMAL"},{"n":"TOTAL_DEBITO_LOC","t":"DECIMAL"},{"n":"ULTIMO_USUARIO","t":"VARCHAR(50)"},{"n":"USUARIO_CREACION","t":"VARCHAR(50)"}]},"ASIENTO_DIST_LINEA":{"m":"CG","d":"Líneas de asiento contable: cuenta, debe/haber, centro costo y descripción.","f":[{"n":"ASIENTO_DISTRIBUID","t":"VARCHAR(10)"},{"n":"CENTRO_COSTO","t":"VARCHAR(25)"},{"n":"COMENTARIO","t":"VARCHAR(254)"},{"n":"CONSECUTIVO","t":"INT"},{"n":"CUENTA_CONTABLE","t":"VARCHAR(25)"},{"n":"DETALLE_FUNCION","t":"TEXT"},{"n":"FASE","t":"VARCHAR(25)"},{"n":"FUNCION","t":"VARCHAR(1)"},{"n":"INDICE_FUNCION","t":"INT"},{"n":"MONEDA_BASE","t":"VARCHAR(1)"},{"n":"MONTO_BASE","t":"DECIMAL"},{"n":"NIT","t":"VARCHAR(20)"},{"n":"PORCENTAJE","t":"DECIMAL"},{"n":"PROYECTO","t":"VARCHAR(25)"},{"n":"REFERENCIA","t":"VARCHAR(249)"},{"n":"TIPO_LINEA","t":"VARCHAR(1)"},{"n":"USA_TCAMBIO_EXT","t":"VARCHAR(1)"}]},"ASIENTO_DISTRIBUID":{"m":"CG","d":"Cabecera de asientos contables generados por módulos auxiliares o manual.","f":[{"n":"ACTIVO","t":"VARCHAR(1)"},{"n":"ASIENTO_DISTRIBUID","t":"VARCHAR(10)"},{"n":"CONTABILIDAD","t":"VARCHAR(1)"},{"n":"DESCRIPCION","t":"VARCHAR(40)"},{"n":"FCH_HORA_CREACION","t":"DATETIME"},{"n":"FCH_HORA_ULT_APLIC","t":"DATETIME"},{"n":"FCH_HORA_ULT_MODIF","t":"DATETIME"},{"n":"FUENTE","t":"VARCHAR(40)"},{"n":"MARCADO","t":"VARCHAR(1)"},{"n":"MODALIDAD_APLIC","t":"INT"},{"n":"MODO_DISTRIBUCION","t":"VARCHAR(1)"},{"n":"NOTAS","t":"TEXT"},{"n":"PAQUETE","t":"VARCHAR(4)"},{"n":"SALDO_DISTRIBUIR","t":"VARCHAR(1)"},{"n":"SECUENCIA","t":"INT"},{"n":"TIPO_ASIENTO","t":"VARCHAR(4)"},{"n":"TIPO_DISTRIBUCION","t":"VARCHAR(1)"},{"n":"USUARIO_CREACION","t":"VARCHAR(50)"},{"n":"USUARIO_ULT_APLIC","t":"VARCHAR(50)"},{"n":"USUARIO_ULT_MODIF","t":"VARCHAR(50)"}]},"ASIENTO_MARCADO":{"m":"CG","d":"Cabecera de asientos contables generados por módulos auxiliares o manual.","f":[{"n":"ASIENTO","t":"VARCHAR(10)"},{"n":"PAQUETE","t":"VARCHAR(4)"},{"n":"USUARIO","t":"VARCHAR(50)"}]},"ASIENTO_MAYORIZADO":{"m":"CG","d":"Cabecera de asientos contables generados por módulos auxiliares o manual.","f":[{"n":"ASIENTO","t":"VARCHAR(10)"},{"n":"CLASE_ASIENTO","t":"VARCHAR(1)"},{"n":"CONTABILIDAD","t":"VARCHAR(1)"},{"n":"DEPENDENCIA","t":"VARCHAR(10)"},{"n":"DOCUMENTO_GLOBAL","t":"VARCHAR(50)"},{"n":"EXPORTADO","t":"VARCHAR(1)"},{"n":"FECHA","t":"DATETIME"},{"n":"FECHA_CREACION","t":"DATETIME"},{"n":"FECHA_ULT_MODIF","t":"DATETIME"},{"n":"MAYOR_AUDITORIA","t":"INT"},{"n":"MONTO_TOTAL_DOLAR","t":"DECIMAL"},{"n":"MONTO_TOTAL_LOCAL","t":"DECIMAL"},{"n":"NOTAS","t":"TEXT"},{"n":"ORIGEN","t":"VARCHAR(4)"},{"n":"TIPO_ASIENTO","t":"VARCHAR(4)"},{"n":"TIPO_INGRESO_MAYOR","t":"VARCHAR(1)"},{"n":"ULTIMO_USUARIO","t":"VARCHAR(50)"},{"n":"USUARIO_CREACION","t":"VARCHAR(50)"}]},"asiento_mayorizado_2":{"m":"CG","d":"Cabecera de asientos contables generados por módulos auxiliares o manual.","f":[{"n":"ASIENTO","t":"VARCHAR(10)"},{"n":"CLASE_ASIENTO","t":"VARCHAR(1)"},{"n":"CONTABILIDAD","t":"VARCHAR(1)"},{"n":"DEPENDENCIA","t":"VARCHAR(10)"},{"n":"EXPORTADO","t":"VARCHAR(1)"},{"n":"FECHA","t":"DATETIME"},{"n":"FECHA_CREACION","t":"DATETIME"},{"n":"FECHA_ULT_MODIF","t":"DATETIME"},{"n":"MAYOR_AUDITORIA","t":"INT"},{"n":"MONTO_TOTAL_DOLAR","t":"DECIMAL"},{"n":"MONTO_TOTAL_LOCAL","t":"DECIMAL"},{"n":"NOTAS","t":"TEXT"},{"n":"ORIGEN","t":"VARCHAR(4)"},{"n":"TIPO_ASIENTO","t":"VARCHAR(4)"},{"n":"TIPO_INGRESO_MAYOR","t":"VARCHAR(1)"},{"n":"ULTIMO_USUARIO","t":"VARCHAR(10)"},{"n":"USUARIO_CREACION","t":"VARCHAR(10)"}]},"ASIENTO_NOM_TMP":{"m":"CG","d":"Tabla temporal de procesamiento. Datos intermedios de procesos batch.","f":[{"n":"CONCEPTO","t":"VARCHAR(20)"},{"n":"CONTABILIZACION","t":"VARCHAR(1)"},{"n":"CONTRA_CUENTA","t":"VARCHAR(25)"},{"n":"CTRCTO_CTA_CONTABLE","t":"VARCHAR(25)"},{"n":"CTRCTO_CTA_CONTRA","t":"VARCHAR(25)"},{"n":"CUENTA_CONTABLE","t":"VARCHAR(25)"},{"n":"EMPLEADO","t":"VARCHAR(20)"},{"n":"FASE","t":"VARCHAR(25)"},{"n":"NIT_ADMINISTRADORA","t":"VARCHAR(20)"},{"n":"NIT_EMPLEADO","t":"VARCHAR(20)"},{"n":"PROYECTO","t":"VARCHAR(25)"},{"n":"TOTAL","t":"DECIMAL"}]},"ASIENTO_RECU_LINEA":{"m":"CG","d":"Líneas de asiento contable: cuenta, debe/haber, centro costo y descripción.","f":[{"n":"ASIENTO_RECU_LINEA","t":"INT"},{"n":"ASIENTO_RECURRENTE","t":"VARCHAR(10)"},{"n":"CENTRO_COSTO","t":"VARCHAR(25)"},{"n":"CREDITO","t":"DECIMAL"},{"n":"CUENTA_CONTABLE","t":"VARCHAR(25)"},{"n":"DEBITO","t":"DECIMAL"},{"n":"FASE","t":"VARCHAR(25)"},{"n":"NIT","t":"VARCHAR(20)"},{"n":"PROYECTO","t":"VARCHAR(25)"},{"n":"REFERENCIA","t":"VARCHAR(249)"},{"n":"USA_TCAMBIO_EXT","t":"VARCHAR(1)"}]},"ASIENTO_RECURRENTE":{"m":"CG","d":"Cabecera de asientos contables generados por módulos auxiliares o manual.","f":[{"n":"ASIENTO_RECURRENTE","t":"VARCHAR(10)"},{"n":"CONTABILIDAD","t":"VARCHAR(1)"},{"n":"DESCRIPCION","t":"VARCHAR(40)"},{"n":"FCH_HORA_ULT_APLIC","t":"DATETIME"},{"n":"FECHA_HORA","t":"DATETIME"},{"n":"MARCADO","t":"VARCHAR(1)"},{"n":"MODALIDAD_APLIC","t":"INT"},{"n":"MONEDA","t":"VARCHAR(1)"},{"n":"NOTAS","t":"TEXT"},{"n":"PAQUETE","t":"VARCHAR(4)"},{"n":"TIPO","t":"VARCHAR(1)"},{"n":"TIPO_ASIENTO","t":"VARCHAR(4)"},{"n":"UNIDAD","t":"VARCHAR(10)"},{"n":"USUARIO","t":"VARCHAR(50)"},{"n":"USUARIO_ULT_APLIC","t":"VARCHAR(50)"}]},"ASIENTO_TEMP_FA":{"m":"CG","d":"Cabecera de asientos contables generados por módulos auxiliares o manual.","f":[{"n":"ASIENTO","t":"VARCHAR(10)"}]},"ASIENTOS_CHEQUE":{"m":"CG","d":"Cabecera de asientos contables generados por módulos auxiliares o manual.","f":[{"n":"CHEQUE_INTERNO","t":"INT"},{"n":"CONSECUTIVO","t":"INT"},{"n":"CONTABILIDAD","t":"VARCHAR(1)"},{"n":"CREDITO","t":"DECIMAL"},{"n":"CTA_CONTABLE","t":"VARCHAR(25)"},{"n":"CTR_CONTABLE","t":"VARCHAR(25)"},{"n":"DEBITO","t":"DECIMAL"},{"n":"FECHA","t":"DATETIME"},{"n":"REFERENCIA","t":"VARCHAR(249)"},{"n":"TIPO_ASIENTO","t":"VARCHAR(4)"}]},"ASIGNAR_BODEGA":{"m":"CI","d":"Catálogo de bodegas/almacenes con parámetros logísticos.","f":[{"n":"BODEGA","t":"VARCHAR(50)"},{"n":"CANTIDAD","t":"DECIMAL"},{"n":"ESTADO","t":"VARCHAR(50)"},{"n":"FECHA_MODIFICACION","t":"DATETIME"},{"n":"ID","t":"INT"},{"n":"ID_ARTICULO","t":"VARCHAR(50)"},{"n":"REFERENCIA","t":"VARCHAR(50)"},{"n":"STAMP","t":"DATETIME"},{"n":"TIPO_TRANS","t":"VARCHAR(1)"},{"n":"USUARIO","t":"VARCHAR(50)"}]},"ATRIBUTO":{"m":"","d":"","f":[{"n":"ATRIBUTO","t":"VARCHAR(20)"},{"n":"CLASE","t":"VARCHAR(1)"},{"n":"id_cat_ATRIBUTO","t":"INT"}]},"ATRIBUTO_DELETED":{"m":"","d":"","f":[{"n":"ATRIBUTO","t":"VARCHAR(20)"},{"n":"CLASE","t":"VARCHAR(1)"},{"n":"DELETEDATE","t":"DATETIME"},{"n":"ID","t":"INT"},{"n":"id_cat_ATRIBUTO","t":"INT"},{"n":"ID_STATUS","t":"INT"}]},"ATRIBUTO_VALOR":{"m":"","d":"","f":[{"n":"ATRIBUTO","t":"VARCHAR(20)"},{"n":"VALOR","t":"VARCHAR(20)"}]},"AUDIT_AJUSTES_NOMI":{"m":"","d":"Ajustes de inventario: correcciones por diferencias entre conteo y sistema.","f":[{"n":"ASIENTO","t":"VARCHAR(10)"},{"n":"CONSECUTIVO","t":"INT"},{"n":"EMPLEADO","t":"VARCHAR(20)"},{"n":"NETO_ANTERIOR","t":"DECIMAL"},{"n":"NOMINA","t":"VARCHAR(4)"},{"n":"NUMERO_NOMINA","t":"INT"},{"n":"RAZON_DEFAULT","t":"VARCHAR(4)"},{"n":"RAZON_USUARIO","t":"VARCHAR(500)"},{"n":"USUARIO_APLICA","t":"VARCHAR(25)"},{"n":"USUARIO_MODIF","t":"VARCHAR(25)"}]},"AUDIT_TRANS_INV":{"m":"","d":"","f":[{"n":"APLICACION","t":"VARCHAR(249)"},{"n":"ASIENTO","t":"VARCHAR(10)"},{"n":"AUDIT_TRANS_INV","t":"INT"},{"n":"CONSECUTIVO","t":"VARCHAR(10)"},{"n":"FECHA_HORA","t":"DATETIME"},{"n":"FECHA_HORA_APROB","t":"DATETIME"},{"n":"MODULO_ORIGEN","t":"VARCHAR(4)"},{"n":"PAQUETE_INVENTARIO","t":"VARCHAR(4)"},{"n":"REFERENCIA","t":"VARCHAR(200)"},{"n":"USUARIO","t":"VARCHAR(50)"},{"n":"USUARIO_APRO","t":"VARCHAR(50)"}]},"AUDITORIA_ARTICULOS_DESCONTINUADOS":{"m":"CI","d":"","f":[{"n":"ARTICULO","t":"VARCHAR(20)"},{"n":"CreateBy","t":"VARCHAR(30)"},{"n":"DESCRIPCION","t":"VARCHAR(1000)"},{"n":"ID","t":"INT"},{"n":"Recorddate","t":"DATETIME"}]},"AUDITORIA_DE_PROC":{"m":"","d":"","f":[{"n":"ASIENTO","t":"VARCHAR(10)"},{"n":"FECHA_HORA","t":"DATETIME"},{"n":"NOTAS","t":"TEXT"},{"n":"OPCION","t":"VARCHAR(40)"},{"n":"ORIGEN","t":"VARCHAR(4)"},{"n":"USUARIO","t":"VARCHAR(50)"}]},"AUTOR_COMPRA":{"m":"","d":"Tabla de catálogo/maestro de referencia con código y descripción.","f":[{"n":"CLASIFICACION","t":"INT"},{"n":"CODIGO","t":"VARCHAR(4)"},{"n":"DESCRIPCION","t":"VARCHAR(30)"},{"n":"FECHA_RIGE","t":"DATETIME"},{"n":"FECHA_VENCE","t":"DATETIME"},{"n":"NOTAS","t":"TEXT"},{"n":"NUM_AUTOR","t":"VARCHAR(50)"},{"n":"PORCENTAJE","t":"DECIMAL"}]},"AUTOR_VENTA":{"m":"","d":"","f":[{"n":"ARTICULO","t":"INT"},{"n":"CLIENTE","t":"VARCHAR(20)"},{"n":"CODIGO","t":"VARCHAR(4)"},{"n":"CODIGO_INSTITUCION","t":"VARCHAR(2)"},{"n":"DESCRIPCION","t":"VARCHAR(30)"},{"n":"FECHA_RIGE","t":"DATETIME"},{"n":"FECHA_VENCE","t":"DATETIME"},{"n":"INCISO","t":"INT"},{"n":"NOMBRE_INSTITUCION","t":"VARCHAR(160)"},{"n":"NOMBRE_INSTITUCION_OTRO","t":"VARCHAR(160)"},{"n":"NOTAS","t":"TEXT"},{"n":"NUM_AUTOR","t":"VARCHAR(50)"},{"n":"PORCENTAJE","t":"DECIMAL"},{"n":"TIPO_DOC","t":"VARCHAR(3)"},{"n":"TIPO_DOC_EXONERACION_OTRO","t":"VARCHAR(100)"}]},"AUXILIAR_ANTICIPO_FAC":{"m":"CP","d":"","f":[{"n":"APLICADO_IMPUESTO1","t":"DECIMAL"},{"n":"APLICADO_IMPUESTO2","t":"DECIMAL"},{"n":"DOCUMENTO_CC","t":"VARCHAR(50)"},{"n":"FACTURA","t":"VARCHAR(50)"},{"n":"MONTO_APLICADO","t":"DECIMAL"},{"n":"MONTO_DOCUMENTO","t":"DECIMAL"},{"n":"MONTO_IMPUESTO1","t":"DECIMAL"},{"n":"MONTO_IMPUESTO2","t":"DECIMAL"},{"n":"MONTO_PENDIENTE","t":"DECIMAL"},{"n":"SALDO_IMPUESTO1","t":"DECIMAL"},{"n":"SALDO_IMPUESTO2","t":"DECIMAL"},{"n":"TIPO_DOC_CC","t":"VARCHAR(3)"},{"n":"TIPO_FAC","t":"VARCHAR(1)"}]},"AUXILIAR_CC":{"m":"","d":"","f":[{"n":"ASIENTO","t":"VARCHAR(10)"},{"n":"ASIENTO_DIF_CAMB_MR","t":"VARCHAR(10)"},{"n":"CLI_DOC_CREDIT","t":"VARCHAR(20)"},{"n":"CLI_DOC_DEBITO","t":"VARCHAR(20)"},{"n":"CLI_REPORTE_CREDIT","t":"VARCHAR(20)"},{"n":"CLI_REPORTE_DEBITO","t":"VARCHAR(20)"},{"n":"CREDITO","t":"VARCHAR(50)"},{"n":"DEBITO","t":"VARCHAR(50)"},{"n":"DOC_ASOC_PERCE","t":"VARCHAR(50)"},{"n":"DOC_DOCINTCTE","t":"VARCHAR(50)"},{"n":"DOCUMENTO_DOCPPAGO","t":"VARCHAR(50)"},{"n":"ES_INT_CORRIENTE","t":"VARCHAR(1)"},{"n":"FECHA","t":"DATETIME"},{"n":"FOLIOSAT_CREDITO","t":"VARCHAR(50)"},{"n":"FOLIOSAT_DEBITO","t":"VARCHAR(50)"},{"n":"MONEDA_CREDITO","t":"VARCHAR(4)"},{"n":"MONEDA_DEBITO","t":"VARCHAR(4)"},{"n":"MONTO_CLI_CREDITO","t":"DECIMAL"},{"n":"MONTO_CLI_DEBITO","t":"DECIMAL"},{"n":"MONTO_CREDITO","t":"DECIMAL"},{"n":"MONTO_DEBITO","t":"DECIMAL"},{"n":"MONTO_DOLAR","t":"DECIMAL"},{"n":"MONTO_LOCAL","t":"DECIMAL"},{"n":"PS_AFV_CARGADO_PRODUSOFT","t":"VARCHAR(1)"},{"n":"TIPO_CAMBIO_APLICA","t":"DECIMAL"}]},"AUXILIAR_CC_BAK":{"m":"","d":"","f":[{"n":"ASIENTO","t":"VARCHAR(10)"},{"n":"CLI_DOC_CREDIT","t":"VARCHAR(20)"},{"n":"CLI_DOC_DEBITO","t":"VARCHAR(20)"},{"n":"CLI_REPORTE_CREDIT","t":"VARCHAR(20)"},{"n":"CLI_REPORTE_DEBITO","t":"VARCHAR(20)"},{"n":"CREDITO","t":"VARCHAR(12)"},{"n":"DEBITO","t":"VARCHAR(12)"},{"n":"DOCUMENTO_DOCPPAGO","t":"VARCHAR(12)"},{"n":"FECHA","t":"DATETIME"},{"n":"MONEDA_CREDITO","t":"VARCHAR(4)"},{"n":"MONEDA_DEBITO","t":"VARCHAR(4)"},{"n":"MONTO_CLI_CREDITO","t":"DECIMAL"},{"n":"MONTO_CLI_DEBITO","t":"DECIMAL"},{"n":"MONTO_CREDITO","t":"DECIMAL"},{"n":"MONTO_DEBITO","t":"DECIMAL"},{"n":"MONTO_DOLAR","t":"DECIMAL"},{"n":"MONTO_LOCAL","t":"DECIMAL"},{"n":"TIPO_CREDITO","t":"VARCHAR(3)"},{"n":"TIPO_DEBITO","t":"VARCHAR(3)"},{"n":"TIPO_DOCPPAGO","t":"VARCHAR(3)"}]},"AUXILIAR_CP":{"m":"","d":"","f":[{"n":"ASIENTO","t":"VARCHAR(10)"},{"n":"ASIENTO_DIF_CAMB_MR","t":"VARCHAR(10)"},{"n":"CODIGO_RET_PAGO","t":"VARCHAR(4)"},{"n":"CREDITO","t":"VARCHAR(50)"},{"n":"DEBITO","t":"VARCHAR(50)"},{"n":"DOC_DOCINTCTE","t":"VARCHAR(50)"},{"n":"DOCUMENTO_DOCPPAGO","t":"VARCHAR(50)"},{"n":"FECHA","t":"DATETIME"},{"n":"FOLIOSAT_CREDITO","t":"VARCHAR(50)"},{"n":"FOLIOSAT_DEBITO","t":"VARCHAR(50)"},{"n":"MONEDA_CREDITO","t":"VARCHAR(4)"},{"n":"MONEDA_DEBITO","t":"VARCHAR(4)"},{"n":"MONTO_CREDITO","t":"DECIMAL"},{"n":"MONTO_DEBITO","t":"DECIMAL"},{"n":"MONTO_DOLAR","t":"DECIMAL"},{"n":"MONTO_LOCAL","t":"DECIMAL"},{"n":"MONTO_PROV","t":"DECIMAL"},{"n":"MONTO_TOTAL_RET_PAGO","t":"DECIMAL"},{"n":"PROVEEDOR","t":"VARCHAR(20)"},{"n":"TIPO_CAMBIO_APLICA","t":"DECIMAL"},{"n":"TIPO_CREDITO","t":"VARCHAR(3)"},{"n":"TIPO_DEBITO","t":"VARCHAR(3)"},{"n":"TIPO_DOCINTCTE","t":"VARCHAR(3)"},{"n":"TIPO_DOCPPAGO","t":"VARCHAR(3)"}]},"AUXILIAR_PARC_CC":{"m":"","d":"","f":[{"n":"ASIENTO","t":"VARCHAR(10)"},{"n":"CREDITO","t":"VARCHAR(50)"},{"n":"DEBITO","t":"VARCHAR(50)"},{"n":"FECHA","t":"DATETIME"},{"n":"MONTO_AMORTIZA","t":"DECIMAL"},{"n":"MONTO_AMORTIZA_DOL","t":"DECIMAL"},{"n":"MONTO_AMORTIZA_LOC","t":"DECIMAL"},{"n":"MONTO_CLI_CREDITO","t":"DECIMAL"},{"n":"MONTO_CLI_DEBITO","t":"DECIMAL"},{"n":"MONTO_CREDITO","t":"DECIMAL"},{"n":"MONTO_CUOTA","t":"DECIMAL"},{"n":"MONTO_CUOTA_DOL","t":"DECIMAL"},{"n":"MONTO_CUOTA_LOC","t":"DECIMAL"},{"n":"MONTO_DEBITO","t":"DECIMAL"},{"n":"MONTO_DOLAR","t":"DECIMAL"},{"n":"MONTO_INTERES","t":"DECIMAL"},{"n":"MONTO_INTERES_DOL","t":"DECIMAL"},{"n":"MONTO_INTERES_LOC","t":"DECIMAL"},{"n":"MONTO_LOCAL","t":"DECIMAL"},{"n":"PARCIALIDAD","t":"INT"},{"n":"TIPO_CAMBIO_APLICA","t":"DECIMAL"},{"n":"TIPO_CREDITO","t":"VARCHAR(3)"},{"n":"TIPO_DEBITO","t":"VARCHAR(3)"}]},"AUXILIAR_PARC_CP":{"m":"","d":"","f":[{"n":"ASIENTO","t":"VARCHAR(10)"},{"n":"CREDITO","t":"VARCHAR(50)"},{"n":"DEBITO","t":"VARCHAR(50)"},{"n":"FECHA","t":"DATETIME"},{"n":"MONTO_AMORTIZA","t":"DECIMAL"},{"n":"MONTO_AMORTIZA_DOL","t":"DECIMAL"},{"n":"MONTO_AMORTIZA_LOC","t":"DECIMAL"},{"n":"MONTO_CREDITO","t":"DECIMAL"},{"n":"MONTO_CUOTA","t":"DECIMAL"},{"n":"MONTO_CUOTA_DOL","t":"DECIMAL"},{"n":"MONTO_CUOTA_LOC","t":"DECIMAL"},{"n":"MONTO_DEBITO","t":"DECIMAL"},{"n":"MONTO_DOLAR","t":"DECIMAL"},{"n":"MONTO_INTERES","t":"DECIMAL"},{"n":"MONTO_INTERES_DOL","t":"DECIMAL"},{"n":"MONTO_INTERES_LOC","t":"DECIMAL"},{"n":"MONTO_LOCAL","t":"DECIMAL"},{"n":"MONTO_PROV_CREDITO","t":"DECIMAL"},{"n":"MONTO_PROV_DEBITO","t":"DECIMAL"},{"n":"PARCIALIDAD","t":"INT"},{"n":"PROVEEDOR","t":"VARCHAR(20)"},{"n":"TIPO_CAMBIO_APLICA","t":"DECIMAL"},{"n":"TIPO_CREDITO","t":"VARCHAR(3)"},{"n":"TIPO_DEBITO","t":"VARCHAR(3)"}]},"AVISO":{"m":"","d":"","f":[{"n":"ALARMA","t":"INT"},{"n":"AVISO","t":"INT"},{"n":"FECHA_HORA","t":"DATETIME"},{"n":"TEXTO_MHT","t":"TEXT"},{"n":"VERSION_ALARMA","t":"VARCHAR(50)"}]},"AVISO_DESTINATARIO":{"m":"","d":"","f":[{"n":"AVISO","t":"INT"},{"n":"DESTINATARIO","t":"INT"},{"n":"ENVIA_CORREO","t":"VARCHAR(1)"},{"n":"ENVIA_SMS","t":"VARCHAR(1)"},{"n":"ESTADO_SMS","t":"VARCHAR(1)"}]},"AVISO_USUARIO":{"m":"","d":"Usuarios del sistema: credenciales, perfil, estado y auditoría.","f":[{"n":"AVISO","t":"INT"},{"n":"AVISO_GUARDADO","t":"VARCHAR(1)"},{"n":"ENVIA_CORREO","t":"VARCHAR(1)"},{"n":"ENVIA_SMS","t":"VARCHAR(1)"},{"n":"ESTADO","t":"VARCHAR(1)"},{"n":"ESTADO_SMS","t":"VARCHAR(1)"},{"n":"FIJO","t":"VARCHAR(1)"},{"n":"LEIDO","t":"VARCHAR(1)"},{"n":"USUARIO","t":"VARCHAR(50)"}]},"BENEFICIOS_ANTIGUE":{"m":"","d":"","f":[{"n":"DIAS_AGUINALDO","t":"DECIMAL"},{"n":"DIAS_ANTIGUEDAD","t":"DECIMAL"},{"n":"DIAS_VACACIONES","t":"DECIMAL"},{"n":"NOMINA","t":"VARCHAR(4)"},{"n":"PORC_PRIMA_VAC","t":"DECIMAL"}]},"BITACORA_DE_RECIBIDO":{"m":"","d":"","f":[{"n":"DESCRIPCION","t":"VARCHAR"},{"n":"DOCUMENTO","t":"VARCHAR(255)"},{"n":"EVENTO","t":"INT"},{"n":"REQUIERE_ATENCION","t":"VARCHAR(1)"},{"n":"TIPO","t":"VARCHAR(255)"}]},"BITACORA_FE":{"m":"","d":"","f":[{"n":"CONTRIBUYENTE","t":"VARCHAR(50)"},{"n":"DESCRIPCION","t":"VARCHAR"},{"n":"DOCUMENTO","t":"VARCHAR(255)"},{"n":"EVENTO","t":"INT"},{"n":"REQUIERE_ATENCION","t":"VARCHAR(1)"},{"n":"TIPO","t":"VARCHAR(255)"}]},"BITACORA_TRANSITOS":{"m":"","d":"","f":[{"n":"ARTICULO","t":"VARCHAR(25)"},{"n":"BODEGA","t":"VARCHAR(4)"},{"n":"FECHA","t":"DATETIME"},{"n":"TRANSITO_BODEGA","t":"DECIMAL"},{"n":"TRANSITO_CALCULADO","t":"DECIMAL"}]},"BLOQUEO_IMPRESO":{"m":"","d":"","f":[{"n":"FACTURA","t":"VARCHAR(50)"},{"n":"FECHA_HORA","t":"DATETIME"},{"n":"TIPO_DOCUMENTO","t":"VARCHAR(1)"},{"n":"USUARIO","t":"VARCHAR(50)"}]},"BOD_CARGA_MANUF":{"m":"","d":"","f":[{"n":"BODEGA","t":"VARCHAR(4)"},{"n":"MODULO","t":"VARCHAR(1)"},{"n":"UTILIZA_MANUF","t":"VARCHAR(1)"}]},"BODEGA":{"m":"CI","d":"Catálogo de bodegas/almacenes: código, nombre y tipo.","f":[{"n":"ACTIVIDAD_ECONOMICA","t":"VARCHAR(10)"},{"n":"BODEGA","t":"VARCHAR(4)"},{"n":"CODIGO_ESTABLECIMIENTO","t":"VARCHAR(7)"},{"n":"CONSEC_TRASLADOS","t":"VARCHAR(10)"},{"n":"CORREO_ELECTRONICO","t":"VARCHAR(254)"},{"n":"DIRECCION","t":"VARCHAR(120)"},{"n":"DIVISION_GEOGRAFICA1","t":"VARCHAR(12)"},{"n":"DIVISION_GEOGRAFICA2","t":"VARCHAR(12)"},{"n":"DIVISION_GEOGRAFICA3","t":"VARCHAR(12)"},{"n":"DIVISION_GEOGRAFICA4","t":"VARCHAR(12)"},{"n":"MERCADO_LIBRE","t":"VARCHAR(1)"},{"n":"NO_STOCK_NEGATIVO","t":"VARCHAR(1)"},{"n":"NOMBRE","t":"VARCHAR(40)"},{"n":"PAIS","t":"VARCHAR(4)"},{"n":"TELEFONO","t":"VARCHAR(15)"},{"n":"TIPO","t":"VARCHAR(1)"},{"n":"TIPO_ESTABLECIMIENTO","t":"VARCHAR(4)"},{"n":"TIPO_ESTABLECIMIENTO_MH","t":"VARCHAR(30)"},{"n":"U_COORDINADAS","t":"VARCHAR(30)"},{"n":"U_GRUPO_BODEGA","t":"VARCHAR(4)"},{"n":"U_SUCURSAL","t":"VARCHAR(3)"}]},"bodega_encargado":{"m":"CI","d":"Catálogo de bodegas/almacenes con parámetros logísticos.","f":[{"n":"BODEGA","t":"VARCHAR(4)"},{"n":"E_MAIL","t":"VARCHAR(250)"},{"n":"EMPLEADO","t":"VARCHAR(20)"},{"n":"ENCARGADO","t":"VARCHAR(70)"}]},"BODEGAS":{"m":"CI","d":"Catálogo de bodegas/almacenes con parámetros logísticos.","f":[{"n":"CODIGO_BODEGA","t":"VARCHAR(50)"},{"n":"ESTADO_BODEGA","t":"VARCHAR(1)"},{"n":"LOCALIZACION_BODEGA","t":"VARCHAR(50)"},{"n":"NOMBRE_BODEGA","t":"VARCHAR(50)"}]},"BOLETA":{"m":"","d":"","f":[{"n":"ADQUISICION","t":"VARCHAR(4)"},{"n":"ARTICULO","t":"VARCHAR(20)"},{"n":"BODEGA","t":"VARCHAR(4)"},{"n":"BODEGAJE","t":"VARCHAR(1)"},{"n":"BOLETA","t":"VARCHAR(14)"},{"n":"CLIENTE","t":"VARCHAR(20)"},{"n":"COBRABLE","t":"VARCHAR(1)"},{"n":"CONDICION_SERVICIO","t":"VARCHAR(5)"},{"n":"DEPARTAMENTO","t":"VARCHAR(10)"},{"n":"EMAQUILA","t":"VARCHAR(1)"},{"n":"ENTREGADO_POR","t":"VARCHAR(40)"},{"n":"ESTADO","t":"VARCHAR(2)"},{"n":"FAST_SERVICE","t":"VARCHAR(1)"},{"n":"FAX","t":"VARCHAR(15)"},{"n":"FEC_HR_DIAGNOSTICO","t":"DATETIME"},{"n":"FEC_HR_ORIGINAL","t":"DATETIME"},{"n":"FECHA_INV_EXT_PEND","t":"DATETIME"},{"n":"FECHA_INV_EXT_RECIB","t":"DATETIME"},{"n":"HORAS_COBRO","t":"INT"},{"n":"INV_EXTERNO_PEND","t":"VARCHAR(1)"},{"n":"INV_EXTERNO_RECIB","t":"VARCHAR(1)"},{"n":"KM_PERSONALES","t":"DECIMAL"},{"n":"KM_SASA","t":"DECIMAL"},{"n":"LOCALIZACION","t":"VARCHAR(8)"},{"n":"NOTAS_CLIENTE","t":"TEXT"}]},"BOLETA_ESTADO":{"m":"","d":"","f":[{"n":"BOLETA","t":"VARCHAR(14)"},{"n":"ESTADO","t":"VARCHAR(2)"},{"n":"FEC_HR_INICIO","t":"DATETIME"},{"n":"FEC_HR_ORIGINAL","t":"DATETIME"},{"n":"ORDEN_ASIGNACION","t":"INT"},{"n":"USUARIO","t":"VARCHAR(25)"},{"n":"USUARIO_MODIFICA","t":"VARCHAR(25)"}]},"BOLETA_FALLA":{"m":"","d":"","f":[{"n":"BOLETA","t":"VARCHAR(14)"},{"n":"CONFIRMADA","t":"VARCHAR(1)"},{"n":"DETALLE_FALLA","t":"VARCHAR(255)"},{"n":"FALLA","t":"VARCHAR(5)"},{"n":"SOLUCION_FALLA","t":"TEXT"},{"n":"TIPO_EQUIPO_CS","t":"VARCHAR(5)"},{"n":"USUARIO","t":"VARCHAR(25)"}]},"BOLETA_INV_FISICO":{"m":"","d":"","f":[{"n":"ARTICULO","t":"VARCHAR(20)"},{"n":"BODEGA","t":"VARCHAR(4)"},{"n":"BOLETA","t":"VARCHAR(8)"},{"n":"CANT_DISP_RESERV","t":"DECIMAL"},{"n":"CANT_NO_APROBADA","t":"DECIMAL"},{"n":"CANT_VENCIDA","t":"DECIMAL"},{"n":"FECHA_HORA","t":"DATETIME"},{"n":"LOCALIZACION","t":"VARCHAR(8)"},{"n":"LOTE","t":"VARCHAR(15)"},{"n":"SERIE_CADENA_DISP","t":"INT"},{"n":"SERIE_CADENA_NOAPR","t":"INT"},{"n":"SERIE_CADENA_VENC","t":"INT"},{"n":"USUARIO","t":"VARCHAR(50)"},{"n":"VALIDADA","t":"VARCHAR(1)"}]},"BONIF_ART_X_CLI":{"m":"","d":"","f":[{"n":"ARTICULO","t":"VARCHAR(20)"},{"n":"ARTICULO_BONIF","t":"VARCHAR(20)"},{"n":"CANTIDAD_FINAL","t":"INT"},{"n":"CANTIDAD_INICIAL","t":"INT"},{"n":"CLIENTE","t":"VARCHAR(20)"},{"n":"ESCALA_BONIF","t":"INT"},{"n":"FACTOR_BONIF","t":"DECIMAL"},{"n":"FECHA_FINAL","t":"DATETIME"},{"n":"FECHA_INICIAL","t":"DATETIME"},{"n":"UNIDADES_BONIF","t":"DECIMAL"},{"n":"VERSION_BONIF","t":"INT"}]},"BONIF_CLAS_X_CLI":{"m":"","d":"","f":[{"n":"ARTICULO_BONIF","t":"VARCHAR(20)"},{"n":"CANTIDAD_FINAL","t":"INT"},{"n":"CANTIDAD_INICIAL","t":"INT"},{"n":"CLASIFICACION","t":"VARCHAR(12)"},{"n":"CLIENTE","t":"VARCHAR(20)"},{"n":"ESCALA_BONIF","t":"INT"},{"n":"FACTOR_BONIF","t":"DECIMAL"},{"n":"FECHA_FINAL","t":"DATETIME"},{"n":"FECHA_INICIAL","t":"DATETIME"},{"n":"UNIDADES_BONIF","t":"DECIMAL"},{"n":"VERSION_BONIF","t":"INT"}]},"CAJA":{"m":"","d":"","f":[{"n":"ACTIVO_FIJO","t":"VARCHAR(10)"},{"n":"CAJA","t":"VARCHAR(10)"},{"n":"DESCRIPCION","t":"VARCHAR(250)"},{"n":"ESTADO","t":"VARCHAR(1)"},{"n":"NOTAS","t":"TEXT"}]},"CAJA_CHICA":{"m":"CH","d":"Fondos de caja chica: custodio, monto asignado y estado.","f":[{"n":"AREA_FUNCIONAL","t":"VARCHAR(10)"},{"n":"CAJA_CHICA","t":"VARCHAR(20)"},{"n":"CENTRO_COSTO","t":"VARCHAR(25)"},{"n":"CENTRO_REEMBOLSOS","t":"VARCHAR(25)"},{"n":"CUENTA_CONTABLE","t":"VARCHAR(25)"},{"n":"CUENTA_REEMBOLSOS","t":"VARCHAR(25)"},{"n":"DESCRIPCION","t":"VARCHAR(25)"},{"n":"ESTADO","t":"VARCHAR(1)"},{"n":"FCH_HORA_CREACION","t":"DATETIME"},{"n":"FCH_HORA_ULT_MODIF","t":"DATETIME"},{"n":"FECHA_INICIO","t":"DATETIME"},{"n":"LIMITE_PORCENTUAL","t":"VARCHAR(1)"},{"n":"MONEDA","t":"VARCHAR(4)"},{"n":"MONTO_CAJA","t":"DECIMAL"},{"n":"MONTO_VALE","t":"DECIMAL"},{"n":"NOTAS","t":"TEXT"},{"n":"NUM_VALES","t":"INT"},{"n":"PARTICIPA_FLUJOCAJA","t":"VARCHAR(1)"},{"n":"REINTEGRO","t":"INT"},{"n":"RESPONSABLE","t":"VARCHAR(20)"},{"n":"SALDO","t":"DECIMAL"},{"n":"ULTIMO_CONSECUTIVO","t":"VARCHAR(10)"},{"n":"USUARIO_CREACION","t":"VARCHAR(50)"},{"n":"USUARIO_ULT_MODIF","t":"VARCHAR(50)"},{"n":"VALIDAR_LIMITE","t":"VARCHAR(1)"}]},"CALC_VAC_DETALLE":{"m":"","d":"","f":[{"n":"ACCION_PERSONAL","t":"INT"},{"n":"CALCULO_VACACIONAL","t":"INT"},{"n":"CANTIDAD_CALCULADA","t":"DECIMAL"},{"n":"CANTIDAD_MODIFIC","t":"DECIMAL"},{"n":"CONSECUTIVO","t":"INT"},{"n":"CONTRIB_CALCULADA","t":"VARCHAR(1)"},{"n":"CONTRIBUCION_VAC","t":"VARCHAR(12)"},{"n":"EMPLEADO","t":"VARCHAR(20)"},{"n":"FECHA_FINAL","t":"DATETIME"},{"n":"FECHA_INICIAL","t":"DATETIME"},{"n":"FECHA_ULT_MODIF","t":"DATETIME"},{"n":"FRACCION","t":"VARCHAR(1)"},{"n":"NOTAS","t":"TEXT"},{"n":"REQUIERE_RECALCULO","t":"VARCHAR(1)"},{"n":"USUARIO_ULT_MODIF","t":"VARCHAR(50)"}]},"CALCULO_AJUSTES_NOMI":{"m":"","d":"Ajustes de inventario: correcciones por diferencias entre conteo y sistema.","f":[{"n":"CANTIDAD","t":"DECIMAL"},{"n":"CENTRO_COSTO","t":"VARCHAR(25)"},{"n":"CONCEPTO","t":"VARCHAR(20)"},{"n":"CONSECUTIVO","t":"INT"},{"n":"EMPLEADO","t":"VARCHAR(20)"},{"n":"FASE","t":"VARCHAR(25)"},{"n":"FORMA_APLICACION","t":"VARCHAR(1)"},{"n":"MONTO","t":"DECIMAL"},{"n":"NOMINA","t":"VARCHAR(4)"},{"n":"NUMERO_NOMINA","t":"INT"},{"n":"PROYECTO","t":"VARCHAR(25)"},{"n":"TIPO_REGISTRO","t":"VARCHAR(1)"},{"n":"TOTAL","t":"DECIMAL"}]},"CALCULO_VACACIONAL":{"m":"","d":"Control de vacaciones: días acumulados, tomados y pendientes.","f":[{"n":"ACCION_UNICA","t":"VARCHAR(1)"},{"n":"CALCULO_VACACIONAL","t":"INT"},{"n":"CENTRO_COSTO","t":"VARCHAR(25)"},{"n":"DEPARTAMENTO","t":"VARCHAR(10)"},{"n":"EMPLEADO","t":"VARCHAR(20)"},{"n":"ESTADO","t":"VARCHAR(1)"},{"n":"FECHA","t":"DATETIME"},{"n":"FECHA_APLICACION","t":"DATETIME"},{"n":"FECHA_APROBACION","t":"DATETIME"},{"n":"FECHA_CANCELACION","t":"DATETIME"},{"n":"FECHA_CORTE","t":"DATETIME"},{"n":"FECHA_CREACION","t":"DATETIME"},{"n":"FECHA_ULT_MODIF","t":"DATETIME"},{"n":"NOMINA","t":"VARCHAR(4)"},{"n":"NOTAS","t":"TEXT"},{"n":"PUESTO","t":"VARCHAR(8)"},{"n":"REFERENCIA","t":"VARCHAR(40)"},{"n":"REGIMEN_VACACIONAL","t":"VARCHAR(12)"},{"n":"TIPO_ACCION","t":"VARCHAR(4)"},{"n":"UBICACION","t":"VARCHAR(8)"},{"n":"USUARIO_APLICACION","t":"VARCHAR(50)"},{"n":"USUARIO_APROBACION","t":"VARCHAR(50)"},{"n":"USUARIO_CANCELAC","t":"VARCHAR(50)"},{"n":"USUARIO_CREACION","t":"VARCHAR(50)"},{"n":"USUARIO_ULT_MODIF","t":"VARCHAR(50)"}]},"CANCELACION_COTIZACIONES":{"m":"FA","d":"","f":[{"n":"DESCRIPCION","t":"VARCHAR(50)"},{"n":"RAZON","t":"VARCHAR(10)"}]},"CAR_TIPO_EQUIPO_CS":{"m":"","d":"","f":[{"n":"CAR_TIPO_EQUIPO_CS","t":"VARCHAR(5)"},{"n":"DESCRIPCION","t":"VARCHAR(40)"},{"n":"TIPO_EQUIPO_CS","t":"VARCHAR(5)"}]},"CARGOS":{"m":"CN","d":"Tabla de catálogo/maestro de referencia con código y descripción.","f":[{"n":"CODIGO","t":"VARCHAR(4)"},{"n":"DESCRIPCION","t":"VARCHAR(30)"}]},"CARTA_PORTE":{"m":"","d":"","f":[{"n":"APROBADO","t":"VARCHAR(1)"},{"n":"CAMPO1","t":"VARCHAR(50)"},{"n":"CAMPO2","t":"VARCHAR(50)"},{"n":"CAMPO3","t":"VARCHAR(50)"},{"n":"CAMPO4","t":"VARCHAR(50)"},{"n":"CAMPO5","t":"VARCHAR(50)"},{"n":"CVE_TRANSPORTE","t":"VARCHAR(50)"},{"n":"DOCUMENTO","t":"VARCHAR(50)"},{"n":"ENTRADA_SALIDA_MERC","t":"VARCHAR(10)"},{"n":"IDCCP","t":"VARCHAR(36)"},{"n":"PAIS_ORIGEN_DESTINO","t":"VARCHAR(4)"},{"n":"REGISTRO_ISTMO","t":"VARCHAR(2)"},{"n":"TIPO_DOCUMENTO","t":"VARCHAR(3)"},{"n":"TOTAL_DIST_REC","t":"DECIMAL"},{"n":"TRANSP_INTERNAC","t":"VARCHAR(2)"},{"n":"UBICACION_PDESTINO","t":"VARCHAR(2)"},{"n":"UBICACION_PORIGEN","t":"VARCHAR(2)"},{"n":"VIA_ENTRADA_SALIDA","t":"VARCHAR(50)"}]},"CARTA_PORTE_ARRENDATARIO":{"m":"","d":"","f":[{"n":"ARRENDATARIO","t":"VARCHAR(50)"},{"n":"DOMICILIO","t":"VARCHAR(50)"},{"n":"NOMBRE_ARRENDATARIO","t":"VARCHAR(254)"},{"n":"NUM_REG_IDTRIB_ARRENDATARIO","t":"VARCHAR(40)"},{"n":"RESIDENCIA_FISCAL_ARRENDATARIO","t":"VARCHAR(4)"},{"n":"RFC_ARRENDATARIO","t":"VARCHAR(20)"}]},"CARTA_PORTE_AUTO_FEDERAL":{"m":"","d":"","f":[{"n":"DOCUMENTO","t":"VARCHAR(50)"},{"n":"TIPO_DOCUMENTO","t":"VARCHAR(3)"},{"n":"VEHICULO","t":"VARCHAR(50)"}]},"CARTA_PORTE_AUTO_NAVIERO":{"m":"","d":"Tabla de catálogo/maestro de referencia con código y descripción.","f":[{"n":"CODIGO","t":"VARCHAR(50)"},{"n":"DESCRIPCION","t":"VARCHAR"}]},"CARTA_PORTE_CANT_TRANSPORTA":{"m":"","d":"","f":[{"n":"CANT_TRANSPORTA","t":"VARCHAR(50)"},{"n":"CANTIDAD","t":"DECIMAL"},{"n":"CVESTRANSPORTE","t":"VARCHAR(50)"},{"n":"DOCUMENTO","t":"VARCHAR(50)"},{"n":"ID_DESTINO","t":"VARCHAR(8)"},{"n":"ID_ORIGEN","t":"VARCHAR(8)"},{"n":"MERCANCIA","t":"VARCHAR(50)"},{"n":"TIPO_DOCUMENTO","t":"VARCHAR(3)"}]},"CARTA_PORTE_CARRO":{"m":"","d":"","f":[{"n":"CARRO","t":"VARCHAR(50)"},{"n":"GUIA_CARRO","t":"VARCHAR(15)"},{"n":"MATRICULA_CARRO","t":"VARCHAR(15)"},{"n":"TIPO_CARRO","t":"VARCHAR(50)"},{"n":"TONELADAS_NETAS_CARRO","t":"DECIMAL"}]},"CARTA_PORTE_CAT_COFEPRIS":{"m":"","d":"Tabla de catálogo/maestro de referencia con código y descripción.","f":[{"n":"CODIGO","t":"VARCHAR(2)"},{"n":"DESCRIPCION","t":"VARCHAR(40)"}]},"CARTA_PORTE_CAT_COND_TRANS":{"m":"","d":"Tabla de catálogo/maestro de referencia con código y descripción.","f":[{"n":"CODIGO","t":"VARCHAR(2)"},{"n":"DESCRIPCION","t":"VARCHAR(40)"}]},"CARTA_PORTE_CAT_CONTENEDOR":{"m":"","d":"Tabla de catálogo/maestro de referencia con código y descripción.","f":[{"n":"CODIGO","t":"VARCHAR(50)"},{"n":"DESCRIPCION","t":"VARCHAR"}]},"CARTA_PORTE_CAT_DERECHO_PASO":{"m":"","d":"","f":[{"n":"CODIGO","t":"VARCHAR(50)"},{"n":"CONCESIONARIO","t":"VARCHAR"},{"n":"DERECHO_PASO","t":"VARCHAR"},{"n":"ENTRE","t":"VARCHAR"},{"n":"HASTA","t":"VARCHAR"},{"n":"OTORGA_RECIBE","t":"VARCHAR"}]},"CARTA_PORTE_CAT_DOC_ADUANERO":{"m":"","d":"Tabla de catálogo/maestro de referencia con código y descripción.","f":[{"n":"CODIGO","t":"VARCHAR(2)"},{"n":"DESCRIPCION","t":"VARCHAR(200)"}]},"CARTA_PORTE_CAT_FARMACEUTICA":{"m":"","d":"Tabla de catálogo/maestro de referencia con código y descripción.","f":[{"n":"CODIGO","t":"VARCHAR(2)"},{"n":"DESCRIPCION","t":"VARCHAR(40)"}]},"CARTA_PORTE_CAT_POLO_ISTMO":{"m":"","d":"Tabla de catálogo/maestro de referencia con código y descripción.","f":[{"n":"CODIGO","t":"VARCHAR(2)"},{"n":"DESCRIPCION","t":"VARCHAR(40)"}]},"CARTA_PORTE_CAT_REGIMEN_AD":{"m":"","d":"Tabla de catálogo/maestro de referencia con código y descripción.","f":[{"n":"CODIGO","t":"VARCHAR(4)"},{"n":"DESCRIPCION","t":"VARCHAR(200)"}]},"CARTA_PORTE_CAT_TIPO_MATERIA":{"m":"","d":"Tabla de catálogo/maestro de referencia con código y descripción.","f":[{"n":"CODIGO","t":"VARCHAR(2)"},{"n":"DESCRIPCION","t":"VARCHAR(40)"}]},"CARTA_PORTE_CAT_TIPO_TRAFICO":{"m":"","d":"Tabla de catálogo/maestro de referencia con código y descripción.","f":[{"n":"CODIGO","t":"VARCHAR(4)"},{"n":"DESCRIPCION","t":"VARCHAR(200)"}]},"CARTA_PORTE_CAT_TRANSPORTE":{"m":"","d":"Tabla de catálogo/maestro de referencia con código y descripción.","f":[{"n":"CODIGO","t":"VARCHAR(50)"},{"n":"DESCRIPCION","t":"VARCHAR"}]},"CARTA_PORTE_CLAVE_STCC":{"m":"","d":"Tabla de catálogo/maestro de referencia con código y descripción.","f":[{"n":"CODIGO","t":"VARCHAR(50)"},{"n":"DESCRIPCION","t":"VARCHAR"}]},"CARTA_PORTE_COD_TRANS_AEREO":{"m":"","d":"Tabla de catálogo/maestro de referencia con código y descripción.","f":[{"n":"CODIGO","t":"VARCHAR(50)"},{"n":"DESCRIPCION","t":"VARCHAR"}]},"CARTA_PORTE_CONFIG_MARITIMA":{"m":"","d":"Tabla de catálogo/maestro de referencia con código y descripción.","f":[{"n":"CODIGO","t":"VARCHAR(50)"},{"n":"DESCRIPCION","t":"VARCHAR"}]},"CARTA_PORTE_CONFIG_VEHICULAR":{"m":"","d":"Tabla de catálogo/maestro de referencia con código y descripción.","f":[{"n":"CODIGO","t":"VARCHAR(50)"},{"n":"DESCRIPCION","t":"VARCHAR"}]},"CARTA_PORTE_CONT_MARITIMO":{"m":"","d":"Tabla de catálogo/maestro de referencia con código y descripción.","f":[{"n":"CODIGO","t":"VARCHAR(50)"},{"n":"DESCRIPCION","t":"VARCHAR"}]},"CARTA_PORTE_CONTE_CARRO":{"m":"","d":"","f":[{"n":"CARRO","t":"VARCHAR(50)"},{"n":"CONTE_CARRO","t":"VARCHAR(50)"},{"n":"PESO_CONTENEDOR_VACIO","t":"DECIMAL"},{"n":"PESO_NETO_MERCANCIA","t":"DECIMAL"},{"n":"TIPO_CONTENEDOR","t":"VARCHAR(50)"}]},"CARTA_PORTE_CONTENEDOR":{"m":"","d":"","f":[{"n":"CONTENEDOR","t":"VARCHAR(50)"},{"n":"DOCUMENTO","t":"VARCHAR(50)"},{"n":"FECHA_CERTIFICACIONCCP","t":"VARCHAR(50)"},{"n":"IDCCP_RELACIONADO","t":"VARCHAR(36)"},{"n":"MATRICULA_CONTENEDOR","t":"VARCHAR(15)"},{"n":"NUM_PRECINTO","t":"VARCHAR(20)"},{"n":"PLACA_VMCCP","t":"VARCHAR(20)"},{"n":"TIPO_CONTENEDOR","t":"VARCHAR(50)"},{"n":"TIPO_DOCUMENTO","t":"VARCHAR(3)"}]},"CARTA_PORTE_CVE_TRANSPORTE":{"m":"","d":"Tabla de catálogo/maestro de referencia con código y descripción.","f":[{"n":"CODIGO","t":"VARCHAR(50)"},{"n":"DESCRIPCION","t":"VARCHAR"}]},"CARTA_PORTE_DERE_PASO":{"m":"","d":"","f":[{"n":"DERE_PASO","t":"VARCHAR(50)"},{"n":"DOCUMENTO","t":"VARCHAR(50)"},{"n":"KILOMETRAJE_PAGADO","t":"DECIMAL"},{"n":"TIPO_DERECHO_DE_PASO","t":"VARCHAR(50)"},{"n":"TIPO_DOCUMENTO","t":"VARCHAR(3)"}]},"CARTA_PORTE_DESTINO":{"m":"","d":"","f":[{"n":"DOCUMENTO","t":"VARCHAR(50)"},{"n":"FECHA_HORA_PROG_LLEGADA","t":"DATETIME"},{"n":"ID_DESTINO","t":"VARCHAR(8)"},{"n":"NAVEGACION_TRAFICO","t":"VARCHAR(8)"},{"n":"NOMBRE_DESTINATARIO","t":"VARCHAR"},{"n":"NOMBRE_ESTACION","t":"VARCHAR"},{"n":"NUM_ESTACION","t":"VARCHAR(50)"},{"n":"NUM_REGID_TRIB","t":"VARCHAR(40)"},{"n":"RESIDENCIA_FISCAL","t":"VARCHAR(4)"},{"n":"RFC_DESTINATARIO","t":"VARCHAR(20)"},{"n":"TIPO_DOCUMENTO","t":"VARCHAR(3)"},{"n":"UBICACION","t":"VARCHAR(50)"}]},"CARTA_PORTE_DET_MERCANCIA":{"m":"","d":"","f":[{"n":"DET_MERCANCIA","t":"VARCHAR(50)"},{"n":"NUM_PIEZAS","t":"INT"},{"n":"PESO_BRUTO","t":"DECIMAL"},{"n":"PESO_NETO","t":"DECIMAL"},{"n":"PESO_TARA","t":"DECIMAL"},{"n":"UNIDAD_PESO","t":"VARCHAR(50)"}]},"CARTA_PORTE_DOMICILIO":{"m":"","d":"","f":[{"n":"CALLE","t":"VARCHAR(60)"},{"n":"CODIGOPOSTAL","t":"VARCHAR(60)"},{"n":"COLONIA","t":"VARCHAR(60)"},{"n":"DOMICILIO","t":"VARCHAR(50)"},{"n":"ESTADO","t":"VARCHAR(60)"},{"n":"LOCALIDAD","t":"VARCHAR(60)"},{"n":"MUNICIPIO","t":"VARCHAR(60)"},{"n":"NUMERO_EXTERIOR","t":"VARCHAR(60)"},{"n":"NUMERO_INTERIOR","t":"VARCHAR(60)"},{"n":"PAIS","t":"VARCHAR(60)"},{"n":"REFERENCIA","t":"VARCHAR(60)"}]},"CARTA_PORTE_ESTACIONES":{"m":"","d":"Tabla de catálogo/maestro de referencia con código y descripción.","f":[{"n":"CODIGO","t":"VARCHAR(50)"},{"n":"DESCRIPCION","t":"VARCHAR"}]},"CARTA_PORTE_FERRO_CARRO":{"m":"","d":"","f":[{"n":"CARRO","t":"VARCHAR(50)"},{"n":"DOCUMENTO","t":"VARCHAR(50)"},{"n":"FERRO_CARRO","t":"VARCHAR(50)"},{"n":"TIPO_DOCUMENTO","t":"VARCHAR(3)"},{"n":"TRANS_FERRO","t":"VARCHAR(50)"}]},"CARTA_PORTE_FIGURA_PARTE":{"m":"","d":"","f":[{"n":"FIGURA","t":"VARCHAR(50)"},{"n":"FIGURA_PARTE","t":"VARCHAR(50)"},{"n":"PARTE","t":"VARCHAR(50)"}]},"CARTA_PORTE_FIGURA_TRANSPORTE":{"m":"","d":"","f":[{"n":"DOCUMENTO","t":"VARCHAR(50)"},{"n":"FIGURA_TRANSPORTE","t":"VARCHAR(50)"},{"n":"OPERADOR","t":"VARCHAR(50)"},{"n":"TIPO_DOCUMENTO","t":"VARCHAR(3)"}]},"CARTA_PORTE_IDENTIFICACION":{"m":"","d":"","f":[{"n":"DESCRIP_GUIA_IDENTIFICACION","t":"VARCHAR(1000)"},{"n":"DOCUMENTO","t":"VARCHAR(50)"},{"n":"ID_GUIA","t":"VARCHAR(50)"},{"n":"MERCANCIA","t":"VARCHAR(50)"},{"n":"NUMERO_GUIA_IDENTIFICACION","t":"VARCHAR(30)"},{"n":"PESO_GUIA_IDENTIFICACION","t":"DECIMAL"},{"n":"TIPO_DOCUMENTO","t":"VARCHAR(3)"}]},"CARTA_PORTE_MATE_PELIGROSO":{"m":"","d":"Tabla de catálogo/maestro de referencia con código y descripción.","f":[{"n":"CODIGO","t":"VARCHAR(50)"},{"n":"DESCRIPCION","t":"VARCHAR"}]},"CARTA_PORTE_MERCANCIA":{"m":"","d":"","f":[{"n":"BIENES_TRANSP","t":"VARCHAR(50)"},{"n":"CANTIDAD","t":"DECIMAL"},{"n":"CLAVE_STCC","t":"VARCHAR(50)"},{"n":"CLAVE_UNIDAD","t":"VARCHAR(4)"},{"n":"CONDICIONES_ESPTRANSP","t":"VARCHAR(2)"},{"n":"CVE_MATERIAL_PELIGROSO","t":"VARCHAR(50)"},{"n":"DATOS_FABRICANTE","t":"VARCHAR(600)"},{"n":"DATOS_FORMULADOR","t":"VARCHAR(600)"},{"n":"DATOS_MAQUILADOR","t":"VARCHAR(600)"},{"n":"DENOMINACION_DISTINTIVAP","t":"VARCHAR(50)"},{"n":"DENOMINACION_GENERICAP","t":"VARCHAR(50)"},{"n":"DESCRIP_EMBALAJE","t":"VARCHAR(100)"},{"n":"DESCRIPCION","t":"VARCHAR"},{"n":"DESCRIPCION_MATERIA","t":"VARCHAR(50)"},{"n":"DET_MERCANCIA","t":"VARCHAR(50)"},{"n":"DIMENSIONES","t":"VARCHAR(20)"},{"n":"DOCUMENTO","t":"VARCHAR(50)"},{"n":"EMBALAJE","t":"VARCHAR(50)"},{"n":"FABRICANTE","t":"VARCHAR(240)"},{"n":"FECHA_CADUCIDAD","t":"VARCHAR(50)"},{"n":"FOLIO_IMPOVUCEM","t":"VARCHAR(25)"},{"n":"FORMA_FARMACEUTICA","t":"VARCHAR(2)"},{"n":"FRACCION_ARANCELARIA","t":"VARCHAR(20)"},{"n":"LOTE_MEDICAMENTO","t":"VARCHAR(10)"},{"n":"MATERIAL_PELIGROSO","t":"VARCHAR(2)"}]},"CARTA_PORTE_MERCANCIAS":{"m":"","d":"","f":[{"n":"CARGO_POR_TASACION","t":"DECIMAL"},{"n":"DOCUMENTO","t":"VARCHAR(50)"},{"n":"LOGISTICA_IRD","t":"VARCHAR(2)"},{"n":"NUM_TOTAL_MERCANCIAS","t":"INT"},{"n":"PESO_BRUTO_TOTAL","t":"DECIMAL"},{"n":"PESO_NETO_TOTAL","t":"DECIMAL"},{"n":"TIPO_DOCUMENTO","t":"VARCHAR(3)"},{"n":"UNIDAD_PESO","t":"VARCHAR(50)"}]},"CARTA_PORTE_NOTIFICADO":{"m":"","d":"","f":[{"n":"DOMICILIO","t":"VARCHAR(50)"},{"n":"NOMBRE_NOTIFICADO","t":"VARCHAR(254)"},{"n":"NOTIFICADO","t":"VARCHAR(50)"},{"n":"NUM_REG_IDTRIB_NOTIFICADO","t":"VARCHAR(40)"},{"n":"RESIDENCIA_FISCAL_NOTIFICADO","t":"VARCHAR(4)"},{"n":"RFC_NOTIFICADO","t":"VARCHAR(20)"}]},"CARTA_PORTE_OPERADOR":{"m":"","d":"","f":[{"n":"DESCRIPCION_FIGURA","t":"VARCHAR"},{"n":"DOMICILIO","t":"VARCHAR(50)"},{"n":"NOMBRE_OPERADOR","t":"VARCHAR(254)"},{"n":"NUM_LICENCIA","t":"VARCHAR(16)"},{"n":"NUM_REG_IDTRIB_OPERADOR","t":"VARCHAR(40)"},{"n":"OPERADOR","t":"VARCHAR(50)"},{"n":"RESIDENCIA_FISCAL_OPERADOR","t":"VARCHAR(4)"},{"n":"RFC_OPERADOR","t":"VARCHAR(20)"},{"n":"TIPO_FIGURA","t":"VARCHAR(50)"}]},"CARTA_PORTE_ORIGEN":{"m":"","d":"","f":[{"n":"DOCUMENTO","t":"VARCHAR(50)"},{"n":"FECHA_HORA_SALIDA","t":"DATETIME"},{"n":"ID_ORIGEN","t":"VARCHAR(8)"},{"n":"NAVEGACION_TRAFICO","t":"VARCHAR(8)"},{"n":"NOMBRE_ESTACION","t":"VARCHAR"},{"n":"NOMBRE_REMITENTE","t":"VARCHAR"},{"n":"NUM_ESTACION","t":"VARCHAR(50)"},{"n":"NUM_REGID_TRIB","t":"VARCHAR(40)"},{"n":"RESIDENCIA_FISCAL","t":"VARCHAR(4)"},{"n":"RFC_REMITENTE","t":"VARCHAR(20)"},{"n":"TIPO_DOCUMENTO","t":"VARCHAR(3)"},{"n":"UBICACION","t":"VARCHAR(50)"}]},"CARTA_PORTE_PARTE_TRANSPORTE":{"m":"","d":"Tabla de catálogo/maestro de referencia con código y descripción.","f":[{"n":"CODIGO","t":"VARCHAR(50)"},{"n":"DESCRIPCION","t":"VARCHAR"}]},"CARTA_PORTE_PEDIMENTOS":{"m":"","d":"","f":[{"n":"DOCUMENTO","t":"VARCHAR(50)"},{"n":"ID_PEDIMENTO","t":"VARCHAR(50)"},{"n":"IDENT_DOC_ADUANERO","t":"VARCHAR(150)"},{"n":"MERCANCIA","t":"VARCHAR(50)"},{"n":"PEDIMENTO","t":"VARCHAR(21)"},{"n":"RFC_IMPO","t":"VARCHAR(20)"},{"n":"TIPO_DOCUMENTO","t":"VARCHAR(3)"},{"n":"TIPO_DOCUMENTO_ADUANERO","t":"VARCHAR(2)"}]},"CARTA_PORTE_PROD_SERV":{"m":"","d":"Tabla de catálogo/maestro de referencia con código y descripción.","f":[{"n":"CODIGO","t":"VARCHAR(50)"},{"n":"DESCRIPCION","t":"VARCHAR"}]},"CARTA_PORTE_PROPIETARIO":{"m":"","d":"","f":[{"n":"DOMICILIO","t":"VARCHAR(50)"},{"n":"NOMBRE_PROPIETARIO","t":"VARCHAR(254)"},{"n":"NUM_REG_IDTRIB_PROPIETARIO","t":"VARCHAR(40)"},{"n":"PROPIETARIO","t":"VARCHAR(50)"},{"n":"RESIDENCIA_FISCAL_PROPIETARIO","t":"VARCHAR(4)"},{"n":"RFC_PROPIETARIO","t":"VARCHAR(20)"}]},"CARTA_PORTE_REGIMEN_ADUANERO":{"m":"","d":"","f":[{"n":"CAT_REGIMEN_AD","t":"VARCHAR(4)"},{"n":"DOCUMENTO","t":"VARCHAR(50)"},{"n":"REGIMEN","t":"VARCHAR(50)"},{"n":"TIPO_DOCUMENTO","t":"VARCHAR(50)"}]},"CARTA_PORTE_REMOLQUE":{"m":"","d":"","f":[{"n":"DOCUMENTO","t":"VARCHAR(50)"},{"n":"PLACA","t":"VARCHAR(10)"},{"n":"SUB_TIPO_REM","t":"VARCHAR(50)"},{"n":"TIPO_DOCUMENTO","t":"VARCHAR(3)"}]},"CARTA_PORTE_REMOLQUESCCP":{"m":"","d":"","f":[{"n":"CONTENEDOR","t":"VARCHAR(50)"},{"n":"DOCUMENTO","t":"VARCHAR(50)"},{"n":"PLACA_CCP","t":"VARCHAR(20)"},{"n":"REMOLQUE","t":"VARCHAR(50)"},{"n":"SUBTIPO_REMCCP","t":"VARCHAR(50)"},{"n":"TIPO_DOCUMENTO","t":"VARCHAR(3)"}]},"CARTA_PORTE_SUBTIPO_REM":{"m":"","d":"Tabla de catálogo/maestro de referencia con código y descripción.","f":[{"n":"CODIGO","t":"VARCHAR(50)"},{"n":"DESCRIPCION","t":"VARCHAR"}]},"CARTA_PORTE_TIPO_CARGA":{"m":"","d":"Tabla de catálogo/maestro de referencia con código y descripción.","f":[{"n":"CODIGO","t":"VARCHAR(50)"},{"n":"DESCRIPCION","t":"VARCHAR"}]},"CARTA_PORTE_TIPO_CARRO":{"m":"","d":"Tabla de catálogo/maestro de referencia con código y descripción.","f":[{"n":"CODIGO","t":"VARCHAR(50)"},{"n":"DESCRIPCION","t":"VARCHAR"}]},"CARTA_PORTE_TIPO_EMBALAJE":{"m":"","d":"Tabla de catálogo/maestro de referencia con código y descripción.","f":[{"n":"CODIGO","t":"VARCHAR(50)"},{"n":"DESCRIPCION","t":"VARCHAR"}]},"CARTA_PORTE_TIPO_ESTACION":{"m":"","d":"Tabla de catálogo/maestro de referencia con código y descripción.","f":[{"n":"CODIGO","t":"VARCHAR(50)"},{"n":"DESCRIPCION","t":"VARCHAR"}]},"CARTA_PORTE_TIPO_PERMISO":{"m":"","d":"Permisos de acceso a módulos, procesos y datos por usuario o grupo.","f":[{"n":"CODIGO","t":"VARCHAR(50)"},{"n":"DESCRIPCION","t":"VARCHAR"}]},"CARTA_PORTE_TIPO_SERVICIO":{"m":"","d":"Tabla de catálogo/maestro de referencia con código y descripción.","f":[{"n":"CODIGO","t":"VARCHAR(50)"},{"n":"DESCRIPCION","t":"VARCHAR"}]},"CARTA_PORTE_TRANS_AEREO":{"m":"","d":"","f":[{"n":"CODIGO_TRANSPORTISTA","t":"VARCHAR(50)"},{"n":"DOCUMENTO","t":"VARCHAR(50)"},{"n":"LUGAR_CONTRATO","t":"VARCHAR(120)"},{"n":"MATRICULA_AERONAVE","t":"VARCHAR(11)"},{"n":"NOMBRE_ASEG","t":"VARCHAR(50)"},{"n":"NOMBRE_EMBARCADOR","t":"VARCHAR(254)"},{"n":"NOMBRE_TRANSPORTISTA","t":"VARCHAR(254)"},{"n":"NUM_PERMISO_SCT","t":"VARCHAR(50)"},{"n":"NUM_POLIZASEGURO","t":"VARCHAR(30)"},{"n":"NUM_REGIDTRIBEMBARC","t":"VARCHAR(40)"},{"n":"NUM_REGIDTRIBTRANSPOR","t":"VARCHAR(40)"},{"n":"NUMERO_GUIA","t":"VARCHAR(15)"},{"n":"PERM_SCT","t":"VARCHAR(50)"},{"n":"RESIDENCIA_FISCAL_EMBARC","t":"VARCHAR(4)"},{"n":"RESIDENCIA_FISCAL_TRANSPOR","t":"VARCHAR(4)"},{"n":"RFC_EMBARCADOR","t":"VARCHAR(20)"},{"n":"RFC_TRANSPORTISTA","t":"VARCHAR(20)"},{"n":"TIPO_DOCUMENTO","t":"VARCHAR(3)"}]},"CARTA_PORTE_TRANS_FERRO":{"m":"","d":"","f":[{"n":"CONCESIONARIO","t":"VARCHAR(20)"},{"n":"DOCUMENTO","t":"VARCHAR(50)"},{"n":"NOMBRE_ASEG","t":"VARCHAR(50)"},{"n":"NUM_POLIZA_SEGURO","t":"VARCHAR(30)"},{"n":"TIPO_DE_SERVICIO","t":"VARCHAR(50)"},{"n":"TIPO_DOCUMENTO","t":"VARCHAR(3)"},{"n":"TIPO_TRAFICO","t":"VARCHAR(4)"},{"n":"TRANS_FERRO","t":"VARCHAR(50)"}]},"CARTA_PORTE_TRANS_MARITIMO":{"m":"","d":"","f":[{"n":"ANIO_EMBARCACION","t":"INT"},{"n":"CALADO","t":"DECIMAL"},{"n":"DOCUMENTO","t":"VARCHAR(50)"},{"n":"ESLORA","t":"DECIMAL"},{"n":"LINEA_NAVIERA","t":"VARCHAR(50)"},{"n":"MANGA","t":"DECIMAL"},{"n":"MATRICULA","t":"VARCHAR(30)"},{"n":"NACIONALIDAD_EMBARC","t":"VARCHAR(4)"},{"n":"NOMBRE_AGENTENAVIERO","t":"VARCHAR(100)"},{"n":"NOMBRE_ASEG","t":"VARCHAR(50)"},{"n":"NOMBRE_EMBARC","t":"VARCHAR(50)"},{"n":"NUM_AUTORIZACIONNAVIERO","t":"VARCHAR(50)"},{"n":"NUM_CERTITC","t":"VARCHAR(20)"},{"n":"NUM_CONOCEMBARC","t":"VARCHAR(30)"},{"n":"NUM_PERMISO_SCT","t":"VARCHAR(50)"},{"n":"NUM_POLIZA_SEGURO","t":"VARCHAR(30)"},{"n":"NUM_VIAJE","t":"VARCHAR(30)"},{"n":"NUMERO_OMI","t":"VARCHAR(10)"},{"n":"PERM_SCT","t":"VARCHAR(50)"},{"n":"PERMISO_NAVEGACION","t":"VARCHAR(19)"},{"n":"PUNTAL","t":"DECIMAL"},{"n":"TIPO_CARGA","t":"VARCHAR(50)"},{"n":"TIPO_DOCUMENTO","t":"VARCHAR(3)"},{"n":"TIPO_EMBARCACION","t":"VARCHAR(50)"},{"n":"UNIDADES_DEARQBRUTO","t":"DECIMAL"}]},"CARTA_PORTE_UBICACION":{"m":"","d":"Ubicaciones físicas dentro del almacén (rack, pasillo, nivel).","f":[{"n":"DISTANCIA_RECORRIDA","t":"DECIMAL"},{"n":"DOCUMENTO","t":"VARCHAR(50)"},{"n":"DOMICILIO","t":"VARCHAR(50)"},{"n":"FECHA_HORA_SALIDA","t":"DATETIME"},{"n":"ID_UBICACION","t":"VARCHAR(20)"},{"n":"NAVEGACION_TRAFICO","t":"VARCHAR(8)"},{"n":"NOMBRE_ESTACION","t":"VARCHAR"},{"n":"NOMBRE_REMITENTE","t":"VARCHAR"},{"n":"NUM_ESTACION","t":"VARCHAR(50)"},{"n":"NUM_REGID_TRIB","t":"VARCHAR(40)"},{"n":"RESIDENCIA_FISCAL","t":"VARCHAR(4)"},{"n":"RFC_REMITENTE","t":"VARCHAR(20)"},{"n":"TIPO_DOCUMENTO","t":"VARCHAR(3)"},{"n":"TIPO_ESTACION","t":"VARCHAR(50)"},{"n":"TIPO_UBICACION","t":"VARCHAR(10)"},{"n":"UBICACION","t":"VARCHAR(50)"}]},"CARTA_PORTE_UNIDAD_PESO":{"m":"","d":"Tabla de catálogo/maestro de referencia con código y descripción.","f":[{"n":"CODIGO","t":"VARCHAR(50)"},{"n":"DESCRIPCION","t":"VARCHAR"}]},"CARTA_PORTE_VEHICULOS":{"m":"","d":"","f":[{"n":"ANIO_MODELO_VM","t":"INT"},{"n":"ASEGURA_CARGA","t":"VARCHAR(50)"},{"n":"ASEGURA_MED_AMBIENTE","t":"VARCHAR(50)"},{"n":"ASEGURA_RESP_CIVIL","t":"VARCHAR(50)"},{"n":"CONFIG_VEHICULAR","t":"VARCHAR(50)"},{"n":"NUM_PERMISO_SCT","t":"VARCHAR(50)"},{"n":"PERM_SCT","t":"VARCHAR(50)"},{"n":"PESO_BRUTO","t":"DECIMAL"},{"n":"PLACA_VM","t":"VARCHAR(10)"},{"n":"POLIZA_CARGA","t":"VARCHAR(30)"},{"n":"POLIZA_MED_AMBIENTE","t":"VARCHAR(30)"},{"n":"POLIZA_RESP_CIVIL","t":"VARCHAR(30)"},{"n":"PRIMA_SEGURO","t":"DECIMAL"},{"n":"VEHICULO","t":"VARCHAR(50)"}]},"CAT_PUESTO_EXTERNO":{"m":"CN","d":"","f":[{"n":"CAT_PUESTO_EXTERNO","t":"VARCHAR(12)"},{"n":"DESCRIPCION","t":"VARCHAR(254)"}]},"CATALOGO_EXISTENCIA":{"m":"CI","d":"","f":[{"n":"CATALOGO_EXISTENCIA","t":"VARCHAR(4)"},{"n":"DESCRIPCION","t":"VARCHAR(254)"}]},"CATALOGO_FORMA_FARMACEUTICA":{"m":"","d":"","f":[{"n":"DESCRIPCION","t":"VARCHAR(200)"},{"n":"FORMA_FARMACEUTICA","t":"VARCHAR(25)"}]},"CATALOGO_SUIRPLUS":{"m":"","d":"","f":[{"n":"CODIGO","t":"VARCHAR(15)"},{"n":"CODIGO_SUIRPLUS","t":"VARCHAR(15)"},{"n":"DESC_SUIRPLUS","t":"VARCHAR(50)"},{"n":"TIPO","t":"VARCHAR(1)"}]},"CATALOGO_TIPO_CONTRIBUYENTE":{"m":"","d":"Tabla de catálogo/maestro de referencia con código y descripción.","f":[{"n":"CODIGO","t":"VARCHAR(2)"},{"n":"DESCRIPCION","t":"VARCHAR(255)"}]},"CATEGORIA_CLIENTE":{"m":"CC","d":"","f":[{"n":"CATEGORIA_CLIENTE","t":"VARCHAR(8)"},{"n":"CTA_AJUSTE_REDONDEO","t":"VARCHAR(25)"},{"n":"CTA_ANTICIPO_CXC","t":"VARCHAR(25)"},{"n":"CTA_COBR_COM","t":"VARCHAR(25)"},{"n":"CTA_COBR_DUDOSA","t":"VARCHAR(25)"},{"n":"CTA_CONTADO","t":"VARCHAR(25)"},{"n":"CTA_COST_LIN","t":"VARCHAR(25)"},{"n":"CTA_COST_VENT","t":"VARCHAR(25)"},{"n":"CTA_CREDITO_CXC","t":"VARCHAR(25)"},{"n":"CTA_CXC","t":"VARCHAR(25)"},{"n":"CTA_DEBITO_CXC","t":"VARCHAR(25)"},{"n":"CTA_DESC_BONIF","t":"VARCHAR(25)"},{"n":"CTA_DESC_GRAL","t":"VARCHAR(25)"},{"n":"CTA_DESC_LIN","t":"VARCHAR(25)"},{"n":"CTA_DEV_VENTAS","t":"VARCHAR(25)"},{"n":"CTA_IMP_BOLSA_CXC","t":"VARCHAR(25)"},{"n":"CTA_IMPUESTO1_CXC","t":"VARCHAR(25)"},{"n":"CTA_IMPUESTO2_CXC","t":"VARCHAR(25)"},{"n":"CTA_INT_CORRIENTE","t":"VARCHAR(25)"},{"n":"CTA_INT_MORA_CXC","t":"VARCHAR(25)"},{"n":"CTA_LXC","t":"VARCHAR(25)"},{"n":"CTA_PRONTO_PAG_CXC","t":"VARCHAR(25)"},{"n":"CTA_RECIBOS_CXC","t":"VARCHAR(25)"},{"n":"CTA_RUBRO1_CXC","t":"VARCHAR(25)"},{"n":"CTA_RUBRO2_CXC","t":"VARCHAR(25)"}]},"CATEGORIA_PROVEED":{"m":"","d":"","f":[{"n":"CATEGORIA_PROVEED","t":"VARCHAR(8)"},{"n":"CTA_ADVALOREM","t":"VARCHAR(25)"},{"n":"CTA_AJUSTE_REDONDEO","t":"VARCHAR(25)"},{"n":"CTA_ANTICIPO_CXP","t":"VARCHAR(25)"},{"n":"CTA_COMISION","t":"VARCHAR(25)"},{"n":"CTA_COMISION_CXP","t":"VARCHAR(25)"},{"n":"CTA_CREDITO_CXP","t":"VARCHAR(25)"},{"n":"CTA_CXP","t":"VARCHAR(25)"},{"n":"CTA_DEBITO_CXP","t":"VARCHAR(25)"},{"n":"CTA_GASTO_RENTA","t":"VARCHAR(25)"},{"n":"CTA_IGV_NO_DOM","t":"VARCHAR(25)"},{"n":"CTA_IMP_BOLSA_CXP","t":"VARCHAR(25)"},{"n":"CTA_IMPUESTO1_CXP","t":"VARCHAR(25)"},{"n":"CTA_IMPUESTO2_CXP","t":"VARCHAR(25)"},{"n":"CTA_LXP","t":"VARCHAR(25)"},{"n":"CTA_PENSION_AFP","t":"VARCHAR(25)"},{"n":"CTA_PENSION_ONP","t":"VARCHAR(25)"},{"n":"CTA_PRONTO_PAG_CXP","t":"VARCHAR(25)"},{"n":"CTA_RENTA","t":"VARCHAR(25)"},{"n":"CTA_RUBRO1_CXP","t":"VARCHAR(25)"},{"n":"CTA_RUBRO2_CXP","t":"VARCHAR(25)"},{"n":"CTR_ADVALOREM","t":"VARCHAR(25)"},{"n":"CTR_AJUSTE_REDONDEO","t":"VARCHAR(25)"},{"n":"CTR_ANTICIPO_CXP","t":"VARCHAR(25)"},{"n":"CTR_COMISION","t":"VARCHAR(25)"}]},"CATEGORIA_TIPO_NIT":{"m":"","d":"","f":[{"n":"CATEGORIA","t":"VARCHAR(3)"},{"n":"DESCRIPCION","t":"VARCHAR(100)"}]},"CC_DET_RETENCION_PAR":{"m":"CC","d":"Retenciones fiscales aplicadas en documentos de compra o venta.","f":[{"n":"CLIENTE","t":"VARCHAR(20)"},{"n":"CLIENTE_CAN","t":"VARCHAR(20)"},{"n":"DOC_CAN","t":"VARCHAR(50)"},{"n":"DOCUMENTO","t":"VARCHAR(50)"},{"n":"MONTO","t":"DECIMAL"},{"n":"NUM_RETEN","t":"VARCHAR(20)"},{"n":"RETENCION","t":"VARCHAR(4)"},{"n":"TIPO","t":"VARCHAR(3)"},{"n":"TIPO_CAN","t":"VARCHAR(3)"}]},"CENTRO_CONCEPTO":{"m":"","d":"","f":[{"n":"ACTIVO","t":"VARCHAR(1)"},{"n":"CENTRO_COSTO","t":"VARCHAR(25)"},{"n":"CONCEPTO","t":"VARCHAR(20)"},{"n":"CUENTA_CONTABLE","t":"VARCHAR(25)"},{"n":"CUENTA_CONTRA","t":"VARCHAR(25)"}]},"CENTRO_COSTO":{"m":"AS","d":"Centros de costo para análisis financiero multidimensional.","f":[{"n":"ACEPTA_DATOS","t":"VARCHAR(1)"},{"n":"CENTRO_COSTO","t":"VARCHAR(25)"},{"n":"DESCRIPCION","t":"VARCHAR(200)"},{"n":"TIPO","t":"VARCHAR(1)"}]},"CENTRO_CUENTA":{"m":"","d":"","f":[{"n":"CENTRO_CONSOLIDA","t":"VARCHAR(25)"},{"n":"CENTRO_COSTO","t":"VARCHAR(25)"},{"n":"CENTRO_GASTO","t":"VARCHAR(25)"},{"n":"CENTRO_POZO","t":"VARCHAR(25)"},{"n":"CUENTA_CONSOLIDA","t":"VARCHAR(25)"},{"n":"CUENTA_CONTABLE","t":"VARCHAR(25)"},{"n":"CUENTA_GASTO","t":"VARCHAR(25)"},{"n":"CUENTA_POZO","t":"VARCHAR(25)"},{"n":"ESTADO","t":"VARCHAR(1)"}]},"CENTRO_SERVICIO":{"m":"","d":"","f":[{"n":"CEDULA","t":"VARCHAR(40)"},{"n":"CLIENTE","t":"VARCHAR(20)"},{"n":"HORARIO_CS","t":"VARCHAR(5)"},{"n":"JEFE_TALLER","t":"VARCHAR(40)"},{"n":"NOTAS","t":"TEXT"},{"n":"USUARIO_CSA","t":"VARCHAR(25)"}]},"CENTRO_TRABAJO":{"m":"","d":"","f":[{"n":"ACTIVIDAD","t":"VARCHAR(7)"},{"n":"CENTRO_TRABAJO","t":"VARCHAR(12)"},{"n":"DESCRIPCION","t":"VARCHAR(40)"},{"n":"PORCENTAJE","t":"DECIMAL"}]},"CG_AUX":{"m":"CG","d":"","f":[{"n":"ASIENTO","t":"VARCHAR(10)"},{"n":"COMENTARIO","t":"TEXT"},{"n":"GUID_ORIGEN","t":"VARCHAR(48)"},{"n":"LINEA","t":"INT"},{"n":"TABLA_ORIGEN","t":"VARCHAR(30)"}]},"CG_CERTIFICADO_RET":{"m":"CG","d":"","f":[{"n":"ASIENTO","t":"VARCHAR(10)"},{"n":"BASE_DOLAR","t":"DECIMAL"},{"n":"BASE_LOCAL","t":"DECIMAL"},{"n":"CONSECUTIVO","t":"INT"},{"n":"CONTABILIDAD","t":"VARCHAR(1)"},{"n":"CREDITO_DOLAR","t":"DECIMAL"},{"n":"CREDITO_LOCAL","t":"DECIMAL"},{"n":"CUENTA_CONTABLE","t":"VARCHAR(25)"},{"n":"DEBITO_DOLAR","t":"DECIMAL"},{"n":"DEBITO_LOCAL","t":"DECIMAL"},{"n":"DESCRIPCION_CUENTA","t":"VARCHAR(60)"},{"n":"DIV_GEO1","t":"VARCHAR(12)"},{"n":"DIV_GEO2","t":"VARCHAR(12)"},{"n":"FECHA","t":"DATETIME"},{"n":"GUID","t":"VARCHAR(48)"},{"n":"NIT","t":"VARCHAR(20)"},{"n":"PAIS","t":"VARCHAR(4)"},{"n":"RAZON_SOCIAL","t":"VARCHAR(80)"},{"n":"SALDO_NORMAL","t":"VARCHAR(1)"},{"n":"UBICACION","t":"VARCHAR(40)"}]},"CHEQUE":{"m":"CB","d":"Registro de cheques emitidos: número, fecha, monto, beneficiario y estado.","f":[{"n":"CHEQUE_INTERNO","t":"INT"},{"n":"CONCEPTO","t":"TEXT"},{"n":"CONTRIBUYENTE","t":"VARCHAR(20)"},{"n":"CUENTA_BANCO","t":"VARCHAR(20)"},{"n":"DOCUMENTO_GLOBAL","t":"VARCHAR(50)"},{"n":"ESTADO_SOLICITUD","t":"VARCHAR(1)"},{"n":"FCH_HORA_CREACION","t":"DATETIME"},{"n":"FCH_HORA_MODIFIC","t":"DATETIME"},{"n":"FCH_HORA_ULT_APLIC","t":"DATETIME"},{"n":"METODO_PAGO","t":"VARCHAR(10)"},{"n":"MONTO","t":"DECIMAL"},{"n":"ORIGEN_SOLICITUD","t":"VARCHAR(40)"},{"n":"PAGADERO_A","t":"VARCHAR(150)"},{"n":"RECURRENTE","t":"VARCHAR(1)"},{"n":"REFERENCIA","t":"VARCHAR(249)"},{"n":"RESPONSABLE_SOLICI","t":"VARCHAR(100)"},{"n":"SELECCIONADO","t":"VARCHAR(1)"},{"n":"SUBTIPO","t":"INT"},{"n":"TIPO","t":"VARCHAR(3)"},{"n":"USUARIO_CREACION","t":"VARCHAR(50)"},{"n":"USUARIO_MODIFIC","t":"VARCHAR(50)"},{"n":"USUARIO_ULT_APLIC","t":"VARCHAR(50)"}]},"CIERRE_COMPRA_MF":{"m":"","d":"","f":[{"n":"ACTIVIDAD_COMERCIAL","t":"VARCHAR(10)"},{"n":"ANNO","t":"INT"},{"n":"DESC_TIPO_PROVEEDOR","t":"VARCHAR(150)"},{"n":"DOCUMENTO","t":"VARCHAR(50)"},{"n":"FECHA_DOCUMENTO","t":"DATETIME"},{"n":"IVA_ACREDITABLE_1","t":"DECIMAL"},{"n":"IVA_ACREDITABLE_13","t":"DECIMAL"},{"n":"IVA_ACREDITABLE_2","t":"DECIMAL"},{"n":"IVA_ACREDITABLE_4","t":"DECIMAL"},{"n":"IVA_ACREDITABLE_8","t":"DECIMAL"},{"n":"IVA_ACREDITABLE_REAL_1","t":"DECIMAL"},{"n":"IVA_ACREDITABLE_REAL_13","t":"DECIMAL"},{"n":"IVA_ACREDITABLE_REAL_2","t":"DECIMAL"},{"n":"IVA_ACREDITABLE_REAL_4","t":"DECIMAL"},{"n":"IVA_ACREDITABLE_REAL_8","t":"DECIMAL"},{"n":"IVA_PAGADO_1","t":"DECIMAL"},{"n":"IVA_PAGADO_13","t":"DECIMAL"},{"n":"IVA_PAGADO_2","t":"DECIMAL"},{"n":"IVA_PAGADO_4","t":"DECIMAL"},{"n":"IVA_PAGADO_8","t":"DECIMAL"},{"n":"MES","t":"VARCHAR(20)"},{"n":"MONEDA","t":"VARCHAR(4)"},{"n":"MONTO","t":"DECIMAL"},{"n":"MONTO_DOLAR","t":"DECIMAL"},{"n":"MONTO_IVA_CREDITO_DIRECTO","t":"DECIMAL"}]},"CIERRE_MF":{"m":"","d":"","f":[{"n":"ANNO","t":"INT"},{"n":"ASIENTO","t":"VARCHAR(20)"},{"n":"COMPRA","t":"DECIMAL"},{"n":"ESTADO","t":"VARCHAR(20)"},{"n":"IVA_ACREDITABLE","t":"DECIMAL"},{"n":"IVA_COMPRA","t":"DECIMAL"},{"n":"IVA_VENTA","t":"DECIMAL"},{"n":"IVA_X_COBRAR","t":"DECIMAL"},{"n":"IVA_X_PAGAR","t":"DECIMAL"},{"n":"MES","t":"VARCHAR(20)"},{"n":"PROPORCIONALIDA_1","t":"DECIMAL"},{"n":"PROPORCIONALIDA_13","t":"DECIMAL"},{"n":"PROPORCIONALIDA_2","t":"DECIMAL"},{"n":"PROPORCIONALIDA_4","t":"DECIMAL"},{"n":"PROPORCIONALIDA_8","t":"DECIMAL"},{"n":"PROPORCIONALIDA_REAL_1","t":"DECIMAL"},{"n":"PROPORCIONALIDA_REAL_13","t":"DECIMAL"},{"n":"PROPORCIONALIDA_REAL_2","t":"DECIMAL"},{"n":"PROPORCIONALIDA_REAL_4","t":"DECIMAL"},{"n":"PROPORCIONALIDA_REAL_8","t":"DECIMAL"},{"n":"VENTA","t":"DECIMAL"}]},"CIERRE_VENTA_MF":{"m":"","d":"","f":[{"n":"ACTIVIDAD_COMERCIAL","t":"VARCHAR(10)"},{"n":"ANNO","t":"INT"},{"n":"ANULADO","t":"VARCHAR(1)"},{"n":"CLASE_DOCUMENTO","t":"VARCHAR(50)"},{"n":"CLIENTE","t":"VARCHAR(20)"},{"n":"CREDITO_CANASTA_BASICA","t":"DECIMAL"},{"n":"CREDITO_PLENO_13","t":"DECIMAL"},{"n":"CREDITO_REDUCIDO_2","t":"DECIMAL"},{"n":"CREDITO_REDUCIDO_4","t":"DECIMAL"},{"n":"CREDITO_REDUCIDO_8","t":"DECIMAL"},{"n":"DESC_TIPO_CLIENTE","t":"VARCHAR(150)"},{"n":"DOCUMENTO","t":"VARCHAR(50)"},{"n":"EXENTO_CON_DERECHO","t":"DECIMAL"},{"n":"EXENTO_SIN_DERECHO","t":"DECIMAL"},{"n":"FECHA","t":"DATETIME"},{"n":"IMPUESTO_1","t":"DECIMAL"},{"n":"IMPUESTO_13","t":"DECIMAL"},{"n":"IMPUESTO_2","t":"DECIMAL"},{"n":"IMPUESTO_4","t":"DECIMAL"},{"n":"IMPUESTO_8","t":"DECIMAL"},{"n":"MES","t":"VARCHAR(20)"},{"n":"MODULO","t":"VARCHAR(100)"},{"n":"MONEDA","t":"VARCHAR(4)"},{"n":"NOMBRE","t":"VARCHAR(150)"},{"n":"PAIS","t":"VARCHAR(4)"}]},"CLASE_DOC_ES":{"m":"","d":"Tabla de catálogo/maestro de referencia con código y descripción.","f":[{"n":"CODIGO","t":"VARCHAR(3)"},{"n":"DESCRIPCION","t":"VARCHAR(50)"}]},"CLASE_SEGURO":{"m":"","d":"","f":[{"n":"CLASE_SEGURO","t":"VARCHAR(4)"},{"n":"DESCRIPCION","t":"VARCHAR(40)"}]},"CLASIF_BIENES_SERV_ADQ":{"m":"","d":"","f":[{"n":"CLASIFICACION","t":"VARCHAR(4)"},{"n":"DESCRIPCION","t":"VARCHAR(254)"}]},"CLASIFIC_ADI_ARTICULO":{"m":"CI","d":"","f":[{"n":"ARTICULO","t":"VARCHAR(20)"},{"n":"CLASIFICACION","t":"VARCHAR(12)"},{"n":"VALOR","t":"VARCHAR(12)"}]},"CLASIFICACION":{"m":"CI","d":"","f":[{"n":"AGRUPACION","t":"INT"},{"n":"APORTE_CODIGO","t":"VARCHAR(5)"},{"n":"CLASIFICACION","t":"VARCHAR(12)"},{"n":"DESCRIPCION","t":"VARCHAR(40)"},{"n":"id_cat_CLASIFICACION","t":"INT"},{"n":"PLANTILLA_SERIE","t":"VARCHAR(4)"},{"n":"TIPO_CODIGO_BARRAS","t":"VARCHAR(1)"},{"n":"UNIDAD_MEDIDA","t":"VARCHAR(6)"},{"n":"USA_NUMEROS_SERIE","t":"VARCHAR(1)"}]},"CLASIFICACION_ADI":{"m":"CI","d":"","f":[{"n":"CLASIFICACION","t":"VARCHAR(12)"},{"n":"DESCRIPCION","t":"VARCHAR(70)"},{"n":"POSICION","t":"INT"}]},"CLASIFICACION_ADI_VALOR":{"m":"CI","d":"","f":[{"n":"CLASIFICACION","t":"VARCHAR(12)"},{"n":"DESCRIPCION","t":"VARCHAR(254)"},{"n":"VALOR","t":"VARCHAR(12)"}]},"CLASIFICACION_COMPRA":{"m":"CI","d":"","f":[{"n":"CODIGO","t":"VARCHAR(4)"},{"n":"CODIGO_CLASIFICACION","t":"VARCHAR(12)"}]},"CLASIFICACION_VENTA":{"m":"CI","d":"","f":[{"n":"CODIGO","t":"VARCHAR(4)"},{"n":"CODIGO_ARTICULO","t":"VARCHAR(20)"}]},"ClassNotes":{"m":"AS","d":"","f":[{"n":"ClassNoteToken","t":"DECIMAL"},{"n":"NoteHeaderToken","t":"DECIMAL"},{"n":"NoteType","t":"INT"},{"n":"SystemNoteToken","t":"DECIMAL"},{"n":"UserNoteToken","t":"DECIMAL"}]},"CLIENTE":{"m":"CC","d":"Maestro de clientes. Datos generales, condición de pago, límite crédito, categoría, país y vendedor asignado.","f":[{"n":"ACEPTA_BACKORDER","t":"VARCHAR(1)"},{"n":"ACEPTA_DOC_EDI","t":"VARCHAR(1)"},{"n":"ACEPTA_DOC_ELECTRONICO","t":"VARCHAR(1)"},{"n":"ACEPTA_FRACCIONES","t":"VARCHAR(1)"},{"n":"ACTIVO","t":"VARCHAR(1)"},{"n":"AFECTACION_IVA","t":"VARCHAR(2)"},{"n":"AJUSTE_FECHA_COBRO","t":"VARCHAR(1)"},{"n":"ALIAS","t":"VARCHAR(150)"},{"n":"API_RECEPCION_DE","t":"VARCHAR(254)"},{"n":"APLICAC_ABIERTAS","t":"VARCHAR(1)"},{"n":"ASOCOBLIGCONTFACT","t":"VARCHAR(1)"},{"n":"AUTO_DETRACCION","t":"VARCHAR(1)"},{"n":"BANCO_NACION","t":"VARCHAR(240)"},{"n":"CARGO","t":"VARCHAR(30)"},{"n":"CATEGORIA_CLIENTE","t":"VARCHAR(8)"},{"n":"CLASE_ABC","t":"VARCHAR(1)"},{"n":"CLASE_DOCUMENTO","t":"VARCHAR(1)"},{"n":"CLI_CORPORAC_ASOC","t":"VARCHAR(20)"},{"n":"CLIENTE","t":"VARCHAR(20)"},{"n":"COBRADOR","t":"VARCHAR(4)"},{"n":"COBRO_JUDICIAL","t":"VARCHAR(1)"},{"n":"CODIGO_IMPUESTO","t":"VARCHAR(4)"},{"n":"CONDICION_PAGO","t":"VARCHAR(4)"},{"n":"CONFIRMA_DOC_ELECTRONICO","t":"VARCHAR(1)"},{"n":"CONTACTO","t":"VARCHAR(30)"}]},"CLIENTE_PROV_BOD":{"m":"CC","d":"","f":[{"n":"BODEGA","t":"VARCHAR(4)"},{"n":"CLIENTE","t":"VARCHAR(20)"},{"n":"PROVEEDOR","t":"VARCHAR(20)"}]},"CLIENTE_RETENCION":{"m":"CC","d":"Retenciones fiscales aplicadas en documentos de compra o venta.","f":[{"n":"CLIENTE","t":"VARCHAR(20)"},{"n":"CODIGO_RETENCION","t":"VARCHAR(4)"},{"n":"NOTAS","t":"TEXT"}]},"CLIENTE_TEMPIVA":{"m":"CC","d":"","f":[{"n":"AFECTACION_IVA","t":"VARCHAR(2)"},{"n":"CLIENTE","t":"VARCHAR(20)"},{"n":"CODIGO_IMPUESTO","t":"VARCHAR(4)"},{"n":"PORC_TARIFA","t":"DECIMAL"},{"n":"ROWPOINTER","t":"GUID"},{"n":"TIPIFICACION_CLIENTE","t":"VARCHAR(2)"},{"n":"TIPO_IMPUESTO","t":"VARCHAR(5)"},{"n":"TIPO_TARIFA","t":"VARCHAR(2)"}]},"CLIENTE_VENDEDOR":{"m":"CC","d":"Catálogo de vendedores/agentes comerciales con sus metas y parámetros.","f":[{"n":"CLIENTE","t":"VARCHAR(20)"},{"n":"id_cat_CLIENTE_VENDEDOR","t":"INT"},{"n":"VENDEDOR","t":"VARCHAR(4)"}]},"COBRADOR":{"m":"CC","d":"","f":[{"n":"ACTIVO","t":"VARCHAR(1)"},{"n":"COBRADOR","t":"VARCHAR(4)"},{"n":"COMISION","t":"DECIMAL"},{"n":"CTA_COMISION","t":"VARCHAR(25)"},{"n":"CTR_COMISION","t":"VARCHAR(25)"},{"n":"E_MAIL","t":"VARCHAR(249)"},{"n":"EMPLEADO","t":"VARCHAR(20)"},{"n":"NOMBRE","t":"VARCHAR(40)"}]},"COD_INGRESO":{"m":"","d":"Tabla de catálogo/maestro de referencia con código y descripción.","f":[{"n":"COD_INGRESO","t":"VARCHAR(4)"},{"n":"DESCRIPCION","t":"VARCHAR(200)"},{"n":"GRAVADO","t":"VARCHAR(1)"}]},"COD_OBSERVA_ISSS":{"m":"","d":"Tabla de catálogo/maestro de referencia con código y descripción.","f":[{"n":"ACCION_PERSONAL","t":"VARCHAR(4)"},{"n":"CODIGO","t":"VARCHAR(2)"},{"n":"CONCEPTO","t":"VARCHAR(20)"},{"n":"DESCRIPCION","t":"VARCHAR(250)"},{"n":"PRIORIDAD","t":"INT"}]},"CODIGO_ARANCEL":{"m":"CO","d":"","f":[{"n":"CODIGO_ARANCEL","t":"VARCHAR(15)"},{"n":"DESCRIPCION","t":"VARCHAR(50)"},{"n":"NOTAS","t":"TEXT"}]},"CODIGO_HACIENDA":{"m":"","d":"Tabla de catálogo/maestro de referencia con código y descripción.","f":[{"n":"CODIGO","t":"VARCHAR(50)"},{"n":"DESCRIPCION","t":"VARCHAR"},{"n":"IMPUESTO","t":"VARCHAR(4)"},{"n":"PAIS","t":"VARCHAR(20)"}]},"CODIGO_POSTAL":{"m":"","d":"","f":[{"n":"CODIGO_POSTAL","t":"VARCHAR(6)"},{"n":"DESCRIPCION","t":"VARCHAR(50)"}]},"CODIGOS_MODIFICACION":{"m":"","d":"Tabla de catálogo/maestro de referencia con código y descripción.","f":[{"n":"CODIGO","t":"VARCHAR(2)"},{"n":"DESCRIPCION","t":"VARCHAR(249)"}]},"CODING_CARTA_RENTA":{"m":"","d":"","f":[{"n":"COD_INGRESO","t":"VARCHAR(4)"},{"n":"CONCEPTO","t":"VARCHAR(4000)"},{"n":"RUBRO","t":"VARCHAR(40)"}]},"COLA_IMPRESION":{"m":"","d":"","f":[{"n":"CLIENTE_PROVEEDOR","t":"VARCHAR(20)"},{"n":"CONTRIBUYENTE","t":"VARCHAR(20)"},{"n":"MODULO","t":"VARCHAR(3)"},{"n":"NUMERO_DOCUMENTO","t":"VARCHAR(50)"},{"n":"TIPO_DOCUMENTO","t":"VARCHAR(3)"}]},"COMPLEMENTO_RETENCION":{"m":"","d":"Retenciones fiscales aplicadas en documentos de compra o venta.","f":[{"n":"APROBADO","t":"VARCHAR(2)"},{"n":"CONCEPTO_PAGO","t":"VARCHAR(2)"},{"n":"CURP","t":"VARCHAR(18)"},{"n":"DESCRIPCION_CONCEPTO","t":"VARCHAR(255)"},{"n":"DOCUMENTO","t":"VARCHAR(50)"},{"n":"ES_BENEFICIARIO","t":"VARCHAR(2)"},{"n":"PAIS","t":"VARCHAR(4)"},{"n":"RFC","t":"VARCHAR(20)"},{"n":"TIPO_DOCUMENTO","t":"VARCHAR(3)"}]},"COMPLEMENTO_SUNAT":{"m":"","d":"","f":[{"n":"AEROPUERTO","t":"VARCHAR(10)"},{"n":"APROBADO","t":"VARCHAR(1)"},{"n":"CONDUCTOR","t":"VARCHAR(50)"},{"n":"CONSECUTIVO","t":"VARCHAR(10)"},{"n":"DESCRIPCION_MOTIVO_TRASLADO","t":"VARCHAR(100)"},{"n":"DIRECCION_PUNTO_LLEGADA","t":"TEXT"},{"n":"DIRECCION_PUNTO_PARTIDA","t":"TEXT"},{"n":"FECHA_ENTREGA_BIENES","t":"VARCHAR(10)"},{"n":"FECHA_INICIO_TRASLADO","t":"VARCHAR(10)"},{"n":"INDICADOR_ENVASE_VACIO","t":"VARCHAR(1)"},{"n":"INDICADOR_TRANSBORDO","t":"VARCHAR(1)"},{"n":"INDICADOR_TRASLADO","t":"VARCHAR(1)"},{"n":"INDICADOR_TRASLADO_TOTAL","t":"VARCHAR(1)"},{"n":"INDICADOR_VEHICULO_CONDUCTORES","t":"VARCHAR(1)"},{"n":"INDICADOR_VEHICULO_VACIO","t":"VARCHAR(1)"},{"n":"MODALIDAD_TRANSPORTE","t":"VARCHAR(2)"},{"n":"MOTIVO_TRASLADO","t":"VARCHAR(2)"},{"n":"NUMERO_BULTOS","t":"DECIMAL"},{"n":"NUMERO_CONTENEDOR1","t":"VARCHAR(50)"},{"n":"NUMERO_CONTENEDOR2","t":"VARCHAR(50)"},{"n":"NUMERO_DOCUMENTO","t":"VARCHAR(50)"},{"n":"NUMERO_DOCUMENTO_INTERNO","t":"VARCHAR(50)"},{"n":"NUMERO_DOCUMENTO_RELACIONADO","t":"VARCHAR(50)"},{"n":"NUMERO_PRECINTO1","t":"VARCHAR(50)"},{"n":"NUMERO_PRECINTO2","t":"VARCHAR(50)"}]},"CONC_FORM_CONCEPTO":{"m":"","d":"","f":[{"n":"CONCEPTO","t":"VARCHAR(20)"},{"n":"CONCEPTO_USA","t":"VARCHAR(20)"},{"n":"SECUENCIA","t":"INT"}]},"CONC_FORM_RUBRO":{"m":"","d":"","f":[{"n":"CONCEPTO","t":"VARCHAR(20)"},{"n":"RUBRO","t":"VARCHAR(17)"},{"n":"SECUENCIA","t":"INT"}]},"CONCEPTO":{"m":"","d":"","f":[{"n":"ALIAS","t":"VARCHAR(15)"},{"n":"CALCULO_POR_DLL","t":"VARCHAR(1)"},{"n":"CALCULO_SPD","t":"VARCHAR(1)"},{"n":"CANT_EDITABLE","t":"VARCHAR(1)"},{"n":"CARGA_HORAS","t":"VARCHAR(1)"},{"n":"CARGA_POR_DLL","t":"VARCHAR(1)"},{"n":"CLIENTE","t":"VARCHAR(20)"},{"n":"CODIGO_ANEXO","t":"VARCHAR(20)"},{"n":"CONCEPTO","t":"VARCHAR(20)"},{"n":"CONTABILIZACION","t":"VARCHAR(1)"},{"n":"DESCRIPCION","t":"VARCHAR(40)"},{"n":"DIAS_PERIODO","t":"INT"},{"n":"DISTRIBUYE_CENTROS","t":"VARCHAR(1)"},{"n":"ELIMINAR_CONC_CERO","t":"VARCHAR(1)"},{"n":"EXCLUYENTE","t":"VARCHAR(1)"},{"n":"FACTOR_REDONDEO","t":"DECIMAL"},{"n":"FIJO","t":"VARCHAR(1)"},{"n":"FORMULA_DEFINIDA","t":"VARCHAR(1)"},{"n":"FUNCION_INTERFAZ","t":"VARCHAR(40)"},{"n":"IMPRIMIR_ACUMULADO","t":"VARCHAR(1)"},{"n":"IMPRIMIR_COMP_PAGO","t":"VARCHAR(1)"},{"n":"IMPRIMIR_COND_PAGO","t":"VARCHAR(1)"},{"n":"INCLUIR_DOC_RH","t":"VARCHAR(1)"},{"n":"LIQUIDABLE","t":"VARCHAR(1)"},{"n":"MAX_NIVEL","t":"INT"}]},"CONCEPTO_FORMULA":{"m":"","d":"","f":[{"n":"CANTIDAD","t":"DECIMAL"},{"n":"CONCEPTO","t":"VARCHAR(20)"},{"n":"FORMULA","t":"TEXT"},{"n":"MONTO","t":"DECIMAL"},{"n":"NIVEL_FORMULA","t":"INT"},{"n":"SECUENCIA","t":"INT"},{"n":"USA_CANTIDAD","t":"VARCHAR(1)"},{"n":"USA_MONTO","t":"VARCHAR(1)"},{"n":"VALOR_FINAL","t":"DECIMAL"},{"n":"VALOR_INICIAL","t":"DECIMAL"}]},"CONCEPTO_LIQUIDAC":{"m":"","d":"","f":[{"n":"CONCEPTO","t":"VARCHAR(20)"},{"n":"CUENTA_BANCARIA","t":"VARCHAR(20)"},{"n":"DOCS_POR_GENERAR","t":"VARCHAR(1)"},{"n":"DOCS_POR_IMPRIMIR","t":"VARCHAR(1)"},{"n":"FECHA_HORA","t":"DATETIME"},{"n":"FECHA_LIQUIDAC","t":"DATETIME"},{"n":"MONEDA","t":"VARCHAR(4)"},{"n":"NOTAS","t":"TEXT"},{"n":"NUMERO_LIQUIDAC","t":"INT"},{"n":"PDO_FINAL","t":"DATETIME"},{"n":"SUBTIPODOC_CHEQUE","t":"INT"},{"n":"SUBTIPODOC_TEF","t":"INT"},{"n":"USUARIO","t":"VARCHAR(50)"}]},"CONCEPTO_PUESTO":{"m":"CN","d":"","f":[{"n":"CONCEPTO","t":"VARCHAR(20)"},{"n":"PUESTO","t":"VARCHAR(8)"}]},"CONCEPTO_USUARIO":{"m":"","d":"Usuarios del sistema: credenciales, perfil, estado y auditoría.","f":[{"n":"CONCEPTO","t":"VARCHAR(20)"},{"n":"NOMINA","t":"VARCHAR(4)"},{"n":"PRIVILEGIO","t":"VARCHAR(1)"},{"n":"USUARIO","t":"VARCHAR(50)"}]},"CONCILIACION":{"m":"CB","d":"Proceso de conciliación bancaria. Cruces entre movimientos del banco y sistema.","f":[{"n":"CONCILIACION","t":"INT"},{"n":"CREDITOS_ACLARA_CB","t":"DECIMAL"},{"n":"CREDITOS_ACLARA_EF","t":"DECIMAL"},{"n":"CREDITOS_ACLARAR","t":"DECIMAL"},{"n":"CREDITOS_AJUSTES","t":"DECIMAL"},{"n":"CREDITOS_CON_AJUST","t":"DECIMAL"},{"n":"CREDITOS_CONCIL","t":"DECIMAL"},{"n":"CREDITOS_LIQUIDAR","t":"DECIMAL"},{"n":"CREDITOS_SIN_DIF","t":"DECIMAL"},{"n":"CREDITOS_TRANSITO","t":"DECIMAL"},{"n":"CUENTA_BANCO","t":"VARCHAR(20)"},{"n":"DEBITOS_ACLARA_CB","t":"DECIMAL"},{"n":"DEBITOS_ACLARA_EF","t":"DECIMAL"},{"n":"DEBITOS_ACLARAR","t":"DECIMAL"},{"n":"DEBITOS_AJUSTES","t":"DECIMAL"},{"n":"DEBITOS_CON_AJUST","t":"DECIMAL"},{"n":"DEBITOS_CONCIL","t":"DECIMAL"},{"n":"DEBITOS_LIQUIDAR","t":"DECIMAL"},{"n":"DEBITOS_SIN_DIF","t":"DECIMAL"},{"n":"DEBITOS_TRANSITO","t":"DECIMAL"},{"n":"ESTADO","t":"VARCHAR(1)"},{"n":"FCH_HORA_APROBAC","t":"DATETIME"},{"n":"FCH_HORA_CREACION","t":"DATETIME"},{"n":"FCH_HORA_MODIFIC","t":"DATETIME"},{"n":"FECHA_FINAL","t":"DATETIME"}]},"CONDICION_PAGO":{"m":"AS","d":"Condiciones de pago: código, días neto, parcialidades y descuento contado.","f":[{"n":"CONDICION_OPERAC_ES","t":"VARCHAR(4)"},{"n":"CONDICION_PAGO","t":"VARCHAR(4)"},{"n":"CONDICION_VENTA","t":"VARCHAR(2)"},{"n":"CONDICION_VENTA_OTRO","t":"VARCHAR(100)"},{"n":"DESCRIPCION","t":"VARCHAR(40)"},{"n":"DESCUENTO_CONTADO","t":"FLOAT"},{"n":"DIAS_NETO","t":"INT"},{"n":"PAGOS_PARCIALES","t":"VARCHAR(1)"},{"n":"PLAZO_CONDPAGO","t":"INT"},{"n":"PLAZO_ES","t":"VARCHAR(4)"},{"n":"PS_AFV_ID_CONDICION_PAGO","t":"INT"},{"n":"TIPO_CONDPAGO","t":"VARCHAR(2)"},{"n":"TIPO_DIFERIDO","t":"VARCHAR(4)"},{"n":"U_FORMA_PAGO","t":"VARCHAR(100)"},{"n":"U_METODO_PAGO","t":"VARCHAR(100)"},{"n":"U_PLAZO_PAGO","t":"VARCHAR(4)"},{"n":"USA_DIFERIDO","t":"VARCHAR(1)"}]},"CONDICION_PAGO_TEMPIVA":{"m":"AS","d":"","f":[{"n":"CONDICION_PAGO","t":"VARCHAR(4)"},{"n":"CONDICION_VENTA","t":"VARCHAR(2)"},{"n":"DIAS_NETO","t":"INT"},{"n":"ROWPOINTER","t":"GUID"}]},"CONDICION_SERVICIO":{"m":"","d":"","f":[{"n":"CONDICION_SERVICIO","t":"VARCHAR(5)"},{"n":"DESCRIPCION","t":"VARCHAR(40)"}]},"CONDUCTOR":{"m":"","d":"","f":[{"n":"APELLIDOS","t":"VARCHAR(70)"},{"n":"CODIGO","t":"VARCHAR(50)"},{"n":"DOCUMENTO_IDENTIDAD","t":"VARCHAR(20)"},{"n":"NOMBRES","t":"VARCHAR(70)"},{"n":"NUMERO_LICENCIA","t":"VARCHAR(100)"},{"n":"TIPO_DOCUMENTO_IDENTIDAD","t":"VARCHAR(25)"}]},"CONFIG_CLIENTE":{"m":"CC","d":"","f":[{"n":"CAMPO","t":"VARCHAR(30)"},{"n":"ORDEN","t":"INT"},{"n":"VISIBLE","t":"VARCHAR(1)"}]},"CONFIG_ENVIOS":{"m":"","d":"","f":[{"n":"CODIGO","t":"VARCHAR(50)"},{"n":"CONFIRM_PWD_SMTP","t":"VARCHAR(254)"},{"n":"CuentaOAuth","t":"VARCHAR(25)"},{"n":"DESCRIPCION","t":"VARCHAR(18)"},{"n":"ENVIO_MAIL_SALIDA","t":"VARCHAR(100)"},{"n":"GMAIL_CREDENCIAL","t":"TEXT"},{"n":"METODO_ENTREGA","t":"VARCHAR(10)"},{"n":"PUERTO","t":"INT"},{"n":"REQ_AUTENTICACION","t":"VARCHAR(1)"},{"n":"SERVIDOR_SMTP","t":"VARCHAR(50)"},{"n":"USA_CONEXION_SSL","t":"VARCHAR(1)"},{"n":"USA_CUENTA_ACTUAL","t":"VARCHAR(1)"},{"n":"USA_GMAIL_AUTH2","t":"VARCHAR(1)"},{"n":"USA_USUARIO_RED","t":"VARCHAR(1)"},{"n":"USUARIO_PWD_SMTP","t":"VARCHAR(254)"},{"n":"USUARIO_SMTP","t":"VARCHAR(100)"}]},"CONFIG_REPORTES_GN":{"m":"","d":"","f":[{"n":"NOMBRE_CAMPO","t":"VARCHAR(100)"},{"n":"NOMBRE_REPORTE","t":"VARCHAR(50)"},{"n":"TIPO","t":"VARCHAR(1)"},{"n":"VALOR","t":"VARCHAR(4000)"}]},"CONFIG_TARJETAS":{"m":"","d":"","f":[{"n":"NOMBRE","t":"VARCHAR(30)"},{"n":"TIPO","t":"VARCHAR(1)"},{"n":"TIPO_TARJETA","t":"VARCHAR(12)"},{"n":"VALOR","t":"VARCHAR(250)"}]},"CONSE_NCF_RETENCION":{"m":"","d":"Retenciones fiscales aplicadas en documentos de compra o venta.","f":[{"n":"CODIGO_RETENCION","t":"VARCHAR(4)"},{"n":"NOTAS","t":"TEXT"},{"n":"PREFIJO","t":"VARCHAR(50)"}]},"CONSEC_AJUSTE_CONF":{"m":"","d":"Ajustes de inventario: correcciones por diferencias entre conteo y sistema.","f":[{"n":"AJUSTE_CONFIG","t":"VARCHAR(4)"},{"n":"CONSECUTIVO","t":"VARCHAR(10)"}]},"CONSEC_USUARIO":{"m":"","d":"Usuarios del sistema: credenciales, perfil, estado y auditoría.","f":[{"n":"CONSECUTIVO","t":"VARCHAR(10)"},{"n":"USUARIO","t":"VARCHAR(50)"}]},"CONSECUFA_USUARIO":{"m":"","d":"Usuarios del sistema: credenciales, perfil, estado y auditoría.","f":[{"n":"CODIGO_CONSECUTIVO","t":"VARCHAR(10)"},{"n":"USUARIO","t":"VARCHAR(50)"}]},"CONSECUTIVO":{"m":"FA","d":"Control de consecutivos y numeración automática de documentos.","f":[{"n":"ACTIVO","t":"VARCHAR(1)"},{"n":"BODEGA","t":"VARCHAR(4)"},{"n":"CONSECUTIVO","t":"VARCHAR(10)"},{"n":"CONSECUTIVO_NC","t":"VARCHAR(10)"},{"n":"DESCRIPCION","t":"VARCHAR(40)"},{"n":"DOCUMENTO","t":"VARCHAR(50)"},{"n":"ENTIDAD","t":"VARCHAR(40)"},{"n":"FECHA_FINAL","t":"DATETIME"},{"n":"FECHA_HORA_ULT","t":"DATETIME"},{"n":"FECHA_INICIAL","t":"DATETIME"},{"n":"FORMATO_IMPRESION_DETALLADO","t":"VARCHAR(250)"},{"n":"FORMATO_IMPRESION_RESUMIDO","t":"VARCHAR(250)"},{"n":"LONGITUD","t":"DECIMAL"},{"n":"MASCARA","t":"VARCHAR(50)"},{"n":"MASCARA_DTE","t":"VARCHAR(50)"},{"n":"PREFIJO","t":"VARCHAR(5)"},{"n":"RESOLUCION","t":"VARCHAR(20)"},{"n":"ULTIMO_USUARIO","t":"VARCHAR(50)"},{"n":"ULTIMO_VALOR","t":"VARCHAR(50)"},{"n":"USA_IMP_FISCAL","t":"VARCHAR(1)"},{"n":"VALOR_FINAL","t":"VARCHAR(50)"},{"n":"VALOR_INICIAL","t":"VARCHAR(50)"}]},"CONSECUTIVO_CI":{"m":"FA","d":"Control de consecutivos y numeración automática de documentos.","f":[{"n":"CONSECUTIVO","t":"VARCHAR(10)"},{"n":"DESCRIPCION","t":"VARCHAR(40)"},{"n":"EDITABLE","t":"VARCHAR(1)"},{"n":"EMAIL_CFDI","t":"VARCHAR(254)"},{"n":"FORMATO_IMP","t":"VARCHAR(254)"},{"n":"MASCARA","t":"VARCHAR(50)"},{"n":"MULTIPLES_TRANS","t":"VARCHAR(1)"},{"n":"SIGUIENTE_CONSEC","t":"VARCHAR(50)"},{"n":"TIENE_COMPLEMENTO","t":"VARCHAR(1)"},{"n":"TIPO","t":"VARCHAR(4)"},{"n":"TODAS_TRANS","t":"VARCHAR(1)"},{"n":"ULT_FECHA_HORA","t":"DATETIME"},{"n":"ULTIMO_USUARIO","t":"VARCHAR(50)"},{"n":"USA_TRASLADO","t":"VARCHAR(1)"}]},"CONSECUTIVO_FA":{"m":"FA","d":"Control de consecutivos y numeración automática de documentos.","f":[{"n":"CODIGO_CONSECUTIVO","t":"VARCHAR(10)"},{"n":"COPIA1","t":"VARCHAR(30)"},{"n":"COPIA2","t":"VARCHAR(30)"},{"n":"COPIA3","t":"VARCHAR(30)"},{"n":"COPIA4","t":"VARCHAR(30)"},{"n":"COPIA5","t":"VARCHAR(30)"},{"n":"DE_CC_RPT","t":"VARCHAR(254)"},{"n":"DE_CONS_RPT","t":"VARCHAR(254)"},{"n":"DESCRIPCION","t":"VARCHAR(40)"},{"n":"FECHA_HORA_ULT","t":"DATETIME"},{"n":"FORMATO","t":"VARCHAR(250)"},{"n":"LONGITUD","t":"INT"},{"n":"MASCARA","t":"VARCHAR(50)"},{"n":"MASCARA_DTE","t":"VARCHAR(100)"},{"n":"MATRICULA_MERCANTIL","t":"INT"},{"n":"NUMERO_COPIAS","t":"INT"},{"n":"ORIGINAL","t":"VARCHAR(30)"},{"n":"REIMPRESION","t":"VARCHAR(30)"},{"n":"RESOLUCION","t":"VARCHAR(20)"},{"n":"SERIE","t":"VARCHAR(25)"},{"n":"SUBTIPOS_DOC","t":"VARCHAR(254)"},{"n":"TIPO","t":"VARCHAR(1)"},{"n":"TIPO_DOCUMENTO","t":"VARCHAR(3)"},{"n":"USA_DESPACHOS","t":"VARCHAR(1)"},{"n":"USA_ESQUEMA_CAJAS","t":"VARCHAR(1)"}]},"CONSECUTIVO_USUARIO":{"m":"FA","d":"Control de consecutivos y numeración automática de documentos.","f":[{"n":"CONSECUTIVO","t":"VARCHAR(10)"},{"n":"USUARIO","t":"VARCHAR(50)"}]},"CONSECUTIVOS_SLV":{"m":"FA","d":"Control de consecutivos y numeración automática de documentos.","f":[{"n":"ANNO","t":"VARCHAR(10)"},{"n":"MASCARA","t":"VARCHAR(255)"},{"n":"TIPO_DOCUMENTO","t":"VARCHAR(100)"},{"n":"ULTIMO_VALOR","t":"VARCHAR(255)"}]},"CONSTANTE_CALC_VALOR":{"m":"","d":"","f":[{"n":"CONSTANTE","t":"VARCHAR(12)"},{"n":"DESCRIPCION","t":"VARCHAR(40)"},{"n":"VALOR","t":"DECIMAL"},{"n":"VARIABLE","t":"VARCHAR(12)"}]},"CONSTANTE_CALCULO":{"m":"","d":"","f":[{"n":"CONSTANTE","t":"VARCHAR(12)"},{"n":"DESCRIPCION","t":"VARCHAR(40)"}]},"CONTACTO_CLIENTE":{"m":"CC","d":"Contactos asociados a clientes o proveedores con datos de comunicación.","f":[{"n":"APELLIDOS","t":"VARCHAR(50)"},{"n":"CARGO","t":"VARCHAR(100)"},{"n":"CELULAR","t":"VARCHAR(50)"},{"n":"CLIENTE","t":"VARCHAR(20)"},{"n":"CONTACTO","t":"VARCHAR(20)"},{"n":"DEPARTAMENTO","t":"VARCHAR(100)"},{"n":"EMAIL","t":"VARCHAR(100)"},{"n":"FAX","t":"VARCHAR(50)"},{"n":"GENERO","t":"VARCHAR(1)"},{"n":"NOMBRE","t":"VARCHAR(50)"},{"n":"NOTAS","t":"VARCHAR"},{"n":"TELEFONO","t":"VARCHAR(50)"}]},"CONTACTOS":{"m":"","d":"Contactos asociados a clientes o proveedores con datos de comunicación.","f":[{"n":"CEDULAJURIDICA","t":"VARCHAR(20)"},{"n":"EMAIL_EDI","t":"VARCHAR(80)"},{"n":"GLN","t":"VARCHAR(13)"},{"n":"NOMBRE","t":"VARCHAR(80)"}]},"CONTINGENCIA_SLV":{"m":"","d":"","f":[{"n":"CODIGO_GENERACION","t":"VARCHAR(36)"},{"n":"CONSECUTIVO","t":"VARCHAR(10)"},{"n":"ERROR_SOFTLAND","t":"VARCHAR(1)"},{"n":"ERROR_WS","t":"VARCHAR(1)"},{"n":"ESTADO","t":"VARCHAR(50)"},{"n":"FECHA","t":"DATETIME"},{"n":"FECHA_FIN","t":"DATETIME"},{"n":"FECHA_INICIO","t":"DATETIME"},{"n":"JSON","t":"VARCHAR"},{"n":"MOTIVO_CONTINGENCIA","t":"VARCHAR(500)"},{"n":"NOMBRE_JSON","t":"VARCHAR(254)"},{"n":"NOMBRE_RESPONSABLE","t":"VARCHAR(100)"},{"n":"NUMERO_RESPONSABLE","t":"VARCHAR(25)"},{"n":"SELLO","t":"VARCHAR(4000)"},{"n":"TIPO_CONTINGENCIA","t":"VARCHAR(4)"},{"n":"TIPO_RESPONSABLE","t":"VARCHAR(4)"},{"n":"VALOR_CONSECUTIVO","t":"VARCHAR(50)"}]},"CONTRAREC_ASIENTO_CR":{"m":"CP","d":"Cabecera de asientos contables generados por módulos auxiliares o manual.","f":[{"n":"ASIENTO","t":"VARCHAR(10)"},{"n":"CONTRARECIBO","t":"VARCHAR(20)"}]},"CONTRAREC_MOV_PRES":{"m":"CP","d":"","f":[{"n":"CONTRARECIBO","t":"VARCHAR(50)"},{"n":"NUMERO_APARTADO","t":"INT"},{"n":"NUMERO_EJERCIDO","t":"INT"},{"n":"PRESUPUESTO","t":"VARCHAR(20)"},{"n":"UNIDAD_OPERATIVA","t":"VARCHAR(4)"}]},"CONTRARECIBOS":{"m":"CP","d":"","f":[{"n":"CONDICION_PAGO","t":"VARCHAR(4)"},{"n":"CONGELADO","t":"VARCHAR(1)"},{"n":"CONTRARECIBO","t":"VARCHAR(50)"},{"n":"ESTADO","t":"VARCHAR(1)"},{"n":"FECHA_EMISION","t":"DATETIME"},{"n":"FECHA_RIGE","t":"DATETIME"},{"n":"FECHA_ULT_MOD","t":"DATETIME"},{"n":"FECHA_VENCE","t":"DATETIME"},{"n":"NOTAS","t":"TEXT"},{"n":"PRESUPUESTO_CR","t":"VARCHAR(20)"},{"n":"PROVEEDOR","t":"VARCHAR(20)"},{"n":"USUARIO_ULT_MOD","t":"VARCHAR(50)"}]},"CONTRARECIBOS_CC":{"m":"CP","d":"","f":[{"n":"CLIENTE","t":"VARCHAR(20)"},{"n":"CONDICION_PAGO","t":"VARCHAR(4)"},{"n":"CONGELADO","t":"VARCHAR(1)"},{"n":"CONTRARECIBO","t":"VARCHAR(50)"},{"n":"ESTADO","t":"VARCHAR(1)"},{"n":"FECHA_EMISION","t":"DATETIME"},{"n":"FECHA_RIGE","t":"DATETIME"},{"n":"FECHA_ULT_MOD","t":"DATETIME"},{"n":"NOTAS","t":"TEXT"},{"n":"USUARIO_ULT_MOD","t":"VARCHAR(50)"}]},"CONTRATO_LINEA_TEMPIVA":{"m":"","d":"","f":[{"n":"ARTICULO","t":"VARCHAR(20)"},{"n":"CONTRATO","t":"VARCHAR(10)"},{"n":"LINEA","t":"INT"},{"n":"PORC_IMPUESTO1","t":"DECIMAL"},{"n":"PORC_IMPUESTO2","t":"DECIMAL"},{"n":"ROWPOINTER","t":"GUID"},{"n":"TIPO_IMPUESTO1","t":"VARCHAR(4)"},{"n":"TIPO_IMPUESTO2","t":"VARCHAR(4)"},{"n":"TIPO_TARIFA1","t":"VARCHAR(2)"},{"n":"TIPO_TARIFA2","t":"VARCHAR(2)"}]},"CONTRIB_VAC_CONDIC":{"m":"","d":"","f":[{"n":"CONDICION_APLIC","t":"TEXT"},{"n":"CONTRIBUCION_VAC","t":"VARCHAR(12)"}]},"CONTRIB_VAC_FORM":{"m":"","d":"","f":[{"n":"CONTRIBUCION_VAC","t":"VARCHAR(12)"},{"n":"FORMULA_CALCULO","t":"TEXT"}]},"CONTRIBUCION_VAC":{"m":"","d":"","f":[{"n":"ACTIVA","t":"VARCHAR(1)"},{"n":"CANT_DECIMALES","t":"INT"},{"n":"CANT_MAX_ANNO","t":"DECIMAL"},{"n":"CANT_MAX_LEY","t":"DECIMAL"},{"n":"CANTIDAD_DIAS","t":"DECIMAL"},{"n":"CONTRIBUCION_VAC","t":"VARCHAR(12)"},{"n":"CONTROL_INCAP","t":"VARCHAR(1)"},{"n":"DESCRIPCION","t":"VARCHAR(40)"},{"n":"EDICION_CALCULO","t":"VARCHAR(1)"},{"n":"ELIMINAR_CONT_CERO","t":"VARCHAR(1)"},{"n":"FECHA_CREACION","t":"DATETIME"},{"n":"FECHA_REFERENCIA","t":"VARCHAR(1)"},{"n":"FECHA_ULT_MODIF","t":"DATETIME"},{"n":"NOTAS","t":"TEXT"},{"n":"PERIODICIDAD","t":"VARCHAR(1)"},{"n":"PERIODO","t":"INT"},{"n":"TIPO_ACCION","t":"VARCHAR(4)"},{"n":"TIPO_FRACCION","t":"VARCHAR(1)"},{"n":"USAR_FRACCIONES","t":"VARCHAR(1)"},{"n":"USUARIO_CREACION","t":"VARCHAR(50)"},{"n":"USUARIO_ULT_MODIF","t":"VARCHAR(50)"},{"n":"VERIFICA_CONDICION","t":"VARCHAR(1)"}]},"CONTROL_HORAS_INCAP":{"m":"","d":"","f":[{"n":"ACCION","t":"INT"},{"n":"ACEPTADO","t":"VARCHAR(1)"},{"n":"CONSECUTIVO","t":"INT"},{"n":"EMPLEADO","t":"VARCHAR(20)"},{"n":"HORAS_CAUSADAS","t":"DECIMAL"},{"n":"HORAS_CONSUMIDAS","t":"DECIMAL"},{"n":"HORAS_VENCIDAS","t":"DECIMAL"},{"n":"NOMINA","t":"VARCHAR(4)"},{"n":"NUMERO_NOMINA","t":"INT"},{"n":"SALDO","t":"DECIMAL"},{"n":"SALDO_INICIAL","t":"DECIMAL"}]},"CONVENIO_TRIBUTACION":{"m":"","d":"","f":[{"n":"CONVENIO","t":"VARCHAR(1)"},{"n":"DESCRIPCION","t":"VARCHAR(250)"}]},"copia_PEDIDO":{"m":"","d":"","f":[{"n":"ACT_COM_RECEPTOR","t":"VARCHAR(10)"},{"n":"ACTIVIDAD_COMERCIAL","t":"VARCHAR(10)"},{"n":"AUTORIZADO","t":"VARCHAR(1)"},{"n":"BACKORDER","t":"VARCHAR(1)"},{"n":"BASE_IMPUESTO1","t":"DECIMAL"},{"n":"BASE_IMPUESTO2","t":"DECIMAL"},{"n":"BODEGA","t":"VARCHAR(4)"},{"n":"BODEGA_EMBARQUE","t":"VARCHAR(4)"},{"n":"CAMBIOS_COTI","t":"VARCHAR(254)"},{"n":"CLASE_PEDIDO","t":"VARCHAR(1)"},{"n":"CLAVE_REFERENCIA_DE","t":"VARCHAR(50)"},{"n":"CLIENTE","t":"VARCHAR(20)"},{"n":"CLIENTE_CORPORAC","t":"VARCHAR(20)"},{"n":"CLIENTE_DIRECCION","t":"VARCHAR(20)"},{"n":"CLIENTE_ORIGEN","t":"VARCHAR(20)"},{"n":"COBRADOR","t":"VARCHAR(4)"},{"n":"CODIGO_REFERENCIA_DE","t":"VARCHAR(2)"},{"n":"CODIGO_REFERENCIA_OTRO","t":"VARCHAR(100)"},{"n":"COMENTARIO_CXC","t":"VARCHAR(249)"},{"n":"CONDICION_PAGO","t":"VARCHAR(4)"},{"n":"CONSECUTIVO_FTC","t":"VARCHAR(10)"},{"n":"CONTRATO","t":"VARCHAR(20)"},{"n":"CONTRATO_AC","t":"VARCHAR(10)"},{"n":"CONTRATO_REVENTA","t":"VARCHAR(1)"},{"n":"CONTRATO_VIGENCIA_DESDE","t":"DATETIME"}]},"CORRIDA_AD":{"m":"","d":"","f":[{"n":"CANT_PLANTILLAS","t":"INT"},{"n":"CORRIDA_AD","t":"INT"},{"n":"FECHA","t":"DATETIME"},{"n":"USUARIO","t":"VARCHAR(50)"}]},"COST_STD_BATCH":{"m":"","d":"","f":[{"n":"ARTICULO","t":"VARCHAR(20)"},{"n":"BODEGA","t":"VARCHAR(4)"},{"n":"COSTO_INDIR_DOL","t":"DECIMAL"},{"n":"COSTO_INDIR_LOC","t":"DECIMAL"},{"n":"COSTO_MO_DOL","t":"DECIMAL"},{"n":"COSTO_MO_LOC","t":"DECIMAL"},{"n":"MAT_CORP_DOL","t":"DECIMAL"},{"n":"MAT_CORP_LOC","t":"DECIMAL"},{"n":"MAT_TERCEROS_DOL","t":"DECIMAL"},{"n":"MAT_TERCEROS_LOC","t":"DECIMAL"},{"n":"USUARIO","t":"VARCHAR(50)"}]},"COSTO_PRODUCCION_LOGIC":{"m":"","d":"Registro de auditoría y trazabilidad de cambios en el sistema.","f":[{"n":"ARTICULO","t":"VARCHAR(20)"},{"n":"AUDIT_TRANS_INV_ERP","t":"INT"},{"n":"AUDIT_TRANS_INV_LOGIC","t":"INT"},{"n":"COD_TRANS_INV","t":"VARCHAR(10)"},{"n":"COSTO_DOLAR","t":"DECIMAL"},{"n":"COSTO_LOCAL","t":"DECIMAL"}]},"COSTO_STD_DESGL":{"m":"","d":"","f":[{"n":"ARTICULO","t":"VARCHAR(20)"},{"n":"BODEGA","t":"VARCHAR(4)"},{"n":"CODIGO_BARRAS_VENT","t":"VARCHAR(20)"},{"n":"COSTO_INDIR_DOL","t":"DECIMAL"},{"n":"COSTO_INDIR_LOC","t":"DECIMAL"},{"n":"COSTO_MO_DOL","t":"DECIMAL"},{"n":"COSTO_MO_LOC","t":"DECIMAL"},{"n":"FECHA_HORA","t":"DATETIME"},{"n":"MAT_CORP_DOL","t":"DECIMAL"},{"n":"MAT_CORP_LOC","t":"DECIMAL"},{"n":"MAT_TERCEROS_DOL","t":"DECIMAL"},{"n":"MAT_TERCEROS_LOC","t":"DECIMAL"},{"n":"USUARIO","t":"VARCHAR(50)"}]},"COSTO_UEPS_PEPS":{"m":"","d":"","f":[{"n":"ARTICULO","t":"VARCHAR(20)"},{"n":"CANTIDAD_ORIGINAL","t":"DECIMAL"},{"n":"CANTIDAD_RESTANTE","t":"DECIMAL"},{"n":"COSTO_DOLAR","t":"DECIMAL"},{"n":"COSTO_LOCAL","t":"DECIMAL"},{"n":"SECUENCIA","t":"DATETIME"}]},"COTIZANTE":{"m":"","d":"","f":[{"n":"ACTIVIDAD","t":"VARCHAR(7)"},{"n":"ACTIVIDAD_ALTO_RIESGO","t":"VARCHAR(1)"},{"n":"CENTRO_TRABAJO","t":"VARCHAR(12)"},{"n":"CONDICION_ESPECIAL","t":"VARCHAR(2)"},{"n":"COTIZA_PENSION","t":"VARCHAR(1)"},{"n":"DEPARTAMENTO","t":"VARCHAR(12)"},{"n":"DEV_SAL_INTEGRAL","t":"VARCHAR(1)"},{"n":"DIVISION_GEOGRAFICA","t":"VARCHAR(12)"},{"n":"EMPLEADO","t":"VARCHAR(20)"},{"n":"FECHA_EXTERIOR","t":"DATETIME"},{"n":"MUNICIPIO","t":"VARCHAR(12)"},{"n":"PAIS","t":"VARCHAR(4)"},{"n":"REGIMEN_PENSIONAL","t":"VARCHAR(1)"},{"n":"RESIDE_EXTERIOR","t":"VARCHAR(1)"},{"n":"SUBTIPO_COTIZANTE","t":"VARCHAR(2)"},{"n":"TIPO_COTIZANTE","t":"VARCHAR(2)"},{"n":"TIPO_VINCULACION","t":"VARCHAR(2)"}]},"CP_DET_RETENCION_PAR":{"m":"CP","d":"Retenciones fiscales aplicadas en documentos de compra o venta.","f":[{"n":"DOC_CAN","t":"VARCHAR(50)"},{"n":"DOCUMENTO","t":"VARCHAR(50)"},{"n":"MONTO","t":"DECIMAL"},{"n":"NUM_RETEN","t":"VARCHAR(20)"},{"n":"PROVEE_CAN","t":"VARCHAR(20)"},{"n":"PROVEEDOR","t":"VARCHAR(20)"},{"n":"RETENCION","t":"VARCHAR(4)"},{"n":"TIPO","t":"VARCHAR(3)"},{"n":"TIPO_CAN","t":"VARCHAR(3)"}]},"CP_PREVIA_AUX_CP_RD":{"m":"CP","d":"","f":[{"n":"FECHA_PAGO","t":"DATETIME"},{"n":"MODULO","t":"VARCHAR(3)"},{"n":"MONTO_LOCAL","t":"DECIMAL"},{"n":"NCF_FAC","t":"VARCHAR(50)"},{"n":"NUM_CRED","t":"VARCHAR(50)"},{"n":"NUM_DEB","t":"VARCHAR(50)"},{"n":"PROVEEDOR","t":"VARCHAR(20)"},{"n":"SUBTIPO_FAC","t":"VARCHAR(30)"},{"n":"TIPO_DOC_DEB","t":"VARCHAR(3)"},{"n":"TIPO_FAC","t":"VARCHAR(3)"}]},"CP_PREVIA_FECHA_PAGO_RD":{"m":"CP","d":"","f":[{"n":"FACTURA","t":"VARCHAR(50)"},{"n":"FECHA_PAGO","t":"DATETIME"},{"n":"MODULO","t":"VARCHAR(3)"},{"n":"PROVEEDOR","t":"VARCHAR(20)"},{"n":"TIPO_FAC","t":"VARCHAR(3)"}]},"CP_PREVIA_FECHA_RET_CP_RD":{"m":"CP","d":"","f":[{"n":"FACTURA","t":"VARCHAR(50)"},{"n":"FECHA_RETENCION","t":"DATETIME"},{"n":"MODULO","t":"VARCHAR(3)"},{"n":"PROVEEDOR","t":"VARCHAR(20)"},{"n":"TIPO_FAC","t":"VARCHAR(3)"}]},"CP_PREVIA_FORMA_PAGO_RD":{"m":"CP","d":"","f":[{"n":"FACTURA","t":"VARCHAR(50)"},{"n":"FORMA_DE_PAGO","t":"VARCHAR(100)"},{"n":"MODULO","t":"VARCHAR(3)"},{"n":"PROVEEDOR","t":"VARCHAR(20)"},{"n":"TIPO_FAC","t":"VARCHAR(3)"}]},"CP_PREVIA_REPCOMLEG_ADIC_RD":{"m":"CP","d":"","f":[{"n":"CUENTABANCO","t":"VARCHAR(10)"},{"n":"FORMA_PAGO","t":"VARCHAR(100)"},{"n":"MODULO","t":"VARCHAR(3)"},{"n":"MONTO_BIEN","t":"DECIMAL"},{"n":"MONTO_SERVICIO","t":"DECIMAL"},{"n":"NCF","t":"VARCHAR(40)"},{"n":"NUMERO_DOC","t":"VARCHAR(50)"},{"n":"PROVEEDOR","t":"VARCHAR(20)"},{"n":"TIPO_DOC","t":"VARCHAR(3)"},{"n":"TIPO_GASTO","t":"VARCHAR(50)"},{"n":"TIPO_ITBIS","t":"VARCHAR(50)"}]},"CP_PREVIA_REPCOMLEG_RD":{"m":"CP","d":"","f":[{"n":"CUENTABANCO","t":"VARCHAR(10)"},{"n":"DESCUENTO","t":"DECIMAL"},{"n":"FECHA_DOC","t":"DATETIME"},{"n":"FECHA_ORIG","t":"DATETIME"},{"n":"IMPUESTO1","t":"DECIMAL"},{"n":"IMPUESTO2","t":"DECIMAL"},{"n":"ITBIS_FACTURADO","t":"DECIMAL"},{"n":"LINEA_VALE","t":"INT"},{"n":"MODULO","t":"VARCHAR(10)"},{"n":"MONEDA","t":"VARCHAR(4)"},{"n":"MONTO_TOTAL","t":"DECIMAL"},{"n":"NCF","t":"VARCHAR(40)"},{"n":"NCF_MODIFICADO","t":"VARCHAR(50)"},{"n":"NUMERO_DOC","t":"VARCHAR(50)"},{"n":"PROVEEDOR","t":"VARCHAR(20)"},{"n":"RETENCION","t":"DECIMAL"},{"n":"RNC_CED","t":"VARCHAR(20)"},{"n":"RUBRO1","t":"DECIMAL"},{"n":"RUBRO2","t":"DECIMAL"},{"n":"SALDO","t":"DECIMAL"},{"n":"SUBTIPO_DOC","t":"INT"},{"n":"SUBTOTAL","t":"DECIMAL"},{"n":"TASA","t":"DECIMAL"},{"n":"TIPO_DOC","t":"VARCHAR(3)"},{"n":"TIPO_ID","t":"VARCHAR(50)"}]},"CREDITO_EMPLEADO":{"m":"CN","d":"","f":[{"n":"CONCEPTO","t":"VARCHAR(20)"},{"n":"CUENTA_BANCARIA","t":"VARCHAR(25)"},{"n":"DIAS","t":"INT"},{"n":"DOCUMENTO_CC","t":"VARCHAR(50)"},{"n":"EMPLEADO","t":"VARCHAR(20)"},{"n":"ENTIDAD_FINANCIERA","t":"VARCHAR(8)"},{"n":"ESTADO","t":"VARCHAR(1)"},{"n":"INICIO_COBRO","t":"DATETIME"},{"n":"LISTA_NOMINAS","t":"VARCHAR(4000)"},{"n":"MESES_NO_COBRO","t":"VARCHAR(26)"},{"n":"MONTO_COBRO1","t":"DECIMAL"},{"n":"MONTO_COBRO2","t":"DECIMAL"},{"n":"MONTO_COBRO3","t":"DECIMAL"},{"n":"MONTO_COBRO4","t":"DECIMAL"},{"n":"MONTO_COBRO5","t":"DECIMAL"},{"n":"MONTO_COBRO6","t":"DECIMAL"},{"n":"NUMERO_CREDITO","t":"INT"},{"n":"PERIODICIDAD","t":"INT"},{"n":"PRIORIDAD","t":"INT"},{"n":"PROVEEDOR","t":"VARCHAR(20)"},{"n":"RAZON_ESTADO","t":"VARCHAR(250)"},{"n":"REFINANCIADO_CON","t":"INT"},{"n":"SALDO_ACTUAL","t":"DECIMAL"},{"n":"SALDO_INICIAL","t":"DECIMAL"},{"n":"TIPO_DOC_CC","t":"VARCHAR(3)"}]},"CTA_AJUSTE_INFL":{"m":"CG","d":"Ajustes de inventario: correcciones por diferencias entre conteo y sistema.","f":[{"n":"CONTRA_CTA_AJUSTE","t":"VARCHAR(25)"},{"n":"CTA_AJUSTABLE","t":"VARCHAR(25)"},{"n":"CTA_AJUSTE","t":"VARCHAR(25)"}]},"CTABANCO_PLAN":{"m":"","d":"","f":[{"n":"ARCHIVO","t":"VARCHAR(255)"},{"n":"ARCHIVO_SINPE","t":"VARCHAR(255)"},{"n":"CUENTA_BANCO","t":"VARCHAR(20)"},{"n":"ENVIO","t":"INT"},{"n":"ENVIO_SINPE","t":"INT"},{"n":"NUMERO_PLAN","t":"VARCHAR(4)"},{"n":"NUMERO_PLAN_SINPE","t":"VARCHAR(4)"}]},"CUADRE_AUX":{"m":"","d":"","f":[{"n":"ASIENTO","t":"VARCHAR(10)"},{"n":"CONCEPTO","t":"VARCHAR(249)"},{"n":"CREDITO_DOL","t":"DECIMAL"},{"n":"CREDITO_LOC","t":"DECIMAL"},{"n":"CUADRES_CG","t":"INT"},{"n":"DEBITO_DOL","t":"DECIMAL"},{"n":"DEBITO_LOC","t":"DECIMAL"},{"n":"FECHA","t":"DATETIME"},{"n":"GUID_ORIGEN","t":"VARCHAR(48)"},{"n":"ORIGEN","t":"VARCHAR(4)"},{"n":"REFERENCIA","t":"VARCHAR(249)"},{"n":"TABLA_ORIGEN","t":"VARCHAR(30)"}]},"CUADRE_CONTA":{"m":"","d":"","f":[{"n":"ASIENTO","t":"VARCHAR(10)"},{"n":"CENTRO","t":"VARCHAR(25)"},{"n":"CENTRO_DESC","t":"VARCHAR(60)"},{"n":"CONTABILIDAD","t":"VARCHAR(1)"},{"n":"CREDITO_DOL","t":"DECIMAL"},{"n":"CREDITO_LOC","t":"DECIMAL"},{"n":"CUADRES_CG","t":"INT"},{"n":"CUENTA","t":"VARCHAR(25)"},{"n":"CUENTA_DESC","t":"VARCHAR(60)"},{"n":"DEBITO_DOL","t":"DECIMAL"},{"n":"DEBITO_LOC","t":"DECIMAL"},{"n":"FECHA","t":"DATETIME"},{"n":"FUENTE","t":"VARCHAR(40)"},{"n":"LINEA","t":"INT"},{"n":"NIT","t":"VARCHAR(20)"},{"n":"NIT_DESC","t":"VARCHAR(150)"},{"n":"ORIGEN","t":"VARCHAR(4)"},{"n":"REFERENCIA","t":"VARCHAR(249)"},{"n":"UBICACION","t":"VARCHAR(1)"}]},"CUADRE_CONTA_AUX":{"m":"","d":"","f":[{"n":"CUADRES_CG","t":"INT"},{"n":"ESTADO","t":"VARCHAR(2)"},{"n":"GUID_AUX","t":"VARCHAR(48)"},{"n":"GUID_CONTA","t":"VARCHAR(48)"}]},"CUADRES_CG":{"m":"","d":"","f":[{"n":"CUADRES_CG","t":"INT"},{"n":"CUENTAS","t":"TEXT"},{"n":"DESCRIPCION","t":"VARCHAR(40)"},{"n":"FECHA","t":"DATETIME"},{"n":"FECHA_DESDE","t":"DATETIME"},{"n":"FECHA_HASTA","t":"DATETIME"},{"n":"FILTROS","t":"VARCHAR(254)"},{"n":"MODULO","t":"VARCHAR(4)"},{"n":"OTROS","t":"VARCHAR(254)"},{"n":"TAB","t":"INT"}]},"CUBO_PRIVILEGIO":{"m":"","d":"","f":[{"n":"CUBO","t":"VARCHAR(40)"},{"n":"DESCRIPCION","t":"VARCHAR(254)"},{"n":"MODULO","t":"VARCHAR(4)"},{"n":"NOMBRE","t":"VARCHAR(60)"},{"n":"PRIVILEGIO","t":"INT"},{"n":"USA_METAS","t":"VARCHAR(1)"}]},"CUENTA_BANCARIA":{"m":"CB","d":"","f":[{"n":"ACTIVA","t":"VARCHAR(1)"},{"n":"CARGO","t":"VARCHAR(40)"},{"n":"CONSE_CHEQUE","t":"VARCHAR(10)"},{"n":"CONSE_TEF","t":"VARCHAR(10)"},{"n":"CONTACTO","t":"VARCHAR(40)"},{"n":"CTA_AJUSTE_CRED","t":"VARCHAR(25)"},{"n":"CTA_AJUSTE_DEB","t":"VARCHAR(25)"},{"n":"CTA_AUTO_DETRACCION","t":"VARCHAR(25)"},{"n":"CTA_CIERRE_CRED","t":"VARCHAR(25)"},{"n":"CTA_CIERRE_DEB","t":"VARCHAR(25)"},{"n":"CTA_CONTABLE","t":"VARCHAR(25)"},{"n":"CTA_DOC_GP","t":"VARCHAR(25)"},{"n":"CTA_ELECTRONICA","t":"VARCHAR(50)"},{"n":"CTA_GASTO_TRANSF","t":"VARCHAR(25)"},{"n":"CTA_LIQUIDAR_CRED","t":"VARCHAR(25)"},{"n":"CTA_LIQUIDAR_DEB","t":"VARCHAR(25)"},{"n":"CTA_PAGO_NO_DOM","t":"VARCHAR(25)"},{"n":"CTA_TRANSF_IC","t":"VARCHAR(25)"},{"n":"CTR_AJUSTE_CRED","t":"VARCHAR(25)"},{"n":"CTR_AJUSTE_DEB","t":"VARCHAR(25)"},{"n":"CTR_AUTO_DETRACCION","t":"VARCHAR(25)"},{"n":"CTR_CIERRE_CRED","t":"VARCHAR(25)"},{"n":"CTR_CIERRE_DEB","t":"VARCHAR(25)"},{"n":"CTR_CONTABLE","t":"VARCHAR(25)"},{"n":"CTR_DOC_GP","t":"VARCHAR(25)"}]},"CUENTA_CONTABLE":{"m":"CG","d":"Plan de cuentas. Código, nombre, tipo, nivel jerárquico y UDFs de clasificación gerencial.","f":[{"n":"ACEPTA_DATOS","t":"VARCHAR(1)"},{"n":"ACEPTA_UNIDADES","t":"VARCHAR(1)"},{"n":"COD_AGRUPADOR","t":"VARCHAR(15)"},{"n":"CONSOLIDA","t":"VARCHAR(1)"},{"n":"CONVERSION","t":"VARCHAR(1)"},{"n":"CUENTA_CONTABLE","t":"VARCHAR(25)"},{"n":"CUENTA_IFRS","t":"VARCHAR(25)"},{"n":"DESC_COD_AGRUP","t":"VARCHAR(60)"},{"n":"DESC_SUB_CTA","t":"VARCHAR(100)"},{"n":"DESCRIPCION","t":"VARCHAR(200)"},{"n":"DESCRIPCION_IFRS","t":"VARCHAR(200)"},{"n":"FCH_HORA_ULT_MOD","t":"DATETIME"},{"n":"FECHA_FIN_CE","t":"DATETIME"},{"n":"FECHA_HORA","t":"DATETIME"},{"n":"FECHA_INI_CE","t":"DATETIME"},{"n":"MANEJA_TERCERO","t":"VARCHAR(1)"},{"n":"NIVEL","t":"VARCHAR(5)"},{"n":"NOTAS","t":"TEXT"},{"n":"ORIGEN_CONVERSION","t":"VARCHAR(1)"},{"n":"SALDO_NORMAL","t":"VARCHAR(1)"},{"n":"SECCION_CUENTA","t":"VARCHAR(4)"},{"n":"SUB_CTA_DE","t":"VARCHAR(100)"},{"n":"TIPO","t":"VARCHAR(1)"},{"n":"TIPO_CAMBIO","t":"VARCHAR(4)"},{"n":"TIPO_DETALLADO","t":"VARCHAR(1)"}]},"CUENTA_DEPRECIACIO":{"m":"","d":"Depreciación de activos fijos: método, cuotas y valores acumulados.","f":[{"n":"CENTRO_COSTO","t":"VARCHAR(25)"},{"n":"CTA_DEPR_AI_C","t":"VARCHAR(25)"},{"n":"CTA_DEPR_AI_F","t":"VARCHAR(25)"},{"n":"CTA_DEPR_DESMANTELA_C","t":"VARCHAR(25)"},{"n":"CTA_DEPR_DESMANTELA_F","t":"VARCHAR(25)"},{"n":"CTA_DEPR_NORMAL","t":"VARCHAR(25)"},{"n":"CTA_DEPR_NORMAL_C","t":"VARCHAR(25)"},{"n":"CTA_DEPR_REVAL","t":"VARCHAR(25)"},{"n":"CTA_DEPR_REVAL_C","t":"VARCHAR(25)"},{"n":"FASE","t":"VARCHAR(25)"},{"n":"PROYECTO","t":"VARCHAR(25)"},{"n":"TIPO_ACTIVO","t":"VARCHAR(4)"}]},"CUENTA_SECCION":{"m":"","d":"","f":[{"n":"CODIGO_R","t":"VARCHAR(4)"},{"n":"CUENTA_CONTABLE","t":"VARCHAR(25)"},{"n":"SECCION_R","t":"VARCHAR(4)"},{"n":"SUBSECCION","t":"VARCHAR(4)"},{"n":"TIPO_R","t":"VARCHAR(2)"}]},"CUENTAS_CORREO_RECEPCION_DE":{"m":"","d":"Recepciones de mercancía en bodega (Centro de Distribución). Vincula con OC o embarque.","f":[{"n":"CORREO","t":"VARCHAR(100)"},{"n":"CREDENCIALES","t":"TEXT"},{"n":"PROVEEDOR","t":"VARCHAR(10)"}]},"DCTO_ART_X_CLI":{"m":"","d":"","f":[{"n":"ARTICULO","t":"VARCHAR(20)"},{"n":"CANTIDAD_FINAL","t":"INT"},{"n":"CANTIDAD_INICIAL","t":"INT"},{"n":"CLIENTE","t":"VARCHAR(20)"},{"n":"ESCALA_DCTO","t":"INT"},{"n":"FECHA_FINAL","t":"DATETIME"},{"n":"FECHA_INICIAL","t":"DATETIME"},{"n":"PORC_DESCUENTO","t":"DECIMAL"},{"n":"TIPO_DESCUENTO","t":"VARCHAR(1)"},{"n":"VERSION_DCTO","t":"INT"}]},"DCTO_CLAS_X_CLI":{"m":"","d":"","f":[{"n":"CANTIDAD_FINAL","t":"INT"},{"n":"CANTIDAD_INICIAL","t":"INT"},{"n":"CLASIFICACION","t":"VARCHAR(12)"},{"n":"CLIENTE","t":"VARCHAR(20)"},{"n":"ESCALA_DCTO","t":"INT"},{"n":"FECHA_FINAL","t":"DATETIME"},{"n":"FECHA_INICIAL","t":"DATETIME"},{"n":"PORC_DESCUENTO","t":"DECIMAL"},{"n":"TIPO_DESCUENTO","t":"VARCHAR(1)"},{"n":"VERSION_DCTO","t":"INT"}]},"DEFINICION_PIVOTE_BI":{"m":"","d":"","f":[{"n":"CUBO","t":"VARCHAR(40)"},{"n":"DEFINICION","t":"INT"},{"n":"DETALLE","t":"TEXT"},{"n":"NOMBRE","t":"VARCHAR(60)"},{"n":"TIPO","t":"VARCHAR(1)"},{"n":"VISTA","t":"VARCHAR(30)"}]},"DENOMINACION":{"m":"AS","d":"","f":[{"n":"DENOM_MONTO","t":"FLOAT"},{"n":"TIPO","t":"VARCHAR(1)"}]},"DEPARTAMENTO":{"m":"CN","d":"","f":[{"n":"ACTIVO","t":"VARCHAR(1)"},{"n":"DEPARTAMENTO","t":"VARCHAR(10)"},{"n":"DESCRIPCION","t":"VARCHAR(254)"},{"n":"JEFE","t":"VARCHAR(250)"}]},"DEPR_CENTRO_COSTO":{"m":"CG","d":"Centros de costo para análisis financiero multidimensional por área.","f":[{"n":"CENTRO_COSTO","t":"VARCHAR(25)"},{"n":"CENTRO_DEPRE","t":"INT"},{"n":"DEPR_DOLAR","t":"DECIMAL"},{"n":"DEPR_LOCAL","t":"DECIMAL"},{"n":"FASE","t":"VARCHAR(25)"},{"n":"HIST_DEPRECIACION","t":"INT"}]},"DEPR_PORCENTAJE":{"m":"","d":"","f":[{"n":"ACTIVO_FIJO","t":"VARCHAR(10)"},{"n":"CONTABILIDAD","t":"VARCHAR(1)"},{"n":"DESMANTELAMIENTO","t":"VARCHAR(10)"},{"n":"MEJORA","t":"VARCHAR(10)"},{"n":"PERIODO","t":"INT"},{"n":"PORCENTAJE","t":"DECIMAL"}]},"DES_BON_ESCALA_BONIFICACION":{"m":"","d":"","f":[{"n":"ARTICULO","t":"VARCHAR(20)"},{"n":"CANT_MAXIMA_DET","t":"DECIMAL"},{"n":"CANT_MINIMA_DET","t":"DECIMAL"},{"n":"CANTIDAD_INICIAL","t":"DECIMAL"},{"n":"CANTIDAD_INICIAL_CONSOL","t":"DECIMAL"},{"n":"CANTIDAD_INICIAL_DET","t":"DECIMAL"},{"n":"CANTIDAD_MAXIMA","t":"DECIMAL"},{"n":"CANTIDAD_MINIMA","t":"DECIMAL"},{"n":"CANTIDAD_PEDIDA","t":"DECIMAL"},{"n":"ESCALA","t":"INT"},{"n":"FACTOR","t":"DECIMAL"},{"n":"FACTOR_DET","t":"DECIMAL"},{"n":"REGLA","t":"VARCHAR(20)"},{"n":"UNIDAD_ALMACEN","t":"DECIMAL"},{"n":"UNIDAD_DETALLE","t":"DECIMAL"}]},"DES_BON_ESPECIFICACION_GRUPO":{"m":"","d":"","f":[{"n":"ARTICULO","t":"VARCHAR(20)"},{"n":"CANTIDAD_MAXIMA","t":"DECIMAL"},{"n":"CANTIDAD_MINIMA","t":"DECIMAL"},{"n":"ESCALA","t":"INT"},{"n":"REGLA","t":"VARCHAR(20)"}]},"DES_BON_PAQUETE":{"m":"","d":"","f":[{"n":"ACTIVO","t":"VARCHAR(1)"},{"n":"APLICA_A_FA","t":"VARCHAR(1)"},{"n":"APLICA_TODA_RUTA","t":"VARCHAR(1)"},{"n":"APLICA_TODA_TIENDA","t":"VARCHAR(1)"},{"n":"DESCRIPCION","t":"VARCHAR(40)"},{"n":"DIAS","t":"TEXT"},{"n":"FECHA_DESDE","t":"DATETIME"},{"n":"FECHA_HASTA","t":"DATETIME"},{"n":"PAQUETE","t":"VARCHAR(20)"},{"n":"PRIORIDAD","t":"INT"}]},"DES_BON_PAQUETE_REGLA":{"m":"","d":"","f":[{"n":"PAQUETE","t":"VARCHAR(20)"},{"n":"REGLA","t":"VARCHAR(20)"}]},"DES_BON_PAQUETE_RUTA":{"m":"","d":"Zonas geográficas o rutas de distribución para análisis territorial.","f":[{"n":"PAQUETE","t":"VARCHAR(20)"},{"n":"RUTA","t":"VARCHAR(4)"}]},"DES_BON_PAQUETE_TIENDA":{"m":"","d":"","f":[{"n":"PAQUETE","t":"VARCHAR(20)"},{"n":"TIENDA","t":"VARCHAR(6)"}]},"DES_BON_REGLA":{"m":"","d":"","f":[{"n":"ACTIVA","t":"VARCHAR(1)"},{"n":"AGRUPACION_ARTICULO","t":"VARCHAR(1)"},{"n":"APLICA_ARTICULO_MENOR_PRECIO","t":"VARCHAR(1)"},{"n":"APLICACION_GRUPOS","t":"VARCHAR(1)"},{"n":"CANTIDAD_ALMACEN_COMPRA","t":"DECIMAL"},{"n":"CANTIDAD_ALMACEN_DESCONTAR","t":"DECIMAL"},{"n":"CANTIDAD_DETALLE_COMPRA","t":"DECIMAL"},{"n":"CANTIDAD_DETALLE_DESCONTAR","t":"DECIMAL"},{"n":"CANTIDAD_LIMITE","t":"DECIMAL"},{"n":"CANTIDAD_MAX_DETALLE","t":"DECIMAL"},{"n":"CANTIDAD_MAXIMA","t":"DECIMAL"},{"n":"CANTIDAD_MIN_DETALLE","t":"DECIMAL"},{"n":"CANTIDAD_MINIMA","t":"DECIMAL"},{"n":"CATEGORIA_MEMBRESIA","t":"VARCHAR(8)"},{"n":"DESCRIPCION","t":"VARCHAR(40)"},{"n":"DETALLE_FORMA_PAGO","t":"VARCHAR(20)"},{"n":"ESPECIFICACION_GRUPO","t":"VARCHAR(1)"},{"n":"FILTRO_ARTICULO","t":"TEXT"},{"n":"FILTRO_ARTICULO_BONIFICACION","t":"TEXT"},{"n":"FILTRO_CLIENTE","t":"TEXT"},{"n":"FILTRO_LOTE","t":"TEXT"},{"n":"FORMA_PAGO","t":"VARCHAR(4)"},{"n":"MINIMO_PAGO","t":"DECIMAL"},{"n":"MONTO_DESDE","t":"DECIMAL"},{"n":"MONTO_HASTA","t":"DECIMAL"}]},"DES_BON_REGLA_LOTE":{"m":"CI","d":"Control de lotes de producción/compra. Trazabilidad y vencimientos.","f":[{"n":"CANT_MESES","t":"INT"},{"n":"DESCUENTO","t":"DECIMAL"},{"n":"DIAS_DESDE","t":"INT"},{"n":"DIAS_HASTA","t":"INT"},{"n":"LINEA_REGLA","t":"INT"},{"n":"REGLA","t":"VARCHAR(20)"}]},"DESC_PRONTO_PAGO":{"m":"","d":"","f":[{"n":"CONDICION_PAGO","t":"VARCHAR(4)"},{"n":"CONSECUTIVO","t":"INT"},{"n":"DESCUENTO","t":"FLOAT"},{"n":"DIA_FIN","t":"INT"},{"n":"DIA_INICIO","t":"INT"},{"n":"PS_AFV_ID_DESC_PRONTO_PAGO","t":"INT"}]},"DESPACHO":{"m":"FA","d":"","f":[{"n":"ASIENTO_DESPACHO","t":"VARCHAR(10)"},{"n":"AUDIT_TRANS_INV","t":"INT"},{"n":"CARGADO_CG","t":"VARCHAR(1)"},{"n":"CLIENTE","t":"VARCHAR(20)"},{"n":"CONSECUTIVO","t":"VARCHAR(10)"},{"n":"DESPACHO","t":"VARCHAR(20)"},{"n":"DIRECCION_EMBARQUE","t":"VARCHAR(8)"},{"n":"EMBARCAR_A","t":"VARCHAR(160)"},{"n":"ESTADO","t":"VARCHAR(1)"},{"n":"FCH_HORA_ANULACION","t":"DATETIME"},{"n":"FCH_HORA_APLICACION","t":"DATETIME"},{"n":"FCH_HORA_APROBACIO","t":"DATETIME"},{"n":"FCH_HORA_CREACION","t":"DATETIME"},{"n":"FCH_HORA_ULT_MODIF","t":"DATETIME"},{"n":"FECHA","t":"DATETIME"},{"n":"GENERA_GUIA_REMISION","t":"VARCHAR(1)"},{"n":"NOTAS_TRANSPORTE","t":"VARCHAR(255)"},{"n":"OBSERVACIONES","t":"TEXT"},{"n":"TIPO_PAGO","t":"VARCHAR(10)"},{"n":"TRANSPORTISTA","t":"VARCHAR(80)"},{"n":"USUARIO_ANULACION","t":"VARCHAR(50)"},{"n":"USUARIO_APLICACION","t":"VARCHAR(50)"},{"n":"USUARIO_APROBACION","t":"VARCHAR(50)"},{"n":"USUARIO_CREACION","t":"VARCHAR(50)"},{"n":"USUARIO_ULT_MODIF","t":"VARCHAR(50)"}]},"DESPACHO_DETALLE":{"m":"FA","d":"","f":[{"n":"ARTICULO","t":"VARCHAR(20)"},{"n":"BODEGA","t":"VARCHAR(4)"},{"n":"CANTIDAD","t":"DECIMAL"},{"n":"CONSEC_TINV_FIN","t":"INT"},{"n":"CONSEC_TINV_INI","t":"INT"},{"n":"COSTO_DOLAR","t":"DECIMAL"},{"n":"COSTO_DOLAR_COMP","t":"DECIMAL"},{"n":"COSTO_LOCAL","t":"DECIMAL"},{"n":"COSTO_LOCAL_COMP","t":"DECIMAL"},{"n":"DESPACHO","t":"VARCHAR(20)"},{"n":"DOCUM_ORIG","t":"VARCHAR(50)"},{"n":"LINEA","t":"INT"},{"n":"LINEA_DOCUM_ORIG","t":"INT"},{"n":"LINEA_KIT","t":"INT"},{"n":"LOCALIZACION","t":"VARCHAR(8)"},{"n":"LOTE","t":"VARCHAR(15)"},{"n":"SERIE_CADENA","t":"INT"},{"n":"TIPO_DOCUM_ORIG","t":"VARCHAR(1)"},{"n":"TIPO_LINEA","t":"VARCHAR(1)"}]},"DESPACHO_DETALLE_SINCRO":{"m":"","d":"","f":[{"n":"ARTICULO","t":"VARCHAR(20)"},{"n":"BODEGA","t":"VARCHAR(4)"},{"n":"CANTIDAD","t":"DECIMAL"},{"n":"COSTO_DOLAR","t":"DECIMAL"},{"n":"COSTO_LOCAL","t":"DECIMAL"},{"n":"DESPACHO","t":"VARCHAR(12)"},{"n":"DOCUM_ORIG","t":"VARCHAR(50)"},{"n":"ID_PDA","t":"VARCHAR(15)"},{"n":"ID_SINCRO","t":"VARCHAR(15)"},{"n":"LINEA","t":"INT"},{"n":"LINEA_DOCUM_ORIG","t":"INT"},{"n":"LOCALIZACION","t":"VARCHAR(8)"},{"n":"LOTE","t":"VARCHAR(15)"},{"n":"TIPO_DOCUM_ORIG","t":"VARCHAR(1)"},{"n":"TIPO_LINEA","t":"VARCHAR(1)"}]},"DESPACHO_SINCRO":{"m":"","d":"","f":[{"n":"ASIENTO_DESPACHADO","t":"VARCHAR(10)"},{"n":"CARGADO_CG","t":"VARCHAR(1)"},{"n":"CLIENTE","t":"VARCHAR(20)"},{"n":"CONSECUTIVO","t":"VARCHAR(10)"},{"n":"DESPACHO","t":"VARCHAR(12)"},{"n":"DIRECCION_EMBARQUE","t":"VARCHAR(4)"},{"n":"EMBARQUE_A","t":"VARCHAR(80)"},{"n":"ESTADO","t":"VARCHAR(1)"},{"n":"FCH_HORA_CREACION","t":"DATETIME"},{"n":"FECHA","t":"DATETIME"},{"n":"ID_PDA","t":"VARCHAR(15)"},{"n":"ID_SINCRO","t":"VARCHAR(15)"},{"n":"NOTAS_TRANSPORTE","t":"VARCHAR(255)"},{"n":"OBSERVACIONES","t":"TEXT"},{"n":"TRANSPORTISTA","t":"VARCHAR(80)"},{"n":"USUARIO_CREACION","t":"VARCHAR(50)"}]},"DESTINATARIO":{"m":"","d":"","f":[{"n":"CELULAR","t":"VARCHAR(25)"},{"n":"CORREO_ELECTRONICO","t":"VARCHAR(60)"},{"n":"DESTINATARIO","t":"INT"},{"n":"NOMBRE","t":"VARCHAR(80)"}]},"DET_DOCUMENTO_EMBARQUE":{"m":"CO","d":"Embarques de importación: proveedor, origen, fechas y costos totales.","f":[{"n":"DOCUMENTO","t":"VARCHAR(50)"},{"n":"EMBARQUE","t":"VARCHAR(10)"},{"n":"MONTO_APLICAR","t":"DECIMAL"},{"n":"PROVEEDOR","t":"VARCHAR(20)"},{"n":"TIPO_DOCUMENTO","t":"VARCHAR(1)"}]},"DET_DOCUMENTO_ORDEN":{"m":"","d":"","f":[{"n":"DOCUMENTO","t":"VARCHAR(50)"},{"n":"ORDEN_COMPRA","t":"VARCHAR(10)"},{"n":"PROVEEDOR","t":"VARCHAR(20)"},{"n":"TIPO_DOCUMENTO","t":"VARCHAR(1)"}]},"DET_LIN_EMBARQUE":{"m":"CO","d":"Embarques de importación: proveedor, origen, fechas y costos totales.","f":[{"n":"BODEGA","t":"VARCHAR(4)"},{"n":"CANT_RECHAZADA","t":"DECIMAL"},{"n":"CANT_RECHAZADA_UA","t":"DECIMAL"},{"n":"CANT_RECIBIDA","t":"DECIMAL"},{"n":"CANT_RECIBIDA_UA","t":"DECIMAL"},{"n":"EMBARQUE","t":"VARCHAR(10)"},{"n":"EMBARQUE_LINEA","t":"INT"},{"n":"LOCALIZACION","t":"VARCHAR(8)"},{"n":"LOTE","t":"VARCHAR(15)"},{"n":"SECUENCIA","t":"INT"},{"n":"SERIE_CADENA","t":"INT"}]},"DET_MOD_RETENCION":{"m":"","d":"Retenciones fiscales aplicadas en documentos de compra o venta.","f":[{"n":"APLICA","t":"VARCHAR(1)"},{"n":"CODIGO_RETENCION","t":"VARCHAR(4)"},{"n":"MODELO_RETENCION","t":"VARCHAR(4)"}]},"DET_NOM_ELECT":{"m":"","d":"","f":[{"n":"AFC","t":"DECIMAL"},{"n":"ALIMEN_NO_PAGO_SALARIAL","t":"DECIMAL"},{"n":"ALIMEN_PAGO_SALARIAL","t":"DECIMAL"},{"n":"ALTO_RIESGO_PENSION","t":"VARCHAR(1)"},{"n":"AMBIENTE","t":"VARCHAR(5)"},{"n":"ANTICIPO","t":"DECIMAL"},{"n":"ANTICIPO_DEDUCCION","t":"DECIMAL"},{"n":"APOYO_SOST","t":"DECIMAL"},{"n":"AUXILIO_NO_SALARIAL","t":"DECIMAL"},{"n":"AUXILIO_SALARIAL","t":"DECIMAL"},{"n":"AUXILIO_TRANSPORTE","t":"DECIMAL"},{"n":"BANCO","t":"VARCHAR(40)"},{"n":"BONIF_RETIRO","t":"DECIMAL"},{"n":"BONIFICACION_NO_SALARIAL","t":"DECIMAL"},{"n":"BONIFICACION_SALARIAL","t":"DECIMAL"},{"n":"BONO_NO_PAGO_SALARIAL","t":"DECIMAL"},{"n":"BONO_PAGO_SALARIAL","t":"DECIMAL"},{"n":"CANT_HUELGA","t":"DECIMAL"},{"n":"CANT_LICENCIA_MP","t":"DECIMAL"},{"n":"CANT_LICENCIA_NR","t":"DECIMAL"},{"n":"CANT_LICENCIA_R","t":"DECIMAL"},{"n":"CANT_VAC_COMPENSADAS","t":"DECIMAL"},{"n":"CANT_VAC_COMUNES","t":"DECIMAL"},{"n":"CESANTIAS_CANTIDAD","t":"DECIMAL"},{"n":"CESANTIAS_INT","t":"DECIMAL"}]},"DET_NOM_ELECT_EMP":{"m":"","d":"","f":[{"n":"CODIGO_TRABAJADOR","t":"VARCHAR(20)"},{"n":"CONSEC_NIE","t":"VARCHAR(100)"},{"n":"CONSECUTIVO","t":"VARCHAR(100)"},{"n":"CUNE","t":"VARCHAR(254)"},{"n":"CUNE_NOV","t":"VARCHAR(254)"},{"n":"ES_NOVEDAD","t":"VARCHAR(1)"},{"n":"ESTADO","t":"VARCHAR(1)"},{"n":"FECHA_HORA_ARCHIVO","t":"VARCHAR(200)"},{"n":"ID","t":"INT"},{"n":"ID_NIE","t":"INT"},{"n":"ID_PREDECESOR","t":"INT"},{"n":"NOMINAS","t":"VARCHAR(4000)"},{"n":"PERIODO","t":"DATETIME"},{"n":"TIPO_XML","t":"VARCHAR(10)"}]},"DET_NOM_ELECT_OTROS":{"m":"","d":"","f":[{"n":"CANTIDAD","t":"DECIMAL"},{"n":"CODIGO_TRABAJADOR","t":"VARCHAR(20)"},{"n":"DESCRIPCION","t":"VARCHAR(40)"},{"n":"FECHA","t":"DATETIME"},{"n":"ID","t":"INT"},{"n":"PAGO","t":"DECIMAL"},{"n":"PERIODO","t":"DATETIME"},{"n":"PORCENTAJE","t":"DECIMAL"},{"n":"RUBRO","t":"VARCHAR(40)"},{"n":"TIPO_XML","t":"VARCHAR(10)"}]},"DET_SOLICITUD_AF_NOTIF":{"m":"","d":"","f":[{"n":"ACTIVO_FIJO","t":"VARCHAR(10)"},{"n":"SOLICITUD","t":"INT"}]},"DET_TIPOSERVICIO_CB":{"m":"","d":"","f":[{"n":"CONSECUTIVO","t":"INT"},{"n":"CUENTA_BANCO","t":"VARCHAR(20)"},{"n":"FASE","t":"VARCHAR(25)"},{"n":"MONTO_BANCO","t":"DECIMAL"},{"n":"MONTO_DOLAR","t":"DECIMAL"},{"n":"MONTO_LOCAL","t":"DECIMAL"},{"n":"NUMERO","t":"DECIMAL"},{"n":"PROYECTO","t":"VARCHAR(25)"},{"n":"TIPO_DOCUMENTO","t":"VARCHAR(3)"},{"n":"TIPO_SERVICIO","t":"VARCHAR(10)"}]},"DET_TIPOSERVICIO_CC":{"m":"","d":"","f":[{"n":"CONSECUTIVO","t":"INT"},{"n":"DOCUMENTO","t":"VARCHAR(50)"},{"n":"FASE","t":"VARCHAR(25)"},{"n":"MONTO_CLIENTE","t":"DECIMAL"},{"n":"MONTO_DOLAR","t":"DECIMAL"},{"n":"MONTO_LOCAL","t":"DECIMAL"},{"n":"PROYECTO","t":"VARCHAR(25)"},{"n":"TIPO","t":"VARCHAR(3)"},{"n":"TIPO_SERVICIO","t":"VARCHAR(10)"}]},"DET_TIPOSERVICIO_CP":{"m":"","d":"","f":[{"n":"CONSECUTIVO","t":"INT"},{"n":"DOCUMENTO","t":"VARCHAR(50)"},{"n":"FASE","t":"VARCHAR(25)"},{"n":"MONTO_DOLAR","t":"DECIMAL"},{"n":"MONTO_LOCAL","t":"DECIMAL"},{"n":"MONTO_PROVEEDOR","t":"DECIMAL"},{"n":"PROVEEDOR","t":"VARCHAR(20)"},{"n":"PROYECTO","t":"VARCHAR(25)"},{"n":"TIPO","t":"VARCHAR(3)"},{"n":"TIPO_SERVICIO","t":"VARCHAR(10)"}]},"DET_TRANS_CB":{"m":"","d":"Transacciones bancarias: depósitos, retiros y transferencias.","f":[{"n":"BENEFICIARIO","t":"VARCHAR(150)"},{"n":"COMPANIA_DESTINO","t":"VARCHAR(10)"},{"n":"CONCEPTO","t":"VARCHAR(100)"},{"n":"CONSECUTIVO","t":"DECIMAL"},{"n":"CONTRIBUYENTE","t":"VARCHAR(20)"},{"n":"CTA_CIERRE_TERCEROS","t":"VARCHAR(25)"},{"n":"CTR_CIERRE_TERCEROS","t":"VARCHAR(25)"},{"n":"CUENTA_DESTINO","t":"VARCHAR(50)"},{"n":"CUENTA_ORIGEN","t":"VARCHAR(20)"},{"n":"ENTIDAD_FINANCIERA","t":"VARCHAR(8)"},{"n":"METODO_PAGO","t":"VARCHAR(10)"},{"n":"MONEDA","t":"VARCHAR(4)"},{"n":"MONTO_COMISION","t":"DECIMAL"},{"n":"MONTO_DESTINO","t":"DECIMAL"},{"n":"MONTO_ORIGEN","t":"DECIMAL"},{"n":"NUMERO_DESTINO","t":"DECIMAL"},{"n":"NUMERO_ORIGEN","t":"DECIMAL"},{"n":"RUBRO1_DETTRANS","t":"VARCHAR(100)"},{"n":"RUBRO10_DETTRANS","t":"VARCHAR(100)"},{"n":"RUBRO2_DETTRANS","t":"VARCHAR(100)"},{"n":"RUBRO3_DETTRANS","t":"VARCHAR(100)"},{"n":"RUBRO4_DETTRANS","t":"VARCHAR(100)"},{"n":"RUBRO5_DETTRANS","t":"VARCHAR(100)"},{"n":"RUBRO6_DETTRANS","t":"VARCHAR(100)"},{"n":"RUBRO7_DETTRANS","t":"VARCHAR(100)"}]},"DETALLE_COMPLEMENTO_SUNAT":{"m":"","d":"","f":[{"n":"ARTICULO","t":"VARCHAR(20)"},{"n":"CANTIDAD","t":"DECIMAL"},{"n":"COMPLEMENTO_SUNAT","t":"VARCHAR(50)"},{"n":"DESCRIPCION","t":"VARCHAR(254)"},{"n":"LINEA","t":"INT"},{"n":"SERIE_DAM","t":"VARCHAR(10)"},{"n":"TIPO_DOCUMENTO","t":"VARCHAR(3)"},{"n":"UNIDAD_MEDIDA","t":"VARCHAR(6)"}]},"DETALLE_CONTINGENCIA_SLV":{"m":"","d":"","f":[{"n":"CODIGO_GENERACION","t":"VARCHAR(36)"},{"n":"CONTINGENCIA","t":"VARCHAR(50)"},{"n":"NUMERO_DOCUMENTO","t":"VARCHAR(50)"},{"n":"TIPO_DOCUMENTO","t":"VARCHAR(3)"}]},"DETALLE_CORRIDA":{"m":"","d":"","f":[{"n":"ASIENTO_CORP","t":"VARCHAR(10)"},{"n":"ASIENTO_DISTRIBUID","t":"VARCHAR(10)"},{"n":"ASIENTO_FISCAL","t":"VARCHAR(10)"},{"n":"CONSECUTIVO","t":"INT"},{"n":"CORRIDA_AD","t":"INT"}]},"DETALLE_DIRECCION":{"m":"","d":"Direcciones de clientes, proveedores o empleados: fiscal, cobro, entrega.","f":[{"n":"CAMPO_1","t":"VARCHAR(250)"},{"n":"CAMPO_10","t":"VARCHAR(250)"},{"n":"CAMPO_2","t":"VARCHAR(250)"},{"n":"CAMPO_3","t":"VARCHAR(250)"},{"n":"CAMPO_4","t":"VARCHAR(250)"},{"n":"CAMPO_5","t":"VARCHAR(250)"},{"n":"CAMPO_6","t":"VARCHAR(250)"},{"n":"CAMPO_7","t":"VARCHAR(250)"},{"n":"CAMPO_8","t":"VARCHAR(250)"},{"n":"CAMPO_9","t":"VARCHAR(250)"},{"n":"DETALLE_DIRECCION","t":"INT"},{"n":"DIRECCION","t":"VARCHAR(10)"},{"n":"id_cat_DETALLE_DIRECCION","t":"INT"}]},"DETALLE_EQUIPO":{"m":"","d":"","f":[{"n":"BOLETA","t":"VARCHAR(14)"},{"n":"CAR_TIPO_EQUIPO_CS","t":"VARCHAR(5)"},{"n":"DETALLE","t":"VARCHAR(40)"},{"n":"TIPO_EQUIPO_CS","t":"VARCHAR(5)"}]},"DETALLE_FACTURA_RETENCION":{"m":"FA","d":"Retenciones fiscales aplicadas en documentos de compra o venta.","f":[{"n":"ARTICULO","t":"VARCHAR(20)"},{"n":"BASE_RETENCION","t":"DECIMAL"},{"n":"FACTURA","t":"VARCHAR(50)"},{"n":"FACTURA_LINEA","t":"INT"},{"n":"MONTO_RETENCION","t":"DECIMAL"},{"n":"RETENCION","t":"VARCHAR(4)"},{"n":"TIPO_DOC","t":"VARCHAR(3)"}]},"DETALLE_PREASIENTO":{"m":"","d":"Cabecera de asientos contables generados por módulos auxiliares o manual.","f":[{"n":"ASIENTO","t":"VARCHAR(10)"},{"n":"BASE_DOLAR","t":"DECIMAL"},{"n":"BASE_LOCAL","t":"DECIMAL"},{"n":"CENTRO_COSTO","t":"VARCHAR(25)"},{"n":"CONSECUTIVO","t":"INT"},{"n":"CREDITO_DOLAR","t":"DECIMAL"},{"n":"CREDITO_LOCAL","t":"DECIMAL"},{"n":"CREDITO_UNIDADES","t":"DECIMAL"},{"n":"CUENTA_CONTABLE","t":"VARCHAR(25)"},{"n":"DEBITO_DOLAR","t":"DECIMAL"},{"n":"DEBITO_LOCAL","t":"DECIMAL"},{"n":"DEBITO_UNIDADES","t":"DECIMAL"},{"n":"FASE","t":"VARCHAR(25)"},{"n":"FUENTE","t":"VARCHAR(40)"},{"n":"NIT","t":"VARCHAR(20)"},{"n":"PROCESO","t":"VARCHAR(10)"},{"n":"PROYECTO","t":"VARCHAR(25)"},{"n":"REFERENCIA","t":"VARCHAR(249)"},{"n":"TIPO_CAMBIO","t":"DECIMAL"}]},"DETALLE_RETENCION":{"m":"","d":"Retenciones fiscales aplicadas en documentos de compra o venta.","f":[{"n":"ASIENTO","t":"VARCHAR(10)"},{"n":"AUTORETENEDORA","t":"VARCHAR(1)"},{"n":"BASE","t":"DECIMAL"},{"n":"CLASE_DOC_ES","t":"VARCHAR(3)"},{"n":"COD_GENERACION_SLV","t":"VARCHAR(100)"},{"n":"CODIGO_RETENCION","t":"VARCHAR(4)"},{"n":"CONTROL_INTERNO","t":"VARCHAR(20)"},{"n":"DOCUMENTO","t":"VARCHAR(50)"},{"n":"DTE_SLV","t":"VARCHAR(100)"},{"n":"ESTADO","t":"VARCHAR(1)"},{"n":"FECHA_CONTABLE","t":"DATETIME"},{"n":"FECHA_DOCUMENTO","t":"DATETIME"},{"n":"FECHA_RIGE","t":"DATETIME"},{"n":"FOLIO_FISCAL_RELACIONADO","t":"VARCHAR(40)"},{"n":"MASCARA_DTE","t":"VARCHAR(50)"},{"n":"MONTO","t":"DECIMAL"},{"n":"PAGADA","t":"VARCHAR(1)"},{"n":"PROVEEDOR","t":"VARCHAR(20)"},{"n":"RESOLUCION","t":"VARCHAR(22)"},{"n":"RETENCION","t":"VARCHAR(50)"},{"n":"SALDO_CANCELAR","t":"DECIMAL"},{"n":"SELLO_RECEPCION_SLV","t":"VARCHAR(100)"},{"n":"SERIE","t":"VARCHAR(13)"},{"n":"SERIE_NUMERO","t":"VARCHAR(22)"},{"n":"TIPO","t":"VARCHAR(3)"}]},"DETALLE_RETENCION_CO":{"m":"","d":"Retenciones fiscales aplicadas en documentos de compra o venta.","f":[{"n":"AUTORETENEDORA","t":"VARCHAR(1)"},{"n":"BASE","t":"DECIMAL"},{"n":"CALCULA_PROVEEDOR","t":"VARCHAR(1)"},{"n":"CLASE_DOC_ES","t":"VARCHAR(3)"},{"n":"CODIGO_GENERADOR","t":"VARCHAR(100)"},{"n":"CODIGO_RETENCION","t":"VARCHAR(4)"},{"n":"CONSECUTIVO","t":"VARCHAR(50)"},{"n":"CONTROL_INTERNO","t":"VARCHAR(20)"},{"n":"DOCUMENTO","t":"VARCHAR(50)"},{"n":"DTE","t":"VARCHAR(100)"},{"n":"ESTADO_DOC_DTE","t":"VARCHAR(50)"},{"n":"FECHA_CONTABLE","t":"DATETIME"},{"n":"FECHA_DOCUMENTO","t":"DATETIME"},{"n":"FECHA_RIGE","t":"DATETIME"},{"n":"FOLIO_FISCAL_RELACIONADO","t":"VARCHAR(40)"},{"n":"MASCARA_DTE","t":"VARCHAR(100)"},{"n":"MONTO","t":"DECIMAL"},{"n":"PROVEEDOR","t":"VARCHAR(20)"},{"n":"RESOLUCION","t":"VARCHAR(100)"},{"n":"SELLO_RECEPCION","t":"VARCHAR(100)"},{"n":"SERIE","t":"VARCHAR(100)"},{"n":"SERIE_NUMERO","t":"VARCHAR(100)"},{"n":"TIPO_DOCUMENTO","t":"VARCHAR(1)"},{"n":"TIPO_RELACION","t":"VARCHAR(2)"}]},"DEVOL_LIN_EMBARQUE":{"m":"CO","d":"Embarques de importación: proveedor, origen, fechas y costos totales.","f":[{"n":"BASE_IMPUESTO1","t":"DECIMAL"},{"n":"BASE_IMPUESTO2","t":"DECIMAL"},{"n":"BIEN_SERVICIO","t":"VARCHAR(1)"},{"n":"BODEGA","t":"VARCHAR(4)"},{"n":"CANT_DEVUELTA","t":"DECIMAL"},{"n":"CANT_DEVUELTAUA","t":"DECIMAL"},{"n":"CODIGO_IMPUESTO","t":"VARCHAR(4)"},{"n":"DESCUENTO","t":"DECIMAL"},{"n":"DESCUENTO_LINEA","t":"DECIMAL"},{"n":"DEVOLUCION","t":"VARCHAR(50)"},{"n":"DEVOLUCION_LINEA","t":"INT"},{"n":"EMBARQUE","t":"VARCHAR(10)"},{"n":"EMBARQUE_LINEA","t":"INT"},{"n":"IMP1_AFECTACOSTO","t":"VARCHAR(1)"},{"n":"IMP1_ASUMIDO_DESC","t":"DECIMAL"},{"n":"IMP1_ASUMIDO_NODESC","t":"DECIMAL"},{"n":"IMP1_RETENIDO_DESC","t":"DECIMAL"},{"n":"IMP1_RETENIDO_NODESC","t":"DECIMAL"},{"n":"IMP2_AFECTACOSTO","t":"VARCHAR(1)"},{"n":"IMPORTE","t":"DECIMAL"},{"n":"IMPUESTO1","t":"DECIMAL"},{"n":"IMPUESTO2","t":"DECIMAL"},{"n":"INDICADOR_FACTURACION","t":"VARCHAR(5)"},{"n":"LOCALIZACION","t":"VARCHAR(8)"},{"n":"LOTE","t":"VARCHAR(15)"}]},"DEVOLUCION":{"m":"FA","d":"Devoluciones de mercancía de clientes o a proveedores.","f":[{"n":"ACTIVIDAD_COMERCIAL","t":"VARCHAR(10)"},{"n":"AFECTA_ORDEN","t":"VARCHAR(1)"},{"n":"AJUSTE_CONFIG","t":"VARCHAR(4)"},{"n":"ANIO_DUA","t":"INT"},{"n":"APLICACION","t":"VARCHAR(40)"},{"n":"ASIENTO","t":"VARCHAR(10)"},{"n":"AUDIT_TRANS_INV","t":"INT"},{"n":"CAI","t":"VARCHAR(50)"},{"n":"CLASE_DOC_ES","t":"VARCHAR(3)"},{"n":"CLASIFICACION","t":"VARCHAR(4)"},{"n":"COD_CONSECUTIVO","t":"VARCHAR(10)"},{"n":"CODIGO_GENERADOR","t":"VARCHAR(100)"},{"n":"CODIGOQR","t":"VARCHAR"},{"n":"CONSECUTIVO_DOC","t":"VARCHAR(10)"},{"n":"CONTROL_INTERNO","t":"VARCHAR(20)"},{"n":"CUFE","t":"VARCHAR(100)"},{"n":"DEDUC_COSTO_ENAJENA","t":"DECIMAL"},{"n":"DEVOLUCION","t":"VARCHAR(50)"},{"n":"DOCUMENTO_DEBITO","t":"VARCHAR(1)"},{"n":"DOCUMENTO_FISCAL","t":"VARCHAR(50)"},{"n":"DTE","t":"VARCHAR(100)"},{"n":"EMBARQUE","t":"VARCHAR(10)"},{"n":"ESTADO","t":"VARCHAR(1)"},{"n":"ESTADO_COMPROBANTE","t":"VARCHAR(50)"},{"n":"FECHA_CAI","t":"DATETIME"}]},"DGII_607_PREVIA":{"m":"","d":"","f":[{"n":"CERTIF","t":"DECIMAL"},{"n":"CHQ_TRANS_DEP","t":"DECIMAL"},{"n":"CLIENTE","t":"VARCHAR(20)"},{"n":"CLIENTE_GENERICO","t":"VARCHAR(1)"},{"n":"DOCUMENTO","t":"VARCHAR(50)"},{"n":"EFECTIVO","t":"DECIMAL"},{"n":"FECHA_COMPROBANTE","t":"DATETIME"},{"n":"FECHA_ORIGINAL","t":"DATETIME"},{"n":"FECHA_RETENCION","t":"DATETIME"},{"n":"FECHA_VENCE_COMPROBANTE","t":"DATETIME"},{"n":"IDENTIFICACION","t":"VARCHAR(254)"},{"n":"IDENTIFICACION_FAC","t":"VARCHAR(20)"},{"n":"ISC_FACTURADO","t":"DECIMAL"},{"n":"ITBIS_FACTURADO","t":"DECIMAL"},{"n":"MODULO","t":"VARCHAR(2)"},{"n":"MONEDA","t":"VARCHAR(4)"},{"n":"MONTO_FACTURADO","t":"DECIMAL"},{"n":"MONTO_RET_ITBIS","t":"DECIMAL"},{"n":"MONTO_RET_RENTA","t":"DECIMAL"},{"n":"MONTO_TOTAL","t":"DECIMAL"},{"n":"NCF","t":"VARCHAR(50)"},{"n":"NCF_MODIFICADO","t":"VARCHAR(50)"},{"n":"OTRAS_FORMAS","t":"DECIMAL"},{"n":"OTROS_IMPUESTOS","t":"DECIMAL"},{"n":"PERMUTA","t":"DECIMAL"}]},"DIARIO":{"m":"","d":"","f":[{"n":"ASIENTO","t":"VARCHAR(10)"},{"n":"BASE_DOLAR","t":"DECIMAL"},{"n":"BASE_LOCAL","t":"DECIMAL"},{"n":"CENTRO_COSTO","t":"VARCHAR(25)"},{"n":"CONSECUTIVO","t":"INT"},{"n":"CREDITO_DOLAR","t":"DECIMAL"},{"n":"CREDITO_LOCAL","t":"DECIMAL"},{"n":"CREDITO_UNIDADES","t":"DECIMAL"},{"n":"CUENTA_CONTABLE","t":"VARCHAR(25)"},{"n":"DEBITO_DOLAR","t":"DECIMAL"},{"n":"DEBITO_LOCAL","t":"DECIMAL"},{"n":"DEBITO_UNIDADES","t":"DECIMAL"},{"n":"DOCUMENTO_GLOBAL","t":"VARCHAR(50)"},{"n":"FASE","t":"VARCHAR(25)"},{"n":"FUENTE","t":"VARCHAR(40)"},{"n":"NIT","t":"VARCHAR(20)"},{"n":"PROYECTO","t":"VARCHAR(25)"},{"n":"REFERENCIA","t":"VARCHAR(249)"},{"n":"TIPO_CAMBIO","t":"DECIMAL"}]},"DIAS_FERIADOS":{"m":"","d":"","f":[{"n":"ANO","t":"INT"},{"n":"DESCRIPCION","t":"VARCHAR(100)"},{"n":"DIA","t":"INT"},{"n":"ID_FERIADO","t":"INT"},{"n":"MES","t":"INT"},{"n":"TIPO","t":"VARCHAR(1)"}]},"DIFERIDO":{"m":"CG","d":"","f":[{"n":"AMORTIZACION_DOL_C","t":"DECIMAL"},{"n":"AMORTIZACION_DOL_F","t":"DECIMAL"},{"n":"AMORTIZACION_LOC_C","t":"DECIMAL"},{"n":"AMORTIZACION_LOC_F","t":"DECIMAL"},{"n":"AMORTIZADO","t":"DECIMAL"},{"n":"AMORTIZADO_DOL_C","t":"DECIMAL"},{"n":"AMORTIZADO_DOL_F","t":"DECIMAL"},{"n":"AMORTIZADO_LOC_C","t":"DECIMAL"},{"n":"AMORTIZADO_LOC_F","t":"DECIMAL"},{"n":"ASIENTO","t":"VARCHAR(10)"},{"n":"ASIENTO_CORP","t":"VARCHAR(10)"},{"n":"CONCEPTO_ME","t":"VARCHAR(4)"},{"n":"COSTO_DOL_C","t":"DECIMAL"},{"n":"COSTO_DOL_F","t":"DECIMAL"},{"n":"COSTO_LOC_C","t":"DECIMAL"},{"n":"COSTO_LOC_F","t":"DECIMAL"},{"n":"CTA_AMORTIZACION","t":"VARCHAR(25)"},{"n":"CTA_CONTRAASIENTO","t":"VARCHAR(25)"},{"n":"CTA_DIFERIDO","t":"VARCHAR(25)"},{"n":"CTA_GASTOINGRESO","t":"VARCHAR(25)"},{"n":"CTR_AMORTIZACION","t":"VARCHAR(25)"},{"n":"CTR_CONTRAASIENTO","t":"VARCHAR(25)"},{"n":"CTR_DIFERIDO","t":"VARCHAR(25)"},{"n":"CTR_GASTOINGRESO","t":"VARCHAR(25)"},{"n":"DESCRIPCION","t":"VARCHAR(250)"}]},"DIFERIDO_DOC_CC":{"m":"CG","d":"","f":[{"n":"DIFERIDO","t":"VARCHAR(53)"},{"n":"DOCUMENTO","t":"VARCHAR(50)"},{"n":"TIPO_DOC","t":"VARCHAR(3)"}]},"DIFERIDO_DOC_CP":{"m":"CG","d":"","f":[{"n":"DIFERIDO","t":"VARCHAR(53)"},{"n":"DOCUMENTO","t":"VARCHAR(50)"},{"n":"PROVEEDOR","t":"VARCHAR(20)"},{"n":"TIPO_DOC","t":"VARCHAR(3)"}]},"DIFERIDOS_IMPUESTOS":{"m":"CG","d":"Configuración de impuestos: tasas, tipos y reglas de aplicación.","f":[{"n":"CONCEPTO_ME","t":"VARCHAR(4)"},{"n":"CONSECUTIVO","t":"INT"},{"n":"DIFERIDO","t":"VARCHAR(53)"},{"n":"IMPUESTO","t":"VARCHAR(4)"},{"n":"IMPUESTO_AFECTA_COSTO","t":"VARCHAR(1)"},{"n":"IMPUESTO_ASUMIDO","t":"VARCHAR(1)"},{"n":"PORCENTAJE","t":"DECIMAL"},{"n":"TIPO_IMPUESTO","t":"VARCHAR(5)"},{"n":"VALOR","t":"DECIMAL"}]},"DIRECC_EMBARQUE":{"m":"CO","d":"Embarques de importación: proveedor, origen, fechas y costos totales.","f":[{"n":"CARGO","t":"VARCHAR(30)"},{"n":"CLIENTE","t":"VARCHAR(20)"},{"n":"CONTACTO","t":"VARCHAR(30)"},{"n":"DESCRIPCION","t":"TEXT"},{"n":"DETALLE_DIRECCION","t":"INT"},{"n":"DIRECCION","t":"VARCHAR(8)"},{"n":"EMAIL","t":"VARCHAR(40)"},{"n":"FAX","t":"VARCHAR(50)"},{"n":"PS_AFV_ID_DIRECC_EMBARQUE","t":"INT"},{"n":"TELEFONO1","t":"VARCHAR(50)"},{"n":"TELEFONO2","t":"VARCHAR(50)"}]},"DIRECCION":{"m":"AS","d":"Direcciones de clientes, proveedores o empleados: fiscal, cobro, entrega.","f":[{"n":"DESCRIPCION","t":"VARCHAR(40)"},{"n":"DIRECCION","t":"VARCHAR(10)"},{"n":"FECHA_CREACION","t":"DATETIME"},{"n":"FECHA_ULT_MODIF","t":"DATETIME"},{"n":"NOMBRE_CAMPO_1","t":"VARCHAR(60)"},{"n":"NOMBRE_CAMPO_10","t":"VARCHAR(60)"},{"n":"NOMBRE_CAMPO_2","t":"VARCHAR(60)"},{"n":"NOMBRE_CAMPO_3","t":"VARCHAR(60)"},{"n":"NOMBRE_CAMPO_4","t":"VARCHAR(60)"},{"n":"NOMBRE_CAMPO_5","t":"VARCHAR(60)"},{"n":"NOMBRE_CAMPO_6","t":"VARCHAR(60)"},{"n":"NOMBRE_CAMPO_7","t":"VARCHAR(60)"},{"n":"NOMBRE_CAMPO_8","t":"VARCHAR(60)"},{"n":"NOMBRE_CAMPO_9","t":"VARCHAR(60)"},{"n":"USUARIO_CREACION","t":"VARCHAR(50)"},{"n":"USUARIO_ULT_MODIF","t":"VARCHAR(50)"}]},"DIRECCION_EMBARQUE":{"m":"AS","d":"Embarques de importación: proveedor, origen, fechas y costos totales.","f":[{"n":"CODIGO_DIRECCION","t":"VARCHAR(4)"},{"n":"DESC_UBIC_GEOGRAFICA","t":"VARCHAR(12)"},{"n":"DESCRIPCION","t":"VARCHAR(40)"},{"n":"DIRECCION","t":"TEXT"},{"n":"DIVISION_GEOGRAFICA1","t":"VARCHAR(12)"},{"n":"DIVISION_GEOGRAFICA2","t":"VARCHAR(12)"},{"n":"PAIS","t":"VARCHAR(4)"}]},"DISCAPACIDAD":{"m":"","d":"Tabla de catálogo/maestro de referencia con código y descripción.","f":[{"n":"CODIGO","t":"INT"},{"n":"DESCRIPCION","t":"VARCHAR(150)"}]},"DIVISION_GEOGRAFICA1":{"m":"","d":"Divisiones geográficas o comerciales para segmentación de análisis.","f":[{"n":"DIVISION_GEOGRAFICA1","t":"VARCHAR(12)"},{"n":"NOMBRE","t":"VARCHAR(40)"},{"n":"PAIS","t":"VARCHAR(4)"}]},"DIVISION_GEOGRAFICA2":{"m":"","d":"Divisiones geográficas o comerciales para segmentación de análisis.","f":[{"n":"DIVISION_GEOGRAFICA1","t":"VARCHAR(12)"},{"n":"DIVISION_GEOGRAFICA2","t":"VARCHAR(12)"},{"n":"NOMBRE","t":"VARCHAR(40)"},{"n":"PAIS","t":"VARCHAR(4)"},{"n":"PS_AFV_ID_ESTADO","t":"INT"}]},"DIVISION_GEOGRAFICA3":{"m":"","d":"Divisiones geográficas o comerciales para segmentación de análisis.","f":[{"n":"DIVISION_GEOGRAFICA1","t":"VARCHAR(12)"},{"n":"DIVISION_GEOGRAFICA2","t":"VARCHAR(12)"},{"n":"DIVISION_GEOGRAFICA3","t":"VARCHAR(12)"},{"n":"NOMBRE","t":"VARCHAR(40)"},{"n":"PAIS","t":"VARCHAR(4)"},{"n":"PS_AFV_ID_CIUDAD","t":"INT"}]},"DIVISION_GEOGRAFICA4":{"m":"","d":"Divisiones geográficas o comerciales para segmentación de análisis.","f":[{"n":"DIVISION_GEOGRAFICA1","t":"VARCHAR(12)"},{"n":"DIVISION_GEOGRAFICA2","t":"VARCHAR(12)"},{"n":"DIVISION_GEOGRAFICA3","t":"VARCHAR(12)"},{"n":"DIVISION_GEOGRAFICA4","t":"VARCHAR(12)"},{"n":"NOMBRE","t":"VARCHAR(40)"},{"n":"PAIS","t":"VARCHAR(4)"}]},"DM_TIPO_ESCALA":{"m":"","d":"","f":[{"n":"DESCRIPCION","t":"VARCHAR(80)"},{"n":"ESTADO","t":"VARCHAR(1)"},{"n":"FECHA_APROBACION","t":"DATETIME"},{"n":"FECHA_CANCELACION","t":"DATETIME"},{"n":"FECHA_CREACION","t":"DATETIME"},{"n":"FECHA_RIGE","t":"DATETIME"},{"n":"TIPO_ESCALA","t":"VARCHAR(10)"},{"n":"USUARIO_APROBACION","t":"VARCHAR(50)"},{"n":"USUARIO_CANCELACION","t":"VARCHAR(50)"},{"n":"USUARIO_CREACION","t":"VARCHAR(50)"},{"n":"VERSION","t":"VARCHAR(10)"}]},"DM_TIPO_ESCALA_DET":{"m":"","d":"","f":[{"n":"ELEMENTO_PAGO","t":"VARCHAR(4)"},{"n":"MONTO","t":"DECIMAL"},{"n":"NIVEL_ORGANIZACIONAL","t":"VARCHAR(4)"},{"n":"PASO_SALARIAL","t":"VARCHAR(4)"},{"n":"TIPO_ESCALA","t":"VARCHAR(10)"},{"n":"VERSION","t":"VARCHAR(10)"}]},"DOC_ADJUNTO":{"m":"","d":"","f":[{"n":"CONSECUTIVO","t":"INT"},{"n":"CONTENIDO","t":"IMAGE(214748364"},{"n":"DESCRIPCION","t":"VARCHAR(254)"},{"n":"NOMBRE","t":"VARCHAR(40)"},{"n":"ROW_ID","t":"GUID"},{"n":"TABLA","t":"VARCHAR(32)"}]},"DOC_ADJUNTO_DELETED":{"m":"","d":"","f":[{"n":"CONSECUTIVO","t":"INT"},{"n":"DELETEDATE","t":"DATETIME"},{"n":"ID","t":"INT"},{"n":"ID_STATUS","t":"INT"},{"n":"NOMBRE","t":"VARCHAR(40)"}]},"DOC_CS_DETALLE":{"m":"","d":"","f":[{"n":"ARTICULO","t":"VARCHAR(20)"},{"n":"DOCUMENTO_CS","t":"VARCHAR(20)"},{"n":"SERIE","t":"VARCHAR(30)"},{"n":"TIPO_GARANTIA","t":"VARCHAR(5)"}]},"DOC_ELECTRONICO_PROC_DE":{"m":"","d":"","f":[{"n":"ACEPTACION_RECHAZO","t":"XML"},{"n":"ACEPTADO","t":"VARCHAR(1)"},{"n":"ARCHIVO_ACEPTACIO_EXPRESA","t":"VARCHAR(255)"},{"n":"ARCHIVO_ACEPTACIO_TACITA","t":"VARCHAR(255)"},{"n":"ARCHIVO_ACEPTACION_BS","t":"VARCHAR(255)"},{"n":"ARCHIVO_ACUSE_RECIBO","t":"VARCHAR(255)"},{"n":"ARCHIVO_RECLAMO","t":"VARCHAR(255)"},{"n":"CADENA_ORIGINAL","t":"VARCHAR"},{"n":"CANTIDAD_IMPRESIONES","t":"INT"},{"n":"CARGADO_ERP","t":"VARCHAR(1)"},{"n":"COD_GENERACION_INVALIDACION","t":"VARCHAR(50)"},{"n":"CODIGO_GENERACION","t":"VARCHAR(50)"},{"n":"CODIGO_RETORNO","t":"VARCHAR(255)"},{"n":"CODIGO_RUTERO","t":"VARCHAR(4)"},{"n":"CONSE_BOLETA_RESUMIDA","t":"VARCHAR(8)"},{"n":"CONSE_COMUNICADO_BAJA","t":"VARCHAR(8)"},{"n":"CONSE_RESUMEN_REVERSION","t":"VARCHAR(8)"},{"n":"CONSEC_AD_CO","t":"VARCHAR(8)"},{"n":"CONSEC_AR_CO","t":"VARCHAR(8)"},{"n":"CONSEC_AR_TACITA","t":"VARCHAR(8)"},{"n":"CONSEC_DOC_CO","t":"VARCHAR(8)"},{"n":"CONSEC_ZP_CO","t":"VARCHAR(8)"},{"n":"CONSEC_ZP_TACITA","t":"VARCHAR(8)"},{"n":"CONTIENE_ERRORES","t":"VARCHAR(1)"},{"n":"DOCUMENTO_ELECTRONICO","t":"XML"}]},"DOC_ELECTRONICO_PROCESADO":{"m":"","d":"","f":[{"n":"ACEPTACION_RECHAZO","t":"XML"},{"n":"ACEPTADO","t":"VARCHAR(1)"},{"n":"CADENA_ORIGINAL","t":"VARCHAR"},{"n":"CANTIDAD_IMPRESIONES","t":"INT"},{"n":"CARGADO_ERP","t":"VARCHAR(1)"},{"n":"CONTIENE_ERRORES","t":"VARCHAR(1)"},{"n":"DOCUMENTO_ELECTRONICO","t":"XML"},{"n":"EMAIL_EMISOR","t":"VARCHAR(255)"},{"n":"EMAIL_RECEPTOR","t":"VARCHAR(255)"},{"n":"ENVIADO","t":"VARCHAR(1)"},{"n":"ERROR_SOFTLAND","t":"VARCHAR(1)"},{"n":"ERROR_WS","t":"VARCHAR(1)"},{"n":"ESTADO","t":"VARCHAR(1)"},{"n":"ESTADO_CARTA_PORTE","t":"VARCHAR(1)"},{"n":"FECHA_HORA","t":"DATETIME"},{"n":"FECHATIMBRADO","t":"VARCHAR(21)"},{"n":"FIRMA_DOCUMENTO","t":"VARCHAR"},{"n":"FOLIO_SAT","t":"VARCHAR(36)"},{"n":"GENERA_CARTA_PORTE","t":"VARCHAR(1)"},{"n":"GLN_EMISOR","t":"VARCHAR(13)"},{"n":"GLN_RECEPTOR","t":"VARCHAR(13)"},{"n":"GUUID_GT","t":"VARCHAR(255)"},{"n":"MODULO","t":"VARCHAR(2)"},{"n":"NIT_EMISOR","t":"VARCHAR(40)"},{"n":"NIT_RECEPTOR","t":"VARCHAR(40)"}]},"DOC_ELECTRONICO_RECI_DE":{"m":"","d":"","f":[{"n":"ACEPTA_CLIENTE","t":"VARCHAR(1)"},{"n":"ACEPTADO","t":"VARCHAR(1)"},{"n":"APLICACION","t":"VARCHAR(249)"},{"n":"ATTACHED_DOCUMENT","t":"XML"},{"n":"CLAVE","t":"VARCHAR(255)"},{"n":"CODIGO_ACTIVIDAD","t":"VARCHAR(10)"},{"n":"CODIGO_MONEDA","t":"VARCHAR(4)"},{"n":"CONDICION_IMPUESTO","t":"VARCHAR(10)"},{"n":"CONDICION_PAGO","t":"VARCHAR(4)"},{"n":"CONSEC_AD_ACEPT_BIEN_SERVICIO","t":"VARCHAR(8)"},{"n":"CONSEC_AD_ACEPT_RECLAMO","t":"VARCHAR(8)"},{"n":"CONSEC_AD_ACUSE","t":"VARCHAR(8)"},{"n":"CONSEC_AR_ACEPT_BIEN_SERVICIO","t":"VARCHAR(8)"},{"n":"CONSEC_AR_ACEPT_RECLAMO","t":"VARCHAR(8)"},{"n":"CONSEC_AR_ACUSE","t":"VARCHAR(8)"},{"n":"CONSEC_ZP_ACEPT_BIEN_SERVICIO","t":"VARCHAR(8)"},{"n":"CONSEC_ZP_ACEPT_RECLAMO","t":"VARCHAR(8)"},{"n":"CONSEC_ZP_ACUSE","t":"VARCHAR(8)"},{"n":"CONSECUTIVO","t":"VARCHAR(40)"},{"n":"DOCUMENTO_ELECTRONICO","t":"XML"},{"n":"EMAIL_EMISOR","t":"VARCHAR(255)"},{"n":"ENVIADO","t":"VARCHAR(1)"},{"n":"ERRORES_ESQUEMA","t":"VARCHAR(1)"},{"n":"EXTENSION_ARCHIVO","t":"VARCHAR(10)"},{"n":"FECHA_ACEPT_BIEN_SERVICIO","t":"DATETIME"}]},"DOCS_SOPORTE":{"m":"","d":"Tabla transaccional con montos e información de fechas del proceso.","f":[{"n":"ACTIVIDAD_COMERCIAL","t":"VARCHAR(10)"},{"n":"BASE_IMPUESTO1","t":"DECIMAL"},{"n":"BASE_IMPUESTO2","t":"DECIMAL"},{"n":"CAI","t":"VARCHAR(50)"},{"n":"CENTRO_COSTO","t":"VARCHAR(25)"},{"n":"CLAVE_DE","t":"VARCHAR(50)"},{"n":"CLAVE_REFERENCIA","t":"VARCHAR(50)"},{"n":"CLAVE_REFERENCIA_DE","t":"VARCHAR(50)"},{"n":"CODIGO_IMPUESTO","t":"VARCHAR(4)"},{"n":"CODIGO_REFERENCIA","t":"VARCHAR(2)"},{"n":"CODIGO_REFERENCIA_OTRO","t":"VARCHAR(100)"},{"n":"CONCEPTO","t":"VARCHAR(10)"},{"n":"CONCEPTO_ME","t":"VARCHAR(4)"},{"n":"CUENTA_CONTABLE","t":"VARCHAR(25)"},{"n":"DESC_UBIC_GEOGRAFICA","t":"VARCHAR(40)"},{"n":"DESCUENTO","t":"DECIMAL"},{"n":"DETALLE","t":"TEXT"},{"n":"DIVISION_GEOGRAFICA1","t":"VARCHAR(12)"},{"n":"DIVISION_GEOGRAFICA2","t":"VARCHAR(12)"},{"n":"DOC_SOPORTE","t":"VARCHAR(50)"},{"n":"DOCUMENTO_FISCAL","t":"VARCHAR(50)"},{"n":"FECHA","t":"DATETIME"},{"n":"FECHA_CAI","t":"DATETIME"},{"n":"FECHA_EMISION_REFERENCIA","t":"DATETIME"},{"n":"FECHA_RIGE","t":"DATETIME"}]},"DOCUMENTO":{"m":"","d":"","f":[{"n":"CONTENIDO","t":"IMAGE(214748364"},{"n":"DOCUMENTO","t":"INT"},{"n":"NOMBRE","t":"VARCHAR(254)"}]},"DOCUMENTO_ANTICIPO":{"m":"CP","d":"","f":[{"n":"DOCUMENTO","t":"VARCHAR(50)"},{"n":"DOCUMENTO_CC","t":"VARCHAR(50)"},{"n":"MONTO","t":"DECIMAL"},{"n":"MONTO_IMPUESTO1","t":"DECIMAL"},{"n":"MONTO_IMPUESTO2","t":"DECIMAL"},{"n":"TIPO_CC","t":"VARCHAR(3)"},{"n":"TIPO_DOCUMENTO","t":"VARCHAR(1)"}]},"DOCUMENTO_ASOCIADO":{"m":"","d":"","f":[{"n":"APROBADO","t":"VARCHAR(1)"},{"n":"CLASE","t":"VARCHAR(1)"},{"n":"DOC_ORIGEN","t":"VARCHAR(50)"},{"n":"DOCUMENTO","t":"VARCHAR(50)"},{"n":"TIPO","t":"VARCHAR(3)"},{"n":"TIPO_DOC_ORIGEN","t":"VARCHAR(3)"}]},"DOCUMENTO_CS":{"m":"","d":"","f":[{"n":"DOCUMENTO_CS","t":"VARCHAR(20)"},{"n":"ENTREGADO_A","t":"VARCHAR(40)"},{"n":"FECHA_ULT_MOD","t":"DATETIME"},{"n":"NOTAS","t":"TEXT"},{"n":"USUARIO_CREACION","t":"VARCHAR(25)"},{"n":"USUARIO_ULT_MOD","t":"VARCHAR(25)"}]},"DOCUMENTO_ELECTRONICO":{"m":"","d":"","f":[{"n":"ACEPTACION_RECHAZO","t":"XML"},{"n":"ACEPTADO","t":"VARCHAR(1)"},{"n":"CANTIDAD_IMPRESIONES","t":"INT"},{"n":"CARGADO_ERP","t":"VARCHAR(1)"},{"n":"DOCUMENTO_ELECTRONICO","t":"XML"},{"n":"DOCUMENTO_ELECTRONICO_TEXT","t":"VARCHAR"},{"n":"EMAIL_EMISOR","t":"VARCHAR(40)"},{"n":"EMAIL_RECEPTOR","t":"VARCHAR(40)"},{"n":"ENVIADO","t":"VARCHAR(1)"},{"n":"GLN_EMISOR","t":"VARCHAR(13)"},{"n":"GLN_RECEPTOR","t":"VARCHAR(13)"},{"n":"NIT_EMISOR","t":"VARCHAR(40)"},{"n":"NIT_RECEPTOR","t":"VARCHAR(40)"},{"n":"NOMBRE_PDF","t":"VARCHAR(255)"},{"n":"NUMERO_DOC","t":"DECIMAL"},{"n":"NUMERO_RECEPCION","t":"DECIMAL"},{"n":"TIPO_DOC","t":"INT"}]},"DOCUMENTO_ELECTRONICO_FA":{"m":"","d":"","f":[{"n":"ACEPTACION_RECHAZO","t":"XML"},{"n":"ACEPTADO","t":"VARCHAR(1)"},{"n":"CANTIDAD_IMPRESIONES","t":"INT"},{"n":"CARGADO_ERP","t":"VARCHAR(1)"},{"n":"CONSECUTIVO","t":"INT"},{"n":"CONSECUTIVO_RESOLUCION","t":"INT"},{"n":"DOCUMENTO_ELECTRONICO","t":"XML"},{"n":"DOCUMENTO_ELECTRONICO_TEXT","t":"VARCHAR"},{"n":"EMAIL_EMISOR","t":"VARCHAR(40)"},{"n":"EMAIL_RECEPTOR","t":"VARCHAR(40)"},{"n":"ENVIADO","t":"VARCHAR(1)"},{"n":"GLN_EMISOR","t":"VARCHAR(13)"},{"n":"GLN_RECEPTOR","t":"VARCHAR(13)"},{"n":"NIT_EMISOR","t":"VARCHAR(40)"},{"n":"NIT_RECEPTOR","t":"VARCHAR(40)"},{"n":"NOMBRE_PDF","t":"VARCHAR(255)"},{"n":"NUMERO_DOC","t":"VARCHAR(50)"},{"n":"NUMERO_RECEPCION","t":"DECIMAL"},{"n":"SERIE","t":"VARCHAR(20)"},{"n":"TIPO_DOC","t":"INT"}]},"DOCUMENTO_EMBARQUE":{"m":"CO","d":"Embarques de importación: proveedor, origen, fechas y costos totales.","f":[{"n":"ACT_DETRAC","t":"VARCHAR(4)"},{"n":"ACTIVIDAD_COMERCIAL","t":"VARCHAR(10)"},{"n":"ANIO_DUA","t":"INT"},{"n":"APLICACION","t":"VARCHAR(249)"},{"n":"ASIENTO_FINANCIERO","t":"VARCHAR(10)"},{"n":"BASE_IMPUESTO1","t":"DECIMAL"},{"n":"BASE_IMPUESTO2","t":"DECIMAL"},{"n":"CAI","t":"VARCHAR(50)"},{"n":"CLASE_DOC_ES","t":"VARCHAR(3)"},{"n":"CLASE_DOCUMENTO","t":"VARCHAR(1)"},{"n":"CLASIFICACION","t":"VARCHAR(4)"},{"n":"CLAVE_DE","t":"VARCHAR(50)"},{"n":"CLAVE_REFERENCIA","t":"VARCHAR(50)"},{"n":"CLAVE_REFERENCIA_DE","t":"VARCHAR(50)"},{"n":"COD_CONSECUTIVO","t":"VARCHAR(10)"},{"n":"CODIGO_GENERADOR","t":"VARCHAR(100)"},{"n":"CODIGO_REFERENCIA","t":"VARCHAR(2)"},{"n":"CODIGO_REFERENCIA_OTRO","t":"VARCHAR(100)"},{"n":"CODIGOQR","t":"VARCHAR"},{"n":"CONDICION_PAGO","t":"VARCHAR(4)"},{"n":"CONSECUTIVO_DOC","t":"VARCHAR(10)"},{"n":"CONTRATO","t":"VARCHAR(20)"},{"n":"CONTROL_INTERNO","t":"VARCHAR(20)"},{"n":"CUFE","t":"VARCHAR(100)"},{"n":"DEDUC_COSTO_ENAJENA","t":"DECIMAL"}]},"DOCUMENTO_INV":{"m":"CI","d":"","f":[{"n":"APROBADO","t":"VARCHAR(1)"},{"n":"CONSECUTIVO","t":"VARCHAR(10)"},{"n":"DOCUMENTO_INV","t":"VARCHAR(50)"},{"n":"FECHA_DOCUMENTO","t":"DATETIME"},{"n":"FECHA_HOR_CREACION","t":"DATETIME"},{"n":"FECHA_HORA_APROB","t":"DATETIME"},{"n":"MENSAJE_SISTEMA","t":"TEXT"},{"n":"PAQUETE_INVENTARIO","t":"VARCHAR(4)"},{"n":"REFERENCIA","t":"VARCHAR(200)"},{"n":"SELECCIONADO","t":"VARCHAR(1)"},{"n":"USUARIO","t":"VARCHAR(50)"},{"n":"USUARIO_APRO","t":"VARCHAR(50)"}]},"DOCUMENTO_INV_RESPALDO_PAQUETES_CONS":{"m":"CI","d":"","f":[{"n":"APROBADO","t":"VARCHAR(1)"},{"n":"CONSECUTIVO","t":"VARCHAR(10)"},{"n":"DOCUMENTO_INV","t":"VARCHAR(50)"},{"n":"FECHA_DOCUMENTO","t":"DATETIME"},{"n":"FECHA_HOR_CREACION","t":"DATETIME"},{"n":"FECHA_HORA_APROB","t":"DATETIME"},{"n":"MENSAJE_SISTEMA","t":"TEXT"},{"n":"PAQUETE_INVENTARIO","t":"VARCHAR(4)"},{"n":"REFERENCIA","t":"VARCHAR(200)"},{"n":"SELECCIONADO","t":"VARCHAR(1)"},{"n":"USUARIO","t":"VARCHAR(50)"},{"n":"USUARIO_APRO","t":"VARCHAR(50)"}]},"DOCUMENTO_INV_SINCRO":{"m":"","d":"","f":[{"n":"CONSECUTIVO","t":"VARCHAR(10)"},{"n":"DOCUMENTO_INV","t":"VARCHAR(50)"},{"n":"FECHA_DOCUMENTO","t":"DATETIME"},{"n":"FECHA_HOR_CREACION","t":"DATETIME"},{"n":"ID_PDA","t":"VARCHAR(15)"},{"n":"ID_SINCRO","t":"VARCHAR(15)"},{"n":"MENSAJE_SISTEMA","t":"TEXT"},{"n":"PAQUETE_INVENTARIO","t":"VARCHAR(4)"},{"n":"REFERENCIA","t":"VARCHAR(200)"},{"n":"SELECCIONADO","t":"VARCHAR(1)"},{"n":"USUARIO","t":"VARCHAR(50)"}]},"DOCUMENTO_POS":{"m":"","d":"","f":[{"n":"ACTIVIDAD_COMERCIAL","t":"VARCHAR(10)"},{"n":"AFECTA_CONTABIL","t":"VARCHAR(1)"},{"n":"BASE_IMPUESTO1","t":"DECIMAL"},{"n":"BASE_IMPUESTO2","t":"DECIMAL"},{"n":"BENEFICIARIO","t":"VARCHAR(254)"},{"n":"CAJA","t":"VARCHAR(6)"},{"n":"CAJA_COBRO","t":"VARCHAR(6)"},{"n":"CAJERO","t":"VARCHAR(50)"},{"n":"CARGADO_CC","t":"VARCHAR(1)"},{"n":"CARGADO_CG","t":"VARCHAR(1)"},{"n":"CIERRE_ANULACION","t":"VARCHAR(20)"},{"n":"CLASE_DOCUMENTO","t":"VARCHAR(1)"},{"n":"CLAVE_DE","t":"VARCHAR(50)"},{"n":"CLAVE_REFERENCIA_DE","t":"VARCHAR(50)"},{"n":"CLIENTE","t":"VARCHAR(20)"},{"n":"CLIENTE_EXPRESS","t":"VARCHAR(20)"},{"n":"COD_CLASE_DOC","t":"VARCHAR(10)"},{"n":"CONDICION_PAGO_APA","t":"VARCHAR(4)"},{"n":"CORRELATIVO","t":"VARCHAR(10)"},{"n":"DESCUENTO","t":"DECIMAL"},{"n":"DEVUELVE_DINERO","t":"VARCHAR(1)"},{"n":"DIRECCION","t":"VARCHAR(4000)"},{"n":"DOC_CC","t":"VARCHAR(50)"},{"n":"DOC_CC_ANTICIPO","t":"VARCHAR(50)"},{"n":"DOC_CC_ANUL","t":"VARCHAR(50)"}]},"DOCUMENTO_REL":{"m":"","d":"","f":[{"n":"DOCUMENTO_CC","t":"VARCHAR(50)"},{"n":"DOCUMENTO_FISCAL","t":"VARCHAR(50)"},{"n":"DOCUMENTO_PAGO","t":"VARCHAR(10)"},{"n":"FECHA_DOCUMENTO_ORIGEN","t":"DATETIME"},{"n":"MONTO_DOCUMENTO_ORIGEN","t":"DECIMAL"},{"n":"TIPO_CC","t":"VARCHAR(3)"}]},"DOCUMENTOS_CC":{"m":"CC","d":"Documentos de Cuentas por Cobrar: facturas, notas crédito/débito, estado y saldo.","f":[{"n":"ACT_DETRAC","t":"VARCHAR(4)"},{"n":"ACTIVIDAD_COMERCIAL","t":"VARCHAR(10)"},{"n":"ACTIVIDAD_COMERCIAL_RECEP","t":"VARCHAR(10)"},{"n":"ANULADO","t":"VARCHAR(1)"},{"n":"APLICACION","t":"VARCHAR(249)"},{"n":"APROBADO","t":"VARCHAR(1)"},{"n":"ASIENTO","t":"VARCHAR(10)"},{"n":"ASIENTO_PENDIENTE","t":"VARCHAR(1)"},{"n":"AUD_FECHA_ANUL","t":"DATETIME"},{"n":"AUD_USUARIO_ANUL","t":"VARCHAR(50)"},{"n":"AUDITORIA_COBRO","t":"VARCHAR(80)"},{"n":"BASE_IMPUESTO1","t":"DECIMAL"},{"n":"BASE_IMPUESTO2","t":"DECIMAL"},{"n":"BIEN_SERVICIO","t":"VARCHAR(1)"},{"n":"CADPAGO","t":"TEXT"},{"n":"CANCELACION","t":"VARCHAR(2)"},{"n":"CARGADO_DE_FACT","t":"VARCHAR(1)"},{"n":"CERTPAGO","t":"TEXT"},{"n":"CLASE_DOC_ES","t":"VARCHAR(3)"},{"n":"CLASE_DOCUMENTO","t":"VARCHAR(1)"},{"n":"CLAVE_DE","t":"VARCHAR(50)"},{"n":"CLAVE_REFERENCIA_DE","t":"VARCHAR(50)"},{"n":"CLAVE_TECNICA","t":"VARCHAR(80)"},{"n":"CLIENTE","t":"VARCHAR(20)"},{"n":"CLIENTE_ORIGEN","t":"VARCHAR(20)"}]},"DOCUMENTOS_CC_BAK":{"m":"CC","d":"Tabla transaccional con montos e información de fechas del proceso.","f":[{"n":"APLICACION","t":"VARCHAR(40)"},{"n":"APROBADO","t":"VARCHAR(1)"},{"n":"ASIENTO","t":"VARCHAR(10)"},{"n":"ASIENTO_PENDIENTE","t":"VARCHAR(1)"},{"n":"CARGADO_DE_FACT","t":"VARCHAR(1)"},{"n":"CLASE_DOCUMENTO","t":"VARCHAR(1)"},{"n":"CLIENTE","t":"VARCHAR(20)"},{"n":"CLIENTE_ORIGEN","t":"VARCHAR(20)"},{"n":"CLIENTE_REPORTE","t":"VARCHAR(20)"},{"n":"COBRADOR","t":"VARCHAR(4)"},{"n":"CONDICION_PAGO","t":"VARCHAR(4)"},{"n":"CONTRARECIBO","t":"VARCHAR(12)"},{"n":"CTA_BANCARIA","t":"VARCHAR(20)"},{"n":"DEPENDIENTE","t":"VARCHAR(1)"},{"n":"DESCUENTO","t":"DECIMAL"},{"n":"DOCUMENTO","t":"VARCHAR(12)"},{"n":"FECHA","t":"DATETIME"},{"n":"FECHA_DOCUMENTO","t":"DATETIME"},{"n":"FECHA_ULT_CREDITO","t":"DATETIME"},{"n":"FECHA_ULT_MOD","t":"DATETIME"},{"n":"FECHA_VENCE","t":"DATETIME"},{"n":"IMPUESTO1","t":"DECIMAL"},{"n":"IMPUESTO2","t":"DECIMAL"},{"n":"MONEDA","t":"VARCHAR(4)"},{"n":"MONTO","t":"DECIMAL"}]},"DOCUMENTOS_CC_BAKR":{"m":"CC","d":"Tabla transaccional con montos e información de fechas del proceso.","f":[{"n":"APLICACION","t":"VARCHAR(40)"},{"n":"APROBADO","t":"VARCHAR(1)"},{"n":"ASIENTO","t":"VARCHAR(10)"},{"n":"ASIENTO_PENDIENTE","t":"VARCHAR(1)"},{"n":"CARGADO_DE_FACT","t":"VARCHAR(1)"},{"n":"CLASE_DOCUMENTO","t":"VARCHAR(1)"},{"n":"CLIENTE","t":"VARCHAR(20)"},{"n":"CLIENTE_ORIGEN","t":"VARCHAR(20)"},{"n":"CLIENTE_REPORTE","t":"VARCHAR(20)"},{"n":"COBRADOR","t":"VARCHAR(4)"},{"n":"CONDICION_PAGO","t":"VARCHAR(4)"},{"n":"CONTRARECIBO","t":"VARCHAR(12)"},{"n":"CTA_BANCARIA","t":"VARCHAR(20)"},{"n":"DEPENDIENTE","t":"VARCHAR(1)"},{"n":"DESCUENTO","t":"DECIMAL"},{"n":"DOCUMENTO","t":"VARCHAR(12)"},{"n":"FECHA","t":"DATETIME"},{"n":"FECHA_DOCUMENTO","t":"DATETIME"},{"n":"FECHA_ULT_CREDITO","t":"DATETIME"},{"n":"FECHA_ULT_MOD","t":"DATETIME"},{"n":"FECHA_VENCE","t":"DATETIME"},{"n":"IMPUESTO1","t":"DECIMAL"},{"n":"IMPUESTO2","t":"DECIMAL"},{"n":"MONEDA","t":"VARCHAR(4)"},{"n":"MONTO","t":"DECIMAL"}]},"DOCUMENTOS_CC_DICIEMBREABRENES":{"m":"CC","d":"Tabla transaccional con montos e información de fechas del proceso.","f":[{"n":"ANULADO","t":"VARCHAR(1)"},{"n":"APLICACION","t":"VARCHAR(249)"},{"n":"APROBADO","t":"VARCHAR(1)"},{"n":"ASIENTO","t":"VARCHAR(10)"},{"n":"ASIENTO_PENDIENTE","t":"VARCHAR(1)"},{"n":"AUD_FECHA_ANUL","t":"DATETIME"},{"n":"AUD_USUARIO_ANUL","t":"VARCHAR(10)"},{"n":"AUDITORIA_COBRO","t":"VARCHAR(80)"},{"n":"BASE_IMPUESTO1","t":"DECIMAL"},{"n":"BASE_IMPUESTO2","t":"DECIMAL"},{"n":"CARGADO_DE_FACT","t":"VARCHAR(1)"},{"n":"CLASE_DOCUMENTO","t":"VARCHAR(1)"},{"n":"CLIENTE","t":"VARCHAR(20)"},{"n":"CLIENTE_ORIGEN","t":"VARCHAR(20)"},{"n":"CLIENTE_REPORTE","t":"VARCHAR(20)"},{"n":"COBRADOR","t":"VARCHAR(4)"},{"n":"CODIGO_IMPUESTO","t":"VARCHAR(4)"},{"n":"CONDICION_PAGO","t":"VARCHAR(4)"},{"n":"CONTRARECIBO","t":"VARCHAR(50)"},{"n":"CONTRATO","t":"VARCHAR(20)"},{"n":"CTA_BANCARIA","t":"VARCHAR(20)"},{"n":"DEPENDIENTE","t":"VARCHAR(1)"},{"n":"DEPENDIENTE_GP","t":"VARCHAR(1)"},{"n":"DESCUENTO","t":"DECIMAL"},{"n":"DIVISION_GEOGRAFICA1","t":"VARCHAR(12)"}]},"DOCUMENTOS_CP":{"m":"CP","d":"Documentos de Cuentas por Pagar: facturas proveedor, estado y vencimientos.","f":[{"n":"ACT_DETRAC","t":"VARCHAR(4)"},{"n":"ACTIVIDAD_COMERCIAL","t":"VARCHAR(10)"},{"n":"AD_VALOREM","t":"DECIMAL"},{"n":"ADUANA","t":"VARCHAR(12)"},{"n":"ANIO_DUA","t":"INT"},{"n":"ANULADO","t":"VARCHAR(1)"},{"n":"APLICACION","t":"VARCHAR(249)"},{"n":"APROBADO","t":"VARCHAR(1)"},{"n":"ASIENTO","t":"VARCHAR(10)"},{"n":"ASIENTO_PENDIENTE","t":"VARCHAR(1)"},{"n":"AUD_FECHA_ANUL","t":"DATETIME"},{"n":"AUD_USUARIO_ANUL","t":"VARCHAR(50)"},{"n":"BASE_IMPUESTO1","t":"DECIMAL"},{"n":"BASE_IMPUESTO2","t":"DECIMAL"},{"n":"BIEN_SERVICIO","t":"VARCHAR(1)"},{"n":"CAI","t":"VARCHAR(50)"},{"n":"CAJA_CHICA","t":"VARCHAR(20)"},{"n":"CHEQUE_CUENTA","t":"VARCHAR(20)"},{"n":"CHEQUE_IMPRESO","t":"VARCHAR(1)"},{"n":"CLASE_DOC_ES","t":"VARCHAR(3)"},{"n":"CLASE_DOCUMENTO","t":"VARCHAR(1)"},{"n":"CLASIFICACION","t":"VARCHAR(4)"},{"n":"CLAVE_DE","t":"VARCHAR(50)"},{"n":"CLAVE_REFERENCIA","t":"VARCHAR(50)"},{"n":"CLAVE_REFERENCIA_DE","t":"VARCHAR(50)"}]},"DOCUMENTOS_CP_BAKGEO":{"m":"CP","d":"Tabla transaccional con montos e información de fechas del proceso.","f":[{"n":"APLICACION","t":"VARCHAR(40)"},{"n":"APROBADO","t":"VARCHAR(1)"},{"n":"ASIENTO","t":"VARCHAR(10)"},{"n":"ASIENTO_PENDIENTE","t":"VARCHAR(1)"},{"n":"CHEQUE_CUENTA","t":"VARCHAR(20)"},{"n":"CHEQUE_IMPRESO","t":"VARCHAR(1)"},{"n":"CONDICION_PAGO","t":"VARCHAR(4)"},{"n":"CONGELADO","t":"VARCHAR(1)"},{"n":"CONTRARECIBO","t":"VARCHAR(12)"},{"n":"DEPENDIENTE","t":"VARCHAR(1)"},{"n":"DESCUENTO","t":"DECIMAL"},{"n":"DOCUMENTO","t":"VARCHAR(12)"},{"n":"DOCUMENTO_EMBARQUE","t":"VARCHAR(1)"},{"n":"EMBARQUE_APROBADO","t":"VARCHAR(1)"},{"n":"ETIQUETA","t":"VARCHAR(20)"},{"n":"FECHA","t":"DATETIME"},{"n":"FECHA_DOCUMENTO","t":"DATETIME"},{"n":"FECHA_ULT_CREDITO","t":"DATETIME"},{"n":"FECHA_ULT_MOD","t":"DATETIME"},{"n":"IMPUESTO1","t":"DECIMAL"},{"n":"IMPUESTO2","t":"DECIMAL"},{"n":"LIQUIDAC_COMPRA","t":"VARCHAR(15)"},{"n":"MONEDA","t":"VARCHAR(4)"},{"n":"MONTO","t":"DECIMAL"},{"n":"MONTO_DOLAR","t":"DECIMAL"}]},"DOCUMENTOS_RELACIONADOS":{"m":"","d":"","f":[{"n":"DOC_FISCAL_REL","t":"VARCHAR(50)"},{"n":"DOCUMENTO_ORIGEN","t":"VARCHAR(50)"},{"n":"DOCUMENTO_REL","t":"VARCHAR(50)"},{"n":"TIPO_DOC_ORIGEN","t":"VARCHAR(3)"},{"n":"TIPO_DOC_REL","t":"VARCHAR(3)"},{"n":"TIPO_RELACION","t":"VARCHAR(2)"}]},"DOCUMENTOS_RH":{"m":"","d":"","f":[{"n":"DESCRIPCION","t":"VARCHAR(40)"},{"n":"DOCUMENTO","t":"VARCHAR(8)"},{"n":"IDENTIFICADOR","t":"INT"},{"n":"NOTAS","t":"TEXT"},{"n":"UBICACION","t":"VARCHAR(254)"}]},"ELIMINACION_SINCRO_POS":{"m":"","d":"","f":[{"n":"DETALLE_ERROR","t":"VARCHAR(8000)"},{"n":"ESTADO","t":"VARCHAR(1)"},{"n":"FECHA_APLICACION","t":"DATETIME"},{"n":"FECHA_ELIMINACION","t":"DATETIME"},{"n":"ID_SENTENCIA","t":"INT"},{"n":"NOMBRE_TABLA","t":"VARCHAR(254)"},{"n":"SENTENCIA","t":"VARCHAR(8000)"},{"n":"TIPO_TIENDA","t":"VARCHAR(1)"}]},"EMBARQUE":{"m":"CO","d":"Cabecera de embarques de importación. Proveedor, país origen, fechas y costos.","f":[{"n":"ASIENTO","t":"VARCHAR(10)"},{"n":"ASIENTO_LIQ","t":"VARCHAR(10)"},{"n":"ASIENTO_LIQUIDACIO","t":"VARCHAR(1)"},{"n":"ASIENTO_RECIBO","t":"VARCHAR(1)"},{"n":"AUDIT_TRANS_INV","t":"INT"},{"n":"AUDIT_TRANS_LIQ","t":"INT"},{"n":"CRM","t":"VARCHAR(10)"},{"n":"DEMAS_SEPAGA","t":"VARCHAR(1)"},{"n":"EMBARQUE","t":"VARCHAR(10)"},{"n":"ESTADO","t":"VARCHAR(1)"},{"n":"FECHA_A_CONSOL","t":"DATETIME"},{"n":"FECHA_ADUANA","t":"DATETIME"},{"n":"FECHA_AGENCIA","t":"DATETIME"},{"n":"FECHA_CRM","t":"DATETIME"},{"n":"FECHA_DESDE_CONS","t":"DATETIME"},{"n":"FECHA_EMBARQUE","t":"DATETIME"},{"n":"FECHA_HORA_APLICAC","t":"DATETIME"},{"n":"FECHA_HORA_CREADO","t":"DATETIME"},{"n":"FECHA_HORA_LIQUIDA","t":"DATETIME"},{"n":"FECHA_OFRECIDA","t":"DATETIME"},{"n":"FECHA_PLANTA","t":"DATETIME"},{"n":"FECHA_REQUERIDA","t":"DATETIME"},{"n":"FECHA_TRAMITE","t":"DATETIME"},{"n":"LIQUIDAC_COMPRA","t":"VARCHAR(15)"},{"n":"LIQUIDADO","t":"VARCHAR(1)"}]},"EMBARQUE_DOC_CP":{"m":"CO","d":"Embarques de importación: proveedor, origen, fechas y costos totales.","f":[{"n":"DOCUMENTO","t":"VARCHAR(50)"},{"n":"EMBARQUE","t":"VARCHAR(10)"},{"n":"ETIQUETA","t":"VARCHAR(20)"},{"n":"LIQUIDAC_COMPRA","t":"VARCHAR(15)"},{"n":"MONTO_APLICAR","t":"DECIMAL"},{"n":"NOTAS","t":"TEXT"},{"n":"PROVEEDOR","t":"VARCHAR(20)"},{"n":"TIPO","t":"VARCHAR(3)"}]},"EMBARQUE_IMP":{"m":"CO","d":"Embarques de importación: proveedor, origen, fechas y costos totales.","f":[{"n":"EMBARQUE","t":"VARCHAR(10)"},{"n":"USUARIO","t":"VARCHAR(50)"}]},"EMBARQUE_LINEA":{"m":"CO","d":"Detalle de líneas de embarque: artículos importados con costos desagregados.","f":[{"n":"ARTICULO","t":"VARCHAR(20)"},{"n":"BACKORDER_MONTO","t":"VARCHAR(1)"},{"n":"BASE_IMPUESTO1","t":"DECIMAL"},{"n":"BASE_IMPUESTO2","t":"DECIMAL"},{"n":"BIEN_SERVICIO","t":"VARCHAR(1)"},{"n":"BODEGA","t":"VARCHAR(4)"},{"n":"CAMBIO_PRESUP","t":"VARCHAR(1)"},{"n":"CANT_DEVUELTAUA","t":"DECIMAL"},{"n":"CANT_RECHAZADA_UA","t":"DECIMAL"},{"n":"CANT_RECIBIDA_UA","t":"DECIMAL"},{"n":"CANTIDAD_DEVUELTA","t":"DECIMAL"},{"n":"CANTIDAD_EMBARCADA","t":"DECIMAL"},{"n":"CANTIDAD_RECHAZADA","t":"DECIMAL"},{"n":"CANTIDAD_RECIBIDA","t":"DECIMAL"},{"n":"CENTRO_COSTO","t":"VARCHAR(25)"},{"n":"CODIGO_ARANCEL","t":"VARCHAR(15)"},{"n":"CODIGO_IMPUESTO","t":"VARCHAR(4)"},{"n":"CONCEPTO_ME","t":"VARCHAR(4)"},{"n":"COST_UN_COMP_DOLAR","t":"DECIMAL"},{"n":"COST_UN_COMP_LOCAL","t":"DECIMAL"},{"n":"COST_UN_ESTI_COMP_DOLAR","t":"DECIMAL"},{"n":"COST_UN_ESTI_COMP_LOCAL","t":"DECIMAL"},{"n":"COST_UN_ESTI_DOLAR","t":"DECIMAL"},{"n":"COST_UN_ESTI_LOCAL","t":"DECIMAL"},{"n":"COST_UN_FISC_DOLAR","t":"DECIMAL"}]},"EMBARQUE_MOV_PRES":{"m":"CO","d":"Embarques de importación: proveedor, origen, fechas y costos totales.","f":[{"n":"APARTADO","t":"INT"},{"n":"ASIENTO","t":"VARCHAR(10)"},{"n":"EJERCIDO","t":"INT"},{"n":"EMBARQUE","t":"VARCHAR(10)"}]},"EMP_CONC_LIQUIDAC":{"m":"","d":"","f":[{"n":"ASIENTO_DOCUMENTO","t":"VARCHAR(10)"},{"n":"CONCEPTO","t":"VARCHAR(20)"},{"n":"DOCUMENTO_GENERADO","t":"VARCHAR(1)"},{"n":"DOCUMENTO_IMPRESO","t":"VARCHAR(1)"},{"n":"DOCUMENTO_SELECCIO","t":"VARCHAR(1)"},{"n":"EMPLEADO","t":"VARCHAR(20)"},{"n":"FECHA_HORA","t":"DATETIME"},{"n":"FECHA_LIQUIDAC","t":"DATETIME"},{"n":"FORMA_PAGO","t":"VARCHAR(1)"},{"n":"MONEDA","t":"VARCHAR(4)"},{"n":"MONTO_A_PAGAR","t":"DECIMAL"},{"n":"MONTO_CALCULADO","t":"DECIMAL"},{"n":"NOTAS","t":"TEXT"},{"n":"NUMERO_DOCUMENTO","t":"DECIMAL"},{"n":"USUARIO","t":"VARCHAR(50)"}]},"EMP_EXPERIENCIA":{"m":"","d":"","f":[{"n":"CONSECUTIVO","t":"INT"},{"n":"EMAIL_REFERENCIA","t":"VARCHAR(40)"},{"n":"EMPLEADO","t":"VARCHAR(20)"},{"n":"EMPRESA","t":"VARCHAR(100)"},{"n":"FECHA_INGRESO","t":"DATETIME"},{"n":"FECHA_SALIDA","t":"DATETIME"},{"n":"FUNCIONES","t":"TEXT"},{"n":"MOTIVO_SALIDA","t":"VARCHAR(254)"},{"n":"PUESTO","t":"VARCHAR(100)"},{"n":"REFERENCIA","t":"VARCHAR(100)"},{"n":"TEL_REFERENCIA","t":"VARCHAR(20)"}]},"EMP_SALDO_VAC_ACC":{"m":"CG","d":"Saldos acumulados por período, cuenta y dimensión de análisis.","f":[{"n":"CANTIDAD","t":"DECIMAL"},{"n":"CONSECUTIVO","t":"INT"},{"n":"EMPLEADO","t":"VARCHAR(20)"},{"n":"NOTAS","t":"VARCHAR(200)"},{"n":"NUMERO_ACCION","t":"INT"}]},"EMPLEADO":{"m":"CN","d":"Maestro de empleados: datos personales, cargo, departamento, fecha ingreso y salario base.","f":[{"n":"ACTIVO","t":"VARCHAR(1)"},{"n":"ASEGURADO","t":"VARCHAR(20)"},{"n":"BENEFICIO_COLECTIVO","t":"VARCHAR(2)"},{"n":"BONO_DECRETO","t":"DECIMAL"},{"n":"CENTRO_COSTO","t":"VARCHAR(25)"},{"n":"CLASE_SEGURO","t":"VARCHAR(4)"},{"n":"CTA_ELECTRONICA","t":"VARCHAR(50)"},{"n":"CUENTA_ENTIDAD","t":"VARCHAR(50)"},{"n":"DEPARTAMENTO","t":"VARCHAR(10)"},{"n":"DEPENDIENTES","t":"INT"},{"n":"DETALLE_DIR_HAB","t":"INT"},{"n":"DETALLE_DIR_POSTAL","t":"INT"},{"n":"DIAS_DISP_INCAP","t":"DECIMAL"},{"n":"DIRECCION_HAB","t":"TEXT"},{"n":"DIRECCION_POSTAL","t":"TEXT"},{"n":"DIVISION_GEOGRAFICA1","t":"VARCHAR(12)"},{"n":"DIVISION_GEOGRAFICA2","t":"VARCHAR(12)"},{"n":"E_MAIL","t":"VARCHAR(249)"},{"n":"EMPLEADO","t":"VARCHAR(20)"},{"n":"ENTIDAD_FINANCIERA","t":"VARCHAR(8)"},{"n":"ESTADO_CIVIL","t":"VARCHAR(1)"},{"n":"ESTADO_EMPLEADO","t":"VARCHAR(4)"},{"n":"FCH_HORA_ULT_MOD","t":"DATETIME"},{"n":"FECHA_ANTIG_EMP","t":"DATETIME"},{"n":"FECHA_ANTIG_GOB","t":"DATETIME"}]},"EMPLEADO_ACADEMICO":{"m":"CN","d":"","f":[{"n":"CONCLUIDO","t":"VARCHAR(1)"},{"n":"CONSECUTIVO","t":"INT"},{"n":"EMPLEADO","t":"VARCHAR(20)"},{"n":"FECHA_OBTENCION","t":"DATETIME"},{"n":"FECHA_VENCIMIENTO","t":"DATETIME"},{"n":"HORAS_COMPLETAS","t":"INT"},{"n":"HORAS_CURSO","t":"INT"},{"n":"INSTITUCION","t":"VARCHAR(250)"},{"n":"NOTAS","t":"TEXT"},{"n":"PROFESOR","t":"VARCHAR(40)"},{"n":"TIPO_ACADEMICO","t":"VARCHAR(4)"},{"n":"TIPO_CAPACITACION","t":"VARCHAR(40)"},{"n":"TITULO","t":"VARCHAR(50)"}]},"EMPLEADO_ACC_PER":{"m":"CN","d":"","f":[{"n":"ADMINISTRADORA","t":"VARCHAR(10)"},{"n":"APROBADA_POR","t":"VARCHAR(50)"},{"n":"BONO_DECRETO","t":"DECIMAL"},{"n":"CENTRO_COSTO","t":"VARCHAR(25)"},{"n":"DEPARTAMENTO","t":"VARCHAR(10)"},{"n":"DIAS_ACCION","t":"FLOAT"},{"n":"EMPLEADO","t":"VARCHAR(20)"},{"n":"ESTADO_ACCION","t":"VARCHAR(1)"},{"n":"ESTADO_EMPLEADO","t":"VARCHAR(4)"},{"n":"FECHA","t":"DATETIME"},{"n":"FECHA_ANULACION","t":"DATETIME"},{"n":"FECHA_APLICACION","t":"DATETIME"},{"n":"FECHA_APROBACION","t":"DATETIME"},{"n":"FECHA_HORA","t":"DATETIME"},{"n":"FECHA_RIGE","t":"DATETIME"},{"n":"FECHA_VENCE","t":"DATETIME"},{"n":"FECHA_VIGENTE","t":"DATETIME"},{"n":"NOMINA","t":"VARCHAR(4)"},{"n":"NOTAS","t":"TEXT"},{"n":"NUMERO_ACCION","t":"INT"},{"n":"NUMERO_PATRONAL","t":"VARCHAR(25)"},{"n":"PLAZA","t":"VARCHAR(8)"},{"n":"PUESTO","t":"VARCHAR(8)"},{"n":"REGIMEN_VACACIONAL","t":"VARCHAR(12)"},{"n":"RUBRO1","t":"VARCHAR(40)"}]},"EMPLEADO_ACC_SALDO":{"m":"CN","d":"Saldos acumulados por período, cuenta y dimensión de análisis.","f":[{"n":"CONSECUTIVO","t":"INT"},{"n":"DIAS_APLICADOS","t":"DECIMAL"},{"n":"LIQUIDACION","t":"INT"},{"n":"NOMINA","t":"VARCHAR(4)"},{"n":"NUMERO_ACCION","t":"INT"},{"n":"NUMERO_NOMINA","t":"INT"}]},"EMPLEADO_ACCIDENTE":{"m":"CN","d":"","f":[{"n":"CAUSA","t":"VARCHAR(25)"},{"n":"DEPARTAMENTO","t":"VARCHAR(10)"},{"n":"DESCRIPCION","t":"VARCHAR(250)"},{"n":"DIAS_INCAPACIDAD","t":"DECIMAL"},{"n":"EFECTO","t":"VARCHAR(25)"},{"n":"EMPLEADO","t":"VARCHAR(20)"},{"n":"FECHA","t":"DATETIME"},{"n":"LUGAR","t":"VARCHAR(25)"},{"n":"NOTAS","t":"TEXT"},{"n":"NUMERO_ACCION","t":"INT"},{"n":"PUESTO","t":"VARCHAR(8)"},{"n":"TIPO_ACCIDENTE","t":"VARCHAR(4)"}]},"EMPLEADO_AUDITORIA":{"m":"CN","d":"Registro de auditoría y trazabilidad de cambios en el sistema.","f":[{"n":"ATRIBUTO","t":"VARCHAR(40)"},{"n":"FECHA","t":"DATETIME"},{"n":"TIPO_ACCION","t":"VARCHAR(4)"},{"n":"USUARIO","t":"VARCHAR(50)"}]},"EMPLEADO_AUSENCIA":{"m":"CN","d":"","f":[{"n":"EMPLEADO","t":"VARCHAR(20)"},{"n":"FECHA_FINAL","t":"DATETIME"},{"n":"FECHA_INICIAL","t":"DATETIME"},{"n":"NOTAS","t":"TEXT"},{"n":"NUMERO_ACCION","t":"INT"},{"n":"TIPO_AUSENCIA","t":"VARCHAR(4)"}]},"EMPLEADO_CALENDAR":{"m":"CN","d":"","f":[{"n":"DESCRIPCION","t":"TEXT"},{"n":"EMPLEADO","t":"VARCHAR(20)"},{"n":"FECHA","t":"DATETIME"}]},"EMPLEADO_CENTRO":{"m":"CN","d":"","f":[{"n":"CENTRO_COSTO","t":"VARCHAR(25)"},{"n":"EMPLEADO","t":"VARCHAR(20)"},{"n":"PORCENTAJE","t":"DECIMAL"}]},"EMPLEADO_COMPROBANTE":{"m":"CN","d":"","f":[{"n":"EMPLEADO","t":"VARCHAR(20)"},{"n":"GUID_COMPROBANTE","t":"VARCHAR(48)"},{"n":"NOMINA","t":"VARCHAR(4)"},{"n":"NUMERO_NOMINA","t":"INT"},{"n":"USUARIO","t":"VARCHAR(50)"}]},"EMPLEADO_CONC_NOMI":{"m":"CN","d":"","f":[{"n":"CANTIDAD","t":"DECIMAL"},{"n":"CENTRO_COSTO","t":"VARCHAR(25)"},{"n":"CONCEPTO","t":"VARCHAR(20)"},{"n":"CONSECUTIVO","t":"INT"},{"n":"EMPLEADO","t":"VARCHAR(20)"},{"n":"FASE","t":"VARCHAR(25)"},{"n":"FECHA_MODIFICACION","t":"DATETIME"},{"n":"FORMA_APLICACION","t":"VARCHAR(1)"},{"n":"MONTO","t":"DECIMAL"},{"n":"NOMINA","t":"VARCHAR(4)"},{"n":"NUMERO_LIQUIDAC","t":"INT"},{"n":"NUMERO_NOMINA","t":"INT"},{"n":"PROYECTO","t":"VARCHAR(25)"},{"n":"TIPO_REGISTRO","t":"VARCHAR(1)"},{"n":"TOTAL","t":"DECIMAL"},{"n":"USUARIO","t":"VARCHAR(50)"}]},"EMPLEADO_CONC_NOMI_CALC":{"m":"CN","d":"","f":[{"n":"CENTRO_COSTO","t":"VARCHAR(25)"},{"n":"CONCEPTO","t":"VARCHAR(20)"},{"n":"CONSECUTIVO","t":"INT"},{"n":"EMPLEADO","t":"VARCHAR(20)"},{"n":"NOMINA","t":"VARCHAR(4)"},{"n":"NUMERO_NOMINA","t":"INT"},{"n":"TOTAL","t":"DECIMAL"}]},"EMPLEADO_CONC_NOMI_TEMP":{"m":"CN","d":"Tabla temporal de procesamiento. Datos intermedios de procesos batch.","f":[{"n":"CANTIDAD","t":"DECIMAL"},{"n":"CENTRO_COSTO","t":"VARCHAR(25)"},{"n":"CONCEPTO","t":"VARCHAR(20)"},{"n":"CONSECUTIVO","t":"INT"},{"n":"EMPLEADO","t":"VARCHAR(20)"},{"n":"FASE","t":"VARCHAR(25)"},{"n":"FECHA_MODIFICACION","t":"DATETIME"},{"n":"FORMA_APLICACION","t":"VARCHAR(1)"},{"n":"MONTO","t":"DECIMAL"},{"n":"NOMINA","t":"VARCHAR(4)"},{"n":"NUMERO_LIQUIDAC","t":"INT"},{"n":"NUMERO_NOMINA","t":"INT"},{"n":"PROYECTO","t":"VARCHAR(25)"},{"n":"TOTAL","t":"DECIMAL"},{"n":"USUARIO","t":"VARCHAR(50)"}]},"EMPLEADO_CONCEPTO":{"m":"CN","d":"","f":[{"n":"ACTIVO","t":"VARCHAR(1)"},{"n":"ACUMULADO","t":"DECIMAL"},{"n":"CANTIDAD","t":"DECIMAL"},{"n":"CONCEPTO","t":"VARCHAR(20)"},{"n":"CUOTAS_APLICADAS","t":"INT"},{"n":"EMPLEADO","t":"VARCHAR(20)"},{"n":"FECHA_PROX_APLIC","t":"DATETIME"},{"n":"FECHA_ULT_APLIC","t":"DATETIME"},{"n":"FECHA_VENCE","t":"DATETIME"},{"n":"FORMA_APLICACION","t":"VARCHAR(1)"},{"n":"MONTO","t":"DECIMAL"},{"n":"NOTAS","t":"TEXT"},{"n":"NUMERO_CUOTAS","t":"INT"},{"n":"PERIODIC_LIQ_PROV","t":"VARCHAR(1)"},{"n":"SALDO","t":"DECIMAL"},{"n":"SALDO_INICIAL","t":"DECIMAL"},{"n":"VERIFICADO","t":"VARCHAR(1)"}]},"EMPLEADO_CONTRATO":{"m":"CN","d":"","f":[{"n":"EMPLEADO","t":"VARCHAR(20)"},{"n":"ESTADO_CONTRATO","t":"VARCHAR(1)"},{"n":"FECHA_FINALIZACION","t":"DATETIME"},{"n":"FECHA_INICIO","t":"DATETIME"},{"n":"NOTAS","t":"TEXT"},{"n":"TIPO_CONTRATO","t":"VARCHAR(4)"}]},"EMPLEADO_DOCUMENTO":{"m":"CN","d":"","f":[{"n":"DOCUMENTO","t":"INT"},{"n":"EMPLEADO","t":"VARCHAR(20)"}]},"EMPLEADO_EVALUACIO":{"m":"CN","d":"","f":[{"n":"EMPLEADO","t":"VARCHAR(20)"},{"n":"EVALUACION","t":"VARCHAR(8)"},{"n":"FECHA_EVALUACION","t":"DATETIME"},{"n":"FECHA_PROXIMA","t":"DATETIME"},{"n":"NOTAS","t":"TEXT"}]},"EMPLEADO_JERARQUIA":{"m":"CN","d":"","f":[{"n":"SUBORDINADO","t":"VARCHAR(20)"},{"n":"SUPERIOR","t":"VARCHAR(20)"}]},"EMPLEADO_NOMI_NETO":{"m":"CN","d":"","f":[{"n":"ASIENTO_DOCUMENTO","t":"VARCHAR(10)"},{"n":"CALCULADO","t":"VARCHAR(1)"},{"n":"CUENTA_BANCO_DOC","t":"VARCHAR(20)"},{"n":"DIAS_LABORADOS","t":"INT"},{"n":"DOCUMENTO_IMPRESO","t":"VARCHAR(1)"},{"n":"DOCUMENTO_SELECCIO","t":"VARCHAR(1)"},{"n":"EMPLEADO","t":"VARCHAR(20)"},{"n":"ESTADO_NOMINA","t":"VARCHAR(1)"},{"n":"FECHA_CALCULO_SPD","t":"DATETIME"},{"n":"FICHA_SIPE","t":"VARCHAR(10)"},{"n":"FORMA_PAGO","t":"VARCHAR(1)"},{"n":"LIQUIDACION","t":"INT"},{"n":"NETO","t":"DECIMAL"},{"n":"NOMINA","t":"VARCHAR(4)"},{"n":"NOTAS","t":"TEXT"},{"n":"NUMERO_DOCUMENTO","t":"DECIMAL"},{"n":"NUMERO_NOMINA","t":"INT"},{"n":"SALARIOPD_CALCULO","t":"VARCHAR(1)"},{"n":"SALARIOPD_DOLAR","t":"DECIMAL"},{"n":"SALARIOPD_LOCAL","t":"DECIMAL"},{"n":"SALARIOPD_NOMINA","t":"DECIMAL"},{"n":"TIPO_CAMBIO","t":"DECIMAL"},{"n":"TOTAL_ANTICIPOS","t":"DECIMAL"},{"n":"TOTAL_APORTES","t":"DECIMAL"},{"n":"TOTAL_BENEFICIOS","t":"DECIMAL"}]},"EMPLEADO_NOMINA_CFDI":{"m":"CN","d":"","f":[{"n":"ARCHIVO_PDF","t":"VARBINARY"},{"n":"ARCHIVO_XML","t":"VARCHAR"},{"n":"CADENA_ORIGINAL","t":"VARCHAR"},{"n":"CONSECUTIVO","t":"INT"},{"n":"CURP","t":"VARCHAR(255)"},{"n":"DESCUENTOS","t":"DECIMAL"},{"n":"DIAS_INCAP","t":"DECIMAL"},{"n":"DIAS_PAGADOS","t":"DECIMAL"},{"n":"DIAS_VAC","t":"DECIMAL"},{"n":"EMPLEADO","t":"VARCHAR(20)"},{"n":"ENVIADO","t":"VARCHAR(1)"},{"n":"ENVIADO_SCH","t":"VARCHAR(1)"},{"n":"ERROR","t":"VARCHAR"},{"n":"FALTAS_PERIODO","t":"DECIMAL"},{"n":"FECHA_TIMBRADO","t":"VARCHAR(20)"},{"n":"HORAS_EXTRA","t":"DECIMAL"},{"n":"IMPUESTOS","t":"DECIMAL"},{"n":"NOMINA","t":"VARCHAR(4)"},{"n":"NUMERO_CERTIFICADO_CIA","t":"VARCHAR(20)"},{"n":"NUMERO_CERTIFICADO_SAT","t":"VARCHAR(20)"},{"n":"NUMERO_NOMINA","t":"INT"},{"n":"RECIBO","t":"VARCHAR(255)"},{"n":"REG_PATRONAL","t":"VARCHAR(255)"},{"n":"SELLO_CFD","t":"VARCHAR"},{"n":"SELLO_SAT","t":"VARCHAR"}]},"EMPLEADO_NOMINA_CFDI_CONCEPTO":{"m":"CN","d":"","f":[{"n":"CLASE","t":"VARCHAR(20)"},{"n":"CLAVE","t":"VARCHAR(255)"},{"n":"CONCEPTO","t":"VARCHAR"},{"n":"DESCUENTO","t":"DECIMAL"},{"n":"DIAS","t":"VARCHAR(5)"},{"n":"EMPLEADO","t":"VARCHAR(20)"},{"n":"HORAS","t":"VARCHAR(5)"},{"n":"ID","t":"INT"},{"n":"IMPORTE","t":"DECIMAL"},{"n":"NOMINA","t":"VARCHAR(4)"},{"n":"NUMERO_NOMINA","t":"INT"},{"n":"RECIBO","t":"VARCHAR(255)"},{"n":"TIPO","t":"VARCHAR(255)"},{"n":"TOTAL_EXENTO","t":"DECIMAL"},{"n":"TOTAL_GRAVADO","t":"DECIMAL"}]},"EMPLEADO_NOTAS":{"m":"CN","d":"","f":[{"n":"EMPLEADO","t":"VARCHAR(20)"},{"n":"NOTAS","t":"TEXT"}]},"EMPLEADO_PARIENTE":{"m":"CN","d":"","f":[{"n":"CONSECUTIVO","t":"INT"},{"n":"EMPLEADO","t":"VARCHAR(20)"},{"n":"FECHA_NACIMIENTO","t":"DATETIME"},{"n":"LUGAR_ESTUDIO","t":"VARCHAR(40)"},{"n":"LUGAR_TRABAJO","t":"VARCHAR(40)"},{"n":"NIVEL_ACADEMICO","t":"VARCHAR(15)"},{"n":"NOMBRE","t":"VARCHAR(40)"},{"n":"NOTAS","t":"TEXT"},{"n":"PARENTESCO","t":"VARCHAR(8)"},{"n":"PUESTO","t":"VARCHAR(40)"},{"n":"TELEFONO","t":"VARCHAR(20)"}]},"EMPLEADO_SALDO_VAC":{"m":"CN","d":"Saldos acumulados por período, cuenta y dimensión de análisis.","f":[{"n":"ACUMULADO","t":"DECIMAL"},{"n":"ACUMULADO_ADIC","t":"DECIMAL"},{"n":"ANNO","t":"INT"},{"n":"CONSECUTIVO","t":"INT"},{"n":"EMPLEADO","t":"VARCHAR(20)"},{"n":"LIQUIDACION","t":"INT"},{"n":"NOMINA","t":"VARCHAR(4)"},{"n":"NUMERO_NOMINA","t":"INT"},{"n":"REGIMEN_VACACIONAL","t":"VARCHAR(12)"},{"n":"SALDO_ACTUAL","t":"DECIMAL"},{"n":"SALDO_ACTUAL_ADIC","t":"DECIMAL"}]},"EMPLEADO_VACACION":{"m":"CN","d":"Control de vacaciones: días acumulados, tomados y pendientes.","f":[{"n":"ADV_CONTRIB_NOAPLI","t":"VARCHAR(1)"},{"n":"CALCULA_VACACIONES","t":"VARCHAR(1)"},{"n":"CONTRIB_PENDIENTES","t":"VARCHAR(1)"},{"n":"EMPLEADO","t":"VARCHAR(20)"},{"n":"NOTAS_ADVERTENCIA","t":"TEXT"},{"n":"PERMITE_ACUM_NEG","t":"VARCHAR(1)"},{"n":"REGIMEN_VACACIONAL","t":"VARCHAR(12)"},{"n":"REQUIERE_VERIFIC","t":"VARCHAR(1)"},{"n":"UNIDAD_VACACIONAL","t":"DECIMAL"}]},"EMPLEADOS_X_RANGO":{"m":"CN","d":"","f":[{"n":"CENTRO_COSTO","t":"VARCHAR(25)"},{"n":"CONSECUTIVO","t":"INT"},{"n":"empleado","t":"VARCHAR(20)"},{"n":"FASE","t":"VARCHAR(25)"},{"n":"PROYECTO","t":"VARCHAR(25)"},{"n":"variable_desicion","t":"DECIMAL"}]},"EMPRESA":{"m":"","d":"Configuración de empresas del grupo con parámetros globales.","f":[{"n":"CEDULAJURIDICA","t":"VARCHAR(20)"},{"n":"GLN","t":"VARCHAR(13)"},{"n":"NOMBRE","t":"VARCHAR(150)"}]},"ENC_TABLA_UDF":{"m":"","d":"","f":[{"n":"ETIQUETA","t":"VARCHAR(30)"},{"n":"LAYOUT","t":"VARCHAR"},{"n":"NOTAS","t":"TEXT"},{"n":"TABLA","t":"VARCHAR(30)"},{"n":"TIPO","t":"VARCHAR(1)"}]},"ENTIDAD_FINANCIERA":{"m":"CB","d":"Catálogo de entidades financieras (bancos) para operaciones bancarias.","f":[{"n":"COD_ELECTRONICO","t":"VARCHAR(20)"},{"n":"DESCRIPCION","t":"VARCHAR(40)"},{"n":"ENTIDAD_FINANCIERA","t":"VARCHAR(8)"},{"n":"NIT","t":"VARCHAR(20)"},{"n":"PS_AFV_ID_ENTIDAD_FINANCIERA","t":"INT"},{"n":"U_CONVENIOANEXO","t":"VARCHAR(1)"},{"n":"U_CUENTA_PPSFL","t":"VARCHAR(1)"},{"n":"U_STATUSENTIDAD","t":"VARCHAR(1)"}]},"ERROR_CONTROL_STREAMLINE":{"m":"","d":"","f":[{"n":"Articulos","t":"VARCHAR"},{"n":"EmailSent","t":"BIT"},{"n":"ErrorDateTime","t":"DATETIME"},{"n":"ErrorID","t":"INT"},{"n":"ErrorMessage","t":"VARCHAR"},{"n":"FechaCreacion","t":"DATETIME"},{"n":"Proveedor","t":"VARCHAR(50)"}]},"ESCALA_BONIF":{"m":"","d":"","f":[{"n":"ARTICULO","t":"VARCHAR(20)"},{"n":"ARTICULO_BONIF","t":"VARCHAR(20)"},{"n":"ESCALA_BONIF","t":"INT"},{"n":"FACTOR_BONIF","t":"DECIMAL"},{"n":"FECHA_FIN_ESC","t":"DATETIME"},{"n":"FECHA_INICIO_ESC","t":"DATETIME"},{"n":"FECHA_ULT_MODIF","t":"DATETIME"},{"n":"MAX_ART_FACT","t":"INT"},{"n":"MIN_ART_FACT","t":"INT"},{"n":"MONEDA","t":"VARCHAR(1)"},{"n":"NIVEL_PRECIO","t":"VARCHAR(12)"},{"n":"UNIDADES_BONIF","t":"DECIMAL"},{"n":"USUARIO_ULT_MODIF","t":"VARCHAR(50)"},{"n":"VERSION","t":"INT"},{"n":"VERSION_BONIF","t":"INT"}]},"ESCALA_DCTO":{"m":"","d":"","f":[{"n":"ARTICULO","t":"VARCHAR(20)"},{"n":"ESCALA_DCTO","t":"INT"},{"n":"FECHA_FIN_ESC","t":"DATETIME"},{"n":"FECHA_INICIO_ESC","t":"DATETIME"},{"n":"FECHA_ULT_MODIF","t":"DATETIME"},{"n":"MAX_UNID_FACT","t":"INT"},{"n":"MIN_UNID_FACT","t":"INT"},{"n":"MONEDA","t":"VARCHAR(1)"},{"n":"NIVEL_PRECIO","t":"VARCHAR(12)"},{"n":"PORC_DCTO","t":"DECIMAL"},{"n":"USUARIO_ULT_MODIF","t":"VARCHAR(50)"},{"n":"VERSION","t":"INT"},{"n":"VERSION_DCTO","t":"INT"}]},"ESTADO_ACTIVO":{"m":"","d":"","f":[{"n":"ACTIVO","t":"VARCHAR(1)"},{"n":"DESCRIPCION","t":"VARCHAR(40)"},{"n":"ESTADO_ACTIVO","t":"VARCHAR(4)"}]},"ESTADO_EMPLEADO":{"m":"CN","d":"","f":[{"n":"ACTIVO","t":"VARCHAR(1)"},{"n":"DESCRIPCION","t":"VARCHAR(40)"},{"n":"ESTADO_EMPLEADO","t":"VARCHAR(4)"},{"n":"PAGO","t":"VARCHAR(1)"},{"n":"TEMPORAL","t":"VARCHAR(1)"}]},"EVALPROV":{"m":"","d":"","f":[{"n":"COMENTARIO_PROV","t":"VARCHAR(200)"},{"n":"FECHA_APLICO_EVAL","t":"DATETIME"},{"n":"FECHA_PROX_APLICA","t":"DATETIME"},{"n":"NOTA_CRITERIO1","t":"DECIMAL"},{"n":"NOTA_CRITERIO10","t":"DECIMAL"},{"n":"NOTA_CRITERIO2","t":"DECIMAL"},{"n":"NOTA_CRITERIO3","t":"DECIMAL"},{"n":"NOTA_CRITERIO4","t":"DECIMAL"},{"n":"NOTA_CRITERIO5","t":"DECIMAL"},{"n":"NOTA_CRITERIO6","t":"DECIMAL"},{"n":"NOTA_CRITERIO7","t":"DECIMAL"},{"n":"NOTA_CRITERIO8","t":"DECIMAL"},{"n":"NOTA_CRITERIO9","t":"DECIMAL"},{"n":"NOTA_PROVEEDOR","t":"DECIMAL"},{"n":"PROVEEDOR","t":"VARCHAR(20)"}]},"EVENTO_CASO":{"m":"","d":"","f":[{"n":"CASO","t":"INT"},{"n":"COMANDOS","t":"INT"},{"n":"CONDICION","t":"INT"},{"n":"ESTADO","t":"VARCHAR(1)"},{"n":"EVENTO_CONTABLE","t":"VARCHAR(12)"},{"n":"FCH_HORA_CREACION","t":"DATETIME"},{"n":"FCH_HORA_MODIFIC","t":"DATETIME"},{"n":"MODELO","t":"VARCHAR(18)"},{"n":"NOMBRE","t":"VARCHAR(40)"},{"n":"NOTAS","t":"INT"},{"n":"SECUENCIA","t":"INT"},{"n":"USUARIO_CREACION","t":"VARCHAR(10)"},{"n":"USUARIO_MODIFIC","t":"VARCHAR(10)"}]},"EVENTO_CONTABLE":{"m":"","d":"","f":[{"n":"DESCRIPCION","t":"VARCHAR(80)"},{"n":"EVENTO_CONTABLE","t":"VARCHAR(12)"},{"n":"FCH_HORA_CREACION","t":"DATETIME"},{"n":"FCH_HORA_MODIFIC","t":"DATETIME"},{"n":"MODULO","t":"VARCHAR(4)"},{"n":"NOTAS","t":"INT"},{"n":"TIPO","t":"VARCHAR(1)"},{"n":"USUARIO_CREACION","t":"VARCHAR(10)"},{"n":"USUARIO_MODIFIC","t":"VARCHAR(10)"}]},"EVENTO_SECCION":{"m":"","d":"","f":[{"n":"DESCRIPCION","t":"VARCHAR(80)"},{"n":"EVENTO_CONTABLE","t":"VARCHAR(12)"},{"n":"NOTAS","t":"INT"},{"n":"SECCION","t":"INT"},{"n":"TIPO_CONTABLE","t":"VARCHAR(1)"}]},"EVENTO_TEXTO":{"m":"","d":"","f":[{"n":"EVENTO_TEXTO","t":"INT"},{"n":"TEXTO","t":"TEXT"}]},"EVENTO_VARIABLE":{"m":"","d":"","f":[{"n":"DESCRIPCION","t":"VARCHAR(40)"},{"n":"EVENTO_CONTABLE","t":"VARCHAR(12)"},{"n":"NOMBRE","t":"VARCHAR(18)"},{"n":"SECUENCIA","t":"INT"},{"n":"TIPO","t":"VARCHAR(1)"}]},"EXCEP_CIUDAD":{"m":"","d":"","f":[{"n":"CENTRO_COSTO","t":"VARCHAR(25)"},{"n":"CODIGO_RETENCION","t":"VARCHAR(4)"},{"n":"CUENTA_CONTABLE","t":"VARCHAR(25)"},{"n":"DIVISION_GEOGRAFICA1","t":"VARCHAR(12)"},{"n":"DIVISION_GEOGRAFICA2","t":"VARCHAR(12)"},{"n":"PAIS","t":"VARCHAR(4)"},{"n":"PORCENTAJE","t":"DECIMAL"}]},"EXCEP_REGIMEN":{"m":"","d":"","f":[{"n":"CENTRO_COSTO","t":"VARCHAR(25)"},{"n":"CODIGO","t":"VARCHAR(12)"},{"n":"CODIGO_RETENCION","t":"VARCHAR(4)"},{"n":"CUENTA_CONTABLE","t":"VARCHAR(25)"},{"n":"PORCENTAJE","t":"DECIMAL"}]},"EXCEPCION_ARANCEL_IMP":{"m":"CO","d":"","f":[{"n":"CODIGO_ARANCEL","t":"VARCHAR(15)"},{"n":"IMPUESTO_COMPRA","t":"VARCHAR(20)"},{"n":"PAIS","t":"VARCHAR(4)"},{"n":"TIPO","t":"VARCHAR(1)"}]},"EXCEPCION_ARANCEL_PAIS":{"m":"CO","d":"Catálogo de países con cuentas contables asociadas para integración.","f":[{"n":"CODIGO_ARANCEL","t":"VARCHAR(15)"},{"n":"PAIS","t":"VARCHAR(4)"},{"n":"TIPO","t":"VARCHAR(1)"}]},"EXCEPCION_D104":{"m":"","d":"","f":[{"n":"ACTIVIDAD","t":"VARCHAR(4)"},{"n":"ARTICULO_EXCEPCION","t":"VARCHAR(20)"},{"n":"CLIENTE_EXCEPCION","t":"VARCHAR(20)"},{"n":"TIPO_TARIFA","t":"VARCHAR(2)"}]},"EXISTENCIA_BODEGA":{"m":"CI","d":"Catálogo de bodegas/almacenes con parámetros logísticos.","f":[{"n":"ARTICULO","t":"VARCHAR(20)"},{"n":"BLOQUEA_TRANS","t":"VARCHAR(1)"},{"n":"BODEGA","t":"VARCHAR(4)"},{"n":"CANT_DISPONIBLE","t":"DECIMAL"},{"n":"CANT_NO_APROBADA","t":"DECIMAL"},{"n":"CANT_PEDIDA","t":"DECIMAL"},{"n":"CANT_PRODUCCION","t":"DECIMAL"},{"n":"CANT_REMITIDA","t":"DECIMAL"},{"n":"CANT_RESERVADA","t":"DECIMAL"},{"n":"CANT_TRANSITO","t":"DECIMAL"},{"n":"CANT_VENCIDA","t":"DECIMAL"},{"n":"CONGELADO","t":"VARCHAR(1)"},{"n":"COSTO_PROM_COMPARATIVO_DOLAR","t":"DECIMAL"},{"n":"COSTO_PROM_COMPARATIVO_LOC","t":"DECIMAL"},{"n":"COSTO_UNT_ESTANDAR_DOL","t":"DECIMAL"},{"n":"COSTO_UNT_ESTANDAR_LOC","t":"DECIMAL"},{"n":"COSTO_UNT_PROMEDIO_DOL","t":"DECIMAL"},{"n":"COSTO_UNT_PROMEDIO_LOC","t":"DECIMAL"},{"n":"EXISTENCIA_MAXIMA","t":"DECIMAL"},{"n":"EXISTENCIA_MINIMA","t":"DECIMAL"},{"n":"FECHA_CONG","t":"DATETIME"},{"n":"FECHA_DESCONG","t":"DATETIME"},{"n":"PS_AFV_CANT_DISPONIBILIDAD","t":"INT"},{"n":"PUNTO_DE_REORDEN","t":"DECIMAL"}]},"EXISTENCIA_CIERRE":{"m":"CI","d":"","f":[{"n":"ARTICULO","t":"VARCHAR(20)"},{"n":"BODEGA","t":"VARCHAR(4)"},{"n":"CANT_DISPONIBLE","t":"DECIMAL"},{"n":"CANT_NO_APROBADA","t":"DECIMAL"},{"n":"CANT_REMITIDA","t":"DECIMAL"},{"n":"CANT_RESERVADA","t":"DECIMAL"},{"n":"CANT_VENCIDA","t":"DECIMAL"},{"n":"COSTO_COMP_UNT_DOL","t":"DECIMAL"},{"n":"COSTO_COMP_UNT_LOC","t":"DECIMAL"},{"n":"COSTO_FISC_UNT_DOL","t":"DECIMAL"},{"n":"COSTO_FISC_UNT_LOC","t":"DECIMAL"},{"n":"FECHA_CIERRE","t":"DATETIME"},{"n":"TIPO_COSTO","t":"VARCHAR(1)"},{"n":"TIPO_FECHA","t":"VARCHAR(1)"}]},"EXISTENCIA_LOTE":{"m":"CI","d":"Control de lotes de producción/compra. Trazabilidad y vencimientos.","f":[{"n":"ARTICULO","t":"VARCHAR(20)"},{"n":"BODEGA","t":"VARCHAR(4)"},{"n":"CANT_DISPONIBLE","t":"DECIMAL"},{"n":"CANT_NO_APROBADA","t":"DECIMAL"},{"n":"CANT_REMITIDA","t":"DECIMAL"},{"n":"CANT_RESERVADA","t":"DECIMAL"},{"n":"CANT_VENCIDA","t":"DECIMAL"},{"n":"COSTO_UNT_ESTANDAR_DOL","t":"DECIMAL"},{"n":"COSTO_UNT_ESTANDAR_LOC","t":"DECIMAL"},{"n":"COSTO_UNT_PROMEDIO_DOL","t":"DECIMAL"},{"n":"COSTO_UNT_PROMEDIO_LOC","t":"DECIMAL"},{"n":"LOCALIZACION","t":"VARCHAR(8)"},{"n":"LOTE","t":"VARCHAR(15)"}]},"EXISTENCIA_RESERVA":{"m":"CI","d":"","f":[{"n":"APLICACION","t":"VARCHAR(60)"},{"n":"ARTICULO","t":"VARCHAR(20)"},{"n":"BODEGA","t":"VARCHAR(4)"},{"n":"CANTIDAD","t":"DECIMAL"},{"n":"FECHA_HORA","t":"DATETIME"},{"n":"LOCALIZACION","t":"VARCHAR(8)"},{"n":"LOTE","t":"VARCHAR(15)"},{"n":"MODULO_ORIGEN","t":"VARCHAR(4)"},{"n":"SERIE_CADENA","t":"INT"},{"n":"USUARIO","t":"VARCHAR(50)"}]},"EXISTENCIA_SERIE":{"m":"CI","d":"Números de serie para control de activos serializados.","f":[{"n":"ARTICULO","t":"VARCHAR(20)"},{"n":"BODEGA","t":"VARCHAR(4)"},{"n":"CANTIDAD","t":"DECIMAL"},{"n":"LOCALIZACION","t":"VARCHAR(8)"},{"n":"LOTE","t":"VARCHAR(15)"},{"n":"SERIE_FINAL","t":"VARCHAR(20)"},{"n":"SERIE_INICIAL","t":"VARCHAR(20)"},{"n":"TIPO","t":"VARCHAR(1)"}]},"EXONERACION_OPERACIONES":{"m":"","d":"","f":[{"n":"DESCRIPCION","t":"VARCHAR(800)"},{"n":"EXONERACION_OPER","t":"VARCHAR(4)"}]},"FACTURA":{"m":"FA","d":"Cabecera de facturas emitidas. Número, cliente, fecha, condición pago, bodega, vendedor y totales.","f":[{"n":"ACT_COM_RECEPTOR","t":"VARCHAR(10)"},{"n":"ACT_DETRAC","t":"VARCHAR(4)"},{"n":"ACTIVIDAD_COMERCIAL","t":"VARCHAR(10)"},{"n":"AJUSTE_REDONDEO","t":"DECIMAL"},{"n":"ANULADA","t":"VARCHAR(1)"},{"n":"ASIENTO_DOCUMENTO","t":"VARCHAR(10)"},{"n":"AUDIT_TRANS_INV","t":"INT"},{"n":"BASE_IMPUESTO1","t":"DECIMAL"},{"n":"BASE_IMPUESTO2","t":"DECIMAL"},{"n":"CANCELACION","t":"VARCHAR(2)"},{"n":"CARGADO_CG","t":"VARCHAR(1)"},{"n":"CARGADO_CXC","t":"VARCHAR(1)"},{"n":"CLASE_DOCUMENTO","t":"VARCHAR(1)"},{"n":"CLAVE_DE","t":"VARCHAR(50)"},{"n":"CLAVE_REFERENCIA_DE","t":"VARCHAR(50)"},{"n":"CLAVE_TECNICA","t":"VARCHAR(80)"},{"n":"CLIENTE","t":"VARCHAR(20)"},{"n":"CLIENTE_CORPORAC","t":"VARCHAR(20)"},{"n":"CLIENTE_DIRECCION","t":"VARCHAR(20)"},{"n":"CLIENTE_ORIGEN","t":"VARCHAR(20)"},{"n":"COBRADA","t":"VARCHAR(1)"},{"n":"COBRADOR","t":"VARCHAR(4)"},{"n":"CODIGO_GENERACION","t":"VARCHAR(100)"},{"n":"CODIGO_REFERENCIA_DE","t":"VARCHAR(2)"},{"n":"CODIGO_REFERENCIA_OTRO","t":"VARCHAR(100)"}]},"FACTURA_ADUANA":{"m":"FA","d":"","f":[{"n":"CLIENTE","t":"VARCHAR(20)"},{"n":"FACTURA","t":"VARCHAR(50)"},{"n":"FECHA_DUA","t":"DATETIME"},{"n":"NIT_AGEN_ADUANA","t":"VARCHAR(20)"},{"n":"NOMBRE_AGEN_ADUANA","t":"VARCHAR(80)"},{"n":"NUMERO_DUA","t":"VARCHAR(50)"},{"n":"PROVEEDOR","t":"VARCHAR(20)"},{"n":"TIPO_DOCUMENTO","t":"VARCHAR(1)"}]},"FACTURA_ADUANA_CMP":{"m":"FA","d":"","f":[{"n":"ADUANA","t":"VARCHAR(80)"},{"n":"DESC_PARTIDA_ARANCEL","t":"VARCHAR(80)"},{"n":"FACTURA","t":"VARCHAR(50)"},{"n":"FECHA_DUA","t":"DATETIME"},{"n":"NIT_AGEN_ADUANA","t":"VARCHAR(20)"},{"n":"NOMBRE_AGEN_ADUANA","t":"VARCHAR(80)"},{"n":"NUMERO_DUA","t":"VARCHAR(50)"},{"n":"PARTIDA_ARANCEL","t":"VARCHAR(50)"},{"n":"PROVEEDOR","t":"VARCHAR(20)"},{"n":"PROVEEDOR_ADU","t":"VARCHAR(20)"},{"n":"TIPO_DOCUMENTO","t":"VARCHAR(1)"},{"n":"VALOR_ADUANA","t":"DECIMAL"}]},"FACTURA_CANCELA":{"m":"FA","d":"","f":[{"n":"CAJA","t":"VARCHAR(10)"},{"n":"CHECK_DEVOLUCION","t":"VARCHAR(1)"},{"n":"DEVOLUCION","t":"VARCHAR(50)"},{"n":"ENTIDAD_FINANCIERA","t":"VARCHAR(8)"},{"n":"FACTURA","t":"VARCHAR(50)"},{"n":"FECHA_HORA","t":"DATETIME"},{"n":"FORMA_PAGO_DE","t":"VARCHAR(4)"},{"n":"MONEDA","t":"VARCHAR(1)"},{"n":"MONTO","t":"DECIMAL"},{"n":"NUM_AUTORIZA","t":"VARCHAR(20)"},{"n":"NUM_DOCUMENTO","t":"VARCHAR(20)"},{"n":"NUMERO_PAGO","t":"INT"},{"n":"TIPO","t":"VARCHAR(1)"},{"n":"TIPO_DOCUMENTO","t":"VARCHAR(1)"},{"n":"TIPO_TARJETA","t":"VARCHAR(12)"},{"n":"USUARIO","t":"VARCHAR(50)"}]},"FACTURA_CANCELA_FR":{"m":"FA","d":"","f":[{"n":"FACTURA","t":"VARCHAR(50)"},{"n":"MONEDA","t":"VARCHAR(1)"},{"n":"MONTO","t":"DECIMAL"},{"n":"NUM_DOCUMENTO","t":"VARCHAR(20)"},{"n":"NUMERO_PAGO","t":"INT"},{"n":"TIPO","t":"VARCHAR(1)"},{"n":"TIPO_DOCUMENTO","t":"VARCHAR(1)"}]},"FACTURA_DOC_CC":{"m":"FA","d":"","f":[{"n":"DOCUMENTO_CC","t":"VARCHAR(50)"},{"n":"FACTURA","t":"VARCHAR(50)"},{"n":"LINEA","t":"INT"},{"n":"TIPO","t":"VARCHAR(3)"},{"n":"TIPO_DOCUMENTO","t":"VARCHAR(1)"}]},"FACTURA_LINEA":{"m":"FA","d":"","f":[{"n":"ADVALOREM_ES","t":"DECIMAL"},{"n":"ANULADA","t":"VARCHAR(1)"},{"n":"ARTICULO","t":"VARCHAR(20)"},{"n":"BASE_IMPUESTO1","t":"DECIMAL"},{"n":"BASE_IMPUESTO2","t":"DECIMAL"},{"n":"BIEN_SERVICIO","t":"VARCHAR(1)"},{"n":"BODEGA","t":"VARCHAR(4)"},{"n":"CANT_ANUL_PORDESPA","t":"DECIMAL"},{"n":"CANT_DESPACHADA","t":"DECIMAL"},{"n":"CANT_DEV_PROCESO","t":"DECIMAL"},{"n":"CANT_NO_ENTREGADA","t":"DECIMAL"},{"n":"CANTIDAD","t":"DECIMAL"},{"n":"CANTIDAD_ACEPTADA","t":"DECIMAL"},{"n":"CANTIDAD_DEVUELT","t":"DECIMAL"},{"n":"CENTRO_COSTO","t":"VARCHAR(25)"},{"n":"CODIGO_IMPUESTO","t":"VARCHAR(4)"},{"n":"COMENTARIO","t":"VARCHAR(100)"},{"n":"COSTO_ESTIM_COMP_DOLAR","t":"DECIMAL"},{"n":"COSTO_ESTIM_COMP_LOCAL","t":"DECIMAL"},{"n":"COSTO_ESTIM_DOLAR","t":"DECIMAL"},{"n":"COSTO_ESTIM_LOCAL","t":"DECIMAL"},{"n":"COSTO_TOTAL","t":"DECIMAL"},{"n":"COSTO_TOTAL_COMP","t":"DECIMAL"},{"n":"COSTO_TOTAL_COMP_DOLAR","t":"DECIMAL"},{"n":"COSTO_TOTAL_COMP_LOCAL","t":"DECIMAL"}]},"FACTURA_RETENCION":{"m":"FA","d":"Retenciones fiscales aplicadas en documentos de compra o venta.","f":[{"n":"AUTORETENEDORA","t":"VARCHAR(1)"},{"n":"BASE","t":"DECIMAL"},{"n":"CODIGO_GENERACION","t":"VARCHAR(100)"},{"n":"CODIGO_RETENCION","t":"VARCHAR(4)"},{"n":"DOC_REFERENCIA","t":"VARCHAR(50)"},{"n":"DTE","t":"VARCHAR(100)"},{"n":"FACTURA","t":"VARCHAR(50)"},{"n":"FECHA_DOCUMENTO","t":"DATETIME"},{"n":"FECHA_RIGE","t":"DATETIME"},{"n":"MONTO","t":"DECIMAL"},{"n":"SELLO_RECEPCION","t":"VARCHAR(100)"},{"n":"TIPO_DOCUMENTO","t":"VARCHAR(1)"}]},"FALLA":{"m":"","d":"","f":[{"n":"CAUSA","t":"VARCHAR(40)"},{"n":"DESCRIPCION","t":"VARCHAR(40)"},{"n":"FALLA","t":"VARCHAR(5)"},{"n":"SOLUCION","t":"VARCHAR(40)"},{"n":"TIPO_EQUIPO_CS","t":"VARCHAR(5)"}]},"FECHA":{"m":"","d":"","f":[{"n":"AÑO","t":"DATETIME"},{"n":"AÑO_NOMBRE","t":"VARCHAR(50)"},{"n":"DÍA_DEL_AÑO","t":"INT"},{"n":"DÍA_DEL_AÑO_NOMBRE","t":"VARCHAR(50)"},{"n":"DÍA_DEL_MES","t":"INT"},{"n":"DÍA_DEL_MES_NOMBRE","t":"VARCHAR(50)"},{"n":"DÍA_DEL_SEMESTRE","t":"INT"},{"n":"DÍA_DEL_SEMESTRE_NOMBRE","t":"VARCHAR(50)"},{"n":"DÍA_DEL_TRIMESTRE","t":"INT"},{"n":"DÍA_DEL_TRIMESTRE_NOMBRE","t":"VARCHAR(50)"},{"n":"FECHA","t":"DATETIME"},{"n":"FECHA_NOMBRE","t":"VARCHAR(50)"},{"n":"MES","t":"DATETIME"},{"n":"MES_DEL_AÑO","t":"INT"},{"n":"MES_DEL_AÑO_NOMBRE","t":"VARCHAR(50)"},{"n":"MES_DEL_SEMESTRE","t":"INT"},{"n":"MES_DEL_SEMESTRE_NOMBRE","t":"VARCHAR(50)"},{"n":"MES_DEL_TRIMESTRE","t":"INT"},{"n":"MES_DEL_TRIMESTRE_NOMBRE","t":"VARCHAR(50)"},{"n":"MES_NOMBRE","t":"VARCHAR(50)"},{"n":"SEMESTRE","t":"DATETIME"},{"n":"SEMESTRE_DEL_AÑO","t":"INT"},{"n":"SEMESTRE_DEL_AÑO_NOMBRE","t":"VARCHAR(50)"},{"n":"SEMESTRE_NOMBRE","t":"VARCHAR(50)"},{"n":"TRIMESTRE","t":"DATETIME"}]},"FERIADO":{"m":"","d":"","f":[{"n":"FECHA_FERIADO","t":"DATETIME"},{"n":"RAZON","t":"TEXT"}]},"FIADORES_DOC_CC":{"m":"CC","d":"","f":[{"n":"CONTRATO_FIADOR","t":"VARCHAR(20)"},{"n":"DIR_TRAB_FIADOR","t":"VARCHAR(80)"},{"n":"DIREC_FIADOR","t":"VARCHAR(80)"},{"n":"DOCUMENTO","t":"VARCHAR(50)"},{"n":"FIADOR_ID","t":"VARCHAR(20)"},{"n":"LUG_TRAB_FIADOR","t":"VARCHAR(80)"},{"n":"NOMBRE_FIADOR","t":"VARCHAR(80)"},{"n":"OBS_FIADOR","t":"VARCHAR(200)"},{"n":"OCUPAC_FIADOR","t":"VARCHAR(30)"},{"n":"TEL_DOM_FIADOR","t":"VARCHAR(10)"},{"n":"TEL_TRAB_FIADOR","t":"VARCHAR(10)"},{"n":"TIPO","t":"VARCHAR(3)"},{"n":"TIPO_FIADOR","t":"VARCHAR(20)"}]},"FIADORES_DOC_CO":{"m":"CC","d":"","f":[{"n":"CONTRATO_FIADOR","t":"VARCHAR(20)"},{"n":"DIR_TRAB_FIADOR","t":"VARCHAR(80)"},{"n":"DIREC_FIADOR","t":"VARCHAR(80)"},{"n":"DOCUMENTO","t":"VARCHAR(50)"},{"n":"FIADOR_ID","t":"VARCHAR(20)"},{"n":"LUG_TRAB_FIADOR","t":"VARCHAR(80)"},{"n":"NOMBRE_FIADOR","t":"VARCHAR(80)"},{"n":"OBS_FIADOR","t":"VARCHAR(200)"},{"n":"OCUPAC_FIADOR","t":"VARCHAR(30)"},{"n":"PROVEEDOR","t":"VARCHAR(20)"},{"n":"TEL_DOM_FIADOR","t":"VARCHAR(10)"},{"n":"TEL_TRAB_FIADOR","t":"VARCHAR(10)"},{"n":"TIPO","t":"VARCHAR(1)"},{"n":"TIPO_FIADOR","t":"VARCHAR(20)"}]},"FIADORES_DOC_CP":{"m":"CC","d":"","f":[{"n":"CONTRATO_FIADOR","t":"VARCHAR(20)"},{"n":"DIR_TRAB_FIADOR","t":"VARCHAR(80)"},{"n":"DIREC_FIADOR","t":"VARCHAR(80)"},{"n":"DOCUMENTO","t":"VARCHAR(50)"},{"n":"FIADOR_ID","t":"VARCHAR(20)"},{"n":"LUG_TRAB_FIADOR","t":"VARCHAR(80)"},{"n":"NOMBRE_FIADOR","t":"VARCHAR(80)"},{"n":"OBS_FIADOR","t":"VARCHAR(200)"},{"n":"OCUPAC_FIADOR","t":"VARCHAR(30)"},{"n":"PROVEEDOR","t":"VARCHAR(20)"},{"n":"TEL_DOM_FIADOR","t":"VARCHAR(10)"},{"n":"TEL_TRAB_FIADOR","t":"VARCHAR(10)"},{"n":"TIPO","t":"VARCHAR(3)"},{"n":"TIPO_FIADOR","t":"VARCHAR(20)"}]},"FIADORES_DOC_FA":{"m":"CC","d":"","f":[{"n":"CONTRATO_FIADOR","t":"VARCHAR(20)"},{"n":"DIR_TRAB_FIADOR","t":"VARCHAR(80)"},{"n":"DIREC_FIADOR","t":"VARCHAR(80)"},{"n":"DOCUMENTO","t":"VARCHAR(50)"},{"n":"FIADOR_ID","t":"VARCHAR(20)"},{"n":"LUG_TRAB_FIADOR","t":"VARCHAR(80)"},{"n":"NOMBRE_FIADOR","t":"VARCHAR(80)"},{"n":"OBS_FIADOR","t":"VARCHAR(200)"},{"n":"OCUPAC_FIADOR","t":"VARCHAR(30)"},{"n":"TEL_DOM_FIADOR","t":"VARCHAR(10)"},{"n":"TEL_TRAB_FIADOR","t":"VARCHAR(10)"},{"n":"TIPO","t":"VARCHAR(1)"},{"n":"TIPO_FIADOR","t":"VARCHAR(20)"}]},"FIADORES_PED_FA":{"m":"CC","d":"","f":[{"n":"CONTRATO_FIADOR","t":"VARCHAR(20)"},{"n":"DIR_TRAB_FIADOR","t":"VARCHAR(80)"},{"n":"DIREC_FIADOR","t":"VARCHAR(80)"},{"n":"DOCUMENTO","t":"VARCHAR(20)"},{"n":"FIADOR_ID","t":"VARCHAR(20)"},{"n":"LUG_TRAB_FIADOR","t":"VARCHAR(80)"},{"n":"NOMBRE_FIADOR","t":"VARCHAR(80)"},{"n":"OBS_FIADOR","t":"VARCHAR(200)"},{"n":"OCUPAC_FIADOR","t":"VARCHAR(30)"},{"n":"TEL_DOM_FIADOR","t":"VARCHAR(10)"},{"n":"TEL_TRAB_FIADOR","t":"VARCHAR(10)"},{"n":"TIPO","t":"VARCHAR(1)"},{"n":"TIPO_FIADOR","t":"VARCHAR(20)"}]},"FILTRO_EMPLEADO_REPORTES":{"m":"CN","d":"","f":[{"n":"EMPLEADO","t":"VARCHAR(20)"},{"n":"PROCESO","t":"VARCHAR(150)"}]},"FORMA_PAGO_COMPRA":{"m":"","d":"Tabla de catálogo/maestro de referencia con código y descripción.","f":[{"n":"CODIGO","t":"VARCHAR(2)"},{"n":"DESCRIPCION","t":"VARCHAR(249)"}]},"FORMA_PAGO_DE":{"m":"","d":"Tabla de catálogo/maestro de referencia con código y descripción.","f":[{"n":"CODIGO","t":"VARCHAR(4)"},{"n":"DESCRIPCION","t":"VARCHAR(254)"},{"n":"TIPO_PAGO_ASOC","t":"VARCHAR(4)"}]},"FORMA_PAGO_NE":{"m":"","d":"","f":[{"n":"FORMA_PAGO_NE","t":"VARCHAR(10)"},{"n":"NOMBRE","t":"VARCHAR(254)"}]},"FORMA_PAGO_VENTA":{"m":"","d":"Tabla de catálogo/maestro de referencia con código y descripción.","f":[{"n":"CODIGO","t":"VARCHAR(2)"},{"n":"DESCRIPCION","t":"VARCHAR(249)"}]},"FORMAS_PAGO":{"m":"","d":"Tabla de catálogo/maestro de referencia con código y descripción.","f":[{"n":"CODIGO","t":"VARCHAR(4)"},{"n":"DESCRIPCION","t":"VARCHAR(249)"},{"n":"PAIS","t":"VARCHAR(20)"}]},"FORMATO":{"m":"","d":"","f":[{"n":"AGRUPACION_PERIODO","t":"INT"},{"n":"ARTICULO_FIN","t":"VARCHAR(20)"},{"n":"ARTICULO_INI","t":"VARCHAR(20)"},{"n":"BODEGA_FIN","t":"VARCHAR(4)"},{"n":"BODEGA_INI","t":"VARCHAR(4)"},{"n":"CANTIDADES_ENMILES","t":"VARCHAR(1)"},{"n":"CATCLIENTE_FIN","t":"VARCHAR(8)"},{"n":"CATCLIENTE_INI","t":"VARCHAR(8)"},{"n":"CLASIFICACION1_FIN","t":"VARCHAR(12)"},{"n":"CLASIFICACION1_INI","t":"VARCHAR(12)"},{"n":"CLASIFICACION2_FIN","t":"VARCHAR(12)"},{"n":"CLASIFICACION2_INI","t":"VARCHAR(12)"},{"n":"CLASIFICACION3_FIN","t":"VARCHAR(12)"},{"n":"CLASIFICACION3_INI","t":"VARCHAR(12)"},{"n":"CLASIFICACION4_FIN","t":"VARCHAR(12)"},{"n":"CLASIFICACION4_INI","t":"VARCHAR(12)"},{"n":"CLASIFICACION5_FIN","t":"VARCHAR(12)"},{"n":"CLASIFICACION5_INI","t":"VARCHAR(12)"},{"n":"CLASIFICACION6_FIN","t":"VARCHAR(12)"},{"n":"CLASIFICACION6_INI","t":"VARCHAR(12)"},{"n":"CLIENTE_CORP_FIN","t":"VARCHAR(20)"},{"n":"CLIENTE_CORP_INI","t":"VARCHAR(20)"},{"n":"CLIENTE_FIN","t":"VARCHAR(20)"},{"n":"CLIENTE_INI","t":"VARCHAR(20)"},{"n":"CLIENTE_ORIGEN_FIN","t":"VARCHAR(20)"}]},"FORMATO_COLUMNA":{"m":"","d":"Detalle de transacción con cantidades y valores unitarios.","f":[{"n":"ACUM_ANO","t":"VARCHAR(1)"},{"n":"ACUM_ANO_ANT","t":"VARCHAR(1)"},{"n":"ACUM_MES","t":"VARCHAR(1)"},{"n":"ACUM_MES_ANT","t":"VARCHAR(1)"},{"n":"ACUM_PER_ANT","t":"VARCHAR(1)"},{"n":"ACUM_PERIODO","t":"VARCHAR(1)"},{"n":"CANTIDAD","t":"VARCHAR(1)"},{"n":"COLUMNA","t":"VARCHAR(20)"},{"n":"COSTO","t":"VARCHAR(1)"},{"n":"DESCUENTO","t":"VARCHAR(1)"},{"n":"FORMATO","t":"VARCHAR(20)"},{"n":"IMPUESTO1","t":"VARCHAR(1)"},{"n":"IMPUESTO2","t":"VARCHAR(1)"},{"n":"MONTO","t":"VARCHAR(1)"},{"n":"PORCENTAJE","t":"VARCHAR(1)"},{"n":"PORCENTAJE_DESC","t":"VARCHAR(1)"},{"n":"PORCENTAJE_UTIL","t":"VARCHAR(1)"},{"n":"UTILIDAD","t":"VARCHAR(1)"}]},"FORMATO_ORDEN":{"m":"","d":"","f":[{"n":"DESPLIEGUE","t":"VARCHAR(1)"},{"n":"FORMATO","t":"VARCHAR(20)"},{"n":"ORDEN","t":"VARCHAR(20)"},{"n":"ORDEN_COL","t":"VARCHAR(1)"},{"n":"ORDENAMIENTO","t":"VARCHAR(1)"},{"n":"POSICION_ORDEN","t":"INT"}]},"FORMATO_PLANIFICACION":{"m":"","d":"","f":[{"n":"ARTIC_CON_MOVIMIENTOS","t":"VARCHAR(1)"},{"n":"ARTICULO_DESDE","t":"VARCHAR(20)"},{"n":"ARTICULO_DESDE_DESC","t":"VARCHAR(254)"},{"n":"ARTICULO_HASTA","t":"VARCHAR(20)"},{"n":"ARTICULO_HASTA_DESC","t":"VARCHAR(254)"},{"n":"BASE_SUGERENCIA","t":"VARCHAR(1)"},{"n":"BODEGA_DESDE","t":"VARCHAR(4)"},{"n":"BODEGA_DESDE_DESC","t":"VARCHAR(40)"},{"n":"BODEGA_HASTA","t":"VARCHAR(4)"},{"n":"BODEGA_HASTA_DESC","t":"VARCHAR(40)"},{"n":"CALCULAR_HASTA","t":"VARCHAR(1)"},{"n":"CANTIDAD_PERIODOS","t":"INT"},{"n":"CLASIFICACION_1_DESDE","t":"VARCHAR(12)"},{"n":"CLASIFICACION_1_HASTA","t":"VARCHAR(12)"},{"n":"CLASIFICACION_2_DESDE","t":"VARCHAR(12)"},{"n":"CLASIFICACION_2_HASTA","t":"VARCHAR(12)"},{"n":"CLASIFICACION_3_DESDE","t":"VARCHAR(12)"},{"n":"CLASIFICACION_3_HASTA","t":"VARCHAR(12)"},{"n":"CLASIFICACION_4_DESDE","t":"VARCHAR(12)"},{"n":"CLASIFICACION_4_HASTA","t":"VARCHAR(12)"},{"n":"CLASIFICACION_5_DESDE","t":"VARCHAR(12)"},{"n":"CLASIFICACION_5_HASTA","t":"VARCHAR(12)"},{"n":"CLASIFICACION_6_DESDE","t":"VARCHAR(12)"},{"n":"CLASIFICACION_6_HASTA","t":"VARCHAR(12)"},{"n":"CONJUNTO","t":"VARCHAR(10)"}]},"FORMATO_TRAN_PARAM":{"m":"","d":"Parámetros de configuración del módulo.","f":[{"n":"FORMATO","t":"VARCHAR(10)"},{"n":"NOMBRE","t":"VARCHAR(50)"},{"n":"TIPO","t":"VARCHAR(1)"},{"n":"UBICACION","t":"VARCHAR(1)"},{"n":"VALOR","t":"VARCHAR(100)"}]},"FORMATO_TRAN_SFTP":{"m":"","d":"","f":[{"n":"DIRECTORIO_SFTP","t":"VARCHAR(100)"},{"n":"FORMATO","t":"VARCHAR(10)"},{"n":"PASSWORD","t":"VARCHAR(100)"},{"n":"PASSWORD_CONFIRMACION","t":"VARCHAR(100)"},{"n":"PREFIJO_ARCHIVO","t":"VARCHAR(100)"},{"n":"PUERTO_SFTP","t":"INT"},{"n":"SERVIDOR_SFTP","t":"VARCHAR(50)"},{"n":"USUARIO","t":"VARCHAR(100)"}]},"FORMATO_TRANSFER":{"m":"","d":"","f":[{"n":"ARCHIVO_TRANSFORMACION","t":"VARCHAR(50)"},{"n":"DESCRIPCION","t":"VARCHAR(254)"},{"n":"ENTIDAD_FINANCIERA","t":"VARCHAR(8)"},{"n":"FORMATO","t":"VARCHAR(10)"},{"n":"FUENTE_DATOS","t":"VARCHAR(1)"},{"n":"TIPO_ARCHIVO","t":"VARCHAR(4)"}]},"FORMATO_USUARIO":{"m":"","d":"Usuarios del sistema: credenciales, perfil, estado y auditoría.","f":[{"n":"FORMATO","t":"VARCHAR(20)"},{"n":"GENERAR_REPORTE","t":"VARCHAR(1)"},{"n":"MODIFICAR_FILTRO","t":"VARCHAR(1)"},{"n":"MODIFICAR_FORMATO","t":"VARCHAR(1)"},{"n":"USUARIO","t":"VARCHAR(50)"}]},"GARANTIAS_DOC_CC":{"m":"CC","d":"","f":[{"n":"ART_GARANTIA","t":"VARCHAR(20)"},{"n":"DESC_GARANTIA","t":"VARCHAR(40)"},{"n":"DOCUMENTO","t":"VARCHAR(50)"},{"n":"GARANTIA_ID","t":"VARCHAR(20)"},{"n":"OBS_GARANTIA","t":"VARCHAR(200)"},{"n":"TIPO","t":"VARCHAR(3)"},{"n":"TIPO_GARANTIA","t":"VARCHAR(20)"}]},"GARANTIAS_DOC_CO":{"m":"CC","d":"","f":[{"n":"ART_GARANTIA","t":"VARCHAR(20)"},{"n":"DESC_GARANTIA","t":"VARCHAR(40)"},{"n":"DOCUMENTO","t":"VARCHAR(50)"},{"n":"GARANTIA_ID","t":"VARCHAR(20)"},{"n":"OBS_GARANTIA","t":"VARCHAR(200)"},{"n":"PROVEEDOR","t":"VARCHAR(20)"},{"n":"TIPO","t":"VARCHAR(1)"},{"n":"TIPO_GARANTIA","t":"VARCHAR(20)"}]},"GARANTIAS_DOC_CP":{"m":"CC","d":"","f":[{"n":"ART_GARANTIA","t":"VARCHAR(20)"},{"n":"DESC_GARANTIA","t":"VARCHAR(40)"},{"n":"DOCUMENTO","t":"VARCHAR(50)"},{"n":"GARANTIA_ID","t":"VARCHAR(20)"},{"n":"OBS_GARANTIA","t":"VARCHAR(200)"},{"n":"PROVEEDOR","t":"VARCHAR(20)"},{"n":"TIPO","t":"VARCHAR(3)"},{"n":"TIPO_GARANTIA","t":"VARCHAR(20)"}]},"GARANTIAS_DOC_FA":{"m":"CC","d":"","f":[{"n":"ART_GARANTIA","t":"VARCHAR(20)"},{"n":"DESC_GARANTIA","t":"VARCHAR(40)"},{"n":"DOCUMENTO","t":"VARCHAR(50)"},{"n":"GARANTIA_ID","t":"VARCHAR(20)"},{"n":"OBS_GARANTIA","t":"VARCHAR(200)"},{"n":"TIPO","t":"VARCHAR(1)"},{"n":"TIPO_GARANTIA","t":"VARCHAR(20)"}]},"GARANTIAS_PED_FA":{"m":"CC","d":"","f":[{"n":"ART_GARANTIA","t":"VARCHAR(20)"},{"n":"DESC_GARANTIA","t":"VARCHAR(40)"},{"n":"DOCUMENTO","t":"VARCHAR(20)"},{"n":"GARANTIA_ID","t":"VARCHAR(20)"},{"n":"OBS_GARANTIA","t":"VARCHAR(200)"},{"n":"TIPO","t":"VARCHAR(1)"},{"n":"TIPO_GARANTIA","t":"VARCHAR(20)"}]},"GASTO_COMPRA":{"m":"","d":"","f":[{"n":"DESCRIPCION","t":"VARCHAR(40)"},{"n":"GASTO_COMPRA","t":"VARCHAR(10)"},{"n":"TIPO_PRORRATEO","t":"VARCHAR(2)"}]},"GLOBALES":{"m":"AS","d":"","f":[{"n":"MODULO","t":"VARCHAR(20)"},{"n":"NOMBRE","t":"VARCHAR(30)"},{"n":"TEXTO","t":"TEXT"},{"n":"TIPO","t":"VARCHAR(1)"},{"n":"VALOR","t":"VARCHAR(250)"}]},"GLOBALES_AF":{"m":"","d":"","f":[{"n":"ACCIONES_CENTRO","t":"VARCHAR(4)"},{"n":"ACCIONES_ING","t":"VARCHAR(4)"},{"n":"ACCIONES_RET","t":"VARCHAR(4)"},{"n":"AJUSTAR_CALC_DEPR","t":"VARCHAR(1)"},{"n":"AJUSTE_INFLAC","t":"VARCHAR(1)"},{"n":"ASNT_EXCLUSION","t":"VARCHAR(1)"},{"n":"ASNT_INCLUSION","t":"VARCHAR(1)"},{"n":"CANT_DECIMALES","t":"INT"},{"n":"COND_ACTIVOS","t":"VARCHAR(1)"},{"n":"CONSECUTIVO","t":"VARCHAR(10)"},{"n":"CONTA_IMPUESTO","t":"VARCHAR(1)"},{"n":"CONTABILIDAD_REVAL","t":"VARCHAR(1)"},{"n":"CORPORATIVA_ACTIVA","t":"VARCHAR(1)"},{"n":"CTA_AJU_INFLAC","t":"VARCHAR(25)"},{"n":"CTA_CORRECC_DA","t":"VARCHAR(25)"},{"n":"CTA_DETERIORO","t":"VARCHAR(25)"},{"n":"CTA_ORDEN_INGRESO","t":"VARCHAR(25)"},{"n":"CTA_ORDEN_VENTA","t":"VARCHAR(25)"},{"n":"CTA_PERDIDA_VENTA","t":"VARCHAR(25)"},{"n":"CTA_REI","t":"VARCHAR(25)"},{"n":"CTA_SUPERAVIT","t":"VARCHAR(25)"},{"n":"CTA_UTILIDAD_VENTA","t":"VARCHAR(25)"},{"n":"CTR_AJU_INFLAC","t":"VARCHAR(25)"},{"n":"CTR_CORRECC_DA","t":"VARCHAR(25)"},{"n":"CTR_DETERIORO","t":"VARCHAR(25)"}]},"GLOBALES_AS":{"m":"","d":"","f":[{"n":"AJ_FCHPAGO_ADE","t":"VARCHAR(1)"},{"n":"AJ_FCHPAGO_ATRAS","t":"VARCHAR(1)"},{"n":"AJUSTAR_FECHAPAGO","t":"VARCHAR(1)"},{"n":"CALC_FRACC_INTCTE","t":"VARCHAR(1)"},{"n":"COBRAR_IMP1PP_CC","t":"VARCHAR(1)"},{"n":"COBRAR_IMP2PP_CC","t":"VARCHAR(1)"},{"n":"COD_SMTP","t":"VARCHAR(50)"},{"n":"FECHA_ADV_FIN","t":"DATETIME"},{"n":"FECHA_ADV_INI","t":"DATETIME"},{"n":"FECHA_TRABAJO_FIN","t":"DATETIME"},{"n":"FECHA_TRABAJO_INI","t":"DATETIME"},{"n":"IMPUESTO1_DESC","t":"VARCHAR(10)"},{"n":"IMPUESTO2_DESC","t":"VARCHAR(10)"},{"n":"MONEDA_DOLAR","t":"VARCHAR(4)"},{"n":"MONEDA_LOCAL","t":"VARCHAR(4)"},{"n":"NOMBRE_MON_FUNC","t":"VARCHAR(10)"},{"n":"NOMBRE_MON_REP","t":"VARCHAR(10)"},{"n":"PAIS_LOCAL","t":"VARCHAR(4)"},{"n":"PATRON_CCOSTO","t":"VARCHAR(25)"},{"n":"REPL_LISTA_CIA","t":"TEXT"},{"n":"REPL_TC_CODIGO","t":"VARCHAR(1)"},{"n":"REPL_TC_HIST","t":"VARCHAR(1)"},{"n":"RUTA_DOCS","t":"VARCHAR(100)"},{"n":"SIMBOLO_MON_FUNC","t":"VARCHAR(3)"},{"n":"SIMBOLO_MON_REP","t":"VARCHAR(3)"}]},"GLOBALES_BI":{"m":"","d":"","f":[{"n":"CATALOGO","t":"VARCHAR(60)"},{"n":"SERVIDOR","t":"VARCHAR(254)"}]},"GLOBALES_CB":{"m":"","d":"","f":[{"n":"ASIENTO_CHQ","t":"VARCHAR(1)"},{"n":"ASIENTO_DEP","t":"VARCHAR(1)"},{"n":"ASIENTO_NCR","t":"VARCHAR(1)"},{"n":"ASIENTO_NDB","t":"VARCHAR(1)"},{"n":"ASIENTO_OCR","t":"VARCHAR(1)"},{"n":"ASIENTO_ODB","t":"VARCHAR(1)"},{"n":"ASIENTO_TEFCR","t":"VARCHAR(1)"},{"n":"ASIENTO_TEFDB","t":"VARCHAR(1)"},{"n":"CANT_LINEAS_ASNT","t":"INT"},{"n":"CONCIL_NOENTREGADO","t":"VARCHAR(1)"},{"n":"CONSE_LOTE","t":"VARCHAR(50)"},{"n":"COPIARNOTASENASNT","t":"VARCHAR(1)"},{"n":"DEFDOC_ENTREGADO","t":"VARCHAR(1)"},{"n":"FEC_ASIENTO_CHEQ","t":"VARCHAR(1)"},{"n":"FECHA_ULT_DIFCAMB","t":"DATETIME"},{"n":"FORMA_CREACION","t":"VARCHAR(1)"},{"n":"IMP_CHEQ_PANTALLA","t":"VARCHAR(1)"},{"n":"IMPRIMIR_MONTO_MON","t":"VARCHAR(1)"},{"n":"INTEGRACION_CONTA","t":"VARCHAR(1)"},{"n":"MOD_APLIC_ASIENTO","t":"INT"},{"n":"MOSTRAR_CHQ_SUG","t":"VARCHAR(1)"},{"n":"PAQUETE","t":"VARCHAR(4)"},{"n":"PAUSAR_EN_CHEQUES","t":"VARCHAR(1)"},{"n":"RUBRO1_CTABANCO","t":"VARCHAR(60)"},{"n":"RUBRO10_CTABANCO","t":"VARCHAR(60)"}]},"GLOBALES_CC":{"m":"","d":"","f":[{"n":"ANT_PERIODO1","t":"INT"},{"n":"ANT_PERIODO2","t":"INT"},{"n":"ANT_PERIODO3","t":"INT"},{"n":"ANT_PERIODO4","t":"INT"},{"n":"ANT_PERIODO5","t":"INT"},{"n":"ANT_PERIODO6","t":"INT"},{"n":"ASIENTO_DEP","t":"VARCHAR(1)"},{"n":"ASIENTO_DET","t":"VARCHAR(1)"},{"n":"ASIENTO_FAC","t":"VARCHAR(1)"},{"n":"ASIENTO_INT","t":"VARCHAR(1)"},{"n":"ASIENTO_INTC","t":"VARCHAR(1)"},{"n":"ASIENTO_LC","t":"VARCHAR(1)"},{"n":"ASIENTO_NC","t":"VARCHAR(1)"},{"n":"ASIENTO_ND","t":"VARCHAR(1)"},{"n":"ASIENTO_OC","t":"VARCHAR(1)"},{"n":"ASIENTO_OD","t":"VARCHAR(1)"},{"n":"ASIENTO_PER","t":"VARCHAR(1)"},{"n":"ASIENTO_REC","t":"VARCHAR(1)"},{"n":"ASIENTO_RED","t":"VARCHAR(1)"},{"n":"ASIENTO_RET","t":"VARCHAR(1)"},{"n":"ASIENTO_TEF","t":"VARCHAR(1)"},{"n":"ASIENTOS_CTA_PAIS","t":"VARCHAR(1)"},{"n":"ASOCIACION_DE_DOCS","t":"VARCHAR(1)"},{"n":"ASOCOBLIGCONTFACT","t":"VARCHAR(1)"},{"n":"CONSECUTIVO_DE","t":"VARCHAR(10)"}]},"GLOBALES_CG":{"m":"","d":"","f":[{"n":"AJUS_AN_CORP_PEND","t":"VARCHAR(1)"},{"n":"AJUS_AN_FISC_PEND","t":"VARCHAR(1)"},{"n":"AUX_REVER_MOV_ROJO","t":"VARCHAR(1)"},{"n":"CANT_DECIMALES","t":"INT"},{"n":"CTA_CIERRE","t":"VARCHAR(25)"},{"n":"CTA_DIFCAMBIODOLAR","t":"VARCHAR(25)"},{"n":"CTA_DIFCAMBIOLOCAL","t":"VARCHAR(25)"},{"n":"CTA_DIFCAMDOL_PER_REALI","t":"VARCHAR(25)"},{"n":"CTA_DIFCAMDOL_UTI_REALI","t":"VARCHAR(25)"},{"n":"CTA_DIFCAMLOC_PER_REALI","t":"VARCHAR(25)"},{"n":"CTA_DIFCAMLOC_UTI_REALI","t":"VARCHAR(25)"},{"n":"CTA_PERD_DIFCAMDOL","t":"VARCHAR(25)"},{"n":"CTA_PERD_DIFCAMLOC","t":"VARCHAR(25)"},{"n":"CTA_PERD_DOLAR","t":"VARCHAR(25)"},{"n":"CTA_PERD_LOCAL","t":"VARCHAR(25)"},{"n":"CTA_UTL_DOLAR","t":"VARCHAR(25)"},{"n":"CTA_UTL_LOCAL","t":"VARCHAR(25)"},{"n":"CTR_CIERRE","t":"VARCHAR(25)"},{"n":"CTR_DIFCAMBIODOLAR","t":"VARCHAR(25)"},{"n":"CTR_DIFCAMBIOLOCAL","t":"VARCHAR(25)"},{"n":"CTR_DIFCAMDOL_PER_REALI","t":"VARCHAR(25)"},{"n":"CTR_DIFCAMDOL_UTI_REALI","t":"VARCHAR(25)"},{"n":"CTR_DIFCAMLOC_PER_REALI","t":"VARCHAR(25)"},{"n":"CTR_DIFCAMLOC_UTI_REALI","t":"VARCHAR(25)"},{"n":"CTR_PERD_DIFCAMDOL","t":"VARCHAR(25)"}]},"GLOBALES_CI":{"m":"","d":"","f":[{"n":"AJUSTAR_CONTEO","t":"VARCHAR(1)"},{"n":"ASISTENCIA_AUTOMAT","t":"VARCHAR(1)"},{"n":"ASNT_AJU_COMPRA","t":"VARCHAR(1)"},{"n":"ASNT_AJU_CONSUMO","t":"VARCHAR(1)"},{"n":"ASNT_AJU_COSTO","t":"VARCHAR(1)"},{"n":"ASNT_AJU_FISICO","t":"VARCHAR(1)"},{"n":"ASNT_AJU_MISCELAN","t":"VARCHAR(1)"},{"n":"ASNT_AJU_PRODUC","t":"VARCHAR(1)"},{"n":"ASNT_AJU_VENCIM","t":"VARCHAR(1)"},{"n":"ASNT_AJU_VENTA","t":"VARCHAR(1)"},{"n":"CNTRL_SERIES_ENTR","t":"VARCHAR(1)"},{"n":"COSTO_COMPARATIVO","t":"VARCHAR(1)"},{"n":"COSTO_FISCAL","t":"VARCHAR(1)"},{"n":"COSTO_INGR_DEFAULT","t":"VARCHAR(1)"},{"n":"COSTOS_DEC","t":"INT"},{"n":"CTR_EN_TRANSACCION","t":"VARCHAR(1)"},{"n":"EAN13_REGLA_LOCAL","t":"VARCHAR(18)"},{"n":"EAN8_REGLA_LOCAL","t":"VARCHAR(3)"},{"n":"EXIST_EN_TOTALES","t":"VARCHAR(10)"},{"n":"EXISTENCIAS_DEC","t":"INT"},{"n":"FCH_ULT_PROC_APROB","t":"DATETIME"},{"n":"FCH_ULT_PROC_VCTO","t":"DATETIME"},{"n":"FECHA_INICIO_TRANS","t":"DATETIME"},{"n":"INTEGRACION_CONTA","t":"VARCHAR(1)"},{"n":"LINEAS_MAX_TRANS","t":"INT"}]},"GLOBALES_CN":{"m":"","d":"","f":[{"n":"CEDULA_JURIDICA","t":"VARCHAR(25)"},{"n":"FACTOR_REDONDEO","t":"DECIMAL"},{"n":"INTEGRACION_CONTA","t":"VARCHAR(1)"},{"n":"INTEGRACION_CR","t":"VARCHAR(1)"},{"n":"MOD_APLIC_ASIENTO","t":"INT"},{"n":"NOMB_RUBRO1_NOMI","t":"VARCHAR(60)"},{"n":"NOMB_RUBRO10_EMP","t":"VARCHAR(60)"},{"n":"NOMB_RUBRO10_NOMI","t":"VARCHAR(60)"},{"n":"NOMB_RUBRO11_EMP","t":"VARCHAR(60)"},{"n":"NOMB_RUBRO12_EMP","t":"VARCHAR(60)"},{"n":"NOMB_RUBRO13_EMP","t":"VARCHAR(60)"},{"n":"NOMB_RUBRO14_EMP","t":"VARCHAR(60)"},{"n":"NOMB_RUBRO15_EMP","t":"VARCHAR(60)"},{"n":"NOMB_RUBRO16_EMP","t":"VARCHAR(60)"},{"n":"NOMB_RUBRO17_EMP","t":"VARCHAR(60)"},{"n":"NOMB_RUBRO18_EMP","t":"VARCHAR(60)"},{"n":"NOMB_RUBRO19_EMP","t":"VARCHAR(60)"},{"n":"NOMB_RUBRO2_NOMI","t":"VARCHAR(60)"},{"n":"NOMB_RUBRO20_EMP","t":"VARCHAR(60)"},{"n":"NOMB_RUBRO21_EMP","t":"VARCHAR(60)"},{"n":"NOMB_RUBRO22_EMP","t":"VARCHAR(60)"},{"n":"NOMB_RUBRO23_EMP","t":"VARCHAR(60)"},{"n":"NOMB_RUBRO24_EMP","t":"VARCHAR(60)"},{"n":"NOMB_RUBRO25_EMP","t":"VARCHAR(60)"},{"n":"NOMB_RUBRO3_NOMI","t":"VARCHAR(60)"}]},"GLOBALES_CO":{"m":"","d":"","f":[{"n":"AGREGAR_INTERSECCI","t":"VARCHAR(1)"},{"n":"APLICAR_NC","t":"VARCHAR(1)"},{"n":"APROBAR_OC_JERARQUIA","t":"VARCHAR(1)"},{"n":"BODEGA_DEFAULT","t":"VARCHAR(4)"},{"n":"CANT_DIAS_ENV_NOTIF","t":"INT"},{"n":"CANTIDAD_DEC","t":"INT"},{"n":"CAPAS_AFEC_CAPA_RESPEC","t":"VARCHAR(1)"},{"n":"CAPAS_AFEC_OTRAS_CAPAS","t":"VARCHAR(1)"},{"n":"CAPAS_AFEC_PRIMER_CAPA","t":"VARCHAR(1)"},{"n":"CAPAS_APLIC_VARIACION","t":"VARCHAR(1)"},{"n":"CAPAS_CONT_VARIACION","t":"VARCHAR(1)"},{"n":"CODIGO_DEVOLUCION","t":"VARCHAR(10)"},{"n":"CONSECUTIVO_CI","t":"VARCHAR(1)"},{"n":"CONSOLIDAR_LINEAS","t":"VARCHAR(1)"},{"n":"CP_EN_LINEA","t":"VARCHAR(1)"},{"n":"CRIT_EVAL_PROV1","t":"VARCHAR(25)"},{"n":"CRIT_EVAL_PROV10","t":"VARCHAR(25)"},{"n":"CRIT_EVAL_PROV2","t":"VARCHAR(25)"},{"n":"CRIT_EVAL_PROV3","t":"VARCHAR(25)"},{"n":"CRIT_EVAL_PROV4","t":"VARCHAR(25)"},{"n":"CRIT_EVAL_PROV5","t":"VARCHAR(25)"},{"n":"CRIT_EVAL_PROV6","t":"VARCHAR(25)"},{"n":"CRIT_EVAL_PROV7","t":"VARCHAR(25)"},{"n":"CRIT_EVAL_PROV8","t":"VARCHAR(25)"},{"n":"CRIT_EVAL_PROV9","t":"VARCHAR(25)"}]},"GLOBALES_CONFIG_REP_GN":{"m":"","d":"","f":[{"n":"NOMBRE","t":"VARCHAR(100)"},{"n":"REPORTE","t":"VARCHAR(100)"},{"n":"TIPO","t":"VARCHAR(1)"},{"n":"VALOR","t":"VARCHAR(4000)"}]},"GLOBALES_CP":{"m":"","d":"","f":[{"n":"ANT_PERIODO1","t":"INT"},{"n":"ANT_PERIODO2","t":"INT"},{"n":"ANT_PERIODO3","t":"INT"},{"n":"ANT_PERIODO4","t":"INT"},{"n":"ASIENTO_CHQ","t":"VARCHAR(1)"},{"n":"ASIENTO_DET","t":"VARCHAR(1)"},{"n":"ASIENTO_FAC","t":"VARCHAR(1)"},{"n":"ASIENTO_INT","t":"VARCHAR(1)"},{"n":"ASIENTO_INT_CORRIENTE","t":"VARCHAR(1)"},{"n":"ASIENTO_LC","t":"VARCHAR(1)"},{"n":"ASIENTO_NC","t":"VARCHAR(1)"},{"n":"ASIENTO_ND","t":"VARCHAR(1)"},{"n":"ASIENTO_OC","t":"VARCHAR(1)"},{"n":"ASIENTO_OD","t":"VARCHAR(1)"},{"n":"ASIENTO_PER","t":"VARCHAR(1)"},{"n":"ASIENTO_RED","t":"VARCHAR(1)"},{"n":"ASIENTO_RET","t":"VARCHAR(1)"},{"n":"ASIENTO_TEF","t":"VARCHAR(1)"},{"n":"ASIENTOS_CTA_PAIS","t":"VARCHAR(1)"},{"n":"ASIGNAR_MISMA_ENTIDAD","t":"VARCHAR(1)"},{"n":"ASOCOBLIGCONTFACT","t":"VARCHAR(1)"},{"n":"CHQ_A_PANTALLA","t":"VARCHAR(1)"},{"n":"COPIARNOTASENASNT","t":"VARCHAR(1)"},{"n":"DETALLE_OBLIGAT","t":"VARCHAR(1)"},{"n":"DIAS_CONTABLES","t":"INT"}]},"GLOBALES_CS":{"m":"","d":"","f":[{"n":"ARTICULO_SERVICIO","t":"VARCHAR(20)"},{"n":"BODEGA_COBRO","t":"VARCHAR(4)"},{"n":"BODEGA_DESTINO","t":"VARCHAR(4)"},{"n":"BODEGA_INGRESO","t":"VARCHAR(4)"},{"n":"BODEGA_ORIGEN","t":"VARCHAR(4)"},{"n":"CONSEC_BOLETA","t":"VARCHAR(10)"},{"n":"CONSEC_CLIENTE_CS","t":"VARCHAR(20)"},{"n":"CONSEC_SOLIC_TRASP","t":"VARCHAR(10)"},{"n":"RUTA_CS","t":"VARCHAR(4)"},{"n":"TIPO_GAR_ENTREGA","t":"VARCHAR(5)"},{"n":"VENDEDOR_CS","t":"VARCHAR(4)"},{"n":"ZONA_CS","t":"VARCHAR(4)"}]},"GLOBALES_CV":{"m":"","d":"","f":[{"n":"CALCULO_DIAS_VAC","t":"VARCHAR(1)"},{"n":"CONTROL_INCAP","t":"VARCHAR(1)"},{"n":"SALDO_VAC_ANNO","t":"VARCHAR(1)"},{"n":"ULTIMA_SOLICITUD","t":"INT"}]},"GLOBALES_FA":{"m":"","d":"","f":[{"n":"ANULA_CXC_APLICADO","t":"VARCHAR(1)"},{"n":"APLICA_NI_PR_IMP1","t":"VARCHAR(1)"},{"n":"APLICAR_DESC_GEN","t":"VARCHAR(1)"},{"n":"ARTICULO","t":"VARCHAR(20)"},{"n":"ASIENTO_CONTCXCPOR","t":"VARCHAR(1)"},{"n":"ASIENTO_COSTO_POR","t":"VARCHAR(1)"},{"n":"ASIENTO_VENTA_POR","t":"VARCHAR(1)"},{"n":"AUTOR_APROBAR","t":"VARCHAR(1)"},{"n":"AUTOR_FACTREMISION","t":"VARCHAR(1)"},{"n":"AUTOR_FACTUREMITIR","t":"VARCHAR(1)"},{"n":"AUTOR_GRABAR","t":"VARCHAR(1)"},{"n":"BODEGA_DEFAULT","t":"VARCHAR(4)"},{"n":"BODEGA_POR_LINEA","t":"VARCHAR(1)"},{"n":"CALCULO_IMP2","t":"VARCHAR(1)"},{"n":"CAMBIAR_ESQ_TRAB","t":"VARCHAR(1)"},{"n":"CANCEL_PED_PARCIAL","t":"VARCHAR(1)"},{"n":"CARGAR_APROBADO_CC","t":"VARCHAR(1)"},{"n":"CATEGORIA_CLIENTE","t":"VARCHAR(8)"},{"n":"CC_EN_LINEA","t":"VARCHAR(1)"},{"n":"CG_EN_LINEA","t":"VARCHAR(1)"},{"n":"COBRO_JUDICIAL","t":"VARCHAR(1)"},{"n":"CODIGO_REGIMEN","t":"VARCHAR(10)"},{"n":"CODIGO_RETENCION","t":"VARCHAR(4)"},{"n":"COLUMNAS_ESTANDAR","t":"VARCHAR(4000)"},{"n":"COND_PAGO_CONTAD","t":"VARCHAR(4)"}]},"GLOBALES_NOM_ELECT":{"m":"","d":"","f":[{"n":"NOMBRE","t":"VARCHAR(100)"},{"n":"TIPO","t":"VARCHAR(1)"},{"n":"VALOR","t":"VARCHAR(4000)"}]},"GLOBALES_PR":{"m":"","d":"","f":[{"n":"BLOQUEO_FECHAS_ANT","t":"VARCHAR(1)"},{"n":"CAMBIAR_CONVERSION","t":"VARCHAR(1)"},{"n":"CONSEC_AJUSTE","t":"INT"},{"n":"CONSEC_OBLIGACION","t":"INT"},{"n":"LLAVE","t":"INT"},{"n":"PRESUPUESTAR_MAYOR","t":"VARCHAR(1)"},{"n":"USE_CATALOGO_CONTA","t":"VARCHAR(1)"}]},"GLOBALES_PV":{"m":"","d":"","f":[{"n":"AJUSTE_PROPORCIONA","t":"VARCHAR(1)"},{"n":"NIVEL_PRECIO_DOLAR","t":"VARCHAR(12)"},{"n":"NIVEL_PRECIO_LOCAL","t":"VARCHAR(12)"},{"n":"NIVEL_PRORRATEO","t":"INT"},{"n":"TIPO_DESGLOSE","t":"VARCHAR(1)"},{"n":"VALIDACION_AUTOMAT","t":"VARCHAR(1)"}]},"GLOBALES_RH":{"m":"","d":"","f":[{"n":"APROB_ADICIONAL","t":"VARCHAR(1)"},{"n":"CALCULO_DIAS_VAC","t":"VARCHAR(1)"},{"n":"CENTRO_COSTO_LIQ","t":"VARCHAR(25)"},{"n":"CONTROL_INCAP","t":"VARCHAR(1)"},{"n":"CUENTA_CONTA_LIQ","t":"VARCHAR(25)"},{"n":"DEF_RUBRO1_ACCPER","t":"VARCHAR(60)"},{"n":"DEF_RUBRO10_ACCPER","t":"VARCHAR(60)"},{"n":"DEF_RUBRO2_ACCPER","t":"VARCHAR(60)"},{"n":"DEF_RUBRO3_ACCPER","t":"VARCHAR(60)"},{"n":"DEF_RUBRO4_ACCPER","t":"VARCHAR(60)"},{"n":"DEF_RUBRO5_ACCPER","t":"VARCHAR(60)"},{"n":"DEF_RUBRO6_ACCPER","t":"VARCHAR(60)"},{"n":"DEF_RUBRO7_ACCPER","t":"VARCHAR(60)"},{"n":"DEF_RUBRO8_ACCPER","t":"VARCHAR(60)"},{"n":"DEF_RUBRO9_ACCPER","t":"VARCHAR(60)"},{"n":"DIAS_AMPLIA_CONT","t":"INT"},{"n":"E_MAIL_RH","t":"VARCHAR(50)"},{"n":"ESTADO_EMP_CONT","t":"VARCHAR(4)"},{"n":"ESTADO_EMP_LIQ","t":"VARCHAR(4)"},{"n":"ESTADO_EMP_NUEVO","t":"VARCHAR(4)"},{"n":"FORMATO_LIQUIDAC","t":"VARCHAR(30)"},{"n":"GENERA_CONTRATO","t":"VARCHAR(1)"},{"n":"HORAS_INCAP","t":"VARCHAR(1)"},{"n":"INFO_HISTORICA","t":"VARCHAR(1)"},{"n":"INTEGRACION_CONTA","t":"VARCHAR(1)"}]},"GLOBALES_SP":{"m":"","d":"","f":[{"n":"CATEG_CONSUMO","t":"VARCHAR(1)"},{"n":"CATEG_FRECUENCIA","t":"VARCHAR(1)"},{"n":"CATEG_MARGEN","t":"VARCHAR(1)"},{"n":"CATEG_ROTACION","t":"VARCHAR(1)"},{"n":"FORMULA","t":"VARCHAR(1)"},{"n":"MODULO_INICIALIZADO","t":"VARCHAR(1)"},{"n":"PERIODICIDAD_ABC","t":"VARCHAR(1)"},{"n":"PORC_CONSUMO_A","t":"INT"},{"n":"PORC_CONSUMO_B","t":"INT"},{"n":"PORC_CONSUMO_C","t":"INT"},{"n":"PORC_FRECUENCIA_A","t":"INT"},{"n":"PORC_FRECUENCIA_B","t":"INT"},{"n":"PORC_FRECUENCIA_C","t":"INT"},{"n":"PORC_MARGEN_A","t":"INT"},{"n":"PORC_MARGEN_B","t":"INT"},{"n":"PORC_MARGEN_C","t":"INT"},{"n":"PORC_ROTACION_A","t":"INT"},{"n":"PORC_ROTACION_B","t":"INT"},{"n":"PORC_ROTACION_C","t":"INT"},{"n":"ULT_AUDIT_TRANS_INV","t":"DATETIME"},{"n":"ULT_EMBARQUE","t":"DATETIME"},{"n":"ULT_EMBARQUE_LINEA","t":"DATETIME"},{"n":"ULT_FACTURA_LINEA","t":"DATETIME"},{"n":"ULT_ORDEN_COMPRA","t":"DATETIME"},{"n":"ULT_ORDEN_COMPRA_LINEA","t":"DATETIME"}]},"GRUPO_CE":{"m":"","d":"","f":[{"n":"NOMBRE","t":"VARCHAR(100)"},{"n":"USUARIO","t":"VARCHAR(50)"}]},"GRUPO_CONCEPTO":{"m":"","d":"","f":[{"n":"DESCRIPCION","t":"VARCHAR(254)"},{"n":"GRUPO_CONCEPTO","t":"VARCHAR(12)"},{"n":"TIPO","t":"VARCHAR(1)"}]},"GRUPO_CONCEPTO_DET":{"m":"","d":"","f":[{"n":"CONCEPTO","t":"VARCHAR(20)"},{"n":"GRUPO_CONCEPTO","t":"VARCHAR(12)"},{"n":"OPERADOR","t":"VARCHAR(1)"},{"n":"SECUENCIA","t":"INT"}]},"GUID_RELACIONADO":{"m":"","d":"","f":[{"n":"GUID_ORIGEN","t":"VARCHAR(48)"},{"n":"GUID_RELACIONADO","t":"VARCHAR(48)"},{"n":"TABLA_ORIGEN","t":"VARCHAR(30)"},{"n":"TABLA_RELACIONADA","t":"VARCHAR(30)"}]},"HIST_CIERRE_CG":{"m":"","d":"","f":[{"n":"ASIENTO","t":"VARCHAR(10)"},{"n":"CONTABILIDAD","t":"VARCHAR(1)"},{"n":"FECHA","t":"DATETIME"},{"n":"FECHA_CIERRE","t":"DATETIME"},{"n":"MAYOR_AUDITORIA","t":"INT"},{"n":"USUARIO","t":"VARCHAR(50)"}]},"HIST_CREDITO_EMP":{"m":"","d":"","f":[{"n":"DESCONTADO","t":"VARCHAR(1)"},{"n":"DOCUMENTO","t":"VARCHAR(50)"},{"n":"EMPLEADO","t":"VARCHAR(20)"},{"n":"NOMINA","t":"VARCHAR(4)"},{"n":"NUMERO_CREDITO","t":"INT"},{"n":"NUMERO_LIQUIDAC","t":"INT"},{"n":"NUMERO_LIQUIDACION","t":"INT"},{"n":"NUMERO_NOMINA","t":"INT"},{"n":"TOTAL","t":"DECIMAL"}]},"HIST_DEPRECIACION":{"m":"","d":"Depreciación de activos fijos: método, cuotas y valores acumulados.","f":[{"n":"ACTIVO_FIJO","t":"VARCHAR(10)"},{"n":"AJUSTE","t":"VARCHAR(1)"},{"n":"ASIENTO","t":"VARCHAR(10)"},{"n":"CONTABILIDAD","t":"VARCHAR(1)"},{"n":"DEPR_DOLAR","t":"DECIMAL"},{"n":"DEPR_LOCAL","t":"DECIMAL"},{"n":"DESMANTELAMIENTO","t":"VARCHAR(10)"},{"n":"FECHA","t":"DATETIME"},{"n":"FECHA_HORA","t":"DATETIME"},{"n":"HIST_DEPRECIACION","t":"INT"},{"n":"MEJORA","t":"VARCHAR(10)"},{"n":"METODO","t":"VARCHAR(1)"},{"n":"REFERENCIA","t":"VARCHAR(1)"},{"n":"USUARIO","t":"VARCHAR(50)"}]},"HIST_DETERIORO":{"m":"","d":"","f":[{"n":"ACTIVO_FIJO","t":"VARCHAR(10)"},{"n":"ASIENTO","t":"VARCHAR(10)"},{"n":"ASIENTO_F","t":"VARCHAR(10)"},{"n":"DESMANTELAMIENTO","t":"VARCHAR(10)"},{"n":"FECHA","t":"DATETIME"},{"n":"FECHA_HORA","t":"DATETIME"},{"n":"HIST_DETERIORO","t":"INT"},{"n":"MEJORA","t":"VARCHAR(10)"},{"n":"TIPO_CAMBIO","t":"DECIMAL"},{"n":"USUARIO","t":"VARCHAR(50)"},{"n":"VALOR_DOLAR","t":"DECIMAL"},{"n":"VALOR_DOLAR_F","t":"DECIMAL"},{"n":"VALOR_LOCAL","t":"DECIMAL"},{"n":"VALOR_LOCAL_F","t":"DECIMAL"}]},"HIST_DIFCAM_CB":{"m":"","d":"","f":[{"n":"ASIENTO_PROC","t":"VARCHAR(10)"},{"n":"CENTRO_COSTO","t":"VARCHAR(25)"},{"n":"CUENTA_BANCARIA","t":"VARCHAR(20)"},{"n":"CUENTA_CONTABLE","t":"VARCHAR(25)"},{"n":"DIF_CAM_DOLAR","t":"DECIMAL"},{"n":"DIF_CAM_LOCAL","t":"DECIMAL"},{"n":"ESTADO","t":"VARCHAR(1)"},{"n":"FECHA_AUDITORIA","t":"DATETIME"},{"n":"FECHA_PROC","t":"DATETIME"},{"n":"ID_HIST","t":"GUID"},{"n":"NOTAS_REV","t":"TEXT"},{"n":"TCAMB_DOL_DOC_ACT","t":"DECIMAL"},{"n":"TCAMB_DOL_DOC_ANT","t":"DECIMAL"},{"n":"TCAMB_LOC_DOC_ACT","t":"DECIMAL"},{"n":"TCAMB_LOC_DOC_ANT","t":"DECIMAL"},{"n":"TIPO_CAMBIO_PROC","t":"DECIMAL"},{"n":"USUARIO_AUDITORIA","t":"VARCHAR(50)"}]},"HIST_DIFCAM_CC":{"m":"","d":"","f":[{"n":"ASIENTO_PROC","t":"VARCHAR(10)"},{"n":"CENTRO_COSTO","t":"VARCHAR(25)"},{"n":"CUENTA_CONTABLE","t":"VARCHAR(25)"},{"n":"DIF_CAM_DOLAR","t":"DECIMAL"},{"n":"DIF_CAM_LOCAL","t":"DECIMAL"},{"n":"DOCUMENTO","t":"VARCHAR(50)"},{"n":"ESTADO","t":"VARCHAR(1)"},{"n":"FECHA_AUDITORIA","t":"DATETIME"},{"n":"FECHA_PROC","t":"DATETIME"},{"n":"ID_HIST","t":"GUID"},{"n":"NOTAS_REV","t":"TEXT"},{"n":"TCAMB_DOL_DOC_ACT","t":"DECIMAL"},{"n":"TCAMB_DOL_DOC_ANT","t":"DECIMAL"},{"n":"TCAMB_LOC_DOC_ACT","t":"DECIMAL"},{"n":"TCAMB_LOC_DOC_ANT","t":"DECIMAL"},{"n":"TIPO","t":"VARCHAR(3)"},{"n":"TIPO_CAMBIO_PROC","t":"DECIMAL"},{"n":"USUARIO_AUDITORIA","t":"VARCHAR(50)"}]},"HIST_DIFCAM_CG":{"m":"","d":"","f":[{"n":"ASIENTO_PROC","t":"VARCHAR(10)"},{"n":"FECHA_AUDITORIA","t":"DATETIME"},{"n":"FECHA_PROC","t":"DATETIME"},{"n":"ID_HIST","t":"GUID"},{"n":"TIPO_CAMBIO_PROC","t":"DECIMAL"},{"n":"USUARIO_AUDITORIA","t":"VARCHAR(50)"}]},"HIST_DIFCAM_CP":{"m":"","d":"","f":[{"n":"ASIENTO_PROC","t":"VARCHAR(10)"},{"n":"CENTRO_COSTO","t":"VARCHAR(25)"},{"n":"CUENTA_CONTABLE","t":"VARCHAR(25)"},{"n":"DIF_CAM_DOLAR","t":"DECIMAL"},{"n":"DIF_CAM_LOCAL","t":"DECIMAL"},{"n":"DOCUMENTO","t":"VARCHAR(50)"},{"n":"ESTADO","t":"VARCHAR(1)"},{"n":"FECHA_AUDITORIA","t":"DATETIME"},{"n":"FECHA_PROC","t":"DATETIME"},{"n":"ID_HIST","t":"GUID"},{"n":"NOTAS_REV","t":"TEXT"},{"n":"PROVEEDOR","t":"VARCHAR(20)"},{"n":"TCAMB_DOL_DOC_ACT","t":"DECIMAL"},{"n":"TCAMB_DOL_DOC_ANT","t":"DECIMAL"},{"n":"TCAMB_LOC_DOC_ACT","t":"DECIMAL"},{"n":"TCAMB_LOC_DOC_ANT","t":"DECIMAL"},{"n":"TIPO","t":"VARCHAR(3)"},{"n":"TIPO_CAMBIO_PROC","t":"DECIMAL"},{"n":"USUARIO_AUDITORIA","t":"VARCHAR(50)"}]},"HISTORIAL_DESCUENTOS":{"m":"","d":"Estructura de descuentos por volumen, cliente o condición comercial.","f":[{"n":"ARTICULO","t":"VARCHAR(20)"},{"n":"CAJA","t":"VARCHAR(6)"},{"n":"CANTIDAD","t":"DECIMAL"},{"n":"DESCUENTO","t":"DECIMAL"},{"n":"DOCUMENTO","t":"VARCHAR(50)"},{"n":"GUID","t":"GUID"},{"n":"LINEA","t":"VARCHAR(50)"},{"n":"ORIGEN","t":"VARCHAR(3)"},{"n":"REGLA","t":"VARCHAR(200)"},{"n":"TIPO","t":"VARCHAR(1)"}]},"HISTORICO_DIFERIDO":{"m":"CG","d":"","f":[{"n":"AMORTIZACION_DOLAR","t":"DECIMAL"},{"n":"AMORTIZACION_LOCAL","t":"DECIMAL"},{"n":"ASIENTO","t":"VARCHAR(10)"},{"n":"DIFERIDO","t":"VARCHAR(53)"},{"n":"FECHA","t":"DATETIME"},{"n":"HIST_DIFERIDO","t":"INT"},{"n":"USUARIO","t":"VARCHAR(50)"}]},"HISTORICO_EMPLEADO":{"m":"CN","d":"","f":[{"n":"ANTIGUEDAD","t":"DECIMAL"},{"n":"CENTRO_COSTO","t":"VARCHAR(25)"},{"n":"DEPARTAMENTO","t":"VARCHAR(10)"},{"n":"EMPLEADO","t":"VARCHAR(20)"},{"n":"FECHA_SALIDA","t":"DATETIME"},{"n":"JEFE","t":"VARCHAR(20)"},{"n":"NOMINA","t":"VARCHAR(4)"},{"n":"NUMERO_HISTORICO","t":"INT"},{"n":"PRIMER_SALARIO","t":"DECIMAL"},{"n":"PUESTO","t":"VARCHAR(8)"},{"n":"RAZON_SALIDA","t":"VARCHAR(40)"},{"n":"UBICACION","t":"VARCHAR(8)"},{"n":"ULT_FECHA_INGRESO","t":"DATETIME"},{"n":"ULTIMO_SALARIO","t":"DECIMAL"}]},"HISTORICO_SALDOS_INVENTARIOS":{"m":"CG","d":"Saldos acumulados por período, cuenta y dimensión de análisis.","f":[{"n":"ARTICULO","t":"VARCHAR(20)"},{"n":"BODEGA","t":"VARCHAR(4)"},{"n":"CANT_DISPONIBLE","t":"DECIMAL"},{"n":"CANT_REMITIDA","t":"DECIMAL"},{"n":"CANT_RESERVADA","t":"DECIMAL"},{"n":"COSTO_PROMEDIO_DOL","t":"DECIMAL"},{"n":"COSTO_PROMEDIO_LOC","t":"DECIMAL"},{"n":"FECHA","t":"DATETIME"}]},"HISTORICO_SALDOS_INVENTARIOS_CANTIDADES_CEROS":{"m":"CG","d":"Saldos acumulados por período, cuenta y dimensión de análisis.","f":[{"n":"ARTICULO","t":"VARCHAR(20)"},{"n":"BODEGA","t":"VARCHAR(4)"},{"n":"CANT_DISPONIBLE","t":"DECIMAL"},{"n":"CANT_REMITIDA","t":"DECIMAL"},{"n":"CANT_RESERVADA","t":"DECIMAL"},{"n":"COSTO_PROMEDIO_DOL","t":"DECIMAL"},{"n":"COSTO_PROMEDIO_LOC","t":"DECIMAL"},{"n":"FECHA","t":"DATETIME"}]},"HORA_LABORADA":{"m":"","d":"","f":[{"n":"CANTIDAD_HORAS","t":"DECIMAL"},{"n":"CARGADO","t":"VARCHAR(1)"},{"n":"CENTRO_COSTO","t":"VARCHAR(25)"},{"n":"CONCEPTO","t":"VARCHAR(20)"},{"n":"CONSECUTIVO","t":"INT"},{"n":"EMPLEADO","t":"VARCHAR(20)"},{"n":"FASE","t":"VARCHAR(25)"},{"n":"FECHA_CARGA","t":"DATETIME"},{"n":"FECHA_LABORADA","t":"DATETIME"},{"n":"NOMINA","t":"VARCHAR(4)"},{"n":"NUMERO_NOMINA","t":"INT"},{"n":"OBSERVACIONES","t":"TEXT"},{"n":"PROYECTO","t":"VARCHAR(25)"},{"n":"USUARIO_CARGA","t":"VARCHAR(50)"}]},"HORARIO":{"m":"CN","d":"","f":[{"n":"DESCRIPCION","t":"VARCHAR(40)"},{"n":"HORARIO","t":"VARCHAR(4)"},{"n":"HORAS_INCAPACIDAD","t":"DECIMAL"},{"n":"REDONDEO_ENTRAD","t":"INT"},{"n":"REDONDEO_SALIDA","t":"INT"},{"n":"TOLERA_ENTRADA","t":"INT"},{"n":"TOLERA_SALIDA","t":"INT"}]},"HORARIO_CONCEPTO":{"m":"CN","d":"","f":[{"n":"CONCEPTO","t":"VARCHAR(20)"},{"n":"DIA","t":"INT"},{"n":"HORA_FINAL","t":"DATETIME"},{"n":"HORA_INICIO","t":"DATETIME"},{"n":"HORARIO","t":"VARCHAR(4)"}]},"HORARIO_CS":{"m":"CN","d":"","f":[{"n":"DESCRIPCION","t":"VARCHAR(40)"},{"n":"DIAS_NO_HABILES","t":"INT"},{"n":"HORA_FINAL","t":"DATETIME"},{"n":"HORA_INICIAL","t":"DATETIME"},{"n":"HORARIO_CS","t":"VARCHAR(5)"},{"n":"MINUTOS_NO_PROD","t":"INT"}]},"IMAGEN":{"m":"","d":"","f":[{"n":"OBJECT","t":"TEXT"},{"n":"OBJECTKEY","t":"VARCHAR(30)"}]},"IMAGEN_CE":{"m":"","d":"","f":[{"n":"DIRECCION_IMAGEN","t":"VARCHAR(70)"},{"n":"INFORMACION","t":"INT"},{"n":"LINK_IMAGEN","t":"VARCHAR(50)"},{"n":"MODULO","t":"INT"},{"n":"POSICION_IMAGEN","t":"VARCHAR(15)"}]},"IMAGENES":{"m":"","d":"","f":[{"n":"IMAGEN","t":"IMAGE(214748364"},{"n":"ROW_POINTER_GENERICO","t":"GUID"}]},"IMPUESTO":{"m":"AS","d":"Catálogo de impuestos: código, porcentaje y tipo (IVA, retención).","f":[{"n":"CALCULO_IMP2","t":"VARCHAR(1)"},{"n":"COD_IMP1","t":"VARCHAR(4)"},{"n":"COD_IMP2","t":"VARCHAR(4)"},{"n":"CONTAB_DEV_IMP1","t":"VARCHAR(1)"},{"n":"CONTAB_DEV_IMP2","t":"VARCHAR(1)"},{"n":"CTA_IMP1_DESC_CMPS","t":"VARCHAR(25)"},{"n":"CTA_IMP1_DEV_CMPS","t":"VARCHAR(25)"},{"n":"CTA_IMP1_DEV_VTS","t":"VARCHAR(25)"},{"n":"CTA_IMP1_GEN","t":"VARCHAR(25)"},{"n":"CTA_IMP1_GEN_VTS","t":"VARCHAR(25)"},{"n":"CTA_IMP2_DESC_CMPS","t":"VARCHAR(25)"},{"n":"CTA_IMP2_DEV_CMPS","t":"VARCHAR(25)"},{"n":"CTA_IMP2_DEV_VTS","t":"VARCHAR(25)"},{"n":"CTA_IMP2_GEN","t":"VARCHAR(25)"},{"n":"CTA_IMP2_GEN_VTS","t":"VARCHAR(25)"},{"n":"CTR_IMP1_DESC_CMPS","t":"VARCHAR(25)"},{"n":"CTR_IMP1_DEV_CMPS","t":"VARCHAR(25)"},{"n":"CTR_IMP1_DEV_VTS","t":"VARCHAR(25)"},{"n":"CTR_IMP1_GEN","t":"VARCHAR(25)"},{"n":"CTR_IMP1_GEN_VTS","t":"VARCHAR(25)"},{"n":"CTR_IMP2_DESC_CMPS","t":"VARCHAR(25)"},{"n":"CTR_IMP2_DEV_CMPS","t":"VARCHAR(25)"},{"n":"CTR_IMP2_DEV_VTS","t":"VARCHAR(25)"},{"n":"CTR_IMP2_GEN","t":"VARCHAR(25)"},{"n":"CTR_IMP2_GEN_VTS","t":"VARCHAR(25)"}]},"IMPUESTO_ACTIVO":{"m":"AS","d":"Configuración de impuestos: tasas, tipos y reglas de aplicación.","f":[{"n":"ACTIVO","t":"VARCHAR(10)"},{"n":"CONCEPTO_ME","t":"VARCHAR(4)"},{"n":"CONSECUTIVO","t":"INT"},{"n":"IMPUESTO","t":"VARCHAR(4)"},{"n":"IMPUESTO_AC","t":"VARCHAR(1)"},{"n":"IMPUESTO_ASUMIDO","t":"VARCHAR(1)"},{"n":"MEJORA","t":"VARCHAR(10)"},{"n":"PORCENTAJE","t":"DECIMAL"},{"n":"TIPO_IMPUESTO","t":"VARCHAR(5)"},{"n":"VALOR","t":"DECIMAL"}]},"IMPUESTO_ADICIONAL":{"m":"AS","d":"Configuración de impuestos: tasas, tipos y reglas de aplicación.","f":[{"n":"ARTICULO","t":"VARCHAR(150)"},{"n":"CLASIFICACION","t":"VARCHAR(50)"},{"n":"CODIGO_VALOR","t":"VARCHAR(20)"},{"n":"DESC_AFECTA_IMPUESTO","t":"VARCHAR(1)"},{"n":"IMPUESTO","t":"DECIMAL"},{"n":"IMPUESTO_INCLUIDO","t":"VARCHAR(1)"},{"n":"TIPO_IMPUESTO","t":"VARCHAR(1)"},{"n":"TRIBUTO_DTE","t":"VARCHAR(20)"}]},"IMPUESTO_COMPRA":{"m":"AS","d":"Configuración de impuestos: tasas, tipos y reglas de aplicación.","f":[{"n":"DESCRIPCION","t":"VARCHAR(40)"},{"n":"FORMULA_OK","t":"VARCHAR(1)"},{"n":"IMPUESTO_COMPRA","t":"VARCHAR(20)"},{"n":"NOTAS","t":"TEXT"}]},"IMPUESTO_DONDE":{"m":"AS","d":"Configuración de impuestos: tasas, tipos y reglas de aplicación.","f":[{"n":"FORMULA_DONDE","t":"TEXT"},{"n":"IMPUESTO_COMPRA","t":"VARCHAR(20)"}]},"IMPUESTO_EXPAND":{"m":"AS","d":"Configuración de impuestos: tasas, tipos y reglas de aplicación.","f":[{"n":"FORMULA_EXPANDIDA","t":"TEXT"},{"n":"IMPUESTO_COMPRA","t":"VARCHAR(20)"}]},"IMPUESTO_FORMULA":{"m":"AS","d":"Configuración de impuestos: tasas, tipos y reglas de aplicación.","f":[{"n":"FORMULA_ORIGINAL","t":"TEXT"},{"n":"IMPUESTO_COMPRA","t":"VARCHAR(20)"}]},"IMPUESTO_TEMPIVA":{"m":"AS","d":"Configuración de impuestos: tasas, tipos y reglas de aplicación.","f":[{"n":"CALCULO_IMP2","t":"VARCHAR(1)"},{"n":"CONTAB_DEV_IMP1","t":"VARCHAR(1)"},{"n":"CONTAB_DEV_IMP2","t":"VARCHAR(1)"},{"n":"DESCRIPCION","t":"VARCHAR(40)"},{"n":"ESTADO","t":"VARCHAR(1)"},{"n":"IMPUESTO","t":"VARCHAR(4)"},{"n":"IMPUESTO1","t":"DECIMAL"},{"n":"IMPUESTO2","t":"DECIMAL"},{"n":"IMPUESTO2_CANTIDAD","t":"DECIMAL"},{"n":"ROWPOINTER","t":"GUID"},{"n":"TIPO_CONTAB_IMP1","t":"VARCHAR(1)"},{"n":"TIPO_CONTAB_IMP2","t":"VARCHAR(1)"},{"n":"TIPO_IMPUESTO1","t":"VARCHAR(4)"},{"n":"TIPO_IMPUESTO2","t":"VARCHAR(4)"},{"n":"TIPO_TARIFA1","t":"VARCHAR(2)"},{"n":"TIPO_TARIFA2","t":"VARCHAR(2)"},{"n":"USA_IMPUESTO2_CANTIDAD","t":"VARCHAR(1)"}]},"INCOTERMS":{"m":"","d":"","f":[{"n":"CODIGO","t":"VARCHAR(4)"},{"n":"DESCRIP","t":"VARCHAR(100)"},{"n":"PAIS","t":"VARCHAR(20)"}]},"INDICADOR":{"m":"","d":"","f":[{"n":"CLASE","t":"VARCHAR(1)"},{"n":"DESCRIPCION","t":"VARCHAR(40)"},{"n":"INDICADOR","t":"VARCHAR(8)"}]},"INDICADOR_VALOR":{"m":"","d":"","f":[{"n":"FECHA_FINAL","t":"DATETIME"},{"n":"INDICADOR","t":"VARCHAR(8)"},{"n":"VALOR","t":"DECIMAL"}]},"INDICE_PRECIOS":{"m":"","d":"Lista de precios: tarifas por artículo, cliente o segmento.","f":[{"n":"FECHA","t":"DATETIME"},{"n":"MONTO","t":"DECIMAL"},{"n":"TIPO_INDICE_PRECIO","t":"VARCHAR(4)"}]},"INFORMACION":{"m":"","d":"","f":[{"n":"CUERPO","t":"TEXT"},{"n":"DIRECCION_LINK","t":"VARCHAR(50)"},{"n":"FECHA_HASTA","t":"DATETIME"},{"n":"FECHA_INICIO","t":"DATETIME"},{"n":"IDIOMA","t":"VARCHAR(5)"},{"n":"INFORMACION","t":"INT"},{"n":"MODULO","t":"INT"},{"n":"NOMBRE_INFORMACION","t":"VARCHAR(50)"},{"n":"TEXTO_LINK","t":"VARCHAR(50)"},{"n":"TIPO_FORMATO","t":"INT"},{"n":"TIPO_INFORMACION","t":"INT"}]},"INFORMACION_CONTAC":{"m":"","d":"","f":[{"n":"CODIGO","t":"VARCHAR(40)"},{"n":"NOMBRE_EMPRESA","t":"VARCHAR(50)"}]},"INFORMACION_GRUPO":{"m":"","d":"","f":[{"n":"INFORMACION","t":"INT"},{"n":"INFORMACION_GRUPO","t":"INT"},{"n":"MODULO","t":"INT"}]},"INGRESOS_LOTE":{"m":"CI","d":"Control de lotes de producción/compra. Trazabilidad y vencimientos.","f":[{"n":"ARTICULO","t":"VARCHAR(20)"},{"n":"CANTIDAD_INGRESADA","t":"DECIMAL"},{"n":"FECHA_ENTRADA","t":"DATETIME"},{"n":"LOTE","t":"VARCHAR(15)"},{"n":"SECUENCIA_LOTE","t":"INT"}]},"ITEMS_HACIENDA":{"m":"","d":"","f":[{"n":"DESCRIPCION","t":"VARCHAR(254)"},{"n":"FENOMENO_ECONOMICO","t":"VARCHAR(4)"},{"n":"ITEM_HACIENDA","t":"VARCHAR(4)"},{"n":"REPORTE","t":"VARCHAR(4)"},{"n":"TIPO_TARIFA","t":"VARCHAR(2)"}]},"ITS_ACCESORIOS":{"m":"","d":"","f":[{"n":"CODIGO_ACCESORIO","t":"INT"},{"n":"INSTANCIA","t":"VARCHAR(50)"},{"n":"NOMBRE","t":"VARCHAR(50)"}]},"ITS_ACTIVIDAD_ECONOMICA":{"m":"","d":"","f":[{"n":"CODIGO_ACTIVIDAD","t":"VARCHAR(250)"},{"n":"DESCRIPCION","t":"VARCHAR(250)"},{"n":"INSTANCIA","t":"VARCHAR(250)"}]},"ITS_ACTIVIDADES_ORDEN":{"m":"","d":"","f":[{"n":"DESCRIPCION_ACTIVIDAD","t":"VARCHAR(200)"},{"n":"ESTADO_ACTIVIDAD","t":"VARCHAR(15)"},{"n":"FECHA_HORA_ASIGNADO","t":"DATETIME"},{"n":"FECHA_HORA_FIN","t":"DATETIME"},{"n":"FECHA_HORA_INICIO","t":"DATETIME"},{"n":"HORAS_EXTRA_DOBLE","t":"DECIMAL"},{"n":"HORAS_EXTRA_SIMPLE","t":"DECIMAL"},{"n":"HORAS_FACT_X_TEC","t":"DECIMAL"},{"n":"ID_ACTIVIDAD","t":"INT"},{"n":"ID_FALLAS","t":"INT"},{"n":"ID_ORDEN_SERVICIO","t":"VARCHAR(12)"},{"n":"INSTANCIA","t":"VARCHAR(50)"},{"n":"OBSERVACIONES","t":"TEXT"},{"n":"TIEMPO_DURACION","t":"VARCHAR(20)"},{"n":"TIEMPO_ESTIMADO","t":"DECIMAL"},{"n":"USUARIO_ASIGNADO","t":"VARCHAR(50)"},{"n":"USUARIO_JEFE_TECNICO","t":"VARCHAR(50)"}]},"ITS_AGRUPACIONES":{"m":"","d":"","f":[{"n":"ACTIVO","t":"VARCHAR(1)"},{"n":"DESCRIPCION","t":"VARCHAR(50)"},{"n":"ID_AGRUPACION","t":"INT"},{"n":"IMAGE","t":"IMAGE(214748364"}]},"ITS_AGRUPACIONES_PEDIDO":{"m":"","d":"","f":[{"n":"CODIGO_PEDIDO","t":"VARCHAR(40)"},{"n":"ID_AGRUPACION","t":"INT"}]},"ITS_AGRUPACIONES_ZONAS":{"m":"","d":"Zonas geográficas o rutas de distribución para análisis territorial.","f":[{"n":"ALIAS","t":"VARCHAR(120)"},{"n":"ID_ZONA","t":"INT"},{"n":"IMAGEN_DE_FONDO","t":"VARBINARY"},{"n":"INSTANCIA","t":"VARCHAR(50)"},{"n":"NOMBRE_ZONA","t":"VARCHAR(120)"},{"n":"ORDENAMIENTO","t":"INT"}]},"ITS_ALISTO_FASE":{"m":"","d":"","f":[{"n":"Articulo","t":"VARCHAR(20)"},{"n":"Creado","t":"DATETIME"},{"n":"Creado_Por","t":"VARCHAR(50)"},{"n":"Descripcion","t":"VARCHAR"},{"n":"Estado","t":"BIT"},{"n":"Id_Fase","t":"INT"},{"n":"Modificado","t":"DATETIME"},{"n":"Modificado_Por","t":"VARCHAR(50)"},{"n":"Nombre_Fase","t":"VARCHAR(30)"},{"n":"Secuencia","t":"INT"}]},"ITS_ALISTO_FASES_TRANSACCIONES":{"m":"","d":"","f":[{"n":"Comentario","t":"VARCHAR"},{"n":"Creado","t":"DATETIME"},{"n":"Creado_Por","t":"VARCHAR(50)"},{"n":"Ejecutado","t":"BIT"},{"n":"Horas_Adicionales","t":"DECIMAL"},{"n":"Id_Fase","t":"INT"},{"n":"Pedido","t":"VARCHAR(50)"}]},"ITS_ASIGNAR_BODEGA":{"m":"","d":"Catálogo de bodegas/almacenes con parámetros logísticos.","f":[{"n":"BODEGA","t":"VARCHAR(50)"},{"n":"CANTIDAD","t":"DECIMAL"},{"n":"ESTADO","t":"VARCHAR(50)"},{"n":"FECHA_MODIFICACION","t":"DATETIME"},{"n":"ID","t":"INT"},{"n":"ID_ARTICULO","t":"VARCHAR(50)"},{"n":"REFERENCIA","t":"VARCHAR(50)"},{"n":"STAMP","t":"DATETIME"},{"n":"TIPO_TRANS","t":"VARCHAR(1)"},{"n":"USUARIO","t":"VARCHAR(50)"}]},"ITS_AUTOR_VENTA":{"m":"","d":"","f":[{"n":"CLIENTE","t":"VARCHAR(20)"},{"n":"CODIGO","t":"VARCHAR(4)"},{"n":"DESCRIPCION","t":"VARCHAR(30)"},{"n":"FECHA_RIGE","t":"DATETIME"},{"n":"FECHA_VENCE","t":"DATETIME"},{"n":"NOMBRE_INSTITUCION","t":"VARCHAR(100)"},{"n":"NOTAS","t":"TEXT"},{"n":"NUM_AUTOR","t":"VARCHAR(50)"},{"n":"PORCENTAJE","t":"DECIMAL"},{"n":"TIPO_DOC","t":"VARCHAR(3)"}]},"ITS_BITACORA_ACTIVIDADES_ORDEN":{"m":"","d":"Registro de auditoría y trazabilidad de cambios en el sistema.","f":[{"n":"ACCION","t":"VARCHAR(250)"},{"n":"FECHA","t":"DATETIME"},{"n":"ID_ACTIVIDAD","t":"INT"},{"n":"ORDEN_SEVICIO","t":"VARCHAR(12)"},{"n":"USUARIO","t":"VARCHAR(249)"}]},"ITS_BITACORA_CAMPANA":{"m":"","d":"Registro de auditoría y trazabilidad de cambios en el sistema.","f":[{"n":"ACCION","t":"VARCHAR(70)"},{"n":"DESCRIPCION","t":"VARCHAR(150)"},{"n":"FECHA_HORA","t":"DATETIME"},{"n":"ID_BITACORA","t":"INT"},{"n":"ID_CAMPANA","t":"VARCHAR(50)"},{"n":"USUARIO","t":"VARCHAR(50)"}]},"ITS_BITACORA_CONTROL_TRANSACCIONES":{"m":"","d":"Registro de auditoría y trazabilidad de cambios en el sistema.","f":[{"n":"ACCION_DETALLE","t":"VARCHAR"},{"n":"ACCION_REALIZADA","t":"VARCHAR(20)"},{"n":"ENTIDAD_AFECTADA","t":"VARCHAR(50)"},{"n":"ID","t":"INT"},{"n":"STAMP","t":"DATETIME"},{"n":"USUARIO_CEMP","t":"VARCHAR(250)"}]},"ITS_BITACORA_EMARQ_NIVEL":{"m":"","d":"Registro de auditoría y trazabilidad de cambios en el sistema.","f":[{"n":"EMBARQUE","t":"VARCHAR(10)"},{"n":"MONEDA","t":"VARCHAR(1)"},{"n":"NIVEL_PRECIO","t":"VARCHAR(12)"},{"n":"STAMP","t":"DATETIME"},{"n":"USUARIO_ERP","t":"VARCHAR(20)"}]},"ITS_BITACORA_EQUIPO":{"m":"","d":"Registro de auditoría y trazabilidad de cambios en el sistema.","f":[{"n":"ACCION","t":"VARCHAR(80)"},{"n":"EQUIPO","t":"VARCHAR(12)"},{"n":"FECHA_MODIF","t":"DATETIME"},{"n":"FECHA_VENC_NUEVA","t":"DATETIME"},{"n":"FECHA_VENTA_NUEVA","t":"DATETIME"},{"n":"USUARIO","t":"VARCHAR(249)"}]},"ITS_BITACORA_ORDEN_SERVICIO":{"m":"","d":"Registro de auditoría y trazabilidad de cambios en el sistema.","f":[{"n":"ACCION","t":"VARCHAR(80)"},{"n":"FECHA","t":"DATETIME"},{"n":"ORDEN_SEVICIO","t":"VARCHAR(12)"},{"n":"PAQUETE_INV","t":"VARCHAR(50)"},{"n":"PRESUPUESTO","t":"VARCHAR(20)"},{"n":"USUARIO","t":"VARCHAR(249)"}]},"ITS_BODEGAS":{"m":"","d":"Catálogo de bodegas/almacenes con parámetros logísticos.","f":[{"n":"CODIGO_BODEGA","t":"VARCHAR(50)"},{"n":"ESTADO_BODEGA","t":"VARCHAR(1)"},{"n":"LOCALIZACION_BODEGA","t":"VARCHAR(50)"},{"n":"NOMBRE_BODEGA","t":"VARCHAR(50)"}]},"ITS_BOLETAS":{"m":"","d":"","f":[{"n":"ARTICULO","t":"VARCHAR(20)"},{"n":"COMETARIO","t":"TEXT"},{"n":"ESTADO","t":"VARCHAR(1)"},{"n":"FECHA_BOLETA","t":"DATETIME"},{"n":"FECHA_INGRESO","t":"DATETIME"},{"n":"FECHA_SALIDA","t":"DATETIME"},{"n":"ID","t":"INT"},{"n":"ID_CONTRATO","t":"VARCHAR(10)"},{"n":"NUMERO_BOLETA","t":"VARCHAR(10)"},{"n":"PEDIDO","t":"VARCHAR(20)"},{"n":"STAMP","t":"DATETIME"},{"n":"TIEMPO_FACTURABLE","t":"DECIMAL"},{"n":"TIEMPO_NOFACTURABLE","t":"DECIMAL"},{"n":"USUARIO","t":"VARCHAR(249)"}]},"ITS_CA_EJECUCION_LINEA":{"m":"","d":"","f":[{"n":"ARTICULO","t":"VARCHAR(200)"},{"n":"CANTIDAD_ALMACEN","t":"DECIMAL"},{"n":"CANTIDAD_PEDIDA","t":"DECIMAL"},{"n":"COD_EJECUCION","t":"VARCHAR(200)"},{"n":"COSTO_LIQUIDACION","t":"DECIMAL"},{"n":"COSTO_UNITARIO_DOLAR","t":"DECIMAL"},{"n":"COSTO_UNITARIO_LOCAL","t":"DECIMAL"},{"n":"COSTO_UNITARIO_PROVEEDOR","t":"DECIMAL"},{"n":"D.A.I","t":"DECIMAL"},{"n":"DESALMACENAJE","t":"DECIMAL"},{"n":"DUA","t":"DECIMAL"},{"n":"FACTURAS_FOB_CIF","t":"DECIMAL"},{"n":"FLETE_1","t":"DECIMAL"},{"n":"FLETE_2","t":"DECIMAL"},{"n":"FOB","t":"DECIMAL"},{"n":"GASTO_DESALMACENA","t":"DECIMAL"},{"n":"GASTO_FLETE_EXTRA","t":"DECIMAL"},{"n":"GASTOS_2","t":"DECIMAL"},{"n":"IMPUESTO_CONSUMO","t":"DECIMAL"},{"n":"IMPUESTO_VENTAS","t":"DECIMAL"},{"n":"LEY_6946","t":"DECIMAL"},{"n":"LINEA","t":"VARCHAR(5)"},{"n":"ORDEN_COMPRA","t":"VARCHAR(200)"},{"n":"PARTIDA","t":"VARCHAR(500)"},{"n":"PESO","t":"DECIMAL"}]},"ITS_CAJAS":{"m":"","d":"","f":[{"n":"Banco_Asociado","t":"VARCHAR(50)"},{"n":"BASE","t":"DECIMAL"},{"n":"CENTRO_COSTO","t":"VARCHAR(10)"},{"n":"CUENTA_CONTABLE","t":"VARCHAR(10)"},{"n":"DESCRIPCION","t":"VARCHAR(50)"},{"n":"ESTADO","t":"VARCHAR(1)"},{"n":"ID_CAJA","t":"INT"},{"n":"MONEDA","t":"VARCHAR(50)"},{"n":"TIPO","t":"VARCHAR(50)"}]},"ITS_CAMPANA_CLIENTES":{"m":"","d":"","f":[{"n":"CARGO","t":"VARCHAR(30)"},{"n":"CLIENTE","t":"VARCHAR(20)"},{"n":"CONDICION","t":"INT"},{"n":"CREDITO_DISPONIBLE","t":"DECIMAL"},{"n":"E_MAIL","t":"VARCHAR(249)"},{"n":"E_MAIL_VALIDO","t":"VARCHAR(5)"},{"n":"ESTADO","t":"VARCHAR(12)"},{"n":"Fecha_Enviado","t":"DATETIME"},{"n":"ID_CAMPANA","t":"VARCHAR(50)"},{"n":"ID_CONTACTO","t":"INT"},{"n":"NOMBRE_CLIENTE","t":"VARCHAR(150)"},{"n":"NOMBRE_CONTACTO","t":"VARCHAR(30)"},{"n":"RUBRO1","t":"VARCHAR(200)"},{"n":"RUBRO2","t":"VARCHAR(200)"},{"n":"RUBRO3","t":"VARCHAR(200)"},{"n":"SALDO","t":"DECIMAL"},{"n":"SALDO_VENCIDO","t":"DECIMAL"},{"n":"TELEFONO_1","t":"VARCHAR(50)"},{"n":"TELEFONO_1_VALIDO","t":"VARCHAR(5)"},{"n":"TELEFONO_2","t":"VARCHAR(50)"},{"n":"TELEFONO_2_VALIDO","t":"VARCHAR(5)"}]},"ITS_CAMPANA_EVENTOS":{"m":"","d":"","f":[{"n":"AGENTE","t":"VARCHAR(20)"},{"n":"CALLID","t":"VARCHAR(80)"},{"n":"CLIENTE","t":"VARCHAR(20)"},{"n":"CRD","t":"VARCHAR(30)"},{"n":"ESTADO","t":"VARCHAR(1)"},{"n":"ID_CAMPANA","t":"VARCHAR(20)"},{"n":"ID_EVENTO","t":"INT"},{"n":"MENSAJE","t":"VARCHAR(50)"},{"n":"STAMP","t":"VARCHAR(20)"}]},"ITS_CAMPANA_USUARIO":{"m":"","d":"Usuarios del sistema: credenciales, perfil, estado y auditoría.","f":[{"n":"ACCION","t":"TEXT"},{"n":"Cliente","t":"VARCHAR(50)"},{"n":"ESTADO","t":"VARCHAR(50)"},{"n":"FECHA_ESTADO","t":"DATETIME"},{"n":"FECHA_HORA_ACCION","t":"DATETIME"},{"n":"ID_CAMPANA","t":"VARCHAR(50)"},{"n":"USUARIO_ASIGNADO","t":"VARCHAR(50)"}]},"ITS_CAMPANAS":{"m":"","d":"","f":[{"n":"CANTONES","t":"VARCHAR"},{"n":"CATEGORIAS_CLIENTE","t":"VARCHAR"},{"n":"CLASIFICACION","t":"VARCHAR(2)"},{"n":"COBRADORES","t":"VARCHAR"},{"n":"COBRO_JUDICIAL","t":"VARCHAR(1)"},{"n":"CONDICIONES_PAGO","t":"VARCHAR"},{"n":"DESCRIPCION_CAMPANA","t":"VARCHAR(200)"},{"n":"EMAIL_REFERENCIA","t":"VARCHAR(249)"},{"n":"ESTADO","t":"VARCHAR(1)"},{"n":"EXCEDE_LIMITE_CREDITO","t":"VARCHAR(1)"},{"n":"ID_CAMPANA","t":"VARCHAR(50)"},{"n":"Imagen","t":"VARCHAR"},{"n":"MOROSIDAD","t":"VARCHAR(1)"},{"n":"Name_Imagen","t":"VARCHAR(30)"},{"n":"NOMBRE_CAMPANA","t":"VARCHAR(100)"},{"n":"NUMERO_REFERENCIA","t":"VARCHAR(20)"},{"n":"PAISES","t":"VARCHAR"},{"n":"PERMITE_EXCEDER_LIM_CRED","t":"VARCHAR(1)"},{"n":"PROVINCIAS","t":"VARCHAR"},{"n":"RUTAS","t":"VARCHAR"},{"n":"SALDO_MAX","t":"DECIMAL"},{"n":"SALDO_MIN","t":"DECIMAL"},{"n":"SMS_DEFINIDO","t":"TEXT"},{"n":"TIEMPO_ESPERA","t":"INT"},{"n":"TIENE_LIMITE_CREDITO","t":"VARCHAR(1)"}]},"ITS_CANTON":{"m":"","d":"","f":[{"n":"NOMBRE_CANTON","t":"VARCHAR(30)"},{"n":"NUMERO_CANTON","t":"VARCHAR(2)"},{"n":"NUMERO_PROVINCIA","t":"VARCHAR(2)"}]},"ITS_CATEGORIA_ACTIVIDAD":{"m":"","d":"","f":[{"n":"ID_ACTIVIDAD","t":"INT"},{"n":"ID_CATEGORIA","t":"VARCHAR(10)"},{"n":"ID_CATEGORIA_ACTIVIDAD","t":"INT"}]},"ITS_CATEGORIA_ARTICULO_CONSUMO":{"m":"","d":"Categorías de clasificación de artículos para reportes y análisis.","f":[{"n":"CUOTA","t":"DECIMAL"},{"n":"DESCRIPCION","t":"VARCHAR(250)"},{"n":"ID_CATEGORIA_ARTICULO_CONSUMO","t":"INT"}]},"ITS_CATEGORIAS_CG":{"m":"","d":"","f":[{"n":"CEC_ANTICIPO","t":"VARCHAR(10)"},{"n":"CEC_COSTOS","t":"VARCHAR(10)"},{"n":"CEC_CxC","t":"VARCHAR(10)"},{"n":"CEC_CxP","t":"VARCHAR(10)"},{"n":"CEC_DESCUENTOS","t":"VARCHAR(10)"},{"n":"CEC_DEVOLUCIONES","t":"VARCHAR(10)"},{"n":"CEC_FLETE","t":"VARCHAR(10)"},{"n":"CEC_INVENTARIO","t":"VARCHAR(10)"},{"n":"CEC_OTRO","t":"VARCHAR(10)"},{"n":"CEC_SEGURO","t":"VARCHAR(10)"},{"n":"CEC_VENTAS","t":"VARCHAR(10)"},{"n":"CUC_ANTICIPO","t":"VARCHAR(10)"},{"n":"CUC_COSTOS","t":"VARCHAR(10)"},{"n":"CUC_CxC","t":"VARCHAR(10)"},{"n":"CUC_CxP","t":"VARCHAR(10)"},{"n":"CUC_DESCUENTOS","t":"VARCHAR(10)"},{"n":"CUC_DEVOLUCIONES","t":"VARCHAR(10)"},{"n":"CUC_FLETE","t":"VARCHAR(10)"},{"n":"CUC_INVENTARIO","t":"VARCHAR(10)"},{"n":"CUC_OTRO","t":"VARCHAR(10)"},{"n":"CUC_SEGURO","t":"VARCHAR(10)"},{"n":"CUC_VENTAS","t":"VARCHAR(10)"},{"n":"DESCRIPCION","t":"VARCHAR(50)"},{"n":"ESTADO","t":"VARCHAR(1)"},{"n":"ID","t":"INT"}]},"ITS_CD_BitacoraEventos":{"m":"","d":"Registro de auditoría y trazabilidad de cambios en el sistema.","f":[{"n":"Detalle_Accion","t":"VARCHAR"},{"n":"Id","t":"INT"},{"n":"Id_Corrida","t":"INT"},{"n":"Stamp","t":"DATETIME"},{"n":"Tipo_Evento","t":"VARCHAR(2)"},{"n":"Usuario","t":"VARCHAR(30)"}]},"ITS_CD_Corrida_Detalle_Articulo_Precio":{"m":"","d":"Lista de precios: tarifas por artículo, cliente o segmento.","f":[{"n":"ARTICULO","t":"VARCHAR(20)"},{"n":"Autorizado","t":"VARCHAR(1)"},{"n":"ESQUEMA_TRABAJO","t":"VARCHAR(1)"},{"n":"FECHA_FIN","t":"DATETIME"},{"n":"FECHA_INICIO","t":"DATETIME"},{"n":"FECHA_ULT_MODIF","t":"DATETIME"},{"n":"Id","t":"INT"},{"n":"Id_Encabezado","t":"INT"},{"n":"Insertado","t":"VARCHAR(1)"},{"n":"MARGEN_MULR","t":"DECIMAL"},{"n":"MARGEN_UTILIDAD","t":"DECIMAL"},{"n":"MARGEN_UTILIDAD_MIN","t":"DECIMAL"},{"n":"MONEDA","t":"VARCHAR(1)"},{"n":"NIVEL_PRECIO","t":"VARCHAR(12)"},{"n":"Observacion","t":"VARCHAR"},{"n":"PRECIO","t":"DECIMAL"},{"n":"USUARIO_ULT_MODIF","t":"VARCHAR(50)"},{"n":"VERSION","t":"INT"},{"n":"VERSION_ARTICULO","t":"INT"}]},"ITS_CD_Corrida_Detalle_Costo_Proveedor":{"m":"","d":"Detalle de transacción con cantidades y valores unitarios.","f":[{"n":"ARTICULO","t":"VARCHAR(40)"},{"n":"Autorizado","t":"VARCHAR(1)"},{"n":"CANTIDAD","t":"DECIMAL"},{"n":"COSTO","t":"DECIMAL"},{"n":"Id","t":"INT"},{"n":"Id_Encabezado","t":"INT"},{"n":"Insertado","t":"VARCHAR(1)"},{"n":"LINEA","t":"INT"},{"n":"Observacion","t":"VARCHAR"},{"n":"PROVEEDOR","t":"VARCHAR(40)"}]},"ITS_CD_Corrida_Detalle_Escala_Bonif":{"m":"","d":"","f":[{"n":"ARTICULO","t":"VARCHAR(20)"},{"n":"ARTICULO_BONIF","t":"VARCHAR(20)"},{"n":"Autorizado","t":"VARCHAR(1)"},{"n":"ESCALA_BONIF","t":"INT"},{"n":"FACTOR_BONIF","t":"DECIMAL"},{"n":"FECHA_FIN_ESC","t":"DATETIME"},{"n":"FECHA_INICIO_ESC","t":"DATETIME"},{"n":"FECHA_ULT_MODIF","t":"DATETIME"},{"n":"Id","t":"INT"},{"n":"Id_Encabezado","t":"INT"},{"n":"Insertado","t":"VARCHAR(1)"},{"n":"MAX_ART_FACT","t":"INT"},{"n":"MIN_ART_FACT","t":"INT"},{"n":"MONEDA","t":"VARCHAR(1)"},{"n":"NIVEL_PRECIO","t":"VARCHAR(12)"},{"n":"Observacion","t":"VARCHAR"},{"n":"UNIDADES_BONIF","t":"DECIMAL"},{"n":"USUARIO_ULT_MODIF","t":"VARCHAR(50)"},{"n":"VERSION","t":"INT"},{"n":"VERSION_BONIF","t":"INT"}]},"ITS_CD_Corrida_Detalle_Escala_Dcto":{"m":"","d":"","f":[{"n":"ARTICULO","t":"VARCHAR(20)"},{"n":"Autorizado","t":"VARCHAR(1)"},{"n":"ESCALA_DCTO","t":"INT"},{"n":"FECHA_FIN_ESC","t":"DATETIME"},{"n":"FECHA_INICIO_ESC","t":"DATETIME"},{"n":"FECHA_ULT_MODIF","t":"DATETIME"},{"n":"Id","t":"INT"},{"n":"Id_Encabezado","t":"INT"},{"n":"Insertado","t":"VARCHAR(1)"},{"n":"MAX_UNID_FACT","t":"INT"},{"n":"MIN_UNID_FACT","t":"INT"},{"n":"MONEDA","t":"VARCHAR(1)"},{"n":"NIVEL_PRECIO","t":"VARCHAR(12)"},{"n":"Observacion","t":"VARCHAR"},{"n":"PORC_DCTO","t":"DECIMAL"},{"n":"USUARIO_ULT_MODIF","t":"VARCHAR(50)"},{"n":"VERSION","t":"INT"},{"n":"VERSION_DCTO","t":"INT"}]},"ITS_CD_Corrida_Encabezado":{"m":"","d":"","f":[{"n":"Archivo","t":"VARBINARY"},{"n":"Archivo_Content_Type","t":"VARCHAR"},{"n":"Categoria","t":"VARCHAR(1)"},{"n":"Comentario","t":"VARCHAR"},{"n":"Estado","t":"VARCHAR(30)"},{"n":"FechaHora_Creado","t":"DATETIME"},{"n":"FechaHora_Modificado","t":"DATETIME"},{"n":"Id","t":"INT"},{"n":"Nombre_Archivo","t":"VARCHAR"},{"n":"Usuario_Modificado","t":"VARCHAR(30)"},{"n":"Usuario_Propietario","t":"VARCHAR(30)"}]},"ITS_CG_ASIENTO_DIARIO":{"m":"","d":"Cabecera de asientos contables generados por módulos auxiliares o manual.","f":[{"n":"ASIENTO","t":"VARCHAR(30)"},{"n":"AUX","t":"VARCHAR(3)"},{"n":"COMENTARIO","t":"VARCHAR"},{"n":"CONTABILIZADO","t":"VARCHAR(1)"},{"n":"CREADO","t":"DATETIME"},{"n":"CREADO_POR","t":"VARCHAR(50)"},{"n":"DIFERENCIA","t":"DECIMAL"},{"n":"ESTADO","t":"VARCHAR(1)"},{"n":"FECHA_ASIENTO","t":"DATETIME"},{"n":"MODIFICADO","t":"DATETIME"},{"n":"MODIFICADO_POR","t":"VARCHAR(50)"},{"n":"PERIODO","t":"VARCHAR(25)"},{"n":"TIPO_CAMBIO","t":"DECIMAL"},{"n":"TOTAL_CREDITO","t":"DECIMAL"},{"n":"TOTAL_DEBITO","t":"DECIMAL"}]},"ITS_CG_ASIENTO_DIARIO_DETALLE":{"m":"","d":"Cabecera de asientos contables generados por módulos auxiliares o manual.","f":[{"n":"ASIENTO","t":"VARCHAR(30)"},{"n":"CENTRO_COSTO","t":"VARCHAR(30)"},{"n":"CUENTA_CUENTA","t":"VARCHAR(30)"},{"n":"DESCRIPCION","t":"VARCHAR(50)"},{"n":"FUENTE","t":"VARCHAR(50)"},{"n":"ID","t":"INT"},{"n":"MONTO_CREDITO","t":"DECIMAL"},{"n":"MONTO_DEBITO","t":"DECIMAL"},{"n":"REFERENCIA","t":"VARCHAR(50)"}]},"ITS_CG_CC":{"m":"","d":"","f":[{"n":"ACEPTA_MOVIMIENTOS","t":"VARCHAR(1)"},{"n":"AJUSTA_DIFERENCIA","t":"VARCHAR(1)"},{"n":"CC","t":"VARCHAR(10)"},{"n":"CREADO","t":"DATETIME"},{"n":"CREADO_POR","t":"VARCHAR(50)"},{"n":"DESCRIPCION","t":"VARCHAR(150)"},{"n":"ESTADO","t":"VARCHAR(1)"},{"n":"INSTANCIA","t":"VARCHAR(40)"},{"n":"MODIFICADO","t":"DATETIME"},{"n":"MODIFICADO_POR","t":"VARCHAR(50)"},{"n":"SALDO","t":"DECIMAL"},{"n":"TIPO","t":"VARCHAR(3)"}]},"ITS_CITAS":{"m":"","d":"","f":[{"n":"COMENTARIO","t":"TEXT"},{"n":"CORREOS","t":"TEXT"},{"n":"DESCRIPCION_CITA","t":"VARCHAR"},{"n":"EQUIPO_CITA","t":"VARCHAR(100)"},{"n":"ESTADO","t":"VARCHAR(14)"},{"n":"FECHA_CITA","t":"DATETIME"},{"n":"FECHA_CREACION","t":"DATETIME"},{"n":"FECHA_FINAL_CITA","t":"DATETIME"},{"n":"FECHA_INGRESO","t":"DATETIME"},{"n":"FECHA_MODIFICACION","t":"DATETIME"},{"n":"FECHA_SALIDA","t":"DATETIME"},{"n":"HORAS_RESERVADAS","t":"INT"},{"n":"ID_CITA","t":"INT"},{"n":"ID_CLIENTE","t":"VARCHAR(40)"},{"n":"OBSERVACION_CITA","t":"VARCHAR"},{"n":"PRIMERA_CITA","t":"INT"},{"n":"RESULTADO_CITA","t":"INT"},{"n":"SUBTIPO","t":"INT"},{"n":"SUCURSAL_CITA","t":"VARCHAR(100)"},{"n":"TELEFONO_CITA","t":"VARCHAR(200)"},{"n":"TIEMPO_DURACION","t":"VARCHAR(20)"},{"n":"TIPO_CITA","t":"INT"},{"n":"USUARIO_ASIGNADO","t":"VARCHAR(249)"},{"n":"USUARIO_CREACION","t":"VARCHAR(249)"}]},"ITS_CITAS_BITACORAS":{"m":"","d":"Registro de auditoría y trazabilidad de cambios en el sistema.","f":[{"n":"EVENTO","t":"VARCHAR(20)"},{"n":"FECHA_HORA_MODIFICACION","t":"DATETIME"},{"n":"ID_CITA","t":"INT"},{"n":"ID_EVENTO","t":"INT"},{"n":"LOCALIZACION","t":"VARCHAR(40)"},{"n":"REFERENCIA","t":"VARCHAR(50)"},{"n":"USUARIO_MODIFICACION","t":"VARCHAR(249)"}]},"ITS_CITAS_RESULTADO":{"m":"","d":"","f":[{"n":"CITAS_RESUL_DESC","t":"VARCHAR(30)"},{"n":"ID_CITAS_RESUL","t":"INT"}]},"ITS_CITAS_SUBTIPO":{"m":"","d":"","f":[{"n":"CITAS_SUBTIPO_DESC","t":"VARCHAR(50)"},{"n":"ID_CITAS_SUBTIPO","t":"INT"},{"n":"ID_CITAS_TIPO","t":"INT"}]},"ITS_CITAS_TIPO":{"m":"","d":"","f":[{"n":"CITAS_TIPO_DESC","t":"VARCHAR(50)"},{"n":"ID_CITAS_TIPO","t":"INT"}]},"ITS_CLASIFICACION_CONTENEDOR":{"m":"","d":"","f":[{"n":"CLASIFICACION","t":"INT"},{"n":"DESCRIPCION","t":"VARCHAR(80)"},{"n":"ESTADO","t":"VARCHAR(1)"},{"n":"PESO","t":"DECIMAL"},{"n":"VOLUMEN","t":"DECIMAL"}]},"ITS_CLASIFICACION_DOCUMENTOS":{"m":"","d":"","f":[{"n":"DESCRIPCION","t":"VARCHAR(249)"},{"n":"ID_CLASIFICACION","t":"INT"},{"n":"NIVEL_AGRUPACION","t":"INT"}]},"ITS_CLIENTE_EQUIPO":{"m":"","d":"","f":[{"n":"CODIGO_CLIENTE","t":"VARCHAR(20)"},{"n":"CODIGO_CLIENTE_EQUIPO","t":"INT"},{"n":"CODIGO_EQUIPO","t":"VARCHAR(10)"}]},"ITS_CLIENTE_NOTAS":{"m":"","d":"","f":[{"n":"CLIENTE","t":"VARCHAR(20)"},{"n":"COMENTARIO","t":"TEXT"},{"n":"FECHA_COMENTARIO","t":"DATETIME"},{"n":"FECHA_CREACION","t":"DATETIME"},{"n":"ID","t":"INT"},{"n":"ID_CITA","t":"INT"},{"n":"ID_CONTACTO","t":"INT"},{"n":"ID_OPORTUNIDAD","t":"INT"},{"n":"ID_PEDIDO","t":"VARCHAR(50)"},{"n":"TIPO_COMENTARIO","t":"VARCHAR(20)"},{"n":"USUARIO","t":"VARCHAR(50)"}]},"ITS_CLIENTE_SUCURSALES":{"m":"","d":"","f":[{"n":"CODIGO_CLIENTE","t":"VARCHAR(20)"},{"n":"CODIGO_CLIENTE_SUCURSAL","t":"INT"},{"n":"CODIGO_SUCURSAL","t":"INT"},{"n":"DESCRIPCION","t":"VARCHAR(50)"}]},"ITS_CONDICION_CONTACTO":{"m":"","d":"Contactos asociados a clientes o proveedores con datos de comunicación.","f":[{"n":"CONDICION","t":"VARCHAR(200)"},{"n":"ID_CONDICION","t":"INT"}]},"ITS_CONTACTO_CLIENTE":{"m":"","d":"Contactos asociados a clientes o proveedores con datos de comunicación.","f":[{"n":"APELLIDOS","t":"VARCHAR(50)"},{"n":"CARGO","t":"VARCHAR(100)"},{"n":"CELULAR","t":"VARCHAR(50)"},{"n":"CLIENTE","t":"VARCHAR(20)"},{"n":"CONTACTO","t":"VARCHAR(20)"},{"n":"DEPARTAMENTO","t":"VARCHAR(100)"},{"n":"EMAIL","t":"VARCHAR(100)"},{"n":"FAX","t":"VARCHAR(50)"},{"n":"GENERO","t":"VARCHAR(1)"},{"n":"NOMBRE","t":"VARCHAR(50)"},{"n":"NOTAS","t":"VARCHAR"},{"n":"TELEFONO","t":"VARCHAR(50)"}]},"ITS_CONTENEDOR":{"m":"","d":"","f":[{"n":"CLASIFICACION","t":"INT"},{"n":"CONTENEDOR","t":"VARCHAR(50)"},{"n":"ESTADO","t":"VARCHAR(1)"},{"n":"FECHA_ESTIMADA_ARRIVE","t":"DATETIME"},{"n":"FECHA_HORA_INICIO_TRANS","t":"DATETIME"},{"n":"NOMBRE_CONTENEDOR","t":"VARCHAR(80)"},{"n":"PUNTO_EMBARQUE","t":"INT"},{"n":"TIPO_ENVIO","t":"VARCHAR(1)"}]},"ITS_CONTRATO":{"m":"","d":"","f":[{"n":"CLIENTE_ASOCIADO","t":"VARCHAR(20)"},{"n":"CODIGO","t":"VARCHAR(50)"},{"n":"COMENTARIO_FACTURACION","t":"VARCHAR"},{"n":"CONTACTO_ASOCIADO","t":"VARCHAR(20)"},{"n":"COTIZACION_ASOCIADA","t":"VARCHAR(30)"},{"n":"DESCRIPCION","t":"VARCHAR"},{"n":"ESTADO","t":"VARCHAR(50)"},{"n":"FECHA_FIN","t":"DATETIME"},{"n":"FECHA_INICIO","t":"DATETIME"},{"n":"FRECUENCIA","t":"VARCHAR(50)"},{"n":"HORAS_CONTRATADAS","t":"DECIMAL"},{"n":"LICENCIA","t":"VARCHAR"},{"n":"SIGUIENTE_FACTURACION","t":"DATETIME"},{"n":"TIPO_CONTRATO","t":"DECIMAL"}]},"ITS_Contrato_Movimientos":{"m":"","d":"","f":[{"n":"Consecutivo_Contrato","t":"VARCHAR(20)"},{"n":"Creado_Por","t":"VARCHAR(250)"},{"n":"Estado","t":"VARCHAR(10)"},{"n":"ID","t":"INT"},{"n":"Justificacion","t":"VARCHAR(800)"},{"n":"Ref_Erp","t":"VARCHAR(250)"},{"n":"Stamp","t":"DATETIME"},{"n":"Tipo","t":"VARCHAR(10)"}]},"ITS_Control":{"m":"","d":"","f":[{"n":"3VxDIpoLNSY","t":"VARCHAR(100)"},{"n":"HXndMuu6Lhrx","t":"INT"},{"n":"JC2PscCwWKk","t":"VARCHAR(100)"},{"n":"OGfsG1Uxzxg","t":"VARCHAR(100)"},{"n":"vOivqwQ3NwMWB","t":"VARCHAR(100)"}]},"ITS_CONTROL_CUPONES":{"m":"","d":"","f":[{"n":"CANTIDAD","t":"INT"},{"n":"CLIENTE","t":"VARCHAR(20)"},{"n":"COMENTARIO","t":"VARCHAR(600)"},{"n":"FACTURA","t":"VARCHAR(50)"},{"n":"FECHA","t":"DATETIME"}]},"ITS_CONTROL_DESPACHOS":{"m":"","d":"","f":[{"n":"CANT_DESPACHADA_UND_EMP","t":"DECIMAL"},{"n":"CANT_DESPACHADA_UND_VENT","t":"DECIMAL"},{"n":"CANT_PENDIENTE_UND_EMP","t":"DECIMAL"},{"n":"CANT_PENDIENTE_UND_VENT","t":"DECIMAL"},{"n":"DESPACHO","t":"VARCHAR(30)"},{"n":"DESPACHO_PARCIAL","t":"VARCHAR(20)"},{"n":"FECHA_DESPACHO","t":"DATETIME"},{"n":"FECHA_ULT_IMPR","t":"DATETIME"},{"n":"ID_CONTROL","t":"INT"},{"n":"IMPRESO","t":"VARCHAR(1)"},{"n":"PEDIDO","t":"VARCHAR(50)"},{"n":"PEDIDO_LINEA","t":"INT"},{"n":"TRANSPORTE","t":"VARCHAR(100)"},{"n":"USUARIO_DESP","t":"VARCHAR(249)"}]},"ITS_CONTROL_NABI":{"m":"","d":"","f":[{"n":"FECHA_REGISTRO","t":"DATETIME"},{"n":"MENSAJE","t":"VARCHAR"},{"n":"NUMERO_DOCUMENTO","t":"VARCHAR(50)"},{"n":"TIPO_DOC","t":"VARCHAR(5)"}]},"ITS_CONTROL_RESERVA":{"m":"","d":"","f":[{"n":"COD_PEDIDO","t":"VARCHAR(50)"},{"n":"FECHA_FINAL","t":"DATETIME"},{"n":"FECHA_INICIO","t":"DATETIME"},{"n":"IdCONTROL","t":"INT"},{"n":"PEDIDO_LINEA","t":"VARCHAR(1)"},{"n":"TRANSPORTE","t":"VARCHAR(90)"}]},"ITS_ControlRenta":{"m":"","d":"","f":[{"n":"FechaDocumento","t":"DATETIME"},{"n":"idControl","t":"INT"},{"n":"Licencia","t":"VARCHAR(200)"},{"n":"Monto","t":"DECIMAL"},{"n":"NumeroDocumento","t":"VARCHAR(50)"},{"n":"Stamp","t":"DATETIME"},{"n":"TipoDocumento","t":"VARCHAR(50)"},{"n":"Usuario","t":"VARCHAR(50)"}]},"ITS_CuentasRedesSociales":{"m":"","d":"","f":[{"n":"ACTIVO","t":"VARCHAR(1)"},{"n":"CLASE","t":"VARCHAR(50)"},{"n":"FECHA_HORA_CREACION","t":"DATETIME"},{"n":"ID","t":"INT"},{"n":"ID_PAGINA","t":"VARCHAR(150)"},{"n":"USUARIO","t":"VARCHAR(150)"}]},"ITS_DISTRITO":{"m":"","d":"","f":[{"n":"NOMBRE_DISTRITO","t":"VARCHAR(30)"},{"n":"NUMERO_CANTON","t":"VARCHAR(2)"},{"n":"NUMERO_DISTRITO","t":"VARCHAR(2)"},{"n":"NUMERO_PROVINCIA","t":"VARCHAR(2)"}]},"ITS_DOC_ADJUNTO":{"m":"","d":"","f":[{"n":"CONSECUTIVO","t":"INT"},{"n":"CONTENIDO","t":"VARBINARY"},{"n":"DESCRIPCION","t":"VARCHAR(254)"},{"n":"NOMBRE","t":"VARCHAR(500)"},{"n":"ROW_ID","t":"VARCHAR(30)"},{"n":"TABLA","t":"VARCHAR(35)"},{"n":"TIPO","t":"VARCHAR(15)"}]},"ITS_DOCUMENTO_ELECTRONICO":{"m":"","d":"","f":[{"n":"ACEPTACION_RECHAZO","t":"VARCHAR"},{"n":"ACEPTADO","t":"VARCHAR(1)"},{"n":"CONDICION_PAGO","t":"VARCHAR(4)"},{"n":"CONSECUTIVO","t":"INT"},{"n":"CONSECUTIVO_INTERNO","t":"VARCHAR(4000)"},{"n":"DOCUMENTO_ELECTRONICO_FA","t":"VARCHAR"},{"n":"DOCUMENTO_ELECTRONICO_NC","t":"VARCHAR"},{"n":"DOCUMENTO_ELECTRONICO_NC_SIN_DETALLE","t":"VARCHAR"},{"n":"EMAIL_EMISOR","t":"VARCHAR(40)"},{"n":"EMAIL_RECEPTOR","t":"VARCHAR(40)"},{"n":"ENVIADO","t":"VARCHAR(1)"},{"n":"FACTURA_ORIGINAL","t":"VARCHAR(80)"},{"n":"FECHA_DOCUMENTO","t":"DATETIME"},{"n":"IMPUESTO","t":"DECIMAL"},{"n":"IMPUESTO_ACREDITAR","t":"DECIMAL"},{"n":"MENSAJE_RESPUESTA","t":"VARCHAR"},{"n":"NIT_EMISOR","t":"VARCHAR(40)"},{"n":"NIT_RECEPTOR","t":"VARCHAR(40)"},{"n":"NOMBRE_INSTANCIA","t":"VARCHAR(200)"},{"n":"NOMBRE_PROVEEDOR","t":"VARCHAR(200)"},{"n":"NUEVO_DOCUMENTO","t":"VARCHAR(50)"},{"n":"NUMERO_DOC","t":"VARCHAR(50)"},{"n":"PROVEEDOR","t":"VARCHAR(20)"},{"n":"SERIE","t":"VARCHAR(200)"},{"n":"STAMP","t":"DATETIME"}]},"ITS_DOCUMENTO_ENTIDAD":{"m":"","d":"","f":[{"n":"CODIGO_DOCUMENTO_ENTIDAD","t":"INT"},{"n":"CODIGO_ENTIDAD","t":"VARCHAR(25)"},{"n":"ID_DOCUMENTO","t":"INT"},{"n":"TIPO","t":"VARCHAR(1)"}]},"ITS_DOCUMENTOS_ASOC":{"m":"","d":"","f":[{"n":"ACTIVO","t":"VARCHAR(1)"},{"n":"CLASIFICACION_1","t":"INT"},{"n":"CLASIFICACION_2","t":"INT"},{"n":"CUERPO","t":"TEXT"},{"n":"ENTIDAD_ASOCIADA","t":"VARCHAR(80)"},{"n":"FECHA_CREACION","t":"DATETIME"},{"n":"FECHA_ULTIM_MODIFICA","t":"DATETIME"},{"n":"ID_DOCUMENTO","t":"INT"},{"n":"TITULO","t":"VARCHAR(250)"},{"n":"USUARIO_CREADOR","t":"VARCHAR(249)"},{"n":"USUARIO_ULTIM_MODIFICA","t":"VARCHAR(249)"}]},"ITS_DOCUMENTOS_CC_DIFERIDO":{"m":"","d":"Tabla transaccional con montos e información de fechas del proceso.","f":[{"n":"ANULADO","t":"VARCHAR(1)"},{"n":"APLICACION","t":"VARCHAR(249)"},{"n":"APROBADO","t":"VARCHAR(1)"},{"n":"ASIENTO","t":"VARCHAR(10)"},{"n":"ASIENTO_PENDIENTE","t":"VARCHAR(1)"},{"n":"AUD_FECHA_ANUL","t":"DATETIME"},{"n":"AUD_USUARIO_ANUL","t":"VARCHAR(249)"},{"n":"AUDITORIA_COBRO","t":"VARCHAR(80)"},{"n":"BASE_IMPUESTO1","t":"DECIMAL"},{"n":"BASE_IMPUESTO2","t":"DECIMAL"},{"n":"CARGADO_DE_FACT","t":"VARCHAR(1)"},{"n":"CLASE_DOCUMENTO","t":"VARCHAR(1)"},{"n":"CLIENTE","t":"VARCHAR(20)"},{"n":"CLIENTE_ORIGEN","t":"VARCHAR(20)"},{"n":"CLIENTE_REPORTE","t":"VARCHAR(20)"},{"n":"COBRADOR","t":"VARCHAR(4)"},{"n":"CODIGO_IMPUESTO","t":"VARCHAR(4)"},{"n":"CONDICION_PAGO","t":"VARCHAR(4)"},{"n":"CONTRARECIBO","t":"VARCHAR(50)"},{"n":"CONTRATO","t":"VARCHAR(20)"},{"n":"CTA_BANCARIA","t":"VARCHAR(20)"},{"n":"DEPENDIENTE","t":"VARCHAR(1)"},{"n":"DEPENDIENTE_GP","t":"VARCHAR(1)"},{"n":"DESCUENTO","t":"DECIMAL"},{"n":"DIVISION_GEOGRAFICA1","t":"VARCHAR(12)"}]},"ITS_EAP_CONTRATO":{"m":"","d":"","f":[{"n":"CONSECUTIVO_CONTRATO","t":"VARCHAR(50)"},{"n":"CONSECUTIVO_EAP","t":"VARCHAR(20)"},{"n":"ID","t":"INT"},{"n":"Precio_Venta_Dolar","t":"DECIMAL"},{"n":"Referencia_Costo_Dolar","t":"DECIMAL"},{"n":"Referencia_Costo_Local","t":"DECIMAL"},{"n":"Ultimo_Movimiento","t":"VARCHAR(10)"}]},"ITS_EQUIPO":{"m":"","d":"","f":[{"n":"ACTIVA_MANT_PREVENTIVO","t":"VARCHAR(1)"},{"n":"CODIGO_EQUIPO","t":"VARCHAR(10)"},{"n":"COMENTARIOS","t":"TEXT"},{"n":"EMAIL_NOTIFICA","t":"VARCHAR(249)"},{"n":"ESTADO_EQUIPO","t":"VARCHAR(1)"},{"n":"FECHA_ULTIMA_REPARACION","t":"DATETIME"},{"n":"FECHA_VENCE_GARANTIA","t":"DATETIME"},{"n":"FECHA_VENTA","t":"DATETIME"},{"n":"FRECUENCIA_NOTIFICACION","t":"INT"},{"n":"GARANTIA","t":"VARCHAR(20)"},{"n":"ID_MARCA_EQUIPO","t":"VARCHAR(10)"},{"n":"ID_MODELO_EQUIPO","t":"VARCHAR(10)"},{"n":"ID_TIPO_EQUIPO","t":"VARCHAR(10)"},{"n":"INSTANCIA","t":"VARCHAR(50)"},{"n":"NOTIFICACION_ACTIVA","t":"VARCHAR(1)"},{"n":"NUMERO_CELULAR_NOTIF","t":"VARCHAR(10)"},{"n":"NUMERO_SERIE","t":"VARCHAR(50)"},{"n":"RUBRO_1","t":"VARCHAR(100)"},{"n":"RUBRO_2","t":"VARCHAR(100)"},{"n":"RUBRO_3","t":"VARCHAR(100)"},{"n":"TIPO_APLICACION","t":"VARCHAR(1)"},{"n":"USA_FRECUENCIA_AUTOMATICA","t":"VARCHAR(1)"}]},"ITS_EQUIPO_A_PRESTAMO":{"m":"","d":"","f":[{"n":"CATEGORIA_ID","t":"INT"},{"n":"CODIGO_ARTICULO_INVENTARIO","t":"VARCHAR(20)"},{"n":"CONSECUTIVO","t":"VARCHAR(20)"},{"n":"CREADO_POR","t":"VARCHAR(250)"},{"n":"DESCRIPCION","t":"VARCHAR(250)"},{"n":"ESTADO","t":"VARCHAR(1)"},{"n":"FECHA_CREACION","t":"DATETIME"},{"n":"FECHA_MODIFICACION","t":"DATETIME"},{"n":"MODIFICADO_POR","t":"VARCHAR(250)"}]},"ITS_ESTADOS_TSMP":{"m":"","d":"","f":[{"n":"ASUNTO_CORREO","t":"VARCHAR"},{"n":"CUERPO_CORREO","t":"VARCHAR"},{"n":"ESTADO","t":"VARCHAR(1)"},{"n":"ETIQUETA","t":"VARCHAR(50)"}]},"ITS_EVENTO_TIPO_CAJA":{"m":"","d":"","f":[{"n":"CLASIFICACION_EVENTO","t":"VARCHAR(50)"},{"n":"TIPO_CAJA","t":"VARCHAR(50)"}]},"ITS_EXTENCION_EXPEDIENTE":{"m":"","d":"","f":[{"n":"CLIENTE","t":"VARCHAR(200)"},{"n":"FECHA_REGISTRO","t":"DATETIME"},{"n":"PROPIEDAD_0","t":"VARCHAR(200)"},{"n":"PROPIEDAD_1","t":"VARCHAR(200)"},{"n":"PROPIEDAD_2","t":"VARCHAR(200)"},{"n":"PROPIEDAD_3","t":"VARCHAR(200)"},{"n":"PROPIEDAD_4","t":"VARCHAR(200)"},{"n":"PROPIEDAD_5","t":"VARCHAR(200)"},{"n":"PROPIEDAD_6","t":"VARCHAR(200)"},{"n":"PROPIEDAD_7","t":"VARCHAR(200)"},{"n":"PROPIEDAD_8","t":"VARCHAR(200)"},{"n":"PROPIEDAD_9","t":"VARCHAR(200)"}]},"ITS_FALLAS":{"m":"","d":"","f":[{"n":"ACTIVID_PADRE","t":"INT"},{"n":"CODIGO_FALLA","t":"INT"},{"n":"DESCRIPCION","t":"VARCHAR(200)"},{"n":"DURACION_PREDETERMINADA_ACTIVIDAD","t":"INT"},{"n":"ES_TEMPLATE","t":"VARCHAR(1)"},{"n":"INSTANCIA","t":"VARCHAR(50)"},{"n":"TIEMPO_ESTIMADO","t":"DECIMAL"},{"n":"TIPO_ACTIVIDAD","t":"VARCHAR(1)"}]},"ITS_FECHAS_ACTIVIDAD":{"m":"","d":"","f":[{"n":"COMENTARIO","t":"TEXT"},{"n":"FECHA_HORA_INGRESO","t":"DATETIME"},{"n":"FECHA_HORA_SALIDA","t":"DATETIME"},{"n":"ID","t":"INT"},{"n":"ID_ACTIVIDAD","t":"INT"},{"n":"ID_ORDEN","t":"VARCHAR(12)"},{"n":"STAMP","t":"DATETIME"},{"n":"TIEMPO_DURACION","t":"VARCHAR(20)"},{"n":"USUARIO","t":"VARCHAR(249)"},{"n":"USUARIO_ASIGNADO","t":"VARCHAR(249)"}]},"ITS_GEOLOCALIZACION":{"m":"","d":"","f":[{"n":"CANTON","t":"VARCHAR(2)"},{"n":"CATEGORIA_CLIENTE","t":"VARCHAR(8)"},{"n":"DIRECCION_ENTREGA","t":"VARCHAR(500)"},{"n":"DISTRITO","t":"VARCHAR(2)"},{"n":"DOCUMENTO","t":"VARCHAR(20)"},{"n":"EMAIL_FE","t":"VARCHAR(100)"},{"n":"EMPRESA","t":"VARCHAR(100)"},{"n":"LATITUD","t":"VARCHAR(50)"},{"n":"LONGITUD","t":"TEXT"},{"n":"NIT","t":"VARCHAR(20)"},{"n":"PERSONA_QUE_RECIBE","t":"VARCHAR(200)"},{"n":"PROVINCIA","t":"VARCHAR(2)"},{"n":"TELEFONO","t":"VARCHAR(40)"},{"n":"TELEFONO_PERSONA_QUE_RECIBE","t":"VARCHAR(40)"},{"n":"TIPO","t":"VARCHAR(20)"},{"n":"UsarNombreEmpresaFE","t":"BIT"}]},"ITS_GUIAS_CONTENEDOR":{"m":"","d":"","f":[{"n":"CONTENEDOR","t":"VARCHAR(50)"},{"n":"GUIA_DESPACHO","t":"INT"},{"n":"STAMP","t":"DATETIME"}]},"ITS_GUIAS_DESPACHO":{"m":"","d":"","f":[{"n":"COMENTARIO","t":"TEXT"},{"n":"ESTADO","t":"VARCHAR(1)"},{"n":"FECHA_HORA","t":"DATETIME"},{"n":"FECHA_HORA_ESTIMADA","t":"DATETIME"},{"n":"GUIA_DESPACHO","t":"INT"},{"n":"PESO","t":"DECIMAL"},{"n":"PUNTO_EMBARQUE","t":"INT"},{"n":"TIENE_TLC","t":"VARCHAR(1)"},{"n":"TIPO_COMENTARIO","t":"VARCHAR(1)"},{"n":"VOLUMEN","t":"DECIMAL"}]},"ITS_GUIAS_ORDEN":{"m":"","d":"","f":[{"n":"GUIA_DESPACHO","t":"INT"},{"n":"ORDEN_COMPRA","t":"VARCHAR(10)"},{"n":"ORDEN_COMPRA_LINEA","t":"INT"}]},"ITS_HABITACIONES":{"m":"","d":"","f":[{"n":"ARTICULO_EX","t":"VARCHAR(50)"},{"n":"CLASIFICACION_1","t":"VARCHAR(100)"},{"n":"CLASIFICACION_2","t":"VARCHAR(100)"},{"n":"CLASIFICACION_3","t":"VARCHAR(100)"},{"n":"CLASIFICACION_4","t":"VARCHAR(100)"},{"n":"CLASIFICACION_5","t":"VARCHAR(100)"},{"n":"ESTADO","t":"VARCHAR(1)"},{"n":"IdHAB","t":"INT"},{"n":"NUMERO_HABITACION","t":"VARCHAR(10)"}]},"ITS_LINEA_CONSOLIDADO":{"m":"","d":"","f":[{"n":"CODIGO_ARTICULO","t":"VARCHAR(20)"},{"n":"CODIGO_PEDIDO","t":"VARCHAR(20)"},{"n":"ID_CONSOLIDADO","t":"INT"}]},"ITS_MARCA_EQUIPO":{"m":"","d":"","f":[{"n":"ESTADO_MARCA","t":"VARCHAR(1)"},{"n":"ID_MARCA_EQUIPO","t":"VARCHAR(10)"},{"n":"ID_TIPO_EQUIPO","t":"VARCHAR(10)"},{"n":"MARCA_EQUIPO","t":"VARCHAR(30)"}]},"ITS_MENSAJES":{"m":"","d":"","f":[{"n":"ASUNTO","t":"VARCHAR"},{"n":"COPIA_CORREO","t":"VARCHAR"},{"n":"DESTINO","t":"VARCHAR(160)"},{"n":"DUENO","t":"VARCHAR(150)"},{"n":"ENVIADO","t":"VARCHAR(1)"},{"n":"FECHA_HORA_CREADO","t":"DATETIME"},{"n":"FECHA_HORA_ENVIADO","t":"DATETIME"},{"n":"ID","t":"INT"},{"n":"MENSAJE","t":"TEXT"},{"n":"REFERENCIA","t":"VARCHAR(255)"},{"n":"TIPO","t":"VARCHAR(1)"}]},"ITS_MODELO_EQUIPO":{"m":"","d":"","f":[{"n":"ESTADO_MODELO","t":"VARCHAR(1)"},{"n":"ID_MARCA_EQUIPO","t":"VARCHAR(10)"},{"n":"ID_MODELO_EQUIPO","t":"VARCHAR(10)"},{"n":"MODELO_EQUIPO","t":"VARCHAR(70)"}]},"ITS_NIVELES_MENU":{"m":"","d":"","f":[{"n":"ACTIVO","t":"BIT"},{"n":"DESCRIPCION","t":"VARCHAR(250)"},{"n":"ID_NIVEL","t":"INT"},{"n":"ID_NIVEL_PADRE","t":"INT"},{"n":"ID_OPCION","t":"INT"},{"n":"PRIORIDAD","t":"INT"}]},"ITS_NOTAS_DOCUMENTO":{"m":"","d":"","f":[{"n":"COMENTARIO","t":"TEXT"},{"n":"ID_COMENTARIO","t":"INT"},{"n":"ID_DOCUMENTO","t":"INT"},{"n":"TIPO_COMENTARIO","t":"VARCHAR(1)"},{"n":"USUARIO","t":"VARCHAR(249)"}]},"ITS_NOTAS_GUIA_EMB":{"m":"","d":"","f":[{"n":"COMENTARIO","t":"TEXT"},{"n":"GUIA_DESPACHO","t":"INT"},{"n":"ID_COMENTARIO","t":"INT"},{"n":"TIPO","t":"VARCHAR(1)"},{"n":"TIPO_COMENTARIO","t":"VARCHAR(1)"},{"n":"USUARIO","t":"VARCHAR(249)"}]},"ITS_NOTIFICACIONES":{"m":"","d":"","f":[{"n":"CLASIFICACION","t":"VARCHAR(20)"},{"n":"ESTADO","t":"VARCHAR(1)"},{"n":"ID_NOTIFICATION","t":"INT"},{"n":"MENSAJE","t":"VARCHAR"},{"n":"PRIORIDAD","t":"INT"},{"n":"URL","t":"VARCHAR"},{"n":"USUARIO","t":"VARCHAR(250)"}]},"ITS_OPCIONES":{"m":"","d":"","f":[{"n":"ACTIVO","t":"BIT"},{"n":"CONTROLADOR","t":"VARCHAR(50)"},{"n":"DESCRIPCION","t":"VARCHAR"},{"n":"ID_OPCION","t":"INT"},{"n":"METODO","t":"VARCHAR(100)"},{"n":"NOMBRE","t":"VARCHAR(250)"}]},"ITS_OPORTUNIDAD_ESTADO":{"m":"","d":"","f":[{"n":"AVANCE","t":"INT"},{"n":"CODIGO_ESTADO","t":"VARCHAR(10)"},{"n":"ESTADO","t":"VARCHAR(50)"},{"n":"INDICE","t":"INT"}]},"ITS_OPORTUNIDAD_REFERENCIA":{"m":"","d":"","f":[{"n":"CODIGO_REFERENCIA","t":"VARCHAR(10)"},{"n":"ESTADO","t":"VARCHAR(1)"},{"n":"INDICE","t":"INT"},{"n":"REFERENCIA","t":"VARCHAR(100)"}]},"ITS_OPORTUNIDAD_TITULO":{"m":"","d":"","f":[{"n":"CODIGO_TITULO","t":"VARCHAR(10)"},{"n":"ESTADO","t":"VARCHAR(1)"},{"n":"INDICE","t":"INT"},{"n":"TITULO","t":"VARCHAR(100)"}]},"ITS_OPORTUNIDADES":{"m":"","d":"","f":[{"n":"ACTIVO","t":"VARCHAR(1)"},{"n":"DESCRIPCION","t":"VARCHAR(250)"},{"n":"DETALLE_FUENTE","t":"VARCHAR(250)"},{"n":"EMPRESA","t":"VARCHAR(70)"},{"n":"ESTADO","t":"VARCHAR(50)"},{"n":"FECHA_CIERRE","t":"DATETIME"},{"n":"FECHA_MODIFICACION","t":"DATETIME"},{"n":"FECHA_REGISTRO","t":"DATETIME"},{"n":"ID","t":"INT"},{"n":"ID_CLIENTE","t":"VARCHAR(50)"},{"n":"ID_CONTACTO","t":"VARCHAR(20)"},{"n":"INGRESO_ESTIMADO","t":"FLOAT"},{"n":"STAMP","t":"DATETIME"},{"n":"TIPO_FUENTE","t":"VARCHAR(50)"},{"n":"TITULO","t":"VARCHAR(50)"},{"n":"USUARIO_ASIGNADO","t":"VARCHAR(249)"},{"n":"USUARIO_CREACION","t":"VARCHAR(249)"},{"n":"USUARIO_MODIFICACION","t":"VARCHAR(249)"}]},"ITS_OPORTUNIDADES_AREAS":{"m":"","d":"","f":[{"n":"ESTADO","t":"VARCHAR(1)"},{"n":"ID_AREA","t":"VARCHAR(10)"},{"n":"INDICE","t":"INT"},{"n":"NOMBRE","t":"VARCHAR(100)"}]},"ITS_OPORTUNIDADES_ESTADOS":{"m":"","d":"","f":[{"n":"AVANCE","t":"INT"},{"n":"ESTADO","t":"VARCHAR(1)"},{"n":"ID_ESTADO","t":"VARCHAR(10)"},{"n":"INDICE","t":"INT"},{"n":"NOMBRE","t":"VARCHAR(50)"}]},"ITS_OPORTUNIDADES_FUENTES":{"m":"","d":"","f":[{"n":"ESTADO","t":"VARCHAR(1)"},{"n":"ID_FUENTE","t":"VARCHAR(10)"},{"n":"INDICE","t":"INT"},{"n":"NOMBRE","t":"VARCHAR(100)"}]},"ITS_OPORTUNIDADES_PEDIDOS":{"m":"","d":"","f":[{"n":"ID_OPORTUNIDAD","t":"INT"},{"n":"ID_PEDIDO","t":"VARCHAR(50)"}]},"ITS_ORDEN_COMPRA_PEDIDO":{"m":"","d":"Órdenes de compra a proveedores: artículos, cantidades y condiciones.","f":[{"n":"ARTICULO","t":"VARCHAR(20)"},{"n":"CANTIDAD","t":"INT"},{"n":"CLIENTE","t":"VARCHAR(20)"},{"n":"ESTADO","t":"VARCHAR(1)"},{"n":"ORDEN_COMPRA","t":"VARCHAR(10)"},{"n":"ORDEN_COMPRA_LINEA","t":"INT"},{"n":"PEDIDO","t":"VARCHAR(50)"},{"n":"PEDIDO_LINEA","t":"INT"}]},"ITS_ORDEN_MEETING":{"m":"","d":"","f":[{"n":"EMAIL","t":"VARCHAR(249)"},{"n":"ID_MEETING","t":"VARCHAR(120)"},{"n":"ID_ORDEN_SERVICIO","t":"VARCHAR(12)"}]},"ITS_ORDEN_SERVICIO":{"m":"","d":"","f":[{"n":"ACCESORIOS","t":"TEXT"},{"n":"ACTIVO","t":"VARCHAR(1)"},{"n":"AGENTE_RECEPTOR","t":"VARCHAR(50)"},{"n":"CODIGO_CLIENTE","t":"VARCHAR(20)"},{"n":"CODIGO_EQUIPO","t":"VARCHAR(10)"},{"n":"CODIGO_PEDIDO","t":"VARCHAR(20)"},{"n":"EJECUTIVO_ASIGNADO","t":"VARCHAR(50)"},{"n":"EMAIL_CLIENTE","t":"VARCHAR(200)"},{"n":"ESTADO","t":"VARCHAR(1)"},{"n":"ESTADO_PRESUPUESTO","t":"VARCHAR(20)"},{"n":"FALLA_EQUIPO","t":"TEXT"},{"n":"FECHA_HORA_CREACION","t":"DATETIME"},{"n":"FECHA_HORA_ENTREGADO","t":"DATETIME"},{"n":"FECHA_HORA_PROMETIDO","t":"DATETIME"},{"n":"FECHA_HORA_TERMINADO","t":"DATETIME"},{"n":"GARANTIA_EQUIPO","t":"VARCHAR(10)"},{"n":"ID_MEETING","t":"VARCHAR(120)"},{"n":"ID_ORDEN_SERVICIO","t":"VARCHAR(12)"},{"n":"INFORME_TECNICO","t":"TEXT"},{"n":"PROXIMA_FECHA_REVISION","t":"DATETIME"},{"n":"RUBRO_1","t":"VARCHAR(100)"},{"n":"RUBRO_2","t":"VARCHAR(100)"},{"n":"RUBRO_3","t":"VARCHAR(100)"},{"n":"RUBRO1","t":"VARCHAR(50)"},{"n":"RUBRO2","t":"VARCHAR(50)"}]},"ITS_ORDEN_SERVICIO_NOTAS":{"m":"","d":"","f":[{"n":"COMENTARIO","t":"TEXT"},{"n":"ID","t":"INT"},{"n":"ID_ORDEN_SERVICIO","t":"VARCHAR(12)"},{"n":"STAMP","t":"DATETIME"},{"n":"TIPO","t":"VARCHAR(12)"},{"n":"USUARIO","t":"VARCHAR(249)"}]},"ITS_OS_PRESUPUESTO_TEC":{"m":"","d":"Cabecera de presupuesto anual por empresa y escenario.","f":[{"n":"CANTIDAD","t":"DECIMAL"},{"n":"COD_PRESUPUESTO","t":"VARCHAR(50)"},{"n":"COD_TECNICO","t":"VARCHAR(50)"},{"n":"FECHA_CREACION","t":"DATETIME"},{"n":"FECHA_MODIFICACION","t":"DATETIME"},{"n":"ID_ACTIVIDAD","t":"INT"},{"n":"ID_ORDEN_SERVICIO","t":"VARCHAR(12)"},{"n":"LINEA_PRESUPUESTO","t":"INT"}]},"ITS_PARAMETROS_ALISTO":{"m":"","d":"Parámetros de configuración del módulo.","f":[{"n":"Bodega_Materia_Prima","t":"VARCHAR(30)"},{"n":"Consecutivo_Inventario_Alisto","t":"VARCHAR(30)"},{"n":"Costo_Hr_Estandar","t":"DECIMAL"},{"n":"Localizacion_Materia_Prima","t":"VARCHAR(30)"},{"n":"Nombre_Instancia","t":"VARCHAR(30)"},{"n":"Paquete_Inventario_Alisto","t":"VARCHAR(30)"}]},"ITS_PARAMETROS_CATALOG":{"m":"","d":"Parámetros de configuración del módulo.","f":[{"n":"Activar_Articulo_Con_Imp","t":"BIT"},{"n":"Activar_Minimos","t":"BIT"},{"n":"Agrupacion_Entrega","t":"VARCHAR(80)"},{"n":"BODEGAS","t":"VARCHAR(100)"},{"n":"CANT_IMG_PAGER_CATALOG","t":"INT"},{"n":"CANT_IMG_SLIDERSHOW","t":"INT"},{"n":"CATALOGO_PUBLICO","t":"VARCHAR(1)"},{"n":"CE_CONSECUTIVO_NIVELES_MENU","t":"VARCHAR(250)"},{"n":"CE_ETIQUETA_CLASIFICACION_A","t":"VARCHAR(100)"},{"n":"CE_ETIQUETA_CLASIFICACION_B","t":"VARCHAR(100)"},{"n":"CE_ETIQUETA_CLASIFICACION_C","t":"VARCHAR(100)"},{"n":"CE_ETIQUETA_CLASIFICACION_D","t":"VARCHAR(100)"},{"n":"CE_NAVEGACION_CON_IMAGEN_NIVEL_1","t":"BIT"},{"n":"CE_NAVEGACION_CON_IMAGEN_NIVEL_2","t":"BIT"},{"n":"CE_NAVEGACION_CON_IMAGEN_NIVEL_3","t":"BIT"},{"n":"CE_REEMPLAZAR_ICONO_ETIQUETA_NIVEL_1","t":"BIT"},{"n":"CE_REEMPLAZAR_ICONO_ETIQUETA_NIVEL_2","t":"BIT"},{"n":"CE_REEMPLAZAR_ICONO_ETIQUETA_NIVEL_3","t":"BIT"},{"n":"CLASIFICACION_1","t":"VARCHAR(12)"},{"n":"CLASIFICACION_2","t":"VARCHAR(12)"},{"n":"CLASIFICACION_3","t":"VARCHAR(12)"},{"n":"CLASIFICACION_4","t":"VARCHAR(12)"},{"n":"CLASIFICACION_5","t":"VARCHAR(12)"},{"n":"CLASIFICACION_6","t":"VARCHAR(12)"},{"n":"Codigo_Articulo_Flete","t":"VARCHAR(80)"}]},"ITS_PARAMETROS_CG":{"m":"","d":"Parámetros de configuración del módulo.","f":[{"n":"ANIO_ULTIMO_CERRADO","t":"DATETIME"},{"n":"CUENTA_MAYOR_BANCO","t":"VARCHAR(10)"},{"n":"ID","t":"INT"},{"n":"ID_CAJA_GASTOS","t":"VARCHAR(10)"},{"n":"ID_CAJA_PROVEDORES","t":"VARCHAR(10)"},{"n":"ID_CAJA_SIN_BANCO","t":"VARCHAR(10)"},{"n":"ID_TRANSACION_GASTOS","t":"VARCHAR(10)"},{"n":"ID_TRANSACION_PROVEDOR","t":"VARCHAR(10)"},{"n":"INSTANCIA","t":"VARCHAR(40)"},{"n":"MES_INICIO","t":"DATETIME"},{"n":"MES_ULTIMO","t":"DATETIME"},{"n":"TCC_ETIQ1","t":"VARCHAR(30)"},{"n":"TCC_ETIQ2","t":"VARCHAR(30)"},{"n":"TCC_ETIQ3","t":"VARCHAR(30)"},{"n":"TCC_ETIQ4","t":"VARCHAR(30)"},{"n":"TCC_ETIQ5","t":"VARCHAR(30)"},{"n":"TCC_ETIQ6","t":"VARCHAR(30)"},{"n":"TCC_ETIQ7","t":"VARCHAR(30)"},{"n":"TCC_ETIQ8","t":"VARCHAR(30)"},{"n":"TCC_ETIQ9","t":"VARCHAR(30)"}]},"ITS_PARAMETROS_FAC":{"m":"","d":"Parámetros de configuración del módulo.","f":[{"n":"BAC_Compra_Click","t":"VARCHAR(300)"},{"n":"CE_ACTIVA_FACTURA_ELECTRONICA","t":"VARCHAR(1)"},{"n":"CE_CONSECUTIVODEV","t":"VARCHAR(100)"},{"n":"CE_ConsecutivoFac","t":"VARCHAR(50)"},{"n":"CE_ConsecutivoTiq","t":"VARCHAR(20)"},{"n":"CE_ESTRUCT_FE_SOFTLAND","t":"VARCHAR(1)"},{"n":"CE_FormatoImpresion","t":"VARCHAR(3)"},{"n":"CE_FORMATOIMPRESION_CREDITO","t":"VARCHAR(1)"},{"n":"CE_Generar_Factura","t":"VARCHAR(1)"},{"n":"CE_IdFac","t":"INT"},{"n":"CE_LOCALIZACION_SOFTLAND","t":"BIT"},{"n":"CE_LTRIBUTA_C1","t":"VARCHAR"},{"n":"CE_LTRIBUTA_C2","t":"VARCHAR"},{"n":"CE_PASSWORD_HACIENDA","t":"VARCHAR(200)"},{"n":"CE_PROCESOFACTURACION","t":"VARCHAR(1)"},{"n":"CE_USUARIO_HACIENDA","t":"VARCHAR(200)"},{"n":"CODIGO_SUCURSAL","t":"VARCHAR(10)"},{"n":"CONSECUTIVO_DESPACHO","t":"VARCHAR(20)"},{"n":"Desactivar_Despacho_Automatico","t":"BIT"},{"n":"Desactivar_Validacion_Impuesto_Cliente","t":"BIT"},{"n":"F_CONSECUTIVO_CTR_INV_DEV","t":"VARCHAR(100)"},{"n":"F_CONSECUTIVO_PAQUETE_INV_DEV","t":"VARCHAR(100)"},{"n":"F_FACTURA_SIN_EXISTENCIA","t":"BIT"},{"n":"F_OCULTAR_LTRIBUTARIA1_COTIZACION","t":"BIT"},{"n":"FE_CODIGO_ACTIVIDAD","t":"VARCHAR(50)"}]},"ITS_PARAMETROS_HR":{"m":"","d":"Parámetros de configuración del módulo.","f":[{"n":"CE_Estado_Pedido","t":"VARCHAR(1)"},{"n":"HO_articulo_hab_adicional","t":"VARCHAR(100)"},{"n":"HO_Hora_CheckIn","t":"DATETIME"},{"n":"HO_Hora_CheckOut","t":"DATETIME"},{"n":"HO_label_clasf1_hab","t":"VARCHAR(100)"},{"n":"HO_label_clasf2_hab","t":"VARCHAR(100)"},{"n":"HO_label_clasf3_hab","t":"VARCHAR(100)"},{"n":"HO_label_clasf4_hab","t":"VARCHAR(100)"},{"n":"HO_label_clasf5_hab","t":"VARCHAR(100)"},{"n":"NOMBRE_INSTANCIA","t":"VARCHAR(100)"},{"n":"RE_tiempo_naranja","t":"VARCHAR(100)"},{"n":"RE_tiempo_rojo","t":"VARCHAR(100)"},{"n":"RE_tiempo_verde","t":"VARCHAR(100)"}]},"ITS_PC_NIVELES":{"m":"","d":"Tabla de catálogo/maestro de referencia con código y descripción.","f":[{"n":"ACTIVO","t":"BIT"},{"n":"COD_NIVEL","t":"VARCHAR(20)"},{"n":"COD_PADRE","t":"VARCHAR(20)"},{"n":"DESCRIPCION","t":"VARCHAR(250)"},{"n":"FOTO","t":"VARBINARY"},{"n":"ID_NIVEL","t":"INT"},{"n":"PRIORIDAD","t":"INT"}]},"ITS_Pedido_Estado":{"m":"","d":"","f":[{"n":"ESTADO","t":"VARCHAR(100)"},{"n":"PEDIDO","t":"VARCHAR(50)"},{"n":"ULTIMA_MODIFICACION","t":"DATETIME"}]},"ITS_PRESUPUESTO":{"m":"","d":"Cabecera de presupuesto anual por empresa y escenario.","f":[{"n":"CODIGO_ORDEN","t":"VARCHAR(50)"},{"n":"CODIGO_PRESUPESTO","t":"VARCHAR(50)"},{"n":"ESTADO_ENTREGADO","t":"VARCHAR(1)"}]},"ITS_PRESUPUESTO_CATEGORIA":{"m":"","d":"Cabecera de presupuesto anual por empresa y escenario.","f":[{"n":"DESCRIPCION","t":"TEXT"},{"n":"ESTADO","t":"VARCHAR(10)"},{"n":"FECHA_HORA_APROBACION","t":"DATETIME"},{"n":"FECHA_HORA_CREACION","t":"DATETIME"},{"n":"FECHA_HORA_ULTIMA_MODIFICACION","t":"DATETIME"},{"n":"ID_PRESUPUESTO","t":"INT"},{"n":"RESPONSABLE","t":"VARCHAR(249)"},{"n":"USUARIO","t":"VARCHAR(249)"},{"n":"USUARIO_APROBACION","t":"VARCHAR(249)"},{"n":"USUARIO_CREACION","t":"VARCHAR(249)"},{"n":"USUARIO_ULTIMA_MODIFICACION","t":"VARCHAR(249)"}]},"ITS_PRESUPUESTO_CATEGORIA_DETALLE":{"m":"","d":"Cabecera de presupuesto anual por empresa y escenario.","f":[{"n":"ID_CATEGORIA","t":"VARCHAR(12)"},{"n":"ID_DETALLE","t":"INT"},{"n":"ID_PRESUPUESTO_MENSUAL","t":"INT"},{"n":"VALOR_PRESUPUESTADO","t":"INT"}]},"ITS_PRESUPUESTO_MENSUAL":{"m":"","d":"Cabecera de presupuesto anual por empresa y escenario.","f":[{"n":"ID_PRESUPUESTO","t":"INT"},{"n":"ID_PRESUPUESTO_MENSUAL","t":"INT"},{"n":"MES","t":"VARCHAR(10)"}]},"ITS_PROVINCIA":{"m":"","d":"","f":[{"n":"NOMBRE_PROVINCIA","t":"VARCHAR(30)"},{"n":"NUMERO_PROVINCIA","t":"VARCHAR(2)"}]},"ITS_PUNTO_EMBARQUE":{"m":"","d":"Embarques de importación: proveedor, origen, fechas y costos totales.","f":[{"n":"CONTACTO","t":"VARCHAR(50)"},{"n":"DIRECCION","t":"TEXT"},{"n":"DIVISION_GEOGRAFICA1","t":"VARCHAR(12)"},{"n":"E_MAIL","t":"VARCHAR(249)"},{"n":"ESTADO","t":"VARCHAR(1)"},{"n":"ID_PUNTO_EMBARQUE","t":"INT"},{"n":"LATITUD","t":"VARCHAR(50)"},{"n":"LONGITUD","t":"VARCHAR(50)"},{"n":"NOMBRE_PUNTO_EMBARQUE","t":"VARCHAR(80)"},{"n":"PAIS","t":"VARCHAR(4)"},{"n":"REGION","t":"VARCHAR(4)"},{"n":"TELEFONO_1","t":"VARCHAR(50)"},{"n":"TELEFONO_2","t":"VARCHAR(50)"}]},"ITS_REGISTRO_MARCAS":{"m":"","d":"","f":[{"n":"COMENTARIO","t":"VARCHAR(150)"},{"n":"FECHA_HORA_ENTRADA","t":"DATETIME"},{"n":"FECHA_HORA_SALIDA","t":"DATETIME"},{"n":"UBICACION_GPS","t":"VARCHAR(50)"},{"n":"USUARIO","t":"VARCHAR(249)"}]},"ITS_REPORTE_HISTORIAL":{"m":"","d":"","f":[{"n":"ABRIL","t":"DECIMAL"},{"n":"ABRILPV","t":"DECIMAL"},{"n":"AGOSTO","t":"DECIMAL"},{"n":"AGOSTOPV","t":"DECIMAL"},{"n":"ART_PROVEEDOR","t":"VARCHAR(20)"},{"n":"ARTICULO","t":"VARCHAR(20)"},{"n":"BODEGAS","t":"VARCHAR(60)"},{"n":"CANTIDAD","t":"INT"},{"n":"CLASIFICACIONES","t":"VARCHAR"},{"n":"COMENTARIO","t":"TEXT"},{"n":"CONSUMOSTOTALES","t":"DECIMAL"},{"n":"COSTOPROMEDIO","t":"VARCHAR(20)"},{"n":"DESCRIPCION","t":"VARCHAR(100)"},{"n":"DICIEMBRE","t":"DECIMAL"},{"n":"DICIEMBREPV","t":"DECIMAL"},{"n":"ENERO","t":"DECIMAL"},{"n":"ENEROPV","t":"DECIMAL"},{"n":"EXISTENCIAS","t":"DECIMAL"},{"n":"FEBRERO","t":"DECIMAL"},{"n":"FEBREROPV","t":"DECIMAL"},{"n":"FECHA","t":"VARCHAR(25)"},{"n":"JULIO","t":"DECIMAL"},{"n":"JULIOPV","t":"DECIMAL"},{"n":"JUNIO","t":"DECIMAL"},{"n":"JUNIOPV","t":"DECIMAL"}]},"ITS_REPORTE_PLANNING":{"m":"","d":"","f":[{"n":"ABRIL","t":"DECIMAL"},{"n":"ABRILPV","t":"DECIMAL"},{"n":"AGOSTO","t":"DECIMAL"},{"n":"AGOSTOPV","t":"DECIMAL"},{"n":"ART_PROVEEDOR","t":"VARCHAR(20)"},{"n":"ARTICULO","t":"VARCHAR(20)"},{"n":"BODEGAS","t":"VARCHAR(60)"},{"n":"CANTIDAD","t":"INT"},{"n":"CLASIFICACIONES","t":"VARCHAR"},{"n":"COMENTARIO","t":"TEXT"},{"n":"CONSUMOSTOTALES","t":"DECIMAL"},{"n":"COSTOPROMEDIO","t":"VARCHAR(20)"},{"n":"DESCRIPCION","t":"VARCHAR(100)"},{"n":"DICIEMBRE","t":"DECIMAL"},{"n":"DICIEMBREPV","t":"DECIMAL"},{"n":"ENERO","t":"DECIMAL"},{"n":"ENEROPV","t":"DECIMAL"},{"n":"EXISTENCIAS","t":"DECIMAL"},{"n":"FEBRERO","t":"DECIMAL"},{"n":"FEBREROPV","t":"DECIMAL"},{"n":"FECHA","t":"VARCHAR(25)"},{"n":"JULIO","t":"DECIMAL"},{"n":"JULIOPV","t":"DECIMAL"},{"n":"JUNIO","t":"DECIMAL"},{"n":"JUNIOPV","t":"DECIMAL"}]},"ITS_REPORTES":{"m":"","d":"","f":[{"n":"CLASIFICACION_REPORTE","t":"VARCHAR(10)"},{"n":"DESCRIPCION","t":"VARCHAR(100)"},{"n":"FECHA_ULT_MODIF","t":"DATETIME"},{"n":"ID_REPORTE","t":"INT"},{"n":"INSTANCIA","t":"VARCHAR(50)"},{"n":"NOMBRE","t":"VARCHAR(50)"},{"n":"STAMP","t":"DATETIME"},{"n":"TIPO_APLICACION","t":"VARCHAR(1)"},{"n":"TIPO_REPORTE","t":"VARCHAR(15)"},{"n":"URL","t":"VARCHAR(249)"},{"n":"USUARIO_CREADOR","t":"VARCHAR(249)"},{"n":"USUARIO_MODIF","t":"VARCHAR(249)"},{"n":"VER_EN_PESTANA_APARTE","t":"VARCHAR(1)"}]},"ITS_REPORTES_CLASIFICACION":{"m":"","d":"","f":[{"n":"CLASIFICACION_REPORTE","t":"INT"},{"n":"NOMBRE","t":"VARCHAR(70)"},{"n":"STAMP","t":"DATETIME"},{"n":"TIPO_APLICACION","t":"VARCHAR(1)"}]},"its_Reserva_Habitacion":{"m":"","d":"","f":[{"n":"idControl","t":"INT"},{"n":"idHab","t":"INT"}]},"ITS_SERIES_ARTICULOS":{"m":"","d":"Números de serie para control de activos serializados.","f":[{"n":"DISPONIBLE","t":"VARCHAR(1)"},{"n":"GARANTIA_MESES","t":"DECIMAL"},{"n":"ID_REGISTRO_INGRESO","t":"INT"},{"n":"SERIE","t":"VARCHAR(100)"}]},"ITS_SERIES_TRAZABILIDAD_ACTIVIDAD_EN_INVENTARIO":{"m":"","d":"Números de serie para control de activos serializados.","f":[{"n":"FECHA_VENCIMIENTO","t":"DATETIME"},{"n":"ID_DOCUMENTO","t":"VARCHAR(50)"},{"n":"ID_REGISTRO_ACTIVIDAD","t":"INT"},{"n":"SERIE","t":"VARCHAR(100)"},{"n":"STAMP_ACTIVIDAD","t":"DATETIME"},{"n":"TIPO_SALIDA","t":"VARCHAR(2)"}]},"ITS_SERIES_TRAZABILIDAD_INGRESO":{"m":"","d":"Números de serie para control de activos serializados.","f":[{"n":"CANTIDAD_REGISTRO_RECIBIDA","t":"DECIMAL"},{"n":"CODIGO_ARTICULO","t":"VARCHAR(20)"},{"n":"ID_EMBARQUE","t":"VARCHAR(10)"},{"n":"ID_LINEA_EMBARQUE","t":"INT"},{"n":"ID_REGISTRO_INGRESO","t":"INT"},{"n":"STAMP_INGRESO","t":"DATETIME"},{"n":"STAMP_MODIFICACION","t":"DATETIME"}]},"ITS_SFC_CAMPANAS":{"m":"","d":"","f":[{"n":"Agrupacion","t":"INT"},{"n":"CodigoCampana","t":"INT"},{"n":"FactorCupon","t":"INT"},{"n":"FechaVencimiento","t":"DATETIME"},{"n":"NombreCampana","t":"VARCHAR(250)"},{"n":"RedondeoArriba","t":"BIT"},{"n":"ValoresClasificacion","t":"VARCHAR"}]},"ITS_SUCURSALES":{"m":"","d":"","f":[{"n":"CODIGO_SUCURSAL","t":"INT"},{"n":"DESCRIPCION","t":"VARCHAR(50)"},{"n":"INSTANCIA","t":"VARCHAR(50)"}]},"ITS_TIPO_CONTRATO":{"m":"","d":"","f":[{"n":"DESCRIPCION","t":"VARCHAR"},{"n":"ID","t":"DECIMAL"}]},"ITS_TIPO_EQUIPO":{"m":"","d":"","f":[{"n":"ESTADO_TIPO_EQUIPO","t":"VARCHAR(1)"},{"n":"ID_TIPO_EQUIPO","t":"VARCHAR(10)"},{"n":"INSTANCIA","t":"VARCHAR(40)"},{"n":"TIPO_EQUIPO","t":"VARCHAR(30)"}]},"ITS_TRANS_CAJAS":{"m":"","d":"","f":[{"n":"ASIENTO","t":"VARCHAR(50)"},{"n":"CENTRO_COSTO","t":"VARCHAR(10)"},{"n":"CierreCaja","t":"VARCHAR(50)"},{"n":"CLASIFICACION_EVENTO","t":"VARCHAR(50)"},{"n":"COMENTARIO","t":"TEXT"},{"n":"CREADO","t":"DATETIME"},{"n":"CREADO_POR","t":"VARCHAR(50)"},{"n":"CUENTA_CUENTA","t":"VARCHAR(10)"},{"n":"DOC_FISCAL_ORIGINAL","t":"VARCHAR(50)"},{"n":"FECHA_TRANS","t":"DATETIME"},{"n":"ID_CAJA","t":"INT"},{"n":"ID_DOCUMENTO","t":"VARCHAR(50)"},{"n":"ID_TIPO_TRANSACION","t":"INT"},{"n":"ID_TRANS_CAJAS","t":"INT"},{"n":"IMPUESTO","t":"VARCHAR(50)"},{"n":"IMPUESTO_DOLARES","t":"DECIMAL"},{"n":"MODIFICADO","t":"DATETIME"},{"n":"MODIFICADO_POR","t":"VARCHAR(50)"},{"n":"MONEDA","t":"VARCHAR(3)"},{"n":"MONTO","t":"DECIMAL"},{"n":"MONTO_DOLARES","t":"DECIMAL"},{"n":"NIT_EMISOR","t":"VARCHAR(50)"},{"n":"ORIGEN","t":"VARCHAR(2)"},{"n":"STAMP","t":"DATETIME"},{"n":"TIPO","t":"VARCHAR(1)"}]},"ITS_TRANS_CIERRE_CAJA":{"m":"","d":"","f":[{"n":"BancoAsociado","t":"VARCHAR(50)"},{"n":"EFECTIVO_CONTA","t":"DECIMAL"},{"n":"ID_CAJA","t":"INT"},{"n":"ID_TRANS_CAJAS","t":"INT"},{"n":"ID_TRANS_CIERRE_CAJAS","t":"INT"},{"n":"MONTO","t":"DECIMAL"},{"n":"STAMP","t":"DATETIME"},{"n":"TIPO","t":"VARCHAR(1)"},{"n":"USUARIO","t":"VARCHAR(50)"}]},"ITS_TRANS_TIPOS":{"m":"","d":"","f":[{"n":"ACTIVA","t":"VARCHAR(1)"},{"n":"CENTRO_COSTO","t":"VARCHAR(10)"},{"n":"CREADO","t":"DATETIME"},{"n":"CREADO_POR","t":"VARCHAR(50)"},{"n":"CUENTA_CUENTA","t":"VARCHAR(250)"},{"n":"DESCRIPCION","t":"VARCHAR(250)"},{"n":"ID","t":"INT"},{"n":"MODIFICADO","t":"DATETIME"},{"n":"MODIFICADO_POR","t":"VARCHAR(50)"}]},"ITS_TRANSACCIONES_PAGO":{"m":"","d":"","f":[{"n":"CONTACTO_CREDITO","t":"VARCHAR(150)"},{"n":"CUENTA_PAYPAL","t":"VARCHAR(50)"},{"n":"ESTADO","t":"VARCHAR(1)"},{"n":"ID_DOCUMENTO","t":"VARCHAR(50)"},{"n":"MONTO_DE_PAGO","t":"DECIMAL"},{"n":"NOTAS","t":"VARCHAR"},{"n":"NUMERO_AUTORIZA_PAYPAL","t":"VARCHAR(80)"},{"n":"NUMERO_AUTORIZA_TARJETA","t":"VARCHAR(80)"},{"n":"STAMP","t":"DATETIME"},{"n":"TARJETA","t":"VARCHAR(50)"},{"n":"TIPO_DOCUMENTO","t":"VARCHAR(1)"},{"n":"TIPO_PAGO","t":"VARCHAR(10)"},{"n":"TOTAL_DOCUMENTO","t":"DECIMAL"},{"n":"USUARIO","t":"VARCHAR(249)"},{"n":"VUELTO_DE_PAGO","t":"DECIMAL"}]},"ITS_USUARIO_AGENDAS":{"m":"","d":"Usuarios del sistema: credenciales, perfil, estado y auditoría.","f":[{"n":"USU_ADMIN_AGENDA","t":"VARCHAR(249)"},{"n":"USU_AGENTE_AGENDA","t":"VARCHAR(249)"}]},"ITS_USUARIO_CAJAS":{"m":"","d":"Usuarios del sistema: credenciales, perfil, estado y auditoría.","f":[{"n":"ID_CAJA","t":"INT"},{"n":"USUARIO","t":"VARCHAR(50)"}]},"ITS_USUARIO_PRESUPUESTO":{"m":"","d":"Cabecera de presupuesto anual por empresa y escenario.","f":[{"n":"CORREO_ELECTRONICO","t":"VARCHAR(249)"},{"n":"ID_CLASIFICACION","t":"VARCHAR(12)"},{"n":"ID_PRESUPUESTO","t":"VARCHAR(50)"},{"n":"MES","t":"INT"},{"n":"MONTO_ASIGNADO","t":"DECIMAL"}]},"ITS_USUARIO_REPORTE":{"m":"","d":"Usuarios del sistema: credenciales, perfil, estado y auditoría.","f":[{"n":"REPORTE","t":"INT"},{"n":"USUARIO","t":"VARCHAR(249)"}]},"ITS_Vouchers_Lineas_Pedido":{"m":"","d":"","f":[{"n":"Agente","t":"VARCHAR(50)"},{"n":"Factura","t":"VARCHAR(20)"},{"n":"Fecha","t":"DATETIME"},{"n":"Hotel","t":"VARCHAR(30)"},{"n":"Nombre","t":"VARCHAR(50)"},{"n":"Numero","t":"INT"},{"n":"Observaciones","t":"VARCHAR(50)"},{"n":"Oficina_Agente","t":"VARCHAR(25)"},{"n":"Operador","t":"VARCHAR(50)"},{"n":"Pases","t":"INT"},{"n":"Servicio","t":"VARCHAR(50)"},{"n":"Tiempo_Recogido","t":"DATETIME"},{"n":"Ultimo_Estado","t":"VARCHAR(1)"}]},"ITS_WS_ATTACHMENTS":{"m":"","d":"","f":[{"n":"AttachmentFile","t":"VARCHAR"},{"n":"AttachmentName","t":"VARCHAR(250)"},{"n":"AttachmentType","t":"VARCHAR(20)"},{"n":"IdAttachment","t":"INT"},{"n":"IdEmail","t":"INT"}]},"ITS_WS_MENSAJES":{"m":"","d":"","f":[{"n":"EmailFrom","t":"VARCHAR"},{"n":"EmailMessage","t":"VARCHAR"},{"n":"EmailSubject","t":"VARCHAR"},{"n":"EmailTo","t":"VARCHAR"},{"n":"EmailType","t":"VARCHAR(1)"},{"n":"Enviado","t":"BIT"},{"n":"IdEmail","t":"INT"},{"n":"ReplyTo","t":"VARCHAR"},{"n":"Stamp","t":"DATETIME"}]},"JM_EMPLEADO_ACC_PER_7":{"m":"","d":"","f":[{"n":"APROBADA_POR","t":"VARCHAR(25)"},{"n":"CENTRO_COSTO","t":"VARCHAR(25)"},{"n":"DEPARTAMENTO","t":"VARCHAR(10)"},{"n":"DIAS_ACCION","t":"DECIMAL"},{"n":"EMPLEADO","t":"VARCHAR(20)"},{"n":"ESTADO_ACCION","t":"VARCHAR(1)"},{"n":"ESTADO_EMPLEADO","t":"VARCHAR(4)"},{"n":"FECHA","t":"DATETIME"},{"n":"FECHA_ANULACION","t":"DATETIME"},{"n":"FECHA_APLICACION","t":"DATETIME"},{"n":"FECHA_APROBACION","t":"DATETIME"},{"n":"FECHA_HORA","t":"DATETIME"},{"n":"FECHA_RIGE","t":"DATETIME"},{"n":"FECHA_VENCE","t":"DATETIME"},{"n":"FECHA_VIGENTE","t":"DATETIME"},{"n":"NOMINA","t":"VARCHAR(4)"},{"n":"NOTAS","t":"TEXT"},{"n":"NUMERO_ACCION","t":"INT"},{"n":"PLAZA","t":"VARCHAR(8)"},{"n":"PUESTO","t":"VARCHAR(8)"},{"n":"REGIMEN_VACACIONAL","t":"VARCHAR(12)"},{"n":"RUBRO1","t":"VARCHAR(40)"},{"n":"RUBRO2","t":"VARCHAR(40)"},{"n":"RUBRO3","t":"VARCHAR(40)"},{"n":"SALARIO_DIARIO_INT","t":"DECIMAL"}]},"LINEA_CONTEO_SINCRO":{"m":"","d":"Conteo físico de inventario para conciliación con existencias en sistema.","f":[{"n":"ARTICULO","t":"VARCHAR(20)"},{"n":"CANT_APROBADA","t":"DECIMAL"},{"n":"CANT_RECHAZADA","t":"DECIMAL"},{"n":"ID_PDA","t":"VARCHAR(15)"},{"n":"ID_SINCRO","t":"VARCHAR(15)"},{"n":"LINEA","t":"INT"},{"n":"MOTIVO_RECHAZO","t":"VARCHAR(30)"},{"n":"RECIBO","t":"VARCHAR(20)"},{"n":"SERIE_INICIAL","t":"VARCHAR(20)"}]},"LINEA_DEPOSITO":{"m":"CB","d":"","f":[{"n":"CUENTA_BANCO","t":"VARCHAR(20)"},{"n":"DOCUMENTO","t":"VARCHAR(20)"},{"n":"MONTO_CHEQUES","t":"DECIMAL"},{"n":"MONTO_EFECTIVO","t":"DECIMAL"},{"n":"NUMERO","t":"DECIMAL"},{"n":"REFERENCIAS","t":"VARCHAR(80)"},{"n":"TIPO_CB","t":"VARCHAR(3)"},{"n":"TIPO_CC","t":"VARCHAR(3)"}]},"LINEA_DOC_INV":{"m":"CI","d":"","f":[{"n":"AJUSTE_CONFIG","t":"VARCHAR(4)"},{"n":"ARTICULO","t":"VARCHAR(20)"},{"n":"BODEGA","t":"VARCHAR(4)"},{"n":"BODEGA_DESTINO","t":"VARCHAR(4)"},{"n":"CAI","t":"VARCHAR(50)"},{"n":"CANTIDAD","t":"DECIMAL"},{"n":"CENTRO_COSTO","t":"VARCHAR(25)"},{"n":"COSTO_TOTAL_DOLAR","t":"DECIMAL"},{"n":"COSTO_TOTAL_DOLAR_COMP","t":"DECIMAL"},{"n":"COSTO_TOTAL_LOCAL","t":"DECIMAL"},{"n":"COSTO_TOTAL_LOCAL_COMP","t":"DECIMAL"},{"n":"CUENTA_CONTABLE","t":"VARCHAR(25)"},{"n":"DOCUMENTO_INV","t":"VARCHAR(50)"},{"n":"GEN_DOC_ELE","t":"VARCHAR(1)"},{"n":"LINEA_DOC_INV","t":"INT"},{"n":"LOCALIZACION","t":"VARCHAR(8)"},{"n":"LOCALIZACION_DEST","t":"VARCHAR(8)"},{"n":"LOTE","t":"VARCHAR(15)"},{"n":"NIT","t":"VARCHAR(20)"},{"n":"PAQUETE_INVENTARIO","t":"VARCHAR(4)"},{"n":"PRECIO_TOTAL_DOLAR","t":"DECIMAL"},{"n":"PRECIO_TOTAL_LOCAL","t":"DECIMAL"},{"n":"SECUENCIA","t":"DATETIME"},{"n":"SERIE_CADENA","t":"INT"},{"n":"SUBSUBTIPO","t":"VARCHAR(1)"}]},"LINEA_DOC_INV_ABRE":{"m":"CI","d":"","f":[{"n":"AJUSTE_CONFIG","t":"VARCHAR(4)"},{"n":"ARTICULO","t":"VARCHAR(20)"},{"n":"BODEGA","t":"VARCHAR(4)"},{"n":"BODEGA_DESTINO","t":"VARCHAR(4)"},{"n":"CANTIDAD","t":"DECIMAL"},{"n":"CENTRO_COSTO","t":"VARCHAR(25)"},{"n":"COSTO_TOTAL_DOLAR","t":"DECIMAL"},{"n":"COSTO_TOTAL_LOCAL","t":"DECIMAL"},{"n":"CUENTA_CONTABLE","t":"VARCHAR(25)"},{"n":"DOCUMENTO_INV","t":"VARCHAR(50)"},{"n":"LINEA_DOC_INV","t":"INT"},{"n":"LOCALIZACION","t":"VARCHAR(8)"},{"n":"LOCALIZACION_DEST","t":"VARCHAR(8)"},{"n":"LOTE","t":"VARCHAR(15)"},{"n":"NIT","t":"VARCHAR(20)"},{"n":"PAQUETE_INVENTARIO","t":"VARCHAR(4)"},{"n":"PRECIO_TOTAL_DOLAR","t":"DECIMAL"},{"n":"PRECIO_TOTAL_LOCAL","t":"DECIMAL"},{"n":"SECUENCIA","t":"DATETIME"},{"n":"SERIE_CADENA","t":"INT"},{"n":"SUBSUBTIPO","t":"VARCHAR(1)"},{"n":"SUBTIPO","t":"VARCHAR(1)"},{"n":"TIPO","t":"VARCHAR(1)"},{"n":"UNIDAD_DISTRIBUCIO","t":"VARCHAR(6)"}]},"LINEA_DOC_INV_SINCRO":{"m":"","d":"","f":[{"n":"AJUSTE_CONFIG","t":"VARCHAR(4)"},{"n":"ARTICULO","t":"VARCHAR(20)"},{"n":"BODEGA","t":"VARCHAR(4)"},{"n":"BODEGA_DESTINO","t":"VARCHAR(4)"},{"n":"CANTIDAD","t":"DECIMAL"},{"n":"CENTRO_COSTO","t":"VARCHAR(25)"},{"n":"COSTO_TOTAL_DOLAR","t":"DECIMAL"},{"n":"COSTO_TOTAL_LOCAL","t":"DECIMAL"},{"n":"DOCUMENTO_INV","t":"VARCHAR(50)"},{"n":"ID_PDA","t":"VARCHAR(15)"},{"n":"ID_SINCRO","t":"VARCHAR(15)"},{"n":"LINEA_DOC_INV","t":"INT"},{"n":"LOCALIZACION","t":"VARCHAR(8)"},{"n":"LOCALIZACION_DEST","t":"VARCHAR(8)"},{"n":"LOTE","t":"VARCHAR(15)"},{"n":"NIT","t":"VARCHAR(20)"},{"n":"PAQUETE_INVENTARIO","t":"VARCHAR(4)"},{"n":"PRECIO_TOTAL_DOLAR","t":"DECIMAL"},{"n":"PRECIO_TOTAL_LOCAL","t":"DECIMAL"},{"n":"SECUENCIA","t":"DATETIME"},{"n":"SERIE_CADENA","t":"INT"},{"n":"SUBSUBTIPO","t":"VARCHAR(1)"},{"n":"SUBTIPO","t":"VARCHAR(1)"},{"n":"TIPO","t":"VARCHAR(1)"},{"n":"USUARIO","t":"VARCHAR(50)"}]},"LINEASPEDIDO_EDI":{"m":"FA","d":"","f":[{"n":"CANTIDAD_DESPACHADA","t":"DECIMAL"},{"n":"CANTIDAD_PEDIDA","t":"DECIMAL"},{"n":"CANTIDAD_RECIBIDA","t":"DECIMAL"},{"n":"DUN14","t":"VARCHAR(18)"},{"n":"GLN_COMPRADOR","t":"VARCHAR(13)"},{"n":"MONTO_DESCUENTO1","t":"DECIMAL"},{"n":"MONTO_DESCUENTO2","t":"DECIMAL"},{"n":"MONTO_IMPUESTO1","t":"DECIMAL"},{"n":"MONTO_IMPUESTO2","t":"DECIMAL"},{"n":"NUMEROLINEA","t":"INT"},{"n":"NUMEROORDEN","t":"VARCHAR(30)"},{"n":"PEDIDO","t":"VARCHAR(50)"},{"n":"PORCENTAJE_DESCUENTO1","t":"DECIMAL"},{"n":"PORCENTAJE_DESCUENTO2","t":"DECIMAL"},{"n":"PORCENTAJE_IMPUESTO1","t":"DECIMAL"},{"n":"PORCENTAJE_IMPUESTO2","t":"DECIMAL"},{"n":"PRECIOUNITARIO","t":"DECIMAL"}]},"LIQUIDAC_COMPRA":{"m":"","d":"","f":[{"n":"CALCULA_ARANCEL","t":"VARCHAR(1)"},{"n":"ESTADO_LIQUIDAC","t":"VARCHAR(2)"},{"n":"FEC_HORA_ULT_MODIF","t":"DATETIME"},{"n":"FECHA_HORA_APROBAC","t":"DATETIME"},{"n":"FECHA_HORA_CALCULO","t":"DATETIME"},{"n":"FECHA_HORA_CANCELA","t":"DATETIME"},{"n":"FECHA_HORA_CREAC","t":"DATETIME"},{"n":"FECHA_LIQUIDAC","t":"DATETIME"},{"n":"IMP_REAL_DOLAR","t":"DECIMAL"},{"n":"IMP_REAL_LOCAL","t":"DECIMAL"},{"n":"LIQUIDAC_COMPRA","t":"VARCHAR(15)"},{"n":"MONTO_FLETE_DOLAR","t":"DECIMAL"},{"n":"MONTO_FLETE_LOCAL","t":"DECIMAL"},{"n":"MONTO_OTROS_DOLAR","t":"DECIMAL"},{"n":"MONTO_OTROS_LOCAL","t":"DECIMAL"},{"n":"MONTO_SEGURO_DOLAR","t":"DECIMAL"},{"n":"MONTO_SEGURO_LOCAL","t":"DECIMAL"},{"n":"NOTAS","t":"TEXT"},{"n":"PRORRATEO_LIQUIDAC","t":"VARCHAR(2)"},{"n":"PROVEEDOR_LIQUIDAC","t":"VARCHAR(20)"},{"n":"REFERENCIA_LIQUID","t":"VARCHAR(20)"},{"n":"TIPO_CAMBIO_DOLAR","t":"DECIMAL"},{"n":"U_ADUANA","t":"VARCHAR(4)"},{"n":"U_FCH_DUA","t":"VARCHAR(20)"},{"n":"U_NO_AUTORIZACION","t":"VARCHAR(20)"}]},"LIQUIDAC_DETALLE":{"m":"","d":"","f":[{"n":"EMBARQUE","t":"VARCHAR(10)"},{"n":"EMBARQUE_LINEA","t":"INT"},{"n":"ETIQUETA","t":"VARCHAR(20)"},{"n":"LINEA","t":"INT"},{"n":"LIQUIDAC_COMPRA","t":"VARCHAR(15)"},{"n":"MONTO_DOLAR","t":"DECIMAL"},{"n":"MONTO_LOCAL","t":"DECIMAL"},{"n":"RUBRO","t":"VARCHAR(20)"}]},"LIQUIDAC_GASTO":{"m":"","d":"","f":[{"n":"ARTICULO","t":"VARCHAR(20)"},{"n":"DESCRIPCION","t":"VARCHAR(40)"},{"n":"DESTINO","t":"VARCHAR(2)"},{"n":"EMBARQUE","t":"VARCHAR(10)"},{"n":"ETIQUETA","t":"VARCHAR(20)"},{"n":"FACTURA","t":"VARCHAR(50)"},{"n":"FECHA_GASTO","t":"DATETIME"},{"n":"GASTO_COMPRA","t":"VARCHAR(10)"},{"n":"LINEA_EMBARQUE","t":"INT"},{"n":"LINEA_GASTO","t":"INT"},{"n":"LIQUIDAC_COMPRA","t":"VARCHAR(15)"},{"n":"MONEDA","t":"VARCHAR(4)"},{"n":"MONTO_GASTO","t":"DECIMAL"},{"n":"NIT","t":"VARCHAR(20)"},{"n":"PROVEEDOR_FACTURA","t":"VARCHAR(20)"},{"n":"SECUENCIA","t":"INT"},{"n":"TIPO_CAMBIO_DOLAR","t":"DECIMAL"},{"n":"TIPO_CAMBIO_LOCAL","t":"DECIMAL"},{"n":"TIPO_DOCUMENTO","t":"VARCHAR(2)"},{"n":"TIPO_PRORRATEO","t":"VARCHAR(2)"}]},"LIQUIDAC_MENSAJE":{"m":"","d":"","f":[{"n":"LIQUIDAC_COMPRA","t":"VARCHAR(15)"},{"n":"MENSAJE","t":"TEXT"}]},"LIQUIDACION":{"m":"CN","d":"","f":[{"n":"ASIENTO_CONTABLE","t":"VARCHAR(10)"},{"n":"CALCULA_PAGO_NOMINA","t":"VARCHAR(1)"},{"n":"CERRAR_CONTRATOS","t":"VARCHAR(1)"},{"n":"CUENTA_BANCO","t":"VARCHAR(20)"},{"n":"EMPLEADO","t":"VARCHAR(20)"},{"n":"ESTADO_LIQUIDAC","t":"VARCHAR(1)"},{"n":"FECHA_INGRESO","t":"DATETIME"},{"n":"FECHA_LIQUIDACION","t":"DATETIME"},{"n":"FECHA_RETIRO_PAGO","t":"DATETIME"},{"n":"FECHA_SALIDA","t":"DATETIME"},{"n":"FECHA_ULT_MODI","t":"DATETIME"},{"n":"FORMA_PAGO","t":"VARCHAR(1)"},{"n":"LIQUIDACION","t":"INT"},{"n":"MONEDA","t":"VARCHAR(4)"},{"n":"NOMINA_CALCULO","t":"VARCHAR(4)"},{"n":"NUMERO_ACCION","t":"INT"},{"n":"NUMERO_APARTADO","t":"INT"},{"n":"NUMERO_DOC_PAGO","t":"DECIMAL"},{"n":"NUMERO_EJERCIDO","t":"INT"},{"n":"NUMERO_NOMINA_CALCULO","t":"INT"},{"n":"OBSERVACIONES","t":"TEXT"},{"n":"PRESUPUESTO","t":"VARCHAR(20)"},{"n":"SUBTIPODOC_PAGO","t":"INT"},{"n":"UNIDAD_OPERATIVA","t":"VARCHAR(4)"},{"n":"USUARIO_LIQUIDAC","t":"VARCHAR(50)"}]},"LIQUIDACION_APORTE":{"m":"CN","d":"","f":[{"n":"CONCEPTO","t":"VARCHAR(20)"},{"n":"FECHA_LIQUIDAC","t":"DATETIME"},{"n":"LIQUIDACION","t":"INT"},{"n":"MONEDA","t":"VARCHAR(4)"},{"n":"TIPO_CAMBIO","t":"DECIMAL"},{"n":"TOTAL_CALCULADO","t":"DECIMAL"},{"n":"TOTAL_MODIFICADO","t":"DECIMAL"}]},"LIQUIDACION_CONCEP":{"m":"CN","d":"","f":[{"n":"CANTIDAD","t":"DECIMAL"},{"n":"CENTRO_COSTO","t":"VARCHAR(25)"},{"n":"CONCEPTO","t":"VARCHAR(20)"},{"n":"CUENTA_CONTABLE","t":"VARCHAR(25)"},{"n":"DESCRIPCION","t":"VARCHAR(40)"},{"n":"LINEA","t":"INT"},{"n":"LIQUIDACION","t":"INT"},{"n":"MONTO","t":"DECIMAL"},{"n":"SECUENCIA","t":"INT"},{"n":"TIPO_CONCEPTO","t":"VARCHAR(1)"},{"n":"TOTAL_CALCULADO","t":"DECIMAL"}]},"LIQUIDACION_CONTRA":{"m":"CN","d":"","f":[{"n":"EMPLEADO","t":"VARCHAR(20)"},{"n":"FECHA_FINAL_ANT","t":"DATETIME"},{"n":"FECHA_FINAL_NUEV","t":"DATETIME"},{"n":"FECHA_INICIAL","t":"DATETIME"},{"n":"LIQUIDACION","t":"INT"}]},"LIQUIDACION_PAGO":{"m":"CN","d":"","f":[{"n":"LIQUIDACION","t":"INT"},{"n":"MONEDA","t":"VARCHAR(4)"},{"n":"NOTAS","t":"TEXT"},{"n":"PERIODO","t":"DATETIME"},{"n":"SUBTIPO","t":"INT"},{"n":"SUBTIPO_CC","t":"INT"},{"n":"TIPO","t":"VARCHAR(3)"},{"n":"TIPO_CC","t":"VARCHAR(4)"}]},"LIQUIDACION_PAGO_DET":{"m":"CN","d":"","f":[{"n":"CLIENTE","t":"VARCHAR(20)"},{"n":"DOCUMENTO","t":"VARCHAR(50)"},{"n":"EMPLEADO","t":"VARCHAR(20)"},{"n":"LIQUIDACION","t":"INT"},{"n":"MONTO_CALCULADO","t":"DECIMAL"},{"n":"MONTO_GENERADO","t":"DECIMAL"},{"n":"NUMERO_CREDITO","t":"INT"},{"n":"PROVEEDOR","t":"VARCHAR(20)"}]},"LIQUIDACIONES_IGSS":{"m":"CN","d":"","f":[{"n":"NOMINA","t":"VARCHAR(4)"},{"n":"NUM_LIQ_IGSS","t":"INT"},{"n":"NUM_NOTA_CARGO","t":"INT"},{"n":"TIPO_COMP_ORIG","t":"VARCHAR(4)"},{"n":"TIPO_PLANILLA_IGSS","t":"VARCHAR(10)"}]},"LOCALIZACION":{"m":"","d":"","f":[{"n":"BODEGA","t":"VARCHAR(4)"},{"n":"DESCRIPCION","t":"VARCHAR(40)"},{"n":"LOCALIZACION","t":"VARCHAR(8)"},{"n":"PESO_MAXIMO","t":"DECIMAL"},{"n":"VOLUMEN","t":"DECIMAL"}]},"LOTE":{"m":"CI","d":"Control de lotes de producción/compra. Trazabilidad y vencimientos.","f":[{"n":"ARTICULO","t":"VARCHAR(20)"},{"n":"CANTIDAD_INGRESADA","t":"DECIMAL"},{"n":"ESTADO","t":"VARCHAR(1)"},{"n":"FECHA_CUARENTENA","t":"DATETIME"},{"n":"FECHA_ENTRADA","t":"DATETIME"},{"n":"FECHA_FABRICACION","t":"DATETIME"},{"n":"FECHA_VENCIMIENTO","t":"DATETIME"},{"n":"LOTE","t":"VARCHAR(15)"},{"n":"LOTE_DEL_PROVEEDOR","t":"VARCHAR(15)"},{"n":"NOTAS","t":"TEXT"},{"n":"PROVEEDOR","t":"VARCHAR(20)"},{"n":"TIPO_INGRESO","t":"VARCHAR(1)"},{"n":"ULTIMO_INGRESO","t":"INT"}]},"LOTE_ESPE":{"m":"CI","d":"Control de lotes de producción/compra. Trazabilidad y vencimientos.","f":[{"n":"ARTICULO","t":"VARCHAR(20)"},{"n":"ATRIBUTO","t":"VARCHAR(20)"},{"n":"LOTE","t":"VARCHAR(15)"},{"n":"UNIDAD","t":"VARCHAR(6)"},{"n":"VALOR_CUALITATIVO","t":"VARCHAR(20)"},{"n":"VALOR_REAL","t":"DECIMAL"}]},"LOTE_SINCRO":{"m":"CI","d":"Control de lotes de producción/compra. Trazabilidad y vencimientos.","f":[{"n":"ARTICULO","t":"VARCHAR(20)"},{"n":"CANTIDAD_INGRESADA","t":"DECIMAL"},{"n":"CREADO_EN_PDA","t":"VARCHAR(1)"},{"n":"ESTADO","t":"VARCHAR(1)"},{"n":"FECHA_CUARENTENA","t":"DATETIME"},{"n":"FECHA_VENCIMIENTO","t":"DATETIME"},{"n":"ID_PDA","t":"VARCHAR(20)"},{"n":"ID_SINCRO","t":"VARCHAR(15)"},{"n":"LOTE","t":"VARCHAR(15)"},{"n":"LOTE_DEL_PROVEEDOR","t":"VARCHAR(15)"},{"n":"MODIFICADO_EN_PDA","t":"VARCHAR(1)"},{"n":"TIPO_INGRESO","t":"VARCHAR(1)"}]},"MARCA_RELOJ":{"m":"","d":"","f":[{"n":"CARGADO","t":"VARCHAR(1)"},{"n":"CONSISTENTE","t":"VARCHAR(1)"},{"n":"EMPLEADO","t":"VARCHAR(20)"},{"n":"FCH_HORA_ENTRADA","t":"DATETIME"},{"n":"FCH_HORA_SALIDA","t":"DATETIME"},{"n":"FECHA_HORA","t":"DATETIME"},{"n":"HORARIO","t":"VARCHAR(4)"},{"n":"USUARIO","t":"VARCHAR(50)"}]},"MATRIZ_OPER_INVENTARIO":{"m":"","d":"","f":[{"n":"NATURALEZA","t":"VARCHAR(1)"},{"n":"SUBSUBTIPO","t":"VARCHAR(1)"},{"n":"SUBTIPO","t":"VARCHAR(1)"},{"n":"TIPO","t":"VARCHAR(1)"},{"n":"TIPO_OPERACION","t":"VARCHAR(4)"},{"n":"TIPO_PAGO","t":"VARCHAR(10)"}]},"MAYOR":{"m":"CG","d":"Libro mayor por cuenta y período. Saldos acumulados y movimientos.","f":[{"n":"ASIENTO","t":"VARCHAR(10)"},{"n":"ASNT_CONS_CORP","t":"VARCHAR(10)"},{"n":"ASNT_CONS_FISC","t":"VARCHAR(10)"},{"n":"BASE_DOLAR","t":"DECIMAL"},{"n":"BASE_LOCAL","t":"DECIMAL"},{"n":"CENTRO_COSTO","t":"VARCHAR(25)"},{"n":"CLASE_ASIENTO","t":"VARCHAR(1)"},{"n":"CONSECUTIVO","t":"INT"},{"n":"CONTABILIDAD","t":"VARCHAR(1)"},{"n":"CREDITO_DOLAR","t":"DECIMAL"},{"n":"CREDITO_LOCAL","t":"DECIMAL"},{"n":"CREDITO_UNIDADES","t":"DECIMAL"},{"n":"CUENTA_CONTABLE","t":"VARCHAR(25)"},{"n":"DEBITO_DOLAR","t":"DECIMAL"},{"n":"DEBITO_LOCAL","t":"DECIMAL"},{"n":"DEBITO_UNIDADES","t":"DECIMAL"},{"n":"DOCUMENTO_GLOBAL","t":"VARCHAR(50)"},{"n":"ESTADO_CONS_CORP","t":"VARCHAR(1)"},{"n":"ESTADO_CONS_FISC","t":"VARCHAR(1)"},{"n":"FASE","t":"VARCHAR(25)"},{"n":"FECHA","t":"DATETIME"},{"n":"FUENTE","t":"VARCHAR(40)"},{"n":"NIT","t":"VARCHAR(20)"},{"n":"ORIGEN","t":"VARCHAR(4)"},{"n":"PROYECTO","t":"VARCHAR(25)"}]},"MAYOR_AUDITORIA":{"m":"CG","d":"Registro de auditoría y trazabilidad de cambios en el sistema.","f":[{"n":"COMENTARIO","t":"VARCHAR(40)"},{"n":"FECHA","t":"DATETIME"},{"n":"MAYOR_AUDITORIA","t":"INT"},{"n":"USUARIO","t":"VARCHAR(50)"}]},"MAYOR_DIVISION_GEOGRAFICA":{"m":"CG","d":"Divisiones geográficas o comerciales para segmentación de análisis.","f":[{"n":"ASIENTO","t":"VARCHAR(10)"},{"n":"CONSECUTIVO","t":"INT"},{"n":"DIVISION_GEOGRAFICA1","t":"VARCHAR(12)"},{"n":"DIVISION_GEOGRAFICA2","t":"VARCHAR(12)"},{"n":"PAIS","t":"VARCHAR(4)"}]},"MEDIO_PAGO_NE":{"m":"","d":"","f":[{"n":"MEDIO_PAGO_NE","t":"VARCHAR(10)"},{"n":"NOMBRE","t":"VARCHAR(254)"}]},"META":{"m":"","d":"","f":[{"n":"CANTIDADPERIODOS","t":"INT"},{"n":"CUBO","t":"VARCHAR(40)"},{"n":"DIMENSIONAGRUPAMIENTO","t":"VARCHAR(50)"},{"n":"DIMENSIONPRINCIPAL","t":"VARCHAR(50)"},{"n":"ESTADO","t":"VARCHAR(1)"},{"n":"LIMITECRITICO","t":"DECIMAL"},{"n":"LIMITEDEFICIENTE","t":"DECIMAL"},{"n":"LIMITEEXITOSO","t":"DECIMAL"},{"n":"LIMITESOBRESALIENTE","t":"DECIMAL"},{"n":"MEDIDA","t":"VARCHAR(50)"},{"n":"META","t":"INT"},{"n":"NOMBRE","t":"VARCHAR(40)"},{"n":"NOMBRE_DIMENSIONAGRUPAMIENTO","t":"VARCHAR(50)"},{"n":"NOMBRE_DIMENSIONPRINCIPAL","t":"VARCHAR(50)"},{"n":"NOMBRE_MEDIDA","t":"VARCHAR(50)"},{"n":"NOMBREPRESUPUESTO","t":"VARCHAR(50)"},{"n":"NOMBREREAL","t":"VARCHAR(50)"},{"n":"PERIODOINICIAL","t":"DATETIME"},{"n":"VERSION","t":"VARCHAR(4)"}]},"META_DETALLE":{"m":"","d":"","f":[{"n":"CODIGO1","t":"VARCHAR(280)"},{"n":"CODIGO2","t":"VARCHAR(280)"},{"n":"MES","t":"DATETIME"},{"n":"META","t":"INT"},{"n":"METADETALLE","t":"INT"},{"n":"VALORMETA","t":"DECIMAL"}]},"METAS_VENTA_COBRO":{"m":"","d":"","f":[{"n":"AGENTE","t":"VARCHAR(4)"},{"n":"COBRO","t":"DECIMAL"},{"n":"CONTABILIDAD","t":"VARCHAR(1)"},{"n":"PERIODO","t":"DATETIME"},{"n":"VENTA","t":"DECIMAL"}]},"METODO_PAGO":{"m":"","d":"","f":[{"n":"DESCRIPCION","t":"VARCHAR(254)"},{"n":"METODO_PAGO","t":"VARCHAR(10)"}]},"METODO_VALUACION_EQUIV":{"m":"","d":"","f":[{"n":"DESCRIPCION_CR","t":"VARCHAR(500)"},{"n":"DESCRIPCION_PE","t":"VARCHAR(500)"},{"n":"METODO_VALUACION","t":"INT"},{"n":"VALOR_CR","t":"VARCHAR(1)"},{"n":"VALOR_PE","t":"VARCHAR(1)"}]},"MODALIDAD_SERVICIO":{"m":"","d":"","f":[{"n":"DESCRIPCION","t":"VARCHAR(254)"},{"n":"MODALIDAD_SERVICIO","t":"VARCHAR(4)"}]},"MODELO_CONTABLE":{"m":"","d":"","f":[{"n":"CLASE","t":"VARCHAR(1)"},{"n":"DESCRIPCION","t":"VARCHAR(80)"},{"n":"ESTADO","t":"VARCHAR(1)"},{"n":"EVENTO_CONTABLE","t":"VARCHAR(12)"},{"n":"FCH_HORA_CREACION","t":"DATETIME"},{"n":"FCH_HORA_MODIFIC","t":"DATETIME"},{"n":"MODELO","t":"VARCHAR(18)"},{"n":"MODO_CREACION","t":"VARCHAR(1)"},{"n":"NOTAS","t":"INT"},{"n":"REFERENCIA","t":"VARCHAR(20)"},{"n":"USUARIO_CREACION","t":"VARCHAR(10)"},{"n":"USUARIO_MODIFIC","t":"VARCHAR(10)"}]},"MODELO_DETALLE":{"m":"","d":"","f":[{"n":"CENTRO_COSTO","t":"VARCHAR(30)"},{"n":"COMANDOS","t":"INT"},{"n":"CREDITO_DOLAR","t":"VARCHAR(30)"},{"n":"CREDITO_LOCAL","t":"VARCHAR(30)"},{"n":"CREDITO_UNIDADES","t":"VARCHAR(30)"},{"n":"CUENTA_CONTABLE","t":"VARCHAR(30)"},{"n":"DEBITO_DOLAR","t":"VARCHAR(30)"},{"n":"DEBITO_LOCAL","t":"VARCHAR(30)"},{"n":"DEBITO_UNIDADES","t":"VARCHAR(30)"},{"n":"EVENTO_CONTABLE","t":"VARCHAR(12)"},{"n":"FUENTE","t":"VARCHAR(30)"},{"n":"INCLUIR","t":"VARCHAR(30)"},{"n":"ITERADORES","t":"VARCHAR(30)"},{"n":"LINEA","t":"INT"},{"n":"MODELO","t":"VARCHAR(18)"},{"n":"MODELO_BLOQUE","t":"VARCHAR(18)"},{"n":"NIT","t":"VARCHAR(20)"},{"n":"NOMBRE","t":"VARCHAR(40)"},{"n":"NOTAS","t":"INT"},{"n":"REFERENCIA","t":"VARCHAR(40)"},{"n":"SECCION","t":"INT"},{"n":"SECUENCIA","t":"INT"},{"n":"TIPO_DETALLE","t":"VARCHAR(1)"},{"n":"TIPO_DISTRIBUCION","t":"VARCHAR(1)"}]},"MODELO_DISTRIBUCIO":{"m":"","d":"","f":[{"n":"CENTRO_COSTO","t":"VARCHAR(30)"},{"n":"COMANDOS","t":"INT"},{"n":"CUENTA_CONTABLE","t":"VARCHAR(30)"},{"n":"FUENTE","t":"VARCHAR(30)"},{"n":"LINEA","t":"INT"},{"n":"MODELO","t":"VARCHAR(18)"},{"n":"NIT","t":"VARCHAR(20)"},{"n":"NOTAS","t":"INT"},{"n":"REFERENCIA","t":"VARCHAR(30)"},{"n":"SECUENCIA","t":"INT"},{"n":"VALOR","t":"VARCHAR(30)"}]},"MODELO_ENCABEZADO":{"m":"","d":"","f":[{"n":"ASIENTO","t":"VARCHAR(30)"},{"n":"CLASE","t":"VARCHAR(30)"},{"n":"COMANDOS","t":"INT"},{"n":"CONTABILIDAD","t":"VARCHAR(30)"},{"n":"FECHA","t":"VARCHAR(30)"},{"n":"MODELO","t":"VARCHAR(18)"},{"n":"MODO_APLICACION","t":"VARCHAR(30)"},{"n":"NOTAS","t":"INT"},{"n":"ORIGEN","t":"VARCHAR(30)"},{"n":"PAQUETE","t":"VARCHAR(30)"},{"n":"TIPO","t":"VARCHAR(30)"},{"n":"TOTAL_DOLAR","t":"VARCHAR(30)"},{"n":"TOTAL_LOCAL","t":"VARCHAR(30)"}]},"MODELO_RETENCION":{"m":"","d":"Retenciones fiscales aplicadas en documentos de compra o venta.","f":[{"n":"DESCRIPCION","t":"VARCHAR(40)"},{"n":"MODELO_RETENCION","t":"VARCHAR(4)"}]},"MODELO_TEXTO":{"m":"","d":"","f":[{"n":"MODELO_TEXTO","t":"INT"},{"n":"TEXTO","t":"TEXT"}]},"MODULO":{"m":"","d":"","f":[{"n":"MODULO","t":"INT"},{"n":"NOMBRE_MODULO","t":"VARCHAR(50)"}]},"MONEDA":{"m":"AS","d":"Catálogo de monedas: código ISO, símbolo y decimales.","f":[{"n":"CODIGO_ISO","t":"VARCHAR(4)"},{"n":"id_cat_MONEDA","t":"INT"},{"n":"MONEDA","t":"VARCHAR(4)"},{"n":"NOMBRE","t":"VARCHAR(40)"}]},"MONEDA_HIST":{"m":"AS","d":"Catálogo de monedas del sistema. Símbolo, ISO, decimales.","f":[{"n":"FECHA","t":"DATETIME"},{"n":"MONEDA","t":"VARCHAR(4)"},{"n":"MONTO","t":"DECIMAL"},{"n":"USUARIO","t":"VARCHAR(50)"}]},"MONEDA_PED_BACKORD":{"m":"AS","d":"Catálogo de monedas del sistema. Símbolo, ISO, decimales.","f":[{"n":"MONEDA_FACTURA","t":"VARCHAR(3)"},{"n":"MONEDA_REMISION","t":"VARCHAR(3)"},{"n":"PEDIDO","t":"VARCHAR(20)"}]},"MONTO_FC":{"m":"","d":"Tabla transaccional con montos e información de fechas del proceso.","f":[{"n":"FECHA","t":"DATETIME"},{"n":"MONTO","t":"DECIMAL"}]},"MOTIVO_TRASLADO":{"m":"","d":"Traslados de mercancía entre bodegas con trazabilidad de movimiento.","f":[{"n":"CODIGO","t":"VARCHAR(2)"},{"n":"DESCRIPCION","t":"VARCHAR(200)"}]},"MOV_BANCOS":{"m":"CB","d":"Tabla transaccional con montos e información de fechas del proceso.","f":[{"n":"ACLARADA_DIF","t":"VARCHAR(1)"},{"n":"ANULADO","t":"VARCHAR(1)"},{"n":"APROBADO","t":"VARCHAR(1)"},{"n":"ASIENTO","t":"VARCHAR(10)"},{"n":"CLASE_DIF","t":"VARCHAR(1)"},{"n":"CLASE_DOCUMENTO","t":"VARCHAR(1)"},{"n":"COD_IMPUESTO1","t":"VARCHAR(4)"},{"n":"COMPANIA_ORIGEN","t":"VARCHAR(10)"},{"n":"CONCIL_ACLARACION","t":"INT"},{"n":"CONCILIACION","t":"INT"},{"n":"CONFIRMADO","t":"VARCHAR(1)"},{"n":"CONSEC_AJUSTE_NOM","t":"INT"},{"n":"CONTRIBUYENTE","t":"VARCHAR(20)"},{"n":"CUENTA_BANCO","t":"VARCHAR(20)"},{"n":"DEPENDIENTE_GP","t":"VARCHAR(1)"},{"n":"DETALLE","t":"TEXT"},{"n":"DOC_AJUSTE","t":"INT"},{"n":"DOC_REPORTADO","t":"INT"},{"n":"DOCUMENTO_FISCAL","t":"VARCHAR(50)"},{"n":"DOCUMENTO_GLOBAL","t":"VARCHAR(50)"},{"n":"ESTADO","t":"VARCHAR(1)"},{"n":"FCH_HORA_ANULADO","t":"DATETIME"},{"n":"FCH_HORA_CREACION","t":"DATETIME"},{"n":"FCH_HORA_MODIFIC","t":"DATETIME"},{"n":"FECHA","t":"DATETIME"}]},"MOV_PROCESADOS":{"m":"","d":"","f":[{"n":"ARCHIVO_TXT","t":"VARCHAR(250)"},{"n":"CUENTA_BANCO","t":"VARCHAR(20)"},{"n":"FECHA_GENERADO","t":"DATETIME"},{"n":"FECHA_PROCESA","t":"DATETIME"},{"n":"NUMERO","t":"DECIMAL"},{"n":"TIPO_DOCUMENTO","t":"VARCHAR(3)"},{"n":"USUARIO_PROCESA","t":"VARCHAR(50)"}]},"MOV_REPORTADOS":{"m":"","d":"Tabla transaccional con montos e información de fechas del proceso.","f":[{"n":"COMPENSADO","t":"VARCHAR(1)"},{"n":"CONCILIACION","t":"INT"},{"n":"CUENTA_BANCO","t":"VARCHAR(20)"},{"n":"DOC_COMPENSAC","t":"INT"},{"n":"DOC_REPORTADO","t":"INT"},{"n":"ESTADO","t":"VARCHAR(1)"},{"n":"FCH_HORA_CREACION","t":"DATETIME"},{"n":"FCH_HORA_MODIFIC","t":"DATETIME"},{"n":"FECHA","t":"DATETIME"},{"n":"MODO_REGISTRO","t":"VARCHAR(1)"},{"n":"MONTO","t":"DECIMAL"},{"n":"NOTAS","t":"TEXT"},{"n":"NUMERO","t":"DECIMAL"},{"n":"TIPO_CF","t":"VARCHAR(3)"},{"n":"TIPO_DOCUMENTO","t":"VARCHAR(3)"},{"n":"U_REPORTADOS","t":"VARCHAR(300)"},{"n":"USUARIO_CREACION","t":"VARCHAR(50)"},{"n":"USUARIO_MODIFIC","t":"VARCHAR(50)"}]},"MRP_AjusteCostoEstandar":{"m":"","d":"Ajustes de inventario: correcciones por diferencias entre conteo y sistema.","f":[{"n":"AJUSTE_CONFIG","t":"VARCHAR(4)"},{"n":"ARTICULO","t":"VARCHAR(20)"},{"n":"AUDIT_TRANS_INV","t":"INT"},{"n":"CANTIDAD","t":"DECIMAL"},{"n":"COSTO_TOT_FISC_DOL","t":"DECIMAL"},{"n":"COSTO_TOT_FISC_LOC","t":"DECIMAL"},{"n":"FECHA","t":"DATETIME"},{"n":"SUBSUBTIPO","t":"VARCHAR(1)"},{"n":"SUBTIPO","t":"VARCHAR(1)"},{"n":"TIPO","t":"VARCHAR(1)"}]},"MRP_Planificador":{"m":"","d":"","f":[{"n":"PDRMRC_ARTCOD","t":"VARCHAR(30)"},{"n":"PDRMRC_CANTID","t":"DECIMAL"},{"n":"PDRMRC_CODESC","t":"VARCHAR(6)"},{"n":"PDRMRC_FECALT","t":"DATETIME"},{"n":"PDRMRC_ITMMRI","t":"INT"},{"n":"PDRMRC_NROCPV","t":"VARCHAR(20)"},{"n":"PDRMRC_NROFOR","t":"INT"},{"n":"PDRMRC_NROITM","t":"INT"},{"n":"PDRMRC_NROLOT","t":"INT"},{"n":"PDRMRC_TIPPRO","t":"VARCHAR(6)"},{"n":"PROCESADO","t":"VARCHAR(1)"}]},"MULTIPLE_ADQUIRIENTE":{"m":"","d":"","f":[{"n":"ADQUIRIENTE","t":"VARCHAR(20)"},{"n":"DOCUMENTO","t":"VARCHAR(50)"},{"n":"PARTICIPACION","t":"DECIMAL"},{"n":"TIPO_DOCUMENTO","t":"VARCHAR(3)"}]},"NATURALEZA_JURIDICA":{"m":"","d":"Tabla de catálogo/maestro de referencia con código y descripción.","f":[{"n":"CODIGO","t":"INT"},{"n":"DESCRIPCION","t":"VARCHAR(254)"}]},"NATURALEZA_OPERACION":{"m":"","d":"Tabla de catálogo/maestro de referencia con código y descripción.","f":[{"n":"CODIGO","t":"VARCHAR(4)"},{"n":"DESCRIPCION","t":"VARCHAR(249)"}]},"NCF_CONSECUTIVO":{"m":"FA","d":"Control de consecutivos y numeración automática de documentos.","f":[{"n":"ACTIVO","t":"VARCHAR(1)"},{"n":"COMPROBANTE","t":"VARCHAR(100)"},{"n":"DES_TIPO_ECF","t":"VARCHAR(200)"},{"n":"DESCRIPCION","t":"VARCHAR(70)"},{"n":"FECHA_AUTORIZACION_CAI","t":"DATETIME"},{"n":"FECHA_VENCIMIENTO_CAI","t":"DATETIME"},{"n":"FECHAHORA_AJUSTE","t":"DATETIME"},{"n":"FECHAHORA_CREACION","t":"DATETIME"},{"n":"FECHAHORA_MODIFICA","t":"DATETIME"},{"n":"NCF_CONTINGENCIA","t":"VARCHAR(1)"},{"n":"NCF_UNICO","t":"VARCHAR(1)"},{"n":"PREFIJO","t":"VARCHAR(50)"},{"n":"SECUENCIA_FINAL","t":"VARCHAR(20)"},{"n":"SECUENCIA_INICIAL","t":"VARCHAR(20)"},{"n":"SUGERIR","t":"VARCHAR(1)"},{"n":"TIPO","t":"VARCHAR(6)"},{"n":"TIPO_COMPROBANTE","t":"VARCHAR(3)"},{"n":"TIPO_CONTRIBUYENTE","t":"VARCHAR(1)"},{"n":"TIPO_DOC","t":"VARCHAR(21)"},{"n":"TIPO_ECF","t":"VARCHAR(3)"},{"n":"ULTIMO_VALOR","t":"VARCHAR(20)"},{"n":"USUARIO_AJUSTE","t":"VARCHAR(50)"},{"n":"USUARIO_CREACION","t":"VARCHAR(50)"},{"n":"USUARIO_MODIFICA","t":"VARCHAR(50)"}]},"NCF_CONSECUTIVO_USUARIO":{"m":"FA","d":"Control de consecutivos y numeración automática de documentos.","f":[{"n":"NCF_DEFAULT","t":"VARCHAR(1)"},{"n":"PREFIJO","t":"VARCHAR(50)"},{"n":"SECUENCIA","t":"INT"},{"n":"USUARIO","t":"VARCHAR(50)"}]},"NCF_DOCUMENTO":{"m":"","d":"","f":[{"n":"CONTINGENCIA_FECHA_VENCE","t":"DATETIME"},{"n":"CONTINGENCIA_NCF","t":"VARCHAR(50)"},{"n":"CONTINGENCIA_SECUENCIA","t":"INT"},{"n":"DOC_ROWPOINTER","t":"GUID"},{"n":"FECHA_VENCE_SECUENCIA","t":"DATETIME"},{"n":"MODULO","t":"VARCHAR(4)"},{"n":"NCF","t":"VARCHAR(50)"},{"n":"SECUENCIA","t":"INT"},{"n":"TABLA","t":"VARCHAR(20)"},{"n":"TIPO_ANULACION","t":"VARCHAR(3)"},{"n":"TIPO_DOCUMENTO","t":"VARCHAR(6)"},{"n":"TIPO_ECF","t":"VARCHAR(3)"}]},"NCF_SECUENCIA":{"m":"","d":"Control de consecutivos y numeración automática de documentos.","f":[{"n":"DESCRIPCION","t":"VARCHAR(100)"},{"n":"ESTADO","t":"VARCHAR(1)"},{"n":"FECHA_VENCE","t":"DATETIME"},{"n":"PREFIJO","t":"VARCHAR(50)"},{"n":"SECUENCIA","t":"INT"},{"n":"SECUENCIA_FINAL","t":"VARCHAR(20)"},{"n":"SECUENCIA_INICIAL","t":"VARCHAR(20)"},{"n":"ULTIMO_VALOR","t":"VARCHAR(20)"}]},"NIT":{"m":"","d":"","f":[{"n":"ACEPTA_DOC_ELECTRONICO","t":"VARCHAR(1)"},{"n":"ACTIVIDAD_COMERCIAL","t":"VARCHAR(10)"},{"n":"ACTIVIDAD_ECONOMINA","t":"VARCHAR(4)"},{"n":"ACTIVO","t":"VARCHAR(1)"},{"n":"ALIAS","t":"VARCHAR(150)"},{"n":"AREA_DEPTO_SECC","t":"VARCHAR(100)"},{"n":"CARGO","t":"VARCHAR(100)"},{"n":"CARNE","t":"VARCHAR(20)"},{"n":"CATEGORIA","t":"VARCHAR(20)"},{"n":"CELULAR","t":"VARCHAR(14)"},{"n":"CLASE_DOCUMENTO","t":"VARCHAR(5)"},{"n":"COD_INTERNO_EMP","t":"VARCHAR(30)"},{"n":"COD_POSTAL","t":"VARCHAR(6)"},{"n":"CODIGO_EMPLEADO","t":"VARCHAR(20)"},{"n":"CORREO","t":"VARCHAR(100)"},{"n":"DEPARTAMENTO","t":"VARCHAR(12)"},{"n":"DETALLAR_KITS","t":"VARCHAR(1)"},{"n":"DETALLE_DIRECCION","t":"INT"},{"n":"DIGITO_VERIFICADOR","t":"VARCHAR(10)"},{"n":"DIRECCION","t":"VARCHAR(3000)"},{"n":"DIRECCION_ADICIONAL","t":"VARCHAR(300)"},{"n":"DUI","t":"VARCHAR(12)"},{"n":"EMAIL_DOC_ELECTRONICO","t":"VARCHAR(249)"},{"n":"EMAIL_DOC_ELECTRONICO_COPIA","t":"VARCHAR(249)"},{"n":"EXTERIOR","t":"VARCHAR(1)"}]},"NIVEL_EDUCATIVO":{"m":"","d":"Tabla de catálogo/maestro de referencia con código y descripción.","f":[{"n":"CODIGO","t":"INT"},{"n":"DESCRIPCION","t":"VARCHAR(150)"}]},"NIVEL_PRECIO":{"m":"FA","d":"Lista de precios: tarifas por artículo, cliente o segmento.","f":[{"n":"CONDICION_PAGO","t":"VARCHAR(4)"},{"n":"DESCUENTOS","t":"VARCHAR(1)"},{"n":"ESQUEMA_TRABAJO","t":"VARCHAR(1)"},{"n":"id_cat_NIVEL_PRECIO","t":"INT"},{"n":"MONEDA","t":"VARCHAR(1)"},{"n":"NIVEL_PRECIO","t":"VARCHAR(12)"},{"n":"SINC_MOVIL","t":"VARCHAR(1)"},{"n":"SUGERIR_DESCUENTO","t":"VARCHAR(1)"}]},"NIVELPRECIO_USUARIO":{"m":"","d":"Lista de precios: tarifas por artículo, cliente o segmento.","f":[{"n":"MONEDA","t":"VARCHAR(1)"},{"n":"NIVEL_PRECIO","t":"VARCHAR(12)"},{"n":"USUARIO","t":"VARCHAR(25)"}]},"NOM_ELECT_ACCIONES":{"m":"","d":"","f":[{"n":"CODIGO_TRABAJADOR","t":"VARCHAR(20)"},{"n":"FECHA_RIGE","t":"DATETIME"},{"n":"ID","t":"INT"},{"n":"NUMERO_ACCION","t":"INT"},{"n":"PERIODO","t":"DATETIME"}]},"NOM_ELECT_NOM_PROC":{"m":"","d":"","f":[{"n":"CODIGO_TRABAJADOR","t":"VARCHAR(20)"},{"n":"ID","t":"INT"},{"n":"NOMINA","t":"VARCHAR(4)"},{"n":"NUMERO_NOMINA","t":"INT"},{"n":"PERIODO","t":"DATETIME"},{"n":"TIPO","t":"VARCHAR(1)"},{"n":"TIPO_XML","t":"VARCHAR(10)"}]},"NOMBRE_INSTITUCION_EXO":{"m":"","d":"Tabla de catálogo/maestro de referencia con código y descripción.","f":[{"n":"CODIGO","t":"VARCHAR(2)"},{"n":"DESCRIPCION","t":"VARCHAR(254)"}]},"NOMINA":{"m":"CN","d":"Cabecera de nómina procesada: período, tipo, estado y totales.","f":[{"n":"CONCEPTO_DIAS_LABOR","t":"VARCHAR(20)"},{"n":"CONCEPTO_TIPO_CAMBIO","t":"VARCHAR(20)"},{"n":"CONSECUTIVO","t":"INT"},{"n":"CTA_NOMINA","t":"VARCHAR(25)"},{"n":"CTR_NOMINA","t":"VARCHAR(25)"},{"n":"CUENTA_BANCO","t":"VARCHAR(20)"},{"n":"DESCRIPCION","t":"VARCHAR(40)"},{"n":"ELIMINAR_CONC_CERO","t":"VARCHAR(1)"},{"n":"ES_PILA","t":"VARCHAR(1)"},{"n":"ESTADO","t":"VARCHAR(1)"},{"n":"IMP_ACUM_CONCEPTOS","t":"VARCHAR(1)"},{"n":"IMP_COND_CONCEPTOS","t":"VARCHAR(1)"},{"n":"INICIALIZAR_POR_PUESTO","t":"VARCHAR(1)"},{"n":"MODALIDAD_ASIENTO","t":"VARCHAR(1)"},{"n":"MONEDA","t":"VARCHAR(4)"},{"n":"NIT_CIA_ASNT","t":"VARCHAR(1)"},{"n":"NOMINA","t":"VARCHAR(4)"},{"n":"NUMERO_PATRONAL","t":"VARCHAR(25)"},{"n":"NUMSERIE","t":"VARCHAR(25)"},{"n":"PAQUETE_CR","t":"VARCHAR(4)"},{"n":"PARTICIPA_NE","t":"VARCHAR(1)"},{"n":"PERIODO_NOMINA","t":"VARCHAR(10)"},{"n":"PRESUPUESTO_CR","t":"VARCHAR(20)"},{"n":"REPORTE","t":"VARCHAR(100)"},{"n":"RUBRO1","t":"VARCHAR(40)"}]},"NOMINA_BANCO":{"m":"CN","d":"","f":[{"n":"CTA_DEFAULT","t":"VARCHAR(1)"},{"n":"CUENTA_BANCO","t":"VARCHAR(20)"},{"n":"NOMINA","t":"VARCHAR(4)"}]},"NOMINA_CONCEPTO":{"m":"CN","d":"","f":[{"n":"ACTIVO","t":"VARCHAR(1)"},{"n":"CONCEPTO","t":"VARCHAR(20)"},{"n":"NOMINA","t":"VARCHAR(4)"}]},"NOMINA_HISTORICO":{"m":"CN","d":"","f":[{"n":"APROBADA_POR","t":"VARCHAR(50)"},{"n":"ASIENTO","t":"VARCHAR(10)"},{"n":"FECHA_APLICACION","t":"DATETIME"},{"n":"FECHA_APROBACION","t":"DATETIME"},{"n":"FECHA_CALCULO","t":"DATETIME"},{"n":"FECHA_FIN","t":"DATETIME"},{"n":"FECHA_INICIO","t":"DATETIME"},{"n":"FECHA_PAGO","t":"DATETIME"},{"n":"NOMINA","t":"VARCHAR(4)"},{"n":"NUMERO_APARTADO","t":"INT"},{"n":"NUMERO_EJERCIDO","t":"INT"},{"n":"NUMERO_NOMINA","t":"INT"},{"n":"PERIODO","t":"DATETIME"},{"n":"PRESUPUESTO","t":"VARCHAR(20)"},{"n":"UNIDAD_OPERATIVA","t":"VARCHAR(4)"},{"n":"USUARIO_APLICACION","t":"VARCHAR(50)"}]},"NOMINA_LIQUI_IGSS":{"m":"CN","d":"","f":[{"n":"NOMINA","t":"VARCHAR(4)"},{"n":"NUM_LIQ_IGSS","t":"INT"}]},"NOMINA_USUARIO":{"m":"CN","d":"Usuarios del sistema: credenciales, perfil, estado y auditoría.","f":[{"n":"NOMINA","t":"VARCHAR(4)"},{"n":"PRIVILEGIO","t":"VARCHAR(1)"},{"n":"USUARIO","t":"VARCHAR(50)"}]},"NoteHeaders":{"m":"","d":"","f":[{"n":"NoteFlag","t":"INT"},{"n":"NoteHeaderToken","t":"DECIMAL"},{"n":"ObjectName","t":"VARCHAR(128)"}]},"NoteTypes":{"m":"","d":"","f":[{"n":"NoteDesc","t":"VARCHAR(36)"},{"n":"NoteType","t":"INT"}]},"NOTICIA":{"m":"","d":"","f":[{"n":"INFORMACION","t":"INT"},{"n":"MODULO","t":"INT"}]},"ObjectNotes":{"m":"","d":"","f":[{"n":"NoteHeaderToken","t":"DECIMAL"},{"n":"NoteType","t":"INT"},{"n":"ObjectNoteToken","t":"DECIMAL"},{"n":"RefRowPointer","t":"GUID"},{"n":"SpecificNoteToken","t":"DECIMAL"},{"n":"SystemNoteToken","t":"DECIMAL"},{"n":"UserNoteToken","t":"DECIMAL"}]},"OBJETO_IMPUESTO":{"m":"CN","d":"Configuración de impuestos: tasas, tipos y reglas de aplicación.","f":[{"n":"DESCRIPCION","t":"VARCHAR(100)"},{"n":"OBJETO_IMPUESTO","t":"VARCHAR(2)"}]},"OFERTA":{"m":"","d":"","f":[{"n":"ARTICULO","t":"VARCHAR(20)"},{"n":"INFORMACION","t":"INT"},{"n":"MODULO","t":"INT"},{"n":"TIPO_OFERTA","t":"VARCHAR(20)"}]},"ORDEN_CARGADA_SINCRO":{"m":"","d":"","f":[{"n":"DESCARGADA","t":"VARCHAR(1)"},{"n":"ID_PDA","t":"VARCHAR(15)"},{"n":"ID_SINCRO","t":"VARCHAR(15)"},{"n":"ORDEN_COMPRA","t":"VARCHAR(10)"}]},"ORDEN_COMPRA":{"m":"CO","d":"Cabecera de órdenes de compra. Proveedor, bodega destino, condición pago y totales.","f":[{"n":"ASIENTO_CIERRE","t":"VARCHAR(10)"},{"n":"BASE_IMPUESTO1","t":"DECIMAL"},{"n":"BASE_IMPUESTO2","t":"DECIMAL"},{"n":"BODEGA","t":"VARCHAR(4)"},{"n":"CLASE_DOC_ES","t":"VARCHAR(3)"},{"n":"CLAVE_REFERENCIA_DE","t":"VARCHAR(50)"},{"n":"COD_DIREC_EMB","t":"VARCHAR(4)"},{"n":"CODIGO_GENERADOR","t":"VARCHAR(100)"},{"n":"COMENTARIO_CXP","t":"VARCHAR(40)"},{"n":"CONDICION_PAGO","t":"VARCHAR(4)"},{"n":"CONFIRMADA","t":"VARCHAR(1)"},{"n":"CONTROL_INTERNO","t":"VARCHAR(20)"},{"n":"DEPARTAMENTO","t":"VARCHAR(10)"},{"n":"DIRECCION_COBRO","t":"VARCHAR(250)"},{"n":"DIRECCION_EMBARQUE","t":"VARCHAR(250)"},{"n":"DTE","t":"VARCHAR(100)"},{"n":"ESTADO","t":"VARCHAR(1)"},{"n":"ESTADO_DOC_DTE","t":"VARCHAR(50)"},{"n":"FECHA","t":"DATETIME"},{"n":"FECHA_COTIZACION","t":"DATETIME"},{"n":"FECHA_EMISION","t":"DATETIME"},{"n":"FECHA_HORA","t":"DATETIME"},{"n":"FECHA_HORA_CANCELA","t":"DATETIME"},{"n":"FECHA_HORA_CIERRE","t":"DATETIME"},{"n":"FECHA_HORA_CONFIR","t":"DATETIME"}]},"ORDEN_COMPRA_IMP":{"m":"CO","d":"Órdenes de compra a proveedores: artículos, cantidades y condiciones.","f":[{"n":"ORDEN_COMPRA","t":"VARCHAR(10)"},{"n":"USUARIO","t":"VARCHAR(50)"}]},"ORDEN_COMPRA_LINEA":{"m":"CO","d":"Órdenes de compra a proveedores: artículos, cantidades y condiciones.","f":[{"n":"ARTICULO","t":"VARCHAR(20)"},{"n":"BODEGA","t":"VARCHAR(4)"},{"n":"CANTIDAD_ACEPTADA","t":"DECIMAL"},{"n":"CANTIDAD_EMBARCADA","t":"DECIMAL"},{"n":"CANTIDAD_ORDENADA","t":"DECIMAL"},{"n":"CANTIDAD_RECHAZADA","t":"DECIMAL"},{"n":"CANTIDAD_RECIBIDA","t":"DECIMAL"},{"n":"CENTRO_COSTO","t":"VARCHAR(25)"},{"n":"CODIGO_IMPUESTO","t":"VARCHAR(4)"},{"n":"COMENTARIO","t":"VARCHAR(250)"},{"n":"CONCEPTO_ME","t":"VARCHAR(4)"},{"n":"CUENTA_CONTABLE","t":"VARCHAR(25)"},{"n":"DESCRIPCION","t":"TEXT"},{"n":"DIAS_PARA_ENTREGA","t":"INT"},{"n":"E_MAIL","t":"VARCHAR(250)"},{"n":"ES_CANASTA_BASICA","t":"VARCHAR(1)"},{"n":"ESTADO","t":"VARCHAR(1)"},{"n":"FACTOR_CONVERSION","t":"DECIMAL"},{"n":"FACTURA","t":"VARCHAR(50)"},{"n":"FASE","t":"VARCHAR(25)"},{"n":"FEC_EMBARQUE_PROV","t":"DATETIME"},{"n":"FECHA","t":"DATETIME"},{"n":"FECHA_HORA_CANCELA","t":"DATETIME"},{"n":"FECHA_HORA_CIERRE","t":"DATETIME"},{"n":"FECHA_REQUERIDA","t":"DATETIME"}]},"ORDEN_MOV_PRES":{"m":"CR","d":"","f":[{"n":"NUMERO","t":"INT"},{"n":"ORDEN_COMPRA","t":"VARCHAR(10)"},{"n":"PRESUPUESTO","t":"VARCHAR(20)"},{"n":"UNIDAD_OPERATIVA","t":"VARCHAR(4)"}]},"ORDEN_MOV_PRES_LINEA":{"m":"CR","d":"Líneas de órdenes de compra: artículo, cantidad, precio y estado.","f":[{"n":"ACTUALIZADO_BD","t":"VARCHAR(1)"},{"n":"LINEA_CR","t":"INT"},{"n":"NUMERO","t":"INT"},{"n":"ORDEN_COMPRA","t":"VARCHAR(10)"},{"n":"ORDEN_COMPRA_LINEA","t":"INT"}]},"OTROS_DOC_ASOCIADOS":{"m":"","d":"Tabla de catálogo/maestro de referencia con código y descripción.","f":[{"n":"CODIGO","t":"VARCHAR(4)"},{"n":"DESCRIPCION","t":"VARCHAR(254)"}]},"OTROS_DOCS_ASOCIADOS_FAC":{"m":"","d":"","f":[{"n":"DESCRIPCION_DOC","t":"VARCHAR(254)"},{"n":"DOC_FAC_ID","t":"INT"},{"n":"DOCUMENTO","t":"VARCHAR(50)"},{"n":"IDENTIFICACION_CONDUCTOR","t":"VARCHAR(100)"},{"n":"IDENTIFICACION_DOC","t":"VARCHAR(100)"},{"n":"IDENTIFICACION_TRANSPORTE","t":"VARCHAR(100)"},{"n":"MODO_TRANSPORTE","t":"VARCHAR(4)"},{"n":"NOMBRE_CONDUCTOR","t":"VARCHAR(200)"},{"n":"TIPO_DOC_ASOCIADO","t":"VARCHAR(4)"},{"n":"TIPO_DOC_FAC","t":"VARCHAR(1)"}]},"OTROS_DOCS_ASOCIADOS_PED":{"m":"","d":"","f":[{"n":"DESCRIPCION_DOC","t":"VARCHAR(254)"},{"n":"DOC_PED_ID","t":"INT"},{"n":"DOCUMENTO","t":"VARCHAR(20)"},{"n":"IDENTIFICACION_CONDUCTOR","t":"VARCHAR(100)"},{"n":"IDENTIFICACION_DOC","t":"VARCHAR(100)"},{"n":"IDENTIFICACION_TRANSPORTE","t":"VARCHAR(100)"},{"n":"MODO_TRANSPORTE","t":"VARCHAR(4)"},{"n":"NOMBRE_CONDUCTOR","t":"VARCHAR(200)"},{"n":"TIPO_DOC_ASOCIADO","t":"VARCHAR(4)"}]},"PAGINA":{"m":"","d":"","f":[{"n":"MODULO","t":"INT"},{"n":"NOMBRE_PAGINA","t":"VARCHAR(30)"},{"n":"PAGINA","t":"INT"}]},"PAGOS_PARCIALES":{"m":"AS","d":"Tramos de pago por condición: porcentaje y días por cuota.","f":[{"n":"CONDICION_PAGO","t":"VARCHAR(4)"},{"n":"CONSECUTIVO","t":"INT"},{"n":"DIAS_NETO_PARCIAL","t":"INT"},{"n":"PORC_MONTO","t":"FLOAT"}]},"PAIS":{"m":"AS","d":"Catálogo de países con cuentas contables asociadas para integración.","f":[{"n":"CODIGO_ISO","t":"VARCHAR(4)"},{"n":"CTA_ADVALOREM","t":"VARCHAR(25)"},{"n":"CTA_AJUSTE_REDONDEO","t":"VARCHAR(25)"},{"n":"CTA_ANTICIPO_CXC","t":"VARCHAR(25)"},{"n":"CTA_ANTICIPO_CXP","t":"VARCHAR(25)"},{"n":"CTA_COBR_DUDOSA","t":"VARCHAR(25)"},{"n":"CTA_COMISION","t":"VARCHAR(25)"},{"n":"CTA_COMISION_CXP","t":"VARCHAR(25)"},{"n":"CTA_CONTADO","t":"VARCHAR(25)"},{"n":"CTA_COST_LIN","t":"VARCHAR(25)"},{"n":"CTA_COST_VENT","t":"VARCHAR(25)"},{"n":"CTA_CREDITO_CXC","t":"VARCHAR(25)"},{"n":"CTA_CREDITO_CXP","t":"VARCHAR(25)"},{"n":"CTA_CXC","t":"VARCHAR(25)"},{"n":"CTA_CXP","t":"VARCHAR(25)"},{"n":"CTA_DEBITO_CXC","t":"VARCHAR(25)"},{"n":"CTA_DEBITO_CXP","t":"VARCHAR(25)"},{"n":"CTA_DESC_BONIF","t":"VARCHAR(25)"},{"n":"CTA_DESC_GRAL","t":"VARCHAR(25)"},{"n":"CTA_DESC_LIN","t":"VARCHAR(25)"},{"n":"CTA_DEV_VENTAS","t":"VARCHAR(25)"},{"n":"CTA_GAST_COM","t":"VARCHAR(25)"},{"n":"CTA_GASTO_RENTA","t":"VARCHAR(25)"},{"n":"CTA_IGV_NO_DOM","t":"VARCHAR(25)"},{"n":"CTA_IMP_BOLSA_CXC","t":"VARCHAR(25)"}]},"PAQ_DESC_GRUPO":{"m":"","d":"","f":[{"n":"GRUPO","t":"VARCHAR(6)"},{"n":"PAQUETE_DESCUENTO","t":"VARCHAR(12)"}]},"PAQ_DESC_REG_DESC":{"m":"","d":"","f":[{"n":"PAQUETE_DESCUENTO","t":"VARCHAR(12)"},{"n":"REGLA_DESCUENTO","t":"INT"}]},"PAQUETE":{"m":"","d":"","f":[{"n":"DESCRIPCION","t":"VARCHAR(40)"},{"n":"DOBLE_ASIENTO","t":"VARCHAR(1)"},{"n":"FECHA_ULT_ACCESO","t":"DATETIME"},{"n":"MARCADO","t":"VARCHAR(1)"},{"n":"PAQUETE","t":"VARCHAR(4)"},{"n":"ULTIMO_ASIENTO","t":"VARCHAR(10)"},{"n":"ULTIMO_ASIENTO_CORP","t":"VARCHAR(10)"},{"n":"ULTIMO_USUARIO","t":"VARCHAR(50)"},{"n":"USA_DOBLE_ASIENTO","t":"VARCHAR(1)"},{"n":"USUARIO_CREADOR","t":"VARCHAR(50)"}]},"PAQUETE_DESCUENTO":{"m":"","d":"Estructura de descuentos por volumen, cliente o condición comercial.","f":[{"n":"ACTIVO","t":"VARCHAR(1)"},{"n":"DESCRIPCION","t":"VARCHAR(254)"},{"n":"FECHA_HORA_FIN","t":"DATETIME"},{"n":"FECHA_HORA_INICIO","t":"DATETIME"},{"n":"FECHA_RIGE","t":"DATETIME"},{"n":"FECHA_VENCE","t":"DATETIME"},{"n":"NOTAS","t":"TEXT"},{"n":"PAQUETE_DESCUENTO","t":"VARCHAR(12)"},{"n":"TODA_TIENDA","t":"VARCHAR(1)"}]},"PAQUETE_INVENTARIO":{"m":"","d":"","f":[{"n":"DESCRIPCION","t":"VARCHAR(40)"},{"n":"FECHA_ULT_ACCESO","t":"DATETIME"},{"n":"PAQUETE_INVENTARIO","t":"VARCHAR(4)"},{"n":"ULTIMO_USUARIO","t":"VARCHAR(50)"},{"n":"USUARIO_CREADOR","t":"VARCHAR(50)"}]},"PAQUETE_INVENTARIO_SINCRO":{"m":"","d":"","f":[{"n":"DESCRIPCION","t":"VARCHAR(40)"},{"n":"FECHA_ULT_ACCESO","t":"DATETIME"},{"n":"ID_PDA","t":"VARCHAR(15)"},{"n":"ID_SINCRO","t":"VARCHAR(15)"},{"n":"PAQUETE_INVENTARIO","t":"VARCHAR(4)"},{"n":"ULTIMO_USUARIO","t":"VARCHAR(50)"},{"n":"USUARIO_CREADOR","t":"VARCHAR(50)"}]},"PARCIALIDADES_CC":{"m":"CC","d":"Parcialidades activas CC: saldos por cuota en moneda local y dólar.","f":[{"n":"DOCUMENTO_ORIGEN","t":"VARCHAR(50)"},{"n":"FECHA_PROYECTADA","t":"DATETIME"},{"n":"FECHA_RIGE","t":"DATETIME"},{"n":"FECHA_VENCE","t":"DATETIME"},{"n":"MONTO_AMORTIZA","t":"DECIMAL"},{"n":"MONTO_AMORTIZA_DOL","t":"DECIMAL"},{"n":"MONTO_AMORTIZA_LOC","t":"DECIMAL"},{"n":"MONTO_CUOTA","t":"DECIMAL"},{"n":"MONTO_CUOTA_DOL","t":"DECIMAL"},{"n":"MONTO_CUOTA_LOC","t":"DECIMAL"},{"n":"MONTO_GAN_OCASIONAL","t":"DECIMAL"},{"n":"MONTO_GAN_OCASIONAL_DOLAR","t":"DECIMAL"},{"n":"MONTO_GAN_OCASIONAL_LOCAL","t":"DECIMAL"},{"n":"MONTO_IMP_CREE1","t":"DECIMAL"},{"n":"MONTO_IMP_CREE1_DOLAR","t":"DECIMAL"},{"n":"MONTO_IMP_CREE1_LOCAL","t":"DECIMAL"},{"n":"MONTO_IMP_CREE2","t":"DECIMAL"},{"n":"MONTO_IMP_CREE2_DOLAR","t":"DECIMAL"},{"n":"MONTO_IMP_CREE2_LOCAL","t":"DECIMAL"},{"n":"MONTO_IMP_RENTA","t":"DECIMAL"},{"n":"MONTO_IMP_RENTA_DOLAR","t":"DECIMAL"},{"n":"MONTO_IMP_RENTA_LOCAL","t":"DECIMAL"},{"n":"MONTO_INTERES","t":"DECIMAL"},{"n":"MONTO_INTERES_DOL","t":"DECIMAL"},{"n":"MONTO_INTERES_LOC","t":"DECIMAL"}]},"PARCIALIDADES_CO":{"m":"CO","d":"Parcialidades de compras: cuotas de pago a proveedores.","f":[{"n":"DOCUMENTO_ORIGEN","t":"VARCHAR(50)"},{"n":"FECHA_PROYECTADA","t":"DATETIME"},{"n":"FECHA_RIGE","t":"DATETIME"},{"n":"FECHA_VENCE","t":"DATETIME"},{"n":"MONTO_AMORTIZA","t":"DECIMAL"},{"n":"MONTO_AMORTIZA_DOL","t":"DECIMAL"},{"n":"MONTO_AMORTIZA_LOC","t":"DECIMAL"},{"n":"MONTO_CUOTA","t":"DECIMAL"},{"n":"MONTO_CUOTA_DOL","t":"DECIMAL"},{"n":"MONTO_CUOTA_LOC","t":"DECIMAL"},{"n":"MONTO_GAN_OCASIONAL","t":"DECIMAL"},{"n":"MONTO_GAN_OCASIONAL_DOLAR","t":"DECIMAL"},{"n":"MONTO_GAN_OCASIONAL_LOCAL","t":"DECIMAL"},{"n":"MONTO_IMP_CREE1","t":"DECIMAL"},{"n":"MONTO_IMP_CREE1_DOLAR","t":"DECIMAL"},{"n":"MONTO_IMP_CREE1_LOCAL","t":"DECIMAL"},{"n":"MONTO_IMP_CREE2","t":"DECIMAL"},{"n":"MONTO_IMP_CREE2_DOLAR","t":"DECIMAL"},{"n":"MONTO_IMP_CREE2_LOCAL","t":"DECIMAL"},{"n":"MONTO_IMP_RENTA","t":"DECIMAL"},{"n":"MONTO_IMP_RENTA_DOLAR","t":"DECIMAL"},{"n":"MONTO_IMP_RENTA_LOCAL","t":"DECIMAL"},{"n":"MONTO_INTERES","t":"DECIMAL"},{"n":"MONTO_INTERES_DOL","t":"DECIMAL"},{"n":"MONTO_INTERES_LOC","t":"DECIMAL"}]},"PARCIALIDADES_CP":{"m":"CP","d":"Parcialidades activas CP: saldos pendientes por cuota de pago.","f":[{"n":"DOCUMENTO_ORIGEN","t":"VARCHAR(50)"},{"n":"FECHA_PROYECTADA","t":"DATETIME"},{"n":"FECHA_RIGE","t":"DATETIME"},{"n":"FECHA_VENCE","t":"DATETIME"},{"n":"MONTO_AMORTIZA","t":"DECIMAL"},{"n":"MONTO_AMORTIZA_DOL","t":"DECIMAL"},{"n":"MONTO_AMORTIZA_LOC","t":"DECIMAL"},{"n":"MONTO_CUOTA","t":"DECIMAL"},{"n":"MONTO_CUOTA_DOL","t":"DECIMAL"},{"n":"MONTO_CUOTA_LOC","t":"DECIMAL"},{"n":"MONTO_GAN_OCASIONAL","t":"DECIMAL"},{"n":"MONTO_GAN_OCASIONAL_DOLAR","t":"DECIMAL"},{"n":"MONTO_GAN_OCASIONAL_LOCAL","t":"DECIMAL"},{"n":"MONTO_IMP_CREE1","t":"DECIMAL"},{"n":"MONTO_IMP_CREE1_DOLAR","t":"DECIMAL"},{"n":"MONTO_IMP_CREE1_LOCAL","t":"DECIMAL"},{"n":"MONTO_IMP_CREE2","t":"DECIMAL"},{"n":"MONTO_IMP_CREE2_DOLAR","t":"DECIMAL"},{"n":"MONTO_IMP_CREE2_LOCAL","t":"DECIMAL"},{"n":"MONTO_IMP_RENTA","t":"DECIMAL"},{"n":"MONTO_IMP_RENTA_DOLAR","t":"DECIMAL"},{"n":"MONTO_IMP_RENTA_LOCAL","t":"DECIMAL"},{"n":"MONTO_INTERES","t":"DECIMAL"},{"n":"MONTO_INTERES_DOL","t":"DECIMAL"},{"n":"MONTO_INTERES_LOC","t":"DECIMAL"}]},"PARTICIPANTE":{"m":"","d":"","f":[{"n":"CONJUNTO","t":"VARCHAR(10)"},{"n":"NIT","t":"VARCHAR(20)"},{"n":"PARTICIPANTE","t":"VARCHAR(15)"},{"n":"PORC_PARTICIPACION","t":"DECIMAL"}]},"PARTIDA":{"m":"","d":"","f":[{"n":"CENTRO_COSTO","t":"VARCHAR(25)"},{"n":"CONVERSION","t":"VARCHAR(1)"},{"n":"CUENTA_CONTABLE","t":"VARCHAR(25)"},{"n":"DESCRIPCION","t":"VARCHAR(200)"},{"n":"PARTIDA","t":"VARCHAR(51)"},{"n":"TIPO_FLUJO_CAJA","t":"VARCHAR(1)"}]},"PED_GUARD_CE_LINEA":{"m":"","d":"","f":[{"n":"ARTICULO","t":"VARCHAR(20)"},{"n":"CANTIDAD_BONIFICADA","t":"FLOAT"},{"n":"CANTIDAD_PEDIDA","t":"FLOAT"},{"n":"Monto_Descuento","t":"FLOAT"},{"n":"PEDIDO","t":"VARCHAR(12)"},{"n":"PEDIDO_LINEA","t":"INT"},{"n":"PORC_DESCUENTO","t":"FLOAT"},{"n":"PRECIO_UNITARIO","t":"FLOAT"},{"n":"TOTAL_LINEA","t":"FLOAT"}]},"PEDIDO":{"m":"FA","d":"Cabecera de pedidos de venta. Estado, cliente, fechas, bodega y condiciones comerciales.","f":[{"n":"ACT_COM_RECEPTOR","t":"VARCHAR(10)"},{"n":"ACTIVIDAD_COMERCIAL","t":"VARCHAR(10)"},{"n":"AUTORIZADO","t":"VARCHAR(1)"},{"n":"BACKORDER","t":"VARCHAR(1)"},{"n":"BASE_IMPUESTO1","t":"DECIMAL"},{"n":"BASE_IMPUESTO2","t":"DECIMAL"},{"n":"BODEGA","t":"VARCHAR(4)"},{"n":"BODEGA_EMBARQUE","t":"VARCHAR(4)"},{"n":"CAMBIOS_COTI","t":"VARCHAR(254)"},{"n":"CLASE_PEDIDO","t":"VARCHAR(1)"},{"n":"CLAVE_REFERENCIA_DE","t":"VARCHAR(50)"},{"n":"CLIENTE","t":"VARCHAR(20)"},{"n":"CLIENTE_CORPORAC","t":"VARCHAR(20)"},{"n":"CLIENTE_DIRECCION","t":"VARCHAR(20)"},{"n":"CLIENTE_ORIGEN","t":"VARCHAR(20)"},{"n":"COBRADOR","t":"VARCHAR(4)"},{"n":"CODIGO_REFERENCIA_DE","t":"VARCHAR(2)"},{"n":"CODIGO_REFERENCIA_OTRO","t":"VARCHAR(100)"},{"n":"COMENTARIO_CXC","t":"VARCHAR(249)"},{"n":"CONDICION_PAGO","t":"VARCHAR(4)"},{"n":"CONSECUTIVO_FTC","t":"VARCHAR(10)"},{"n":"CONTRATO","t":"VARCHAR(20)"},{"n":"CONTRATO_AC","t":"VARCHAR(10)"},{"n":"CONTRATO_REVENTA","t":"VARCHAR(1)"},{"n":"CONTRATO_VIGENCIA_DESDE","t":"DATETIME"}]},"PEDIDO_AUTORIZA":{"m":"FA","d":"","f":[{"n":"APROBADA","t":"VARCHAR(1)"},{"n":"APROBADA_CREDITO","t":"VARCHAR(1)"},{"n":"APROBADA_VENTAS","t":"VARCHAR(1)"},{"n":"COBRO_JUDICIAL","t":"VARCHAR(1)"},{"n":"COMENTARIO","t":"TEXT"},{"n":"CONSECUTIVO","t":"INT"},{"n":"DCTO_GENERAL","t":"VARCHAR(1)"},{"n":"DIAS_ATRASO","t":"VARCHAR(1)"},{"n":"DOC_VENCIDO","t":"VARCHAR(1)"},{"n":"FACTURA","t":"VARCHAR(50)"},{"n":"FECHA_HORA","t":"DATETIME"},{"n":"FECHA_HORA_CREDITO","t":"DATETIME"},{"n":"FECHA_HORA_VENTAS","t":"DATETIME"},{"n":"LIM_CREDITO","t":"VARCHAR(1)"},{"n":"MARGEN_ARTICULO","t":"VARCHAR(1)"},{"n":"MONTO_MINIMO","t":"VARCHAR(1)"},{"n":"PEDIDO","t":"VARCHAR(50)"},{"n":"SIN_OC","t":"VARCHAR(1)"},{"n":"TIPO_DOCUMENTO","t":"VARCHAR(1)"},{"n":"USUARIO","t":"VARCHAR(50)"},{"n":"USUARIO_CREDITO","t":"VARCHAR(50)"},{"n":"USUARIO_VENTAS","t":"VARCHAR(50)"},{"n":"VALOR_VENTA_MENOR","t":"VARCHAR(1)"},{"n":"VIGENTE","t":"VARCHAR(1)"}]},"PEDIDO_EDI":{"m":"FA","d":"","f":[{"n":"CEDULAJURIDICA_COMPRADOR","t":"VARCHAR(20)"},{"n":"CEDULAJURIDICA_LUGARENTREGA","t":"VARCHAR(20)"},{"n":"CONTACTO_COMPRADOR","t":"VARCHAR(35)"},{"n":"CONTACTO_LUGARENTREGA","t":"VARCHAR(35)"},{"n":"DEPARTAMENTO_COMPRADOR","t":"VARCHAR(17)"},{"n":"DEPARTAMENTO_LUGARENTREGA","t":"VARCHAR(17)"},{"n":"ESTADO","t":"VARCHAR(1)"},{"n":"FECHA_EMISION_ORDEN","t":"DATETIME"},{"n":"FECHA_ENTREGA","t":"DATETIME"},{"n":"GLN_COMPRADOR","t":"VARCHAR(13)"},{"n":"GLN_LUGARENTREGA","t":"VARCHAR(13)"},{"n":"INFORMACION_ADICIONAL","t":"VARCHAR(350)"},{"n":"NOMBRE_EMPRESA_LUGARENTREGA","t":"VARCHAR(80)"},{"n":"NOMBREEMPRESACOMPRADOR","t":"VARCHAR(80)"},{"n":"NUMEROORDEN","t":"VARCHAR(30)"},{"n":"PEDIDO","t":"VARCHAR(50)"},{"n":"PORTON_ENTREGA","t":"VARCHAR(3)"},{"n":"SUBTOTAL_ORDEN","t":"DECIMAL"},{"n":"TELEFONO_COMPRADOR","t":"VARCHAR(25)"},{"n":"TELEFONO_LUGARENTREGA","t":"VARCHAR(25)"},{"n":"TOTAL_DESCUENTOS","t":"DECIMAL"},{"n":"TOTAL_IMPUESTOS","t":"DECIMAL"},{"n":"TOTAL_ORDEN","t":"DECIMAL"},{"n":"URGENTE","t":"VARCHAR(1)"}]},"PEDIDO_GUARDADO_CE":{"m":"FA","d":"","f":[{"n":"CLIENTE","t":"VARCHAR(20)"},{"n":"CONDICION_PAGO","t":"VARCHAR(4)"},{"n":"DESCUENTO","t":"FLOAT"},{"n":"FECHA_PEDIDO","t":"DATETIME"},{"n":"OBSERVACIONES","t":"TEXT"},{"n":"PEDIDO","t":"VARCHAR(50)"},{"n":"TOTAL_IMPUESTO1","t":"FLOAT"},{"n":"TOTAL_IMPUESTO2","t":"FLOAT"},{"n":"TOTAL_MERCADERIA","t":"FLOAT"},{"n":"TOTAL_PEDIDO","t":"FLOAT"}]},"PEDIDO_INTERNET":{"m":"FA","d":"Detalle de transacción con cantidades y valores unitarios.","f":[{"n":"ARTICULO","t":"VARCHAR(20)"},{"n":"CANTIDAD","t":"FLOAT"},{"n":"CLIENTE","t":"VARCHAR(20)"},{"n":"PRECIO","t":"FLOAT"}]},"PEDIDO_LINEA":{"m":"FA","d":"","f":[{"n":"ARTICULO","t":"VARCHAR(20)"},{"n":"BODEGA","t":"VARCHAR(4)"},{"n":"CANTIDAD_A_FACTURA","t":"DECIMAL"},{"n":"CANTIDAD_BONIFICAD","t":"DECIMAL"},{"n":"CANTIDAD_CANCELADA","t":"DECIMAL"},{"n":"CANTIDAD_FACTURADA","t":"DECIMAL"},{"n":"CANTIDAD_PEDIDA","t":"DECIMAL"},{"n":"CANTIDAD_RESERVADA","t":"DECIMAL"},{"n":"CENTRO_COSTO","t":"VARCHAR(25)"},{"n":"COMENTARIO","t":"VARCHAR(100)"},{"n":"CUENTA_CONTABLE","t":"VARCHAR(25)"},{"n":"DESCRIPCION","t":"TEXT"},{"n":"ES_CANASTA_BASICA","t":"VARCHAR(1)"},{"n":"ES_OTRO_CARGO","t":"VARCHAR(1)"},{"n":"ESTADO","t":"VARCHAR(1)"},{"n":"FASE","t":"VARCHAR(25)"},{"n":"FECHA_ENTREGA","t":"DATETIME"},{"n":"FECHA_PROMETIDA","t":"DATETIME"},{"n":"LINEA_ORDEN_COMPRA","t":"INT"},{"n":"LINEA_USUARIO","t":"INT"},{"n":"LOCALIZACION","t":"VARCHAR(8)"},{"n":"LOTE","t":"VARCHAR(15)"},{"n":"MONTO_DESCUENTO","t":"DECIMAL"},{"n":"MONTO_EXONERACION","t":"DECIMAL"},{"n":"MONTO_EXONERACION2","t":"DECIMAL"}]},"PEDIDO_SOLICITUD_LINEA":{"m":"FA","d":"","f":[{"n":"PEDIDO","t":"VARCHAR(50)"},{"n":"PEDIDO_LINEA","t":"INT"},{"n":"SOLICITUD_OC","t":"VARCHAR(10)"},{"n":"SOLICITUD_OC_LINEA","t":"INT"}]},"PEDIDO_SUGERIDO":{"m":"FA","d":"","f":[{"n":"ARTICULO","t":"VARCHAR(20)"},{"n":"CANT_SUG_AJUSTADA","t":"DECIMAL"},{"n":"CANTIDAD_SUGERIDA","t":"DECIMAL"},{"n":"CLASIFICACION1","t":"VARCHAR(12)"},{"n":"CLASIFICACION2","t":"VARCHAR(12)"},{"n":"CLASIFICACION3","t":"VARCHAR(12)"},{"n":"CLASIFICACION4","t":"VARCHAR(12)"},{"n":"CLASIFICACION5","t":"VARCHAR(12)"},{"n":"CLASIFICACION6","t":"VARCHAR(12)"},{"n":"CONSUMO_PROMEDIO","t":"DECIMAL"},{"n":"ESTADO","t":"VARCHAR(1)"},{"n":"FECHA_HORA_GENERAC","t":"DATETIME"},{"n":"FECHA_HORA_SOLICIT","t":"DATETIME"},{"n":"INVENTARIO_ACTUAL","t":"DECIMAL"},{"n":"INVENTARIO_MAXIMO","t":"DECIMAL"},{"n":"INVENTARIO_TRANSIT","t":"DECIMAL"},{"n":"PRECIO_TOTAL","t":"DECIMAL"},{"n":"PRECIO_UNITARIO","t":"DECIMAL"},{"n":"PROVEEDOR","t":"VARCHAR(20)"},{"n":"REFERENCIA_PEDIDO","t":"DECIMAL"},{"n":"SOLICITUD_OC","t":"VARCHAR(10)"},{"n":"USUARIO_GENERACION","t":"VARCHAR(50)"},{"n":"USUARIO_SOLICITUD","t":"VARCHAR(50)"}]},"PEDIDO_USUARIO":{"m":"FA","d":"Usuarios del sistema: credenciales, perfil, estado y auditoría.","f":[{"n":"CODIGO","t":"VARCHAR(40)"},{"n":"PEDIDO","t":"VARCHAR(50)"}]},"PEDIMENTO":{"m":"","d":"","f":[{"n":"ADUANA","t":"VARCHAR(12)"},{"n":"AGENTE_ADUANAL","t":"VARCHAR(12)"},{"n":"FECHA","t":"DATETIME"},{"n":"PEDIMENTO","t":"VARCHAR(15)"}]},"PEDIMENTO_LOTE":{"m":"CI","d":"Control de lotes de producción/compra. Trazabilidad y vencimientos.","f":[{"n":"ARTICULO","t":"VARCHAR(20)"},{"n":"LOTE","t":"VARCHAR(15)"},{"n":"PEDIMENTO","t":"VARCHAR(15)"}]},"PERIODO_CONTABLE":{"m":"CG","d":"Períodos contables del ejercicio. Estado (abierto/cerrado) y fechas.","f":[{"n":"CONTABILIDAD","t":"VARCHAR(1)"},{"n":"DESCRIPCION","t":"VARCHAR(40)"},{"n":"ESTADO","t":"VARCHAR(1)"},{"n":"FECHA_FINAL","t":"DATETIME"},{"n":"FIN_PERIODO_ANUAL","t":"VARCHAR(1)"}]},"PERIODO_NOMINA":{"m":"CN","d":"","f":[{"n":"NOMBRE","t":"VARCHAR(254)"},{"n":"PERIODO_NOMINA","t":"VARCHAR(10)"}]},"PEW_BITACORA_DESPACHADOR":{"m":"","d":"Registro de auditoría y trazabilidad de cambios en el sistema.","f":[{"n":"CANTIDAD_DESPACHADA","t":"INT"},{"n":"CODIGO_PEDIDO","t":"VARCHAR(10)"},{"n":"CODIGO_PRODUCTO","t":"VARCHAR(10)"},{"n":"FECHA","t":"DATETIME"},{"n":"USUARIO","t":"VARCHAR(249)"}]},"PEW_CLIENTE_CONDUCTORES":{"m":"","d":"","f":[{"n":"CEDULA","t":"VARCHAR(12)"},{"n":"CLIENTE","t":"VARCHAR(20)"},{"n":"CODIGO","t":"INT"},{"n":"CODIGO_CONDUCTOR","t":"INT"}]},"PEW_COMPOSICION_CONSOLIDACION":{"m":"","d":"","f":[{"n":"CANTIDAD_CONSOLIDADO","t":"INT"},{"n":"ID_CONSOLIDACION","t":"INT"},{"n":"ID_DETALLE","t":"INT"},{"n":"USUARIO","t":"VARCHAR(50)"}]},"PEW_CONDICION_PAGO_CLIENTE_FAMILIA":{"m":"","d":"","f":[{"n":"CLIENTE","t":"VARCHAR(20)"},{"n":"CONDICION_PAGO","t":"VARCHAR(4)"},{"n":"FAMILIA","t":"VARCHAR(12)"}]},"PEW_CONDUCTORES":{"m":"","d":"Tabla de catálogo/maestro de referencia con código y descripción.","f":[{"n":"ACTIVO","t":"VARCHAR(1)"},{"n":"APELLIDO","t":"VARCHAR(40)"},{"n":"CEDULA","t":"VARCHAR(12)"},{"n":"CODIGO","t":"INT"},{"n":"COMENTARIOS","t":"VARCHAR(249)"},{"n":"INSTANCIA","t":"VARCHAR(40)"},{"n":"NOMBRE","t":"VARCHAR(40)"},{"n":"TELEFONO","t":"VARCHAR(10)"}]},"PEW_CONSOLIDACION":{"m":"","d":"","f":[{"n":"ESTADO_CONSOLIDACION","t":"VARCHAR(15)"},{"n":"FECHA_CREACION","t":"DATETIME"},{"n":"FECHA_EXPORTACION","t":"DATETIME"},{"n":"ID_CONSOLIDACION","t":"INT"},{"n":"RUBRO1","t":"VARCHAR(50)"},{"n":"RUBRO2","t":"VARCHAR(50)"},{"n":"RUBRO3","t":"VARCHAR(150)"},{"n":"RUBRO4","t":"VARCHAR(50)"},{"n":"USUARIO_CREACION","t":"VARCHAR(50)"}]},"PEW_DETALLE_CONSOLIDACION":{"m":"","d":"","f":[{"n":"CANTIDAD_CONSOLIDAR","t":"INT"},{"n":"CANTIDAD_EXISTENCIA","t":"INT"},{"n":"CANTIDAD_PEDIDA","t":"INT"},{"n":"CODIGO_ARTICULO","t":"VARCHAR(50)"},{"n":"CODIGO_PEDIDO","t":"VARCHAR"},{"n":"DESCRIPCION_ARTICULO","t":"VARCHAR(70)"},{"n":"ID_CONSOLIDACION","t":"INT"},{"n":"ID_DETALLE","t":"INT"},{"n":"NUMERO_PEDIDO","t":"VARCHAR(150)"},{"n":"PEDIDO_LINEA","t":"VARCHAR(10)"},{"n":"UND_EMPAQUE","t":"VARCHAR(50)"}]},"PEW_FAMILIA_TIPO_DOCUMENTO":{"m":"","d":"","f":[{"n":"DESCRIPCION","t":"VARCHAR(100)"},{"n":"DOC_A_GENERAR","t":"VARCHAR(3)"},{"n":"FAMILIA","t":"VARCHAR(12)"},{"n":"TIPO_DOC_CC","t":"VARCHAR(3)"}]},"PEW_NOTIFICACIONES":{"m":"","d":"","f":[{"n":"ASUNTO","t":"VARCHAR(100)"},{"n":"CONFIRMACION_RECIBIDO","t":"VARCHAR(1)"},{"n":"CORREO_NOTIFICACION","t":"VARCHAR(249)"},{"n":"FECHA_ENVIADO","t":"DATETIME"},{"n":"TIPO_NOTIFICACION","t":"VARCHAR(10)"}]},"PEW_OBTENERLISTAUSUARIOS":{"m":"","d":"Usuarios del sistema: credenciales, perfil, estado y auditoría.","f":[{"n":"CORREO_ELECTRONICO","t":"VARCHAR(249)"},{"n":"ID_DETALLE","t":"INT"},{"n":"ID_PRESUPUESTO","t":"INT"},{"n":"ID_PRESUPUESTO_MENSUAL","t":"INT"},{"n":"MES","t":"VARCHAR(10)"},{"n":"MONTO","t":"DECIMAL"},{"n":"NOMBRE","t":"VARCHAR(100)"},{"n":"PORCENTAJE","t":"VARCHAR(5)"},{"n":"PUESTO","t":"VARCHAR(40)"}]},"PEW_PARAMETROS":{"m":"","d":"Parámetros de configuración del módulo.","f":[{"n":"ACT_SFC","t":"BIT"},{"n":"ACTIVA_MANT_CAJAS","t":"VARCHAR(20)"},{"n":"ACTIVAR_CONSULTA_ARTICULO_BODEGAS","t":"BIT"},{"n":"Activar_Minimos","t":"BIT"},{"n":"ACTIVAR_REPLYTO_CORREO_USUARIO","t":"BIT"},{"n":"ACTIVAR_TIPO_CAMBIO","t":"VARCHAR(1)"},{"n":"ADJUNTOS_PEDIDO_COMPANIA","t":"BIT"},{"n":"ANALISIS_VENCIMIENTO","t":"VARCHAR"},{"n":"Arrastrar_Monto_Cierre_Caja","t":"VARCHAR(1)"},{"n":"CATEGORIA_AGRUPACION_EQUIPO_PRESTAMO","t":"INT"},{"n":"CC_ConsecutivoDoc_Deposito","t":"VARCHAR(20)"},{"n":"CC_ConsecutivoDoc_NC","t":"VARCHAR(20)"},{"n":"CC_ConsecutivoDoc_ND","t":"VARCHAR(20)"},{"n":"CC_ConsecutivoDoc_Recibos","t":"VARCHAR(20)"},{"n":"CC_ConsecutivoDoc_TEF","t":"VARCHAR(20)"},{"n":"CC_EncargadoCxC","t":"VARCHAR(100)"},{"n":"CC_Permite_Aplicar_Docs","t":"VARCHAR(1)"},{"n":"CC_Usa_Pagos_Diferidos","t":"VARCHAR(1)"},{"n":"CE_Activa_Conta_General","t":"VARCHAR(1)"},{"n":"CE_ACTIVA_DESCUENTO_ESPECIAL_CLIENTE_CLAS_3","t":"VARCHAR(1)"},{"n":"CE_Activa_Equipos_a_Prestamo","t":"BIT"},{"n":"CE_Activa_Facturacion_Recurrente_Contratos","t":"VARCHAR(10)"},{"n":"CE_Activa_Mant_Agrupacion","t":"VARCHAR(1)"},{"n":"CE_Activa_Mant_Articulo","t":"VARCHAR(1)"},{"n":"CE_Activa_Mant_Bodega","t":"VARCHAR(1)"}]},"PEW_PARAMETROS_FAC":{"m":"","d":"Parámetros de configuración del módulo.","f":[{"n":"ACTIVA_CONTROL_HORAS","t":"BIT"},{"n":"ACTIVA_FACTURACION_RECURRENTE","t":"BIT"},{"n":"COMENTARIO_FACTURA","t":"VARCHAR(100)"},{"n":"LICENCIA_CONTRATO","t":"VARCHAR(100)"},{"n":"NOMBRE_INSTANCIA","t":"VARCHAR(40)"}]},"PEW_PARAMETROS_HR":{"m":"","d":"Parámetros de configuración del módulo.","f":[{"n":"CE_aticulo_hab_adicional","t":"VARCHAR(100)"},{"n":"CE_Estado_Pedido","t":"VARCHAR(1)"},{"n":"CE_label_clasf1_hab","t":"VARCHAR(100)"},{"n":"CE_label_clasf2_hab","t":"VARCHAR(100)"},{"n":"CE_label_clasf3_hab","t":"VARCHAR(100)"},{"n":"CE_label_clasf4_hab","t":"VARCHAR(100)"},{"n":"CE_label_clasf5_hab","t":"VARCHAR(100)"},{"n":"INSTANCIA","t":"VARCHAR(100)"}]},"PEW_PARAMETROS_TSMP":{"m":"","d":"Parámetros de configuración del módulo.","f":[{"n":"AVISO_CITA","t":"INT"},{"n":"CE_MOSTRAR_TODOS","t":"BIT"},{"n":"CELULAR_EMPRESA_MENSAJE","t":"VARCHAR(100)"},{"n":"CONSECUTIVO_MACHOTE_PEDIDO","t":"VARCHAR(25)"},{"n":"EMAIL_EMPRESA_MENSAJE","t":"VARCHAR(100)"},{"n":"FRECUENCIA_WS_OS","t":"INT"},{"n":"GN_Permitir_ACTIVIDADES_EN_CUALQUIER_ESTADO","t":"VARCHAR(1)"},{"n":"GN_Permitir_Presupuesto_Cualquier_Estado","t":"VARCHAR(1)"},{"n":"LABEL_ACCESORIOS","t":"VARCHAR(50)"},{"n":"LABEL_FALLAS","t":"VARCHAR(50)"},{"n":"LABEL_ORDENSERVICIO","t":"VARCHAR(50)"},{"n":"LABEL_SUCURSAL","t":"VARCHAR(50)"},{"n":"NOMBRE_EMPRESA_MENSAJE","t":"VARCHAR(100)"},{"n":"NOMBRE_INSTANCIA","t":"VARCHAR(40)"},{"n":"OcultarColumnaFirmaClienteEnImpresion","t":"BIT"},{"n":"PP_ASIGNAR_A_JEFE_TECNICO","t":"BIT"},{"n":"REPROGRAMACION_CITA","t":"INT"},{"n":"TS_Activa_Mant_Accesorios","t":"VARCHAR(1)"},{"n":"TS_Activa_Mant_Boletas","t":"VARCHAR(1)"},{"n":"TS_Activa_Mant_Equipo","t":"VARCHAR(1)"},{"n":"TS_Activa_Mant_Fallas","t":"VARCHAR(1)"},{"n":"TS_Activa_Mant_Sucursales","t":"VARCHAR(1)"},{"n":"TS_ACTIVAR_ACT_TAREAS_PROYECTO","t":"VARCHAR(1)"},{"n":"TS_Clasificaciones_Articulos","t":"VARCHAR(700)"},{"n":"TS_Cod_Art_Terminado_Personifica","t":"VARCHAR(20)"}]},"PEW_PEDIDO_TRANSPORTE":{"m":"","d":"","f":[{"n":"CEDULA_CONDUCTOR","t":"VARCHAR(400)"},{"n":"CODIGO_PEDIDO","t":"VARCHAR(40)"},{"n":"COMENTARIO","t":"TEXT"},{"n":"CORREO_NOTIFICACION","t":"VARCHAR(249)"},{"n":"Error_TomaDeArticulos","t":"TEXT"},{"n":"IMPRIME_DESPACHO","t":"VARCHAR(10)"},{"n":"PLACA_TRANSPORTE","t":"VARCHAR(400)"},{"n":"RUBRO_1","t":"VARCHAR(700)"}]},"PEW_TRANSPORTISTA":{"m":"","d":"","f":[{"n":"ACTIVO","t":"VARCHAR(1)"},{"n":"CLIENTE","t":"VARCHAR(20)"},{"n":"CODIGO","t":"INT"},{"n":"COMENTARIOS","t":"VARCHAR(249)"},{"n":"CONTACTO","t":"VARCHAR(40)"},{"n":"EMPRESA","t":"VARCHAR(40)"},{"n":"INSTANCIA","t":"VARCHAR(40)"},{"n":"TELEFONO","t":"VARCHAR(40)"}]},"PEW_TRANSPORTISTA_PLACAS":{"m":"","d":"","f":[{"n":"CLIENTE","t":"VARCHAR(20)"},{"n":"CODIGO","t":"INT"},{"n":"CODIGO_TRANSPORTISTA","t":"INT"},{"n":"INSTANCIA","t":"VARCHAR(40)"},{"n":"PLACA","t":"VARCHAR(80)"}]},"PEW_USUARIO_BODEGA":{"m":"","d":"Catálogo de bodegas/almacenes con parámetros logísticos.","f":[{"n":"BODEGA","t":"VARCHAR(4)"},{"n":"USUARIO","t":"VARCHAR(249)"}]},"PEW_USUARIO_BODEGA_LOCALIZACION":{"m":"","d":"Catálogo de bodegas/almacenes con parámetros logísticos.","f":[{"n":"BODEGA","t":"VARCHAR(4)"},{"n":"LOCALIZACION","t":"VARCHAR(8)"},{"n":"LOTE","t":"VARCHAR(10)"},{"n":"USUARIO","t":"VARCHAR(249)"}]},"PEW_USUARIO_CONDUCTORES":{"m":"","d":"Usuarios del sistema: credenciales, perfil, estado y auditoría.","f":[{"n":"CEDULA","t":"VARCHAR(12)"},{"n":"Codigo","t":"INT"},{"n":"CORREO_ELECTRONICO","t":"VARCHAR(249)"}]},"PEW_USUARIOS":{"m":"","d":"Usuarios del sistema: credenciales, perfil, estado y auditoría.","f":[{"n":"ACTIVA_ADMIN_AGENTE","t":"VARCHAR(1)"},{"n":"ACTIVA_CAMPANAS","t":"VARCHAR(1)"},{"n":"ACTIVA_CONTROL_INVENTARIO","t":"VARCHAR(1)"},{"n":"ACTIVA_CUOTA_AGENTE","t":"VARCHAR(30)"},{"n":"ACTIVA_FACTURACION","t":"VARCHAR(1)"},{"n":"Activa_Facturacion_Recurrente_Contratos","t":"BIT"},{"n":"ACTIVA_LOGISTICA_EMBARQUE","t":"VARCHAR(1)"},{"n":"ACTIVA_MANT_ACCESORIOS","t":"VARCHAR(1)"},{"n":"ACTIVA_MANT_AGRUPACION","t":"VARCHAR(1)"},{"n":"ACTIVA_MANT_ARTICULOS","t":"VARCHAR(1)"},{"n":"ACTIVA_MANT_BODEGAS","t":"VARCHAR(1)"},{"n":"ACTIVA_MANT_BOLETAS","t":"VARCHAR(1)"},{"n":"ACTIVA_MANT_CAJAS","t":"VARCHAR(1)"},{"n":"Activa_Mant_Citas","t":"VARCHAR(1)"},{"n":"ACTIVA_MANT_CLIENTES","t":"VARCHAR(1)"},{"n":"ACTIVA_MANT_COMPANIA","t":"VARCHAR(1)"},{"n":"ACTIVA_MANT_CONDUCTORES","t":"VARCHAR(1)"},{"n":"ACTIVA_MANT_EQUIPOS","t":"VARCHAR(1)"},{"n":"ACTIVA_MANT_FALLAS","t":"VARCHAR(1)"},{"n":"ACTIVA_MANT_NIVEL_PRECIO","t":"VARCHAR(1)"},{"n":"ACTIVA_MANT_NUEVO_CLASIF","t":"VARCHAR(1)"},{"n":"Activa_Mant_Presupuestos","t":"VARCHAR(1)"},{"n":"ACTIVA_MANT_PROVEEDORES","t":"VARCHAR(1)"},{"n":"ACTIVA_MANT_SUCURSALES","t":"VARCHAR(1)"},{"n":"ACTIVA_MANT_TRANS_CAJAS","t":"VARCHAR(1)"}]},"PILA_HISTORICO":{"m":"","d":"","f":[{"n":"AP_APORTE_FON_SUB_SOL","t":"DECIMAL"},{"n":"AP_APORTE_FON_SUB_SUB","t":"DECIMAL"},{"n":"AP_CODIGO_ADMIN","t":"VARCHAR(6)"},{"n":"AP_COT_OBLIGATORIAS","t":"DECIMAL"},{"n":"AP_COT_VOL_AFILIADOS","t":"DECIMAL"},{"n":"AP_COT_VOL_APORTANTE","t":"DECIMAL"},{"n":"AP_DIAS_MORA_LIQ","t":"DECIMAL"},{"n":"AP_DIGITO_VERIFICADOR","t":"VARCHAR(1)"},{"n":"AP_INT_MORA_LIQ","t":"DECIMAL"},{"n":"AP_INT_MORA_SOL","t":"DECIMAL"},{"n":"AP_INT_MORA_SUB","t":"DECIMAL"},{"n":"AP_NIT_ADMIN","t":"VARCHAR(16)"},{"n":"ARP_APOR_OTROS_SIST","t":"DECIMAL"},{"n":"ARP_CODIGO_ARL","t":"VARCHAR(6)"},{"n":"ARP_DIAS_MORA_LIQ","t":"DECIMAL"},{"n":"ARP_DIGITO_VERIFICADOR","t":"VARCHAR(1)"},{"n":"ARP_FORMULARIO","t":"VARCHAR(10)"},{"n":"ARP_INT_MORA","t":"DECIMAL"},{"n":"ARP_NETOS_APORTES","t":"DECIMAL"},{"n":"ARP_NIT_ARL","t":"VARCHAR(16)"},{"n":"ARP_NUM_AUTORIZACION","t":"DECIMAL"},{"n":"ARP_RIESGOS_LABORALES","t":"DECIMAL"},{"n":"ARP_SALDO_FAVOR","t":"DECIMAL"},{"n":"ARP_SUBTOTAL_APORTES","t":"DECIMAL"},{"n":"ARP_TOTAL_AFILIADOS","t":"DECIMAL"}]},"PILA_HISTORICO_DET":{"m":"","d":"","f":[{"n":"ACTIVIDAD","t":"VARCHAR(7)"},{"n":"ADM_PENSIONES","t":"VARCHAR(6)"},{"n":"ADM_RIESGOS_PROF","t":"VARCHAR(6)"},{"n":"ADM_TRASLADO","t":"VARCHAR(6)"},{"n":"APOR_FON_SOLI","t":"DECIMAL"},{"n":"APOR_FON_SUBS","t":"DECIMAL"},{"n":"APORTE_VOL_AFIL_PEN","t":"DECIMAL"},{"n":"APORTE_VOL_APOR_PEN","t":"DECIMAL"},{"n":"AUTOR_IEG","t":"VARCHAR(15)"},{"n":"AUTOR_LMA","t":"VARCHAR(15)"},{"n":"AVP","t":"VARCHAR(1)"},{"n":"CCF_PERTENECE","t":"VARCHAR(6)"},{"n":"CENTRO_TRABAJO","t":"DECIMAL"},{"n":"CLASE_RIESGO","t":"VARCHAR(1)"},{"n":"CODIGO_DEPTO","t":"VARCHAR(2)"},{"n":"CODIGO_MUNICIPIO","t":"VARCHAR(3)"},{"n":"COLOMBIANO_EXTERIOR","t":"VARCHAR(1)"},{"n":"CORRECCIONES","t":"VARCHAR(1)"},{"n":"COT_EXONERADO","t":"VARCHAR(1)"},{"n":"COT_OBLI_SALUD","t":"DECIMAL"},{"n":"COT_OBLI_SIST_RIESGOS","t":"DECIMAL"},{"n":"COT_OBLIG_PENSIONES","t":"DECIMAL"},{"n":"COT_SIST_PENSIONES","t":"DECIMAL"},{"n":"DIAS_COMPENSA","t":"INT"},{"n":"DIAS_PENSION","t":"INT"}]},"PISTA_EXISTEN_DET":{"m":"CI","d":"","f":[{"n":"ARTICULO","t":"VARCHAR(20)"},{"n":"BODEGA","t":"VARCHAR(4)"},{"n":"CANT_DISPONIBLE","t":"DECIMAL"},{"n":"CANT_NO_APROBADA","t":"DECIMAL"},{"n":"CANT_REMITIDA","t":"DECIMAL"},{"n":"CANT_RESERVADA","t":"DECIMAL"},{"n":"CANT_VENCIDA","t":"DECIMAL"},{"n":"COSTO_COMP_DOL","t":"DECIMAL"},{"n":"COSTO_COMP_LOC","t":"DECIMAL"},{"n":"COSTO_FISCAL_DOL","t":"DECIMAL"},{"n":"COSTO_FISCAL_LOC","t":"DECIMAL"},{"n":"FECHA","t":"DATETIME"},{"n":"LOCALIZACION","t":"VARCHAR(8)"},{"n":"LOTE","t":"VARCHAR(15)"}]},"PISTA_EXISTENCIA":{"m":"CI","d":"","f":[{"n":"FECHA","t":"DATETIME"},{"n":"REFERENCIA","t":"VARCHAR(50)"},{"n":"USUARIO","t":"VARCHAR(50)"}]},"PLAN_PAGO_DOC":{"m":"CC","d":"Plan de pagos por documento: cuotas, fechas de vencimiento y saldos.","f":[{"n":"CONSECUTIVO_PAGO","t":"INT"},{"n":"DOCUMENTO","t":"VARCHAR(50)"},{"n":"FECHA_PROYECTADA","t":"DATETIME"},{"n":"FECHA_RIGE","t":"DATETIME"},{"n":"FECHA_VENCE","t":"DATETIME"},{"n":"MONTO_AMORTIZA","t":"DECIMAL"},{"n":"MONTO_CUOTA","t":"DECIMAL"},{"n":"MONTO_GAN_OCASIONAL","t":"DECIMAL"},{"n":"MONTO_GAN_OCASIONAL_DOLAR","t":"DECIMAL"},{"n":"MONTO_GAN_OCASIONAL_LOCAL","t":"DECIMAL"},{"n":"MONTO_IMP_CREE1","t":"DECIMAL"},{"n":"MONTO_IMP_CREE1_DOLAR","t":"DECIMAL"},{"n":"MONTO_IMP_CREE1_LOCAL","t":"DECIMAL"},{"n":"MONTO_IMP_CREE2","t":"DECIMAL"},{"n":"MONTO_IMP_CREE2_DOLAR","t":"DECIMAL"},{"n":"MONTO_IMP_CREE2_LOCAL","t":"DECIMAL"},{"n":"MONTO_IMP_RENTA","t":"DECIMAL"},{"n":"MONTO_IMP_RENTA_DOLAR","t":"DECIMAL"},{"n":"MONTO_IMP_RENTA_LOCAL","t":"DECIMAL"},{"n":"MONTO_INTERES","t":"DECIMAL"},{"n":"MONTO_PRINCIPAL","t":"DECIMAL"},{"n":"PORCENTAJE","t":"DECIMAL"},{"n":"SALDO","t":"DECIMAL"},{"n":"SALDO_AMORTIZA","t":"DECIMAL"},{"n":"SALDO_CUOTA","t":"DECIMAL"}]},"PLAN_PAGO_PED":{"m":"AS","d":"Plan de pagos por documento: cuotas, fechas de vencimiento y saldos.","f":[{"n":"CONSECUTIVO_PAGO","t":"INT"},{"n":"DOCUMENTO","t":"VARCHAR(20)"},{"n":"FECHA_PROYECTADA","t":"DATETIME"},{"n":"FECHA_RIGE","t":"DATETIME"},{"n":"FECHA_VENCE","t":"DATETIME"},{"n":"MONTO_AMORTIZA","t":"DECIMAL"},{"n":"MONTO_CUOTA","t":"DECIMAL"},{"n":"MONTO_GAN_OCASIONAL","t":"DECIMAL"},{"n":"MONTO_GAN_OCASIONAL_DOLAR","t":"DECIMAL"},{"n":"MONTO_GAN_OCASIONAL_LOCAL","t":"DECIMAL"},{"n":"MONTO_IMP_CREE1","t":"DECIMAL"},{"n":"MONTO_IMP_CREE1_DOLAR","t":"DECIMAL"},{"n":"MONTO_IMP_CREE1_LOCAL","t":"DECIMAL"},{"n":"MONTO_IMP_CREE2","t":"DECIMAL"},{"n":"MONTO_IMP_CREE2_DOLAR","t":"DECIMAL"},{"n":"MONTO_IMP_CREE2_LOCAL","t":"DECIMAL"},{"n":"MONTO_IMP_RENTA","t":"DECIMAL"},{"n":"MONTO_IMP_RENTA_DOLAR","t":"DECIMAL"},{"n":"MONTO_IMP_RENTA_LOCAL","t":"DECIMAL"},{"n":"MONTO_INTERES","t":"DECIMAL"},{"n":"MONTO_PRINCIPAL","t":"DECIMAL"},{"n":"PORCENTAJE","t":"DECIMAL"},{"n":"SALDO","t":"DECIMAL"},{"n":"SALDO_AMORTIZA","t":"DECIMAL"},{"n":"SALDO_CUOTA","t":"DECIMAL"}]},"PLAZA":{"m":"","d":"","f":[{"n":"CANTIDAD_EMPLEADOS","t":"INT"},{"n":"COMPARTIDA","t":"VARCHAR(1)"},{"n":"DEPARTAMENTO","t":"VARCHAR(10)"},{"n":"ESTADO","t":"VARCHAR(1)"},{"n":"FECHA_HORA_MOD","t":"DATETIME"},{"n":"FECHA_VACANTE","t":"DATETIME"},{"n":"NOTAS","t":"TEXT"},{"n":"PLAZA","t":"VARCHAR(8)"},{"n":"PUESTO","t":"VARCHAR(8)"},{"n":"RIGE_DESDE","t":"DATETIME"},{"n":"RIGE_HASTA","t":"DATETIME"},{"n":"TIPO","t":"VARCHAR(1)"},{"n":"USUARIO","t":"VARCHAR(50)"}]},"PLAZO":{"m":"","d":"Tabla de catálogo/maestro de referencia con código y descripción.","f":[{"n":"CODIGO","t":"VARCHAR(4)"},{"n":"DESCRIPCION","t":"VARCHAR(254)"}]},"PRE_AJUSTE":{"m":"","d":"Ajustes de inventario: correcciones por diferencias entre conteo y sistema.","f":[{"n":"APLICADO","t":"VARCHAR(1)"},{"n":"DESCRIPCION","t":"VARCHAR(40)"},{"n":"FECHA","t":"DATETIME"},{"n":"FECHA_HORA","t":"DATETIME"},{"n":"FECHA_HORA_APLICA","t":"DATETIME"},{"n":"NOTAS","t":"TEXT"},{"n":"PRE_AJUSTE","t":"INT"},{"n":"PRESUPUESTO","t":"VARCHAR(8)"},{"n":"TIPO_AJU","t":"VARCHAR(1)"},{"n":"USUARIO","t":"VARCHAR(50)"},{"n":"USUARIO_APLICA","t":"VARCHAR(50)"}]},"PRE_AJUSTE_DETALLE":{"m":"","d":"Ajustes de inventario: correcciones por diferencias entre conteo y sistema.","f":[{"n":"FECHA_FINAL","t":"DATETIME"},{"n":"LINEA","t":"INT"},{"n":"MONTO_DOLAR","t":"DECIMAL"},{"n":"MONTO_LOCAL","t":"DECIMAL"},{"n":"PARTIDA","t":"VARCHAR(51)"},{"n":"PRE_AJUSTE","t":"INT"}]},"PRE_OBLIGACION":{"m":"","d":"","f":[{"n":"DESCRIPCION","t":"VARCHAR(40)"},{"n":"FECHA_HORA","t":"DATETIME"},{"n":"FECHA_INICIAL","t":"DATETIME"},{"n":"NUM_APLICACIONES","t":"INT"},{"n":"PERIODICIDAD","t":"VARCHAR(1)"},{"n":"PRE_OBLIGACION","t":"INT"},{"n":"USUARIO","t":"VARCHAR(50)"}]},"PRE_OBLIGACION_DET":{"m":"","d":"","f":[{"n":"MONTO_LOCAL","t":"DECIMAL"},{"n":"PARTIDA","t":"VARCHAR(51)"},{"n":"PRE_OBLIGACION","t":"INT"}]},"PREASIENTO":{"m":"","d":"Cabecera de asientos contables generados por módulos auxiliares o manual.","f":[{"n":"ASIENTO","t":"VARCHAR(10)"},{"n":"CLASE_ASIENTO","t":"VARCHAR(1)"},{"n":"CONTABILIDAD","t":"VARCHAR(1)"},{"n":"DEPENDENCIA","t":"VARCHAR(10)"},{"n":"FECHA","t":"DATETIME"},{"n":"FECHA_CREACION","t":"DATETIME"},{"n":"FECHA_ULT_MODIF","t":"DATETIME"},{"n":"NOMINA","t":"VARCHAR(4)"},{"n":"NOTAS","t":"TEXT"},{"n":"ORIGEN","t":"VARCHAR(4)"},{"n":"PAQUETE","t":"VARCHAR(4)"},{"n":"PROCESO","t":"VARCHAR(10)"},{"n":"TIPO_ASIENTO","t":"VARCHAR(4)"},{"n":"TOTAL_CONTROL_DOL","t":"DECIMAL"},{"n":"TOTAL_CONTROL_LOC","t":"DECIMAL"},{"n":"TOTAL_CREDITO_DOL","t":"DECIMAL"},{"n":"TOTAL_CREDITO_LOC","t":"DECIMAL"},{"n":"TOTAL_DEBITO_DOL","t":"DECIMAL"},{"n":"TOTAL_DEBITO_LOC","t":"DECIMAL"},{"n":"ULTIMO_USUARIO","t":"VARCHAR(50)"},{"n":"USUARIO_CREACION","t":"VARCHAR(50)"}]},"PRECIO_ART_PROV":{"m":"","d":"Lista de precios: tarifas por artículo, cliente o segmento.","f":[{"n":"ARTICULO","t":"VARCHAR(20)"},{"n":"CANTIDAD_HASTA","t":"DECIMAL"},{"n":"LINEA","t":"INT"},{"n":"PRECIO","t":"DECIMAL"},{"n":"PROVEEDOR","t":"VARCHAR(20)"}]},"PRECIO_REFERENCIA_DE":{"m":"","d":"Lista de precios: tarifas por artículo, cliente o segmento.","f":[{"n":"CODIGO","t":"VARCHAR(4)"},{"n":"DESCRIPCION","t":"VARCHAR(254)"}]},"PREFERENCIA":{"m":"","d":"","f":[{"n":"OPCION","t":"VARCHAR(50)"},{"n":"ORIGEN","t":"VARCHAR(4)"},{"n":"PREFERENCIA1","t":"VARCHAR(250)"},{"n":"PREFERENCIA2","t":"VARCHAR(250)"},{"n":"PREFERENCIA3","t":"VARCHAR(250)"},{"n":"PREFERENCIA4","t":"TEXT"},{"n":"USUARIO","t":"VARCHAR(50)"}]},"PREFIJO":{"m":"","d":"","f":[{"n":"ARTICULO","t":"VARCHAR(20)"},{"n":"PREFIJO","t":"VARCHAR(3)"}]},"PRESU_USUARIO":{"m":"","d":"Usuarios del sistema: credenciales, perfil, estado y auditoría.","f":[{"n":"PRESUPUESTO","t":"VARCHAR(8)"},{"n":"USUARIO","t":"VARCHAR(50)"}]},"PRESUPUEST_DETALLE":{"m":"CR","d":"","f":[{"n":"FECHA_FINAL","t":"DATETIME"},{"n":"MODIFICABLE","t":"VARCHAR(1)"},{"n":"MONTO_ACUM_DOLAR","t":"DECIMAL"},{"n":"MONTO_ACUM_LOCAL","t":"DECIMAL"},{"n":"MONTO_DOLAR","t":"DECIMAL"},{"n":"MONTO_LOCAL","t":"DECIMAL"},{"n":"OBLIGACION_DOLAR","t":"DECIMAL"},{"n":"OBLIGACION_LOCAL","t":"DECIMAL"},{"n":"PARTIDA","t":"VARCHAR(51)"},{"n":"PRESUPUESTO","t":"VARCHAR(8)"}]},"PRESUPUEST_PARTIDA":{"m":"CR","d":"Partidas presupuestales: montos aprobados, comprometidos y ejecutados.","f":[{"n":"INDICADOR","t":"VARCHAR(8)"},{"n":"MODO_TRABAJO","t":"VARCHAR(1)"},{"n":"MONEDA_REGISTRO","t":"VARCHAR(1)"},{"n":"MONTO_BASE","t":"DECIMAL"},{"n":"PARTIDA","t":"VARCHAR(51)"},{"n":"PRESUPUESTO","t":"VARCHAR(8)"}]},"PRESUPUESTO":{"m":"CR","d":"Cabecera de presupuesto anual por empresa y escenario.","f":[{"n":"APROBADO","t":"VARCHAR(1)"},{"n":"CLASE","t":"VARCHAR(1)"},{"n":"CONSOLIDADO_EN","t":"VARCHAR(8)"},{"n":"DESCRIPCION","t":"VARCHAR(40)"},{"n":"FECHA_HORA","t":"DATETIME"},{"n":"FECHA_HORA_APRO","t":"DATETIME"},{"n":"FECHA_HORA_CONSO","t":"DATETIME"},{"n":"INDICADOR_TC","t":"VARCHAR(8)"},{"n":"MODIFICABLE","t":"VARCHAR(1)"},{"n":"PERIODO_FINAL","t":"DATETIME"},{"n":"PERIODO_INICIAL","t":"DATETIME"},{"n":"PRESUPUESTO","t":"VARCHAR(8)"},{"n":"SUPUESTOS","t":"TEXT"},{"n":"TIPO_FISC_CORP","t":"VARCHAR(1)"},{"n":"USUARIO","t":"VARCHAR(50)"},{"n":"USUARIO_APRO","t":"VARCHAR(50)"},{"n":"USUARIO_CONSO","t":"VARCHAR(50)"}]},"PRESUPUESTO_BI":{"m":"CR","d":"Cabecera de presupuesto anual por empresa y escenario.","f":[{"n":"DESCRIPCION","t":"VARCHAR(254)"},{"n":"MONEDA","t":"VARCHAR(1)"},{"n":"PRESUPUESTO","t":"VARCHAR(10)"},{"n":"TIPO_CONTABILIDAD","t":"VARCHAR(1)"}]},"PRESUPUESTO_CI_CR":{"m":"CR","d":"Cabecera de presupuesto anual por empresa y escenario.","f":[{"n":"APARTADO","t":"INT"},{"n":"AUDIT_TRANS_INV","t":"INT"},{"n":"DOCUMENTO_INV","t":"VARCHAR(20)"},{"n":"PAQUETE_INVENTARIO","t":"VARCHAR(4)"},{"n":"PRESUPUESTO","t":"VARCHAR(20)"}]},"PRESUPUESTO_CONTAB":{"m":"CR","d":"Cabecera de presupuesto anual por empresa y escenario.","f":[{"n":"CENTRO_COSTO","t":"VARCHAR(25)"},{"n":"CUENTA_CONTABLE","t":"VARCHAR(25)"},{"n":"FECHA_FINAL","t":"DATETIME"},{"n":"MONTO_ACUM_DOLAR","t":"DECIMAL"},{"n":"MONTO_ACUM_LOCAL","t":"DECIMAL"},{"n":"MONTO_DOLAR","t":"DECIMAL"},{"n":"MONTO_LOCAL","t":"DECIMAL"},{"n":"OBLIGACION_DOLAR","t":"DECIMAL"},{"n":"OBLIGACION_LOCAL","t":"DECIMAL"},{"n":"PRESUPUESTO","t":"VARCHAR(8)"}]},"PRESUPUESTO_DETALLE_BI":{"m":"CR","d":"Cabecera de presupuesto anual por empresa y escenario.","f":[{"n":"CENTRO_COSTO","t":"VARCHAR(60)"},{"n":"CUENTA_CONTABLE","t":"VARCHAR(60)"},{"n":"MES","t":"DATETIME"},{"n":"MONTO","t":"DECIMAL"},{"n":"PRESUPUESTO","t":"VARCHAR(10)"},{"n":"VERSION","t":"VARCHAR(8)"}]},"PRESUPUESTO_NOTAS":{"m":"CR","d":"Cabecera de presupuesto anual por empresa y escenario.","f":[{"n":"NOTAS","t":"TEXT"},{"n":"PRESUPUESTO","t":"VARCHAR(8)"}]},"PRESUPUESTO_TIPOCAM_BI":{"m":"CR","d":"Cabecera de presupuesto anual por empresa y escenario.","f":[{"n":"MES","t":"DATETIME"},{"n":"MONTO_TIPO_CAMBIO","t":"DECIMAL"},{"n":"PRESUPUESTO","t":"VARCHAR(10)"},{"n":"VERSION","t":"VARCHAR(8)"}]},"PRESUPUESTO_VERSION_BI":{"m":"CR","d":"Cabecera de presupuesto anual por empresa y escenario.","f":[{"n":"ESTADO","t":"VARCHAR(1)"},{"n":"MES_FINAL","t":"DATETIME"},{"n":"MES_INICIAL","t":"DATETIME"},{"n":"PRESUPUESTO","t":"VARCHAR(10)"},{"n":"PROMEDIO_TIPO_CAMBIO","t":"DECIMAL"},{"n":"TIPO_TIPOCAMBIO","t":"VARCHAR(1)"},{"n":"VERSION","t":"VARCHAR(8)"}]},"PRIVILEGIO_SISTEMA":{"m":"","d":"","f":[{"n":"DESCRIPCION","t":"VARCHAR(60)"},{"n":"INSTALADA","t":"VARCHAR(1)"},{"n":"POSICION","t":"INT"},{"n":"PRIVILEGIO","t":"INT"},{"n":"PRIVILEGIO_ERP","t":"VARCHAR(40)"},{"n":"PRIVILEGIO_PADRE","t":"INT"},{"n":"SISTEMA","t":"VARCHAR(4)"},{"n":"TIPO","t":"VARCHAR(1)"},{"n":"URL","t":"VARCHAR(255)"}]},"PRON_DET_DIARIO":{"m":"","d":"","f":[{"n":"AJUSTADO","t":"DECIMAL"},{"n":"FECHA","t":"DATETIME"},{"n":"ITEM_PRONOSTICADO","t":"INT"},{"n":"PERIODO","t":"DATETIME"},{"n":"PRONOSTICO","t":"VARCHAR(20)"}]},"PRON_DET_PERIODO":{"m":"","d":"","f":[{"n":"AJUSTADO","t":"DECIMAL"},{"n":"DESGLOSE","t":"VARCHAR(1)"},{"n":"HISTORIA","t":"DECIMAL"},{"n":"ITEM_PRONOSTICADO","t":"INT"},{"n":"NOTAS","t":"TEXT"},{"n":"PERIODO","t":"DATETIME"},{"n":"PRECIO_DOLAR","t":"DECIMAL"},{"n":"PRECIO_LOCAL","t":"DECIMAL"},{"n":"PRONOSTICADO","t":"DECIMAL"},{"n":"PRONOSTICO","t":"VARCHAR(20)"},{"n":"TIPO","t":"VARCHAR(1)"},{"n":"TIPO_CAMBIO","t":"DECIMAL"}]},"PRON_PRDO_MENSAJE":{"m":"","d":"","f":[{"n":"ITEM_PRONOSTICADO","t":"INT"},{"n":"MENSAJE","t":"TEXT"},{"n":"PERIODO","t":"DATETIME"},{"n":"PRONOSTICO","t":"VARCHAR(20)"}]},"PRONOSTICO":{"m":"","d":"","f":[{"n":"CARGAR_VENTAS","t":"VARCHAR(1)"},{"n":"DESCRIPCION","t":"VARCHAR(40)"},{"n":"ESTADO","t":"VARCHAR(1)"},{"n":"FCH_HORA_APROBACIO","t":"DATETIME"},{"n":"FCH_HORA_CREACION","t":"DATETIME"},{"n":"FCH_HORA_MODIFIC","t":"DATETIME"},{"n":"MONEDA_BASE","t":"VARCHAR(1)"},{"n":"NOTAS","t":"TEXT"},{"n":"ORIGEN_DATOS","t":"VARCHAR(2)"},{"n":"PDO_FIN_HISTORIA","t":"DATETIME"},{"n":"PDO_FIN_PRONOST","t":"DATETIME"},{"n":"PDO_INI_HISTORIA","t":"DATETIME"},{"n":"PDO_INI_PRONOST","t":"DATETIME"},{"n":"PERIODOS_HISTORIA","t":"INT"},{"n":"PERIODOS_PRONOST","t":"INT"},{"n":"PRONOSTICO","t":"VARCHAR(20)"},{"n":"REFERENCIA","t":"VARCHAR(40)"},{"n":"TIPO_PERIODOS","t":"VARCHAR(1)"},{"n":"TIPO_PRONOSTICO","t":"VARCHAR(1)"},{"n":"USA_BONIFICACIONES","t":"VARCHAR(1)"},{"n":"USA_COMPONENTES","t":"VARCHAR(1)"},{"n":"USA_DESCUENTOS","t":"VARCHAR(1)"},{"n":"USA_DEVOLUCIONES","t":"VARCHAR(1)"},{"n":"USADO_EN_PM","t":"VARCHAR(1)"},{"n":"USUARIO_APROBACION","t":"VARCHAR(50)"}]},"PRONOSTICO_DETALLE":{"m":"","d":"","f":[{"n":"ARTICULO","t":"VARCHAR(20)"},{"n":"ARTICULO_CUENTA","t":"VARCHAR(4)"},{"n":"BODEGA","t":"VARCHAR(4)"},{"n":"CATEGORIA_CLIENTE","t":"VARCHAR(8)"},{"n":"CLASIFICACION_1","t":"VARCHAR(12)"},{"n":"CLASIFICACION_2","t":"VARCHAR(12)"},{"n":"CLASIFICACION_3","t":"VARCHAR(12)"},{"n":"CLASIFICACION_4","t":"VARCHAR(12)"},{"n":"CLASIFICACION_5","t":"VARCHAR(12)"},{"n":"CLASIFICACION_6","t":"VARCHAR(12)"},{"n":"CLIENTE","t":"VARCHAR(20)"},{"n":"CLIENTE_CORPORAC","t":"VARCHAR(20)"},{"n":"CLIENTE_ORIGEN","t":"VARCHAR(20)"},{"n":"COBRADOR","t":"VARCHAR(4)"},{"n":"ERROR_NETO","t":"DECIMAL"},{"n":"ERROR_TOTAL","t":"DECIMAL"},{"n":"ESTADO","t":"VARCHAR(1)"},{"n":"FCH_HORA_CREACION","t":"DATETIME"},{"n":"FCH_HORA_MODIFIC","t":"DATETIME"},{"n":"FCH_HORA_ULT_CALC","t":"DATETIME"},{"n":"FORMULA_APLICADA","t":"VARCHAR(1)"},{"n":"ITEM_PRONOSTICADO","t":"INT"},{"n":"NOTAS","t":"TEXT"},{"n":"PAIS","t":"VARCHAR(4)"},{"n":"PRECIO_DOLAR","t":"DECIMAL"}]},"PRONOSTICO_FILTRO":{"m":"","d":"","f":[{"n":"CRITERIO","t":"VARCHAR(20)"},{"n":"PRONOSTICO","t":"VARCHAR(20)"},{"n":"VALOR_FINAL","t":"VARCHAR(20)"},{"n":"VALOR_INICIAL","t":"VARCHAR(20)"}]},"PRONOSTICO_ORDEN":{"m":"","d":"","f":[{"n":"CRITERIO","t":"VARCHAR(20)"},{"n":"ORDENAMIENTO","t":"VARCHAR(1)"},{"n":"PRONOSTICO","t":"VARCHAR(20)"},{"n":"SECUENCIA","t":"INT"}]},"PRONOSTICO_USUARIO":{"m":"","d":"Usuarios del sistema: credenciales, perfil, estado y auditoría.","f":[{"n":"PRIVILEGIO","t":"VARCHAR(1)"},{"n":"PRONOSTICO","t":"VARCHAR(20)"},{"n":"USUARIO","t":"VARCHAR(50)"}]},"PROV_RETENCION":{"m":"","d":"Retenciones fiscales aplicadas en documentos de compra o venta.","f":[{"n":"CODIGO_RETENCION","t":"VARCHAR(4)"},{"n":"FECHA_DESDE","t":"DATETIME"},{"n":"FECHA_HASTA","t":"DATETIME"},{"n":"NOTAS","t":"TEXT"},{"n":"PROVEEDOR","t":"VARCHAR(20)"},{"n":"RET_DEFAULT","t":"VARCHAR(1)"}]},"PROV_VALORES_CERTIF":{"m":"","d":"","f":[{"n":"ACUM_RENTA_EXENTA_UVT","t":"DECIMAL"},{"n":"APORTE_SALUD_VOLUNTARIA","t":"DECIMAL"},{"n":"APORTE_SALUD_VOLUNTARIO_REAL","t":"DECIMAL"},{"n":"APORTES_ACUM_UVT","t":"DECIMAL"},{"n":"APORTES_AFC","t":"DECIMAL"},{"n":"APORTES_AFC_REAL","t":"DECIMAL"},{"n":"APORTES_MINIMA","t":"DECIMAL"},{"n":"APORTES_MINIMA_REAL","t":"DECIMAL"},{"n":"APORTES_PEN_REAL","t":"DECIMAL"},{"n":"APORTES_PEN_VOL_REAL","t":"DECIMAL"},{"n":"APORTES_PENSION","t":"DECIMAL"},{"n":"APORTES_PENSION_VOL","t":"DECIMAL"},{"n":"APORTES_SALUD","t":"DECIMAL"},{"n":"APORTES_SALUD_REAL","t":"DECIMAL"},{"n":"BASE_RET_UVT","t":"DECIMAL"},{"n":"CENTRO_COSTO383","t":"VARCHAR(25)"},{"n":"CENTRO_COSTO384","t":"VARCHAR(25)"},{"n":"CUENTA_CONTABLE383","t":"VARCHAR(25)"},{"n":"CUENTA_CONTABLE384","t":"VARCHAR(25)"},{"n":"DECLARANTE","t":"VARCHAR(1)"},{"n":"DEPENDIENTES","t":"DECIMAL"},{"n":"DEPENDIENTES_REAL","t":"DECIMAL"},{"n":"DIFERENCIA_RET","t":"DECIMAL"},{"n":"ES383","t":"VARCHAR(1)"},{"n":"FECHA_ULT_AJUSTE","t":"DATETIME"}]},"PROVEEDOR":{"m":"CP","d":"Maestro de proveedores. Datos fiscales, condición pago, moneda, país y categoría.","f":[{"n":"ACEPTA_DOC_ELECTRONICO","t":"VARCHAR(1)"},{"n":"ACTIVO","t":"VARCHAR(1)"},{"n":"AGENTE_RETENCION","t":"VARCHAR(1)"},{"n":"ALIAS","t":"VARCHAR(150)"},{"n":"AUTORETENEDOR","t":"VARCHAR(1)"},{"n":"BUEN_CONTRIBUYENTE","t":"VARCHAR(1)"},{"n":"CARGO","t":"VARCHAR(30)"},{"n":"CATEGORIA_PROVEED","t":"VARCHAR(8)"},{"n":"CODIGO_IMPUESTO","t":"VARCHAR(4)"},{"n":"CONDICION_PAGO","t":"VARCHAR(4)"},{"n":"CONGELADO","t":"VARCHAR(1)"},{"n":"CONTACTO","t":"VARCHAR(30)"},{"n":"CONTRIBUYENTE","t":"VARCHAR(20)"},{"n":"CONVENIO","t":"VARCHAR(1)"},{"n":"CURP","t":"VARCHAR(18)"},{"n":"DESCUENTO","t":"DECIMAL"},{"n":"DETALLE_DIRECCION","t":"INT"},{"n":"DETRACCION_AUTO","t":"VARCHAR(1)"},{"n":"DIRECCION","t":"TEXT"},{"n":"DIVISION_GEOGRAFICA1","t":"VARCHAR(12)"},{"n":"DIVISION_GEOGRAFICA2","t":"VARCHAR(12)"},{"n":"DIVISION_GEOGRAFICA3","t":"VARCHAR(12)"},{"n":"DIVISION_GEOGRAFICA4","t":"VARCHAR(12)"},{"n":"DOMICILIADO","t":"VARCHAR(1)"},{"n":"E_MAIL","t":"VARCHAR(249)"}]},"PROVEEDOR_ENTIDAD":{"m":"CO","d":"","f":[{"n":"CTA_DEFAULT","t":"VARCHAR(1)"},{"n":"CTA_ELECTRONICA","t":"VARCHAR(50)"},{"n":"CUENTA_BANCO","t":"VARCHAR(20)"},{"n":"ENTIDAD_FINANCIERA","t":"VARCHAR(8)"},{"n":"MONEDA","t":"VARCHAR(4)"},{"n":"NOTAS","t":"TEXT"},{"n":"PROVEEDOR","t":"VARCHAR(20)"},{"n":"TIPO_CUENTA","t":"VARCHAR(12)"}]},"PROVEEDOR_TEMPIVA":{"m":"CO","d":"","f":[{"n":"CODIGO_IMPUESTO","t":"VARCHAR(4)"},{"n":"PORC_TARIFA","t":"DECIMAL"},{"n":"PROVEEDOR","t":"VARCHAR(20)"},{"n":"ROWPOINTER","t":"GUID"},{"n":"TIPIFICACION_PROVEEDOR","t":"VARCHAR(2)"},{"n":"TIPO_IMPUESTO","t":"VARCHAR(4)"},{"n":"TIPO_TARIFA","t":"VARCHAR(2)"}]},"PS_ARTICULO_RECIEN_FACTURADO":{"m":"CI","d":"","f":[{"n":"ACTUALIZADO","t":"VARCHAR(1)"},{"n":"ARTICULO","t":"VARCHAR(20)"}]},"PS_EXISTENCIAS_TEMP":{"m":"","d":"Tabla temporal de procesamiento. Datos intermedios de procesos batch.","f":[{"n":"AP_ID","t":"INT"},{"n":"CASA","t":"INT"},{"n":"DESCUENTO_POR_EMPAQUE","t":"DECIMAL"},{"n":"EXISTENCIA","t":"INT"},{"n":"FECHA_OPERACION","t":"DATETIME"},{"n":"ID","t":"INT"},{"n":"MULTIPLO_VENTA","t":"INT"},{"n":"NIVEL_PRECIO","t":"INT"},{"n":"PRECIO","t":"DECIMAL"},{"n":"UNIDAD_DESCUENTO_POR_EMPAQUE","t":"DECIMAL"},{"n":"UNIDAD_VENTA_MULTIPLO_VENTA","t":"VARCHAR(20)"}]},"PTO_EXTERNO_PUESTO":{"m":"CN","d":"","f":[{"n":"CAT_PUESTO_EXTERNO","t":"VARCHAR(12)"},{"n":"PUESTO","t":"VARCHAR(8)"},{"n":"PUESTO_EXTERNO","t":"VARCHAR(12)"}]},"PUERTOS_SUNAT":{"m":"","d":"Tabla de catálogo/maestro de referencia con código y descripción.","f":[{"n":"CODIGO","t":"VARCHAR(10)"},{"n":"DESCRIPCION","t":"VARCHAR(50)"},{"n":"DIRECCION","t":"VARCHAR(100)"},{"n":"UBIGEO","t":"VARCHAR(20)"}]},"PUESTO":{"m":"CN","d":"","f":[{"n":"ACTIVO","t":"VARCHAR(1)"},{"n":"CONSECUTIVO_PLAZA","t":"VARCHAR(8)"},{"n":"DESCRIPCION","t":"VARCHAR(254)"},{"n":"NOTAS","t":"TEXT"},{"n":"PUESTO","t":"VARCHAR(8)"},{"n":"SALARIO_ACTUAL","t":"DECIMAL"},{"n":"SALARIO_INTERM1","t":"DECIMAL"},{"n":"SALARIO_INTERM2","t":"DECIMAL"},{"n":"SALARIO_MAXIMO","t":"DECIMAL"},{"n":"SALARIO_MINIMO","t":"DECIMAL"}]},"PUESTO_EXTERNO":{"m":"CN","d":"","f":[{"n":"CAT_PUESTO_EXTERNO","t":"VARCHAR(12)"},{"n":"DESCRIPCION","t":"VARCHAR(254)"},{"n":"PUESTO_EXTERNO","t":"VARCHAR(12)"}]},"PUESTO_FUNCIONES":{"m":"CN","d":"","f":[{"n":"PUESTO","t":"VARCHAR(8)"},{"n":"PUESTO_FUNCIONES","t":"TEXT"}]},"PUESTO_SALARIO":{"m":"CN","d":"Salarios y remuneraciones de empleados por período.","f":[{"n":"FECHA","t":"DATETIME"},{"n":"MERCADO_CUARTIL1","t":"DECIMAL"},{"n":"MERCADO_CUARTIL2","t":"DECIMAL"},{"n":"MERCADO_CUARTIL3","t":"DECIMAL"},{"n":"MERCADO_MAXIMO","t":"DECIMAL"},{"n":"MERCADO_MINIMO","t":"DECIMAL"},{"n":"MERCADO_MODA","t":"DECIMAL"},{"n":"MERCADO_PROMEDIO","t":"DECIMAL"},{"n":"MINIMO_LEY","t":"DECIMAL"},{"n":"PUESTO","t":"VARCHAR(8)"},{"n":"SALARIO_COMPANIA","t":"DECIMAL"}]},"RANGOS_AUTORIZA_DEP":{"m":"","d":"","f":[{"n":"CANT_AUTORIZ_REQ","t":"INT"},{"n":"CONSEC_DEP","t":"INT"},{"n":"DEPARTAMENTO","t":"VARCHAR(10)"},{"n":"MONTO_MAX_COMPRA","t":"DECIMAL"}]},"RANGOS_CAI":{"m":"","d":"","f":[{"n":"CAI","t":"VARCHAR(50)"},{"n":"CAJA_POS","t":"VARCHAR(6)"},{"n":"CONSECUTIVO","t":"VARCHAR(10)"},{"n":"TIPO_DOCUMENTO","t":"VARCHAR(3)"},{"n":"TIPO_RETENCION","t":"VARCHAR(3)"},{"n":"USA_CONSECUTIVO_GLOBAL","t":"VARCHAR(1)"}]},"RAZON_AJUS_ANUL":{"m":"","d":"","f":[{"n":"DESCRIPCION","t":"VARCHAR(100)"},{"n":"PAIS","t":"VARCHAR(20)"},{"n":"RAZON","t":"VARCHAR(10)"},{"n":"TIPO","t":"VARCHAR(1)"}]},"RECEPCION_DETRAC":{"m":"CO","d":"Recepciones de mercancía en bodega (Centro de Distribución). Vincula con OC o embarque.","f":[{"n":"COD_DETRACCION","t":"VARCHAR(4)"},{"n":"CONSTANCIA","t":"VARCHAR(50)"},{"n":"CREDITO","t":"VARCHAR(50)"},{"n":"DEBITO","t":"VARCHAR(50)"},{"n":"FECHA_DOC","t":"DATETIME"},{"n":"FECHA_OPERACION","t":"DATETIME"},{"n":"MONTO","t":"DECIMAL"},{"n":"PROVEEDOR","t":"VARCHAR(20)"},{"n":"TIPO_CREDITO","t":"VARCHAR(3)"},{"n":"TIPO_DEBITO","t":"VARCHAR(3)"},{"n":"TIPO_DETRACCION","t":"VARCHAR(4)"}]},"RECEPCION_DETRAC_CC":{"m":"CO","d":"Recepciones de mercancía en bodega (Centro de Distribución). Vincula con OC o embarque.","f":[{"n":"CLIENTE","t":"VARCHAR(20)"},{"n":"COD_DETRACCION","t":"VARCHAR(4)"},{"n":"CONSTANCIA","t":"VARCHAR(50)"},{"n":"CREDITO","t":"VARCHAR(50)"},{"n":"DEBITO","t":"VARCHAR(50)"},{"n":"FECHA_DOC","t":"DATETIME"},{"n":"FECHA_OPERACION","t":"DATETIME"},{"n":"MONTO","t":"DECIMAL"},{"n":"TIPO_CREDITO","t":"VARCHAR(3)"},{"n":"TIPO_DEBITO","t":"VARCHAR(3)"},{"n":"TIPO_DETRACCION","t":"VARCHAR(4)"}]},"RECEPCION_PAGO":{"m":"CO","d":"Recepciones de mercancía en bodega (Centro de Distribución). Vincula con OC o embarque.","f":[{"n":"ANULADA","t":"VARCHAR(1)"},{"n":"CLIENTE","t":"VARCHAR(20)"},{"n":"CODIGO_CONSECUTIVO","t":"VARCHAR(10)"},{"n":"DOCUMENTO_FISCAL","t":"VARCHAR(50)"},{"n":"ESTADO_CANCELACION","t":"VARCHAR(60)"},{"n":"FECHA","t":"DATETIME"},{"n":"FOLIO_FISCAL_RELACIONADO","t":"VARCHAR(50)"},{"n":"FOLIO_FISCAL_SUSTITUTO","t":"VARCHAR(50)"},{"n":"MOTIVO_CANCELACION","t":"VARCHAR(2)"},{"n":"NUMERO_CONSECUTIVO","t":"VARCHAR(10)"},{"n":"TIPO_RELACION","t":"VARCHAR(3)"}]},"RECIBO_PAGO_ELECTRONICO":{"m":"","d":"","f":[{"n":"ANULADO","t":"VARCHAR(1)"},{"n":"CLAVE","t":"VARCHAR(50)"},{"n":"CONTRIBUYENTE","t":"VARCHAR(40)"},{"n":"DEBITO","t":"VARCHAR(50)"},{"n":"DOCUMENTO","t":"VARCHAR(50)"},{"n":"DOCUMENTO_REFERENCIA","t":"VARCHAR(50)"},{"n":"FECHA_RECIBO","t":"DATETIME"},{"n":"NUMERO_CONSECUTIVO","t":"VARCHAR(20)"},{"n":"TIPO_DOCUMENTO","t":"VARCHAR(3)"}]},"RECIBO_SINCRO":{"m":"","d":"","f":[{"n":"ADUANA","t":"VARCHAR(12)"},{"n":"AGENTE_ADUANAL","t":"VARCHAR(12)"},{"n":"CANT_BULTOS","t":"INT"},{"n":"FECHA_CREACION","t":"DATETIME"},{"n":"FECHA_INGRESO","t":"DATETIME"},{"n":"FECHA_SINCRO","t":"DATETIME"},{"n":"ID_PDA","t":"VARCHAR(15)"},{"n":"ID_SINCRO","t":"VARCHAR(15)"},{"n":"ID_TRANSPORTISTA","t":"INT"},{"n":"PEDIMENTO","t":"VARCHAR(15)"},{"n":"PROVEEDOR","t":"VARCHAR(20)"},{"n":"RECIBO","t":"VARCHAR(20)"}]},"RECINTO_FISCAL":{"m":"","d":"Tabla de catálogo/maestro de referencia con código y descripción.","f":[{"n":"CODIGO","t":"VARCHAR(4)"},{"n":"DESCRIPCION","t":"VARCHAR(254)"}]},"REGIMEN_ES":{"m":"","d":"Tabla de catálogo/maestro de referencia con código y descripción.","f":[{"n":"CODIGO","t":"VARCHAR(20)"},{"n":"DESCRIPCION","t":"VARCHAR(254)"}]},"REGIMEN_VAC_CONTRI":{"m":"","d":"","f":[{"n":"CONTRIBUCION_VACAC","t":"VARCHAR(12)"},{"n":"REGIMEN_VACACIONAL","t":"VARCHAR(12)"}]},"REGIMEN_VACACIONAL":{"m":"","d":"Control de vacaciones: días acumulados, tomados y pendientes.","f":[{"n":"ACTIVO","t":"VARCHAR(1)"},{"n":"AGRUPA_CALCULO","t":"VARCHAR(1)"},{"n":"DESCRIPCION","t":"VARCHAR(40)"},{"n":"ELIMINAR_CONT_CERO","t":"VARCHAR(1)"},{"n":"FECHA_CREACION","t":"DATETIME"},{"n":"FECHA_ULT_MODIF","t":"DATETIME"},{"n":"INCLUIR_DOMINGOS","t":"VARCHAR(1)"},{"n":"INCLUIR_FERIADOS","t":"VARCHAR(1)"},{"n":"INCLUIR_SABADOS","t":"VARCHAR(1)"},{"n":"NOTAS","t":"TEXT"},{"n":"REGIMEN_VACACIONAL","t":"VARCHAR(12)"},{"n":"TIPO_ACCION","t":"VARCHAR(4)"},{"n":"TIPO_ANNO","t":"VARCHAR(1)"},{"n":"TIPO_FECHA","t":"VARCHAR(1)"},{"n":"USUARIO_CREACION","t":"VARCHAR(50)"},{"n":"USUARIO_ULT_MODIF","t":"VARCHAR(50)"}]},"REGIMENES":{"m":"","d":"","f":[{"n":"CENTRO_COSTO","t":"VARCHAR(25)"},{"n":"CONSECUTIVO","t":"VARCHAR(10)"},{"n":"CUENTA_CONTABLE","t":"VARCHAR(25)"},{"n":"DESCRIPCION","t":"VARCHAR(40)"},{"n":"IMP1_ASUMIDO_COMPRAS","t":"VARCHAR(1)"},{"n":"MODELO_RETENCION","t":"VARCHAR(4)"},{"n":"REGIMEN","t":"VARCHAR(12)"}]},"REGION":{"m":"","d":"","f":[{"n":"NOMBRE","t":"VARCHAR(40)"},{"n":"NOTAS","t":"VARCHAR(254)"},{"n":"REGION","t":"VARCHAR(4)"}]},"REGION_DET":{"m":"","d":"","f":[{"n":"PAIS","t":"VARCHAR(4)"},{"n":"REGION","t":"VARCHAR(4)"}]},"REGLA_ARTICULO":{"m":"CI","d":"","f":[{"n":"ARTICULO","t":"VARCHAR(20)"},{"n":"REGLA_DESCUENTO","t":"INT"}]},"REGLA_DESCUENTO":{"m":"","d":"Estructura de descuentos por volumen, cliente o condición comercial.","f":[{"n":"ACTIVO","t":"VARCHAR(1)"},{"n":"ARTICULO","t":"VARCHAR(20)"},{"n":"ARTICULO_PATRON","t":"VARCHAR(20)"},{"n":"CANTIDAD_COMPRA","t":"DECIMAL"},{"n":"CANTIDAD_FACTURAR","t":"DECIMAL"},{"n":"CATEGORIA_CLIENTE","t":"VARCHAR(8)"},{"n":"CLASIFICACION","t":"VARCHAR(12)"},{"n":"CLASIFICACION2","t":"VARCHAR(12)"},{"n":"CLASIFICACION3","t":"VARCHAR(12)"},{"n":"CLASIFICACION4","t":"VARCHAR(12)"},{"n":"CLASIFICACION5","t":"VARCHAR(12)"},{"n":"CLASIFICACION6","t":"VARCHAR(12)"},{"n":"CLIENTE","t":"VARCHAR(20)"},{"n":"DESC_FORMA_PAGO","t":"DECIMAL"},{"n":"DESCRIPCION","t":"VARCHAR(254)"},{"n":"DESCUENTO","t":"DECIMAL"},{"n":"DETALLE_FORMA_PAGO","t":"VARCHAR(20)"},{"n":"FORMA_PAGO","t":"VARCHAR(4)"},{"n":"MINIMO_DOCUMENTO","t":"DECIMAL"},{"n":"MINIMO_PAGO","t":"DECIMAL"},{"n":"NOTAS","t":"TEXT"},{"n":"PRIORIDAD","t":"INT"},{"n":"REGLA_DESCUENTO","t":"INT"},{"n":"REQUIERE_AUTORIZACION","t":"VARCHAR(1)"},{"n":"TIPO_DESCUENTO","t":"VARCHAR(1)"}]},"REP_LEGAL_RD":{"m":"","d":"","f":[{"n":"DISCAPACIDAD","t":"VARCHAR(200)"},{"n":"EMPLEADO","t":"VARCHAR(20)"},{"n":"NIVEL_EDUCACION","t":"INT"},{"n":"TIPO_IDENTIFICACION","t":"VARCHAR(1)"},{"n":"TIPO_INGRESO","t":"VARCHAR(4)"},{"n":"TIPO_TRABAJADOR","t":"VARCHAR(1)"}]},"REPORTE_INVENTARIO_PERU":{"m":"","d":"","f":[{"n":"ARTICULO","t":"VARCHAR(24)"},{"n":"BODEGA","t":"VARCHAR(4)"},{"n":"CANTIDAD","t":"DECIMAL"},{"n":"CODIGO_CATALOGO","t":"VARCHAR(1)"},{"n":"CODIGO_ESTABLECIMIENTO","t":"VARCHAR(7)"},{"n":"CODIGO_EXISTENCIA_SUNAT","t":"VARCHAR(128)"},{"n":"CODIGO_OPERACION","t":"VARCHAR(40)"},{"n":"COSTO_TOTAL_SALDO","t":"DECIMAL"},{"n":"COSTO_TOTAL_TRANS","t":"DECIMAL"},{"n":"COSTO_UNITARIO_SALDO","t":"DECIMAL"},{"n":"COSTO_UNITARIO_TRANS","t":"DECIMAL"},{"n":"ESTADO_OPERACION","t":"VARCHAR(1)"},{"n":"FECHA","t":"DATETIME"},{"n":"FORMATO","t":"VARCHAR(4)"},{"n":"GUID_FORMATO","t":"VARCHAR(48)"},{"n":"NATURALEZA","t":"VARCHAR(3)"},{"n":"NUMERO_CORRELATIVO","t":"VARCHAR(10)"},{"n":"NUMERO_DOCUMENTO","t":"VARCHAR(20)"},{"n":"NUMERO_SERIE_DOC","t":"VARCHAR(20)"},{"n":"SALDO_FINAL","t":"DECIMAL"},{"n":"SALDO_INICIAL","t":"DECIMAL"},{"n":"TIPO_EXISTENCIA","t":"VARCHAR(2)"},{"n":"TIPO_OPERACION","t":"VARCHAR(2)"},{"n":"TIPO_PAGO","t":"VARCHAR(2)"},{"n":"TIPO_TRANSAC","t":"VARCHAR(1)"}]},"REPORTE_REPX":{"m":"","d":"","f":[{"n":"ARCHIVO","t":"VARCHAR"},{"n":"DESCRIPCION","t":"VARCHAR(200)"},{"n":"MODULO","t":"VARCHAR(10)"},{"n":"NOMBRE","t":"VARCHAR(100)"},{"n":"PADRE","t":"VARCHAR(100)"}]},"REPORTES_CC":{"m":"","d":"","f":[{"n":"APLICACION","t":"VARCHAR(249)"},{"n":"ASIENTO","t":"VARCHAR(10)"},{"n":"CLIENTE","t":"VARCHAR(20)"},{"n":"CLIENTE_ORIGEN","t":"VARCHAR(20)"},{"n":"COBRADOR","t":"VARCHAR(4)"},{"n":"CONDICION_PAGO","t":"VARCHAR(10)"},{"n":"CONTRARECIBO","t":"VARCHAR(50)"},{"n":"DESC_SUBTIPO","t":"VARCHAR(25)"},{"n":"DESCUENTO","t":"DECIMAL"},{"n":"DIAS_NETO","t":"INT"},{"n":"DOCUMENTO","t":"VARCHAR(50)"},{"n":"FECHA","t":"DATETIME"},{"n":"FECHA_DOCUMENTO","t":"DATETIME"},{"n":"FECHA_VENCE","t":"DATETIME"},{"n":"IMPUESTO1","t":"DECIMAL"},{"n":"IMPUESTO2","t":"DECIMAL"},{"n":"MONEDA","t":"VARCHAR(4)"},{"n":"MONTO_CLI","t":"DECIMAL"},{"n":"MONTO_DOC","t":"DECIMAL"},{"n":"MONTO_DOLAR","t":"DECIMAL"},{"n":"MONTO_LOCAL","t":"DECIMAL"},{"n":"MONTO_RETENCION","t":"DECIMAL"},{"n":"NUM_PARCIALIDADES","t":"INT"},{"n":"PAR_MONTO_AMORTIZA","t":"DECIMAL"},{"n":"PAR_MONTO_CUOTA","t":"DECIMAL"}]},"REPORTES_CONTABLES":{"m":"","d":"","f":[{"n":"CODIGO_R","t":"VARCHAR(4)"},{"n":"NOMBRE","t":"VARCHAR(60)"},{"n":"REPORTE","t":"VARCHAR(150)"},{"n":"REPORTE_AMBAS","t":"VARCHAR(150)"},{"n":"TIPO_R","t":"VARCHAR(2)"}]},"REPORTES_CP":{"m":"","d":"","f":[{"n":"APLICACION","t":"VARCHAR(249)"},{"n":"ASIENTO","t":"VARCHAR(10)"},{"n":"CONDICION_PAGO","t":"VARCHAR(10)"},{"n":"CONTRARECIBO","t":"VARCHAR(50)"},{"n":"DESC_SUBTIPO","t":"VARCHAR(25)"},{"n":"DESCUENTO","t":"DECIMAL"},{"n":"DIAS_NETO","t":"INT"},{"n":"DOCUMENTO","t":"VARCHAR(50)"},{"n":"FECHA","t":"DATETIME"},{"n":"FECHA_DOCUMENTO","t":"DATETIME"},{"n":"FECHA_VENCE","t":"DATETIME"},{"n":"IMPUESTO1","t":"DECIMAL"},{"n":"IMPUESTO2","t":"DECIMAL"},{"n":"MONEDA","t":"VARCHAR(4)"},{"n":"MONTO_DOC","t":"DECIMAL"},{"n":"MONTO_DOLAR","t":"DECIMAL"},{"n":"MONTO_LOCAL","t":"DECIMAL"},{"n":"MONTO_PROV","t":"DECIMAL"},{"n":"MONTO_RETENCION","t":"DECIMAL"},{"n":"NUM_PARCIALIDADES","t":"INT"},{"n":"PAR_MONTO_AMORTIZA","t":"DECIMAL"},{"n":"PAR_MONTO_CUOTA","t":"DECIMAL"},{"n":"PAR_MONTO_INTERES","t":"DECIMAL"},{"n":"PAR_MONTO_PRINCIPAL","t":"DECIMAL"},{"n":"PAR_SALDO_AMORTIZA","t":"DECIMAL"}]},"RESOLUCION_DOC_ELECTRONICO":{"m":"","d":"","f":[{"n":"ANNO_ACTUAL","t":"INT"},{"n":"CAJA","t":"VARCHAR(6)"},{"n":"CODIGO_PAIS","t":"VARCHAR(6)"},{"n":"CORRELATIVO","t":"INT"},{"n":"DEPARTAMENTO","t":"VARCHAR(80)"},{"n":"DIRECCION1","t":"VARCHAR(80)"},{"n":"DISPOSITIVO_ELECTRONICO","t":"VARCHAR(4)"},{"n":"ESTADO","t":"VARCHAR(1)"},{"n":"FECHA_AUTORIZACION","t":"DATETIME"},{"n":"FECHA_CREACION","t":"DATETIME"},{"n":"FECHA_RESOLUCION","t":"DATETIME"},{"n":"FOLIO_FINAL","t":"INT"},{"n":"FOLIO_INICIAL","t":"INT"},{"n":"FORMATO_PDF","t":"VARCHAR(300)"},{"n":"FORMATO_XSLT","t":"VARCHAR(300)"},{"n":"INFORMACION_REGIMEN","t":"VARCHAR(15)"},{"n":"MASCARA","t":"VARCHAR(50)"},{"n":"MUNICIPIO","t":"VARCHAR(35)"},{"n":"NOMBRE_SUCURSAL","t":"VARCHAR(150)"},{"n":"NUMERO_AUTORIZACION","t":"VARCHAR(80)"},{"n":"RESOLUCION","t":"VARCHAR(20)"},{"n":"SERIE","t":"VARCHAR(20)"},{"n":"SIN_VENCIMIENTO","t":"VARCHAR(1)"},{"n":"SUCURSAL","t":"VARCHAR(80)"},{"n":"TIPO_ACTIVO","t":"VARCHAR(8)"}]},"RESOLUCION_ES":{"m":"","d":"","f":[{"n":"AUTORIZACION","t":"VARCHAR(13)"},{"n":"DOC_FINAL","t":"VARCHAR(9)"},{"n":"DOC_INICIAL","t":"VARCHAR(9)"},{"n":"ESTADO","t":"VARCHAR(1)"},{"n":"FECHA_ULT_MOD","t":"DATETIME"},{"n":"NIT","t":"VARCHAR(20)"},{"n":"RESOLUCION","t":"VARCHAR(100)"},{"n":"SERIE","t":"VARCHAR(13)"},{"n":"SUBTIPO","t":"INT"},{"n":"TIPO","t":"VARCHAR(3)"},{"n":"USUARIO_ULT_MOD","t":"VARCHAR(50)"}]},"RESPALDO_EMPLEADO_ESCALA_PROD":{"m":"","d":"","f":[{"n":"ACTIVO","t":"VARCHAR(1)"},{"n":"ASEGURADO","t":"VARCHAR(20)"},{"n":"BENEFICIO_COLECTIVO","t":"VARCHAR(2)"},{"n":"BONO_DECRETO","t":"DECIMAL"},{"n":"CENTRO_COSTO","t":"VARCHAR(25)"},{"n":"CLASE_SEGURO","t":"VARCHAR(4)"},{"n":"CTA_ELECTRONICA","t":"VARCHAR(50)"},{"n":"CUENTA_ENTIDAD","t":"VARCHAR(50)"},{"n":"DEPARTAMENTO","t":"VARCHAR(10)"},{"n":"DEPENDIENTES","t":"INT"},{"n":"DETALLE_DIR_HAB","t":"INT"},{"n":"DETALLE_DIR_POSTAL","t":"INT"},{"n":"DIAS_DISP_INCAP","t":"DECIMAL"},{"n":"DIRECCION_HAB","t":"TEXT"},{"n":"DIRECCION_POSTAL","t":"TEXT"},{"n":"DIVISION_GEOGRAFICA1","t":"VARCHAR(12)"},{"n":"DIVISION_GEOGRAFICA2","t":"VARCHAR(12)"},{"n":"E_MAIL","t":"VARCHAR(249)"},{"n":"EMPLEADO","t":"VARCHAR(20)"},{"n":"ENTIDAD_FINANCIERA","t":"VARCHAR(8)"},{"n":"ESTADO_CIVIL","t":"VARCHAR(1)"},{"n":"ESTADO_EMPLEADO","t":"VARCHAR(4)"},{"n":"FCH_HORA_ULT_MOD","t":"DATETIME"},{"n":"FECHA_ANTIG_EMP","t":"DATETIME"},{"n":"FECHA_ANTIG_GOB","t":"DATETIME"}]},"RESPON_SEGUIMIENTO":{"m":"","d":"","f":[{"n":"CORREO_ELECT","t":"VARCHAR(250)"},{"n":"EMPLEADO","t":"VARCHAR(20)"},{"n":"ESTADO","t":"VARCHAR(1)"},{"n":"NOTAS","t":"TEXT"},{"n":"RESPON_SEGUIMIENTO","t":"VARCHAR(10)"},{"n":"TELEFONO","t":"VARCHAR(20)"}]},"RESPONSABILIDAD_FISCAL":{"m":"","d":"","f":[{"n":"DESCRIPCION","t":"VARCHAR(200)"},{"n":"RESPONSABILIDAD_FISCAL","t":"VARCHAR(8)"}]},"RESPONSABLE":{"m":"","d":"","f":[{"n":"CONTRIBUYENTE","t":"VARCHAR(20)"},{"n":"EMPLEADO","t":"VARCHAR(20)"},{"n":"NIT","t":"VARCHAR(20)"},{"n":"NOMBRE","t":"VARCHAR(50)"},{"n":"RESPONSABLE","t":"VARCHAR(20)"}]},"RETENCIONES":{"m":"","d":"Retenciones fiscales aplicadas en documentos de compra o venta.","f":[{"n":"APLICA_IMP1_DESC","t":"VARCHAR(1)"},{"n":"APLICA_IMP1_NODESC","t":"VARCHAR(1)"},{"n":"APLICA_IMPUESTO1","t":"VARCHAR(1)"},{"n":"APLICA_IMPUESTO2","t":"VARCHAR(1)"},{"n":"APLICA_MONTO","t":"VARCHAR(1)"},{"n":"APLICA_RETENCION","t":"VARCHAR(1)"},{"n":"APLICA_RUBRO1","t":"VARCHAR(1)"},{"n":"APLICA_RUBRO2","t":"VARCHAR(1)"},{"n":"APLICA_SUB_BIENES","t":"VARCHAR(1)"},{"n":"APLICA_SUB_DESC","t":"VARCHAR(1)"},{"n":"APLICA_SUB_SERVICIOS","t":"VARCHAR(1)"},{"n":"APLICA_SUBTOTAL","t":"VARCHAR(1)"},{"n":"CLASIFICACION_ART","t":"VARCHAR(12)"},{"n":"CODIGO_INGRESO","t":"VARCHAR(4)"},{"n":"CODIGO_REGIMEN","t":"VARCHAR(10)"},{"n":"CODIGO_RETENCION","t":"VARCHAR(4)"},{"n":"CONSEC_RET_COMPRA","t":"VARCHAR(10)"},{"n":"CONSEC_RET_VENTA","t":"VARCHAR(10)"},{"n":"CTA_AUTORETENCION","t":"VARCHAR(25)"},{"n":"CTA_RETENCION","t":"VARCHAR(25)"},{"n":"CTR_AUTORETENCION","t":"VARCHAR(25)"},{"n":"CTR_RETENCION","t":"VARCHAR(25)"},{"n":"DESCRIPCION","t":"VARCHAR(40)"},{"n":"ES_AUTORETENEDOR","t":"VARCHAR(1)"},{"n":"ESTADO","t":"VARCHAR(1)"}]},"RETENCIONES_DOC_CC":{"m":"","d":"Retenciones fiscales aplicadas en documentos de compra o venta.","f":[{"n":"ASIENTO","t":"VARCHAR(10)"},{"n":"AUTORETENEDORA","t":"VARCHAR(1)"},{"n":"BASE","t":"DECIMAL"},{"n":"COD_GENERACION_SLV","t":"VARCHAR(100)"},{"n":"CODIGO_RETENCION","t":"VARCHAR(4)"},{"n":"DOC_REFERENCIA","t":"VARCHAR(20)"},{"n":"DOCUMENTO","t":"VARCHAR(50)"},{"n":"DTE_SLV","t":"VARCHAR(100)"},{"n":"ESTADO","t":"VARCHAR(1)"},{"n":"FECHA_CONTABLE","t":"DATETIME"},{"n":"FECHA_DOCUMENTO","t":"DATETIME"},{"n":"FECHA_RIGE","t":"DATETIME"},{"n":"MASCARA_DTE","t":"VARCHAR(50)"},{"n":"MONTO","t":"DECIMAL"},{"n":"RETENCION","t":"VARCHAR(50)"},{"n":"SALDO_CANCELAR","t":"DECIMAL"},{"n":"SELLO_RECEPCION_SLV","t":"VARCHAR(100)"},{"n":"TIPO","t":"VARCHAR(3)"},{"n":"TIPO_APLI_CANCELAR","t":"VARCHAR(1)"}]},"RUTA":{"m":"","d":"Zonas geográficas o rutas de distribución para análisis territorial.","f":[{"n":"DESCRIPCION","t":"VARCHAR(40)"},{"n":"PS_AFV_ID_RUTA","t":"INT"},{"n":"RUTA","t":"VARCHAR(4)"}]},"SAL_DIARIO_INT":{"m":"","d":"","f":[{"n":"APLICADO","t":"VARCHAR(1)"},{"n":"CALCULAR_SDIF","t":"VARCHAR(1)"},{"n":"CONSECUTIVO","t":"INT"},{"n":"DIAS_LABORADOS","t":"VARCHAR(20)"},{"n":"DIAS_SD","t":"DECIMAL"},{"n":"DIAS_SDIV","t":"DECIMAL"},{"n":"FECHA_ACCION","t":"DATETIME"},{"n":"FECHA_FINAL","t":"DATETIME"},{"n":"FECHA_INICIAL","t":"DATETIME"},{"n":"FECHA_REFERENCIA","t":"VARCHAR(1)"},{"n":"FECHA_RIGE","t":"DATETIME"},{"n":"GENERA_ACCION","t":"VARCHAR(1)"},{"n":"NEXCEDE_SALMINZONA","t":"VARCHAR(1)"},{"n":"NOMINA","t":"VARCHAR(4)"},{"n":"NOMINA_HASTA","t":"VARCHAR(4)"},{"n":"NOTAS","t":"TEXT"},{"n":"PORC_DESPENSA","t":"DECIMAL"},{"n":"PORC_FONDO_AHORRO","t":"DECIMAL"},{"n":"RUBRO_SDIV_SD","t":"INT"},{"n":"RUBRO1","t":"DECIMAL"},{"n":"RUBRO1_NOMBRE","t":"VARCHAR(20)"},{"n":"RUBRO2","t":"DECIMAL"},{"n":"RUBRO2_NOMBRE","t":"VARCHAR(20)"},{"n":"RUBRO3","t":"DECIMAL"},{"n":"RUBRO3_NOMBRE","t":"VARCHAR(20)"}]},"SAL_DIARIO_INT_CON":{"m":"","d":"","f":[{"n":"CONCEPTO","t":"VARCHAR(20)"},{"n":"CONSECUTIVO","t":"INT"},{"n":"MODALIDAD","t":"VARCHAR(1)"},{"n":"NOMINA","t":"VARCHAR(4)"},{"n":"SUMA_SDI","t":"VARCHAR(1)"},{"n":"TOPE_EXENCION","t":"DECIMAL"}]},"SAL_DIARIO_INT_DET":{"m":"","d":"","f":[{"n":"ACUMULADO","t":"DECIMAL"},{"n":"CONCEPTO","t":"VARCHAR(20)"},{"n":"CONSECUTIVO","t":"INT"},{"n":"EMPLEADO","t":"VARCHAR(20)"},{"n":"NOMINA","t":"VARCHAR(4)"},{"n":"PROPORCION_DIARIA","t":"DECIMAL"}]},"SAL_DIARIO_INT_EMP":{"m":"","d":"","f":[{"n":"CONSECUTIVO","t":"INT"},{"n":"DIAS_AGUINALDO","t":"DECIMAL"},{"n":"DIAS_ANTIGUEDAD","t":"DECIMAL"},{"n":"DIAS_LABORADOS","t":"DECIMAL"},{"n":"DIAS_VACACIONES","t":"DECIMAL"},{"n":"EMPLEADO","t":"VARCHAR(20)"},{"n":"FACTOR","t":"DECIMAL"},{"n":"MARCA_CALCULO","t":"VARCHAR(1)"},{"n":"NOMINA","t":"VARCHAR(4)"},{"n":"NUMERO_ACCION","t":"INT"},{"n":"PORCENTAJE_PRIMA","t":"DECIMAL"},{"n":"SALARIO_REFERENCIA","t":"DECIMAL"},{"n":"SDI_ANTERIOR","t":"DECIMAL"},{"n":"SDI_FIJO","t":"DECIMAL"},{"n":"SDI_NUEVO","t":"DECIMAL"},{"n":"SDI_VARIABLE","t":"DECIMAL"}]},"SALDO":{"m":"CG","d":"Saldos acumulados por período, cuenta y dimensión de análisis.","f":[{"n":"CENTRO_COSTO","t":"VARCHAR(25)"},{"n":"CREDITO_CORP_DOLAR","t":"DECIMAL"},{"n":"CREDITO_CORP_LOCAL","t":"DECIMAL"},{"n":"CREDITO_CORP_UND","t":"DECIMAL"},{"n":"CREDITO_FISC_DOLAR","t":"DECIMAL"},{"n":"CREDITO_FISC_LOCAL","t":"DECIMAL"},{"n":"CREDITO_FISC_UND","t":"DECIMAL"},{"n":"CUENTA_CONTABLE","t":"VARCHAR(25)"},{"n":"DEBITO_CORP_DOLAR","t":"DECIMAL"},{"n":"DEBITO_CORP_LOCAL","t":"DECIMAL"},{"n":"DEBITO_CORP_UND","t":"DECIMAL"},{"n":"DEBITO_FISC_DOLAR","t":"DECIMAL"},{"n":"DEBITO_FISC_LOCAL","t":"DECIMAL"},{"n":"DEBITO_FISC_UND","t":"DECIMAL"},{"n":"FECHA","t":"DATETIME"},{"n":"SALDO_CORP_DOLAR","t":"DECIMAL"},{"n":"SALDO_CORP_LOCAL","t":"DECIMAL"},{"n":"SALDO_CORP_UND","t":"DECIMAL"},{"n":"SALDO_FISC_DOLAR","t":"DECIMAL"},{"n":"SALDO_FISC_LOCAL","t":"DECIMAL"},{"n":"SALDO_FISC_UND","t":"DECIMAL"}]},"SALDO_CLIENTE":{"m":"CG","d":"Saldos acumulados por período, cuenta y dimensión de análisis.","f":[{"n":"CLIENTE","t":"VARCHAR(20)"},{"n":"FECHA_ULT_MOV","t":"DATETIME"},{"n":"MONEDA","t":"VARCHAR(4)"},{"n":"SALDO","t":"DECIMAL"},{"n":"SALDO_CORPORACION","t":"DECIMAL"},{"n":"SALDO_SUCURSALES","t":"DECIMAL"}]},"SALDO_NIT":{"m":"CG","d":"Saldos acumulados por período, cuenta y dimensión de análisis.","f":[{"n":"CENTRO_COSTO","t":"VARCHAR(25)"},{"n":"CREDITO_CORP_DOLAR","t":"DECIMAL"},{"n":"CREDITO_CORP_LOCAL","t":"DECIMAL"},{"n":"CREDITO_CORP_UND","t":"DECIMAL"},{"n":"CREDITO_FISC_DOLAR","t":"DECIMAL"},{"n":"CREDITO_FISC_LOCAL","t":"DECIMAL"},{"n":"CREDITO_FISC_UND","t":"DECIMAL"},{"n":"CUENTA_CONTABLE","t":"VARCHAR(25)"},{"n":"DEBITO_CORP_DOLAR","t":"DECIMAL"},{"n":"DEBITO_CORP_LOCAL","t":"DECIMAL"},{"n":"DEBITO_CORP_UND","t":"DECIMAL"},{"n":"DEBITO_FISC_DOLAR","t":"DECIMAL"},{"n":"DEBITO_FISC_LOCAL","t":"DECIMAL"},{"n":"DEBITO_FISC_UND","t":"DECIMAL"},{"n":"FECHA","t":"DATETIME"},{"n":"NIT","t":"VARCHAR(20)"},{"n":"SALDO_CORP_DOLAR","t":"DECIMAL"},{"n":"SALDO_CORP_LOCAL","t":"DECIMAL"},{"n":"SALDO_CORP_UND","t":"DECIMAL"},{"n":"SALDO_FISC_DOLAR","t":"DECIMAL"},{"n":"SALDO_FISC_LOCAL","t":"DECIMAL"},{"n":"SALDO_FISC_UND","t":"DECIMAL"}]},"SCROLL":{"m":"","d":"","f":[{"n":"INFORMACION","t":"INT"},{"n":"MODULO","t":"INT"}]},"SEC_INFORMACION":{"m":"","d":"","f":[{"n":"INFORMACION","t":"INT"},{"n":"MODULO","t":"INT"},{"n":"PAGINA","t":"INT"},{"n":"SECCION","t":"INT"}]},"SECCION":{"m":"","d":"","f":[{"n":"DESC_SECCION","t":"VARCHAR(50)"},{"n":"MODULO","t":"INT"},{"n":"PAGINA","t":"INT"},{"n":"SECCION","t":"INT"}]},"SECCION_CUENTA":{"m":"","d":"","f":[{"n":"ACUMULADO","t":"VARCHAR(40)"},{"n":"DESCRIPCION","t":"VARCHAR(40)"},{"n":"SECCION_CUENTA","t":"VARCHAR(4)"},{"n":"SECUENCIA","t":"INT"},{"n":"TIPO_SECCION","t":"VARCHAR(1)"}]},"SECCION_REPORTES":{"m":"","d":"","f":[{"n":"ACUMULADO","t":"VARCHAR(40)"},{"n":"CODIGO_R","t":"VARCHAR(4)"},{"n":"DESCRIPCION","t":"VARCHAR(40)"},{"n":"SECCION_R","t":"VARCHAR(4)"},{"n":"SECUENCIA","t":"INT"},{"n":"TIPO","t":"VARCHAR(1)"},{"n":"TIPO_R","t":"VARCHAR(2)"}]},"SEGUIMIENTO_FACT":{"m":"","d":"","f":[{"n":"CONSECUTIVO","t":"INT"},{"n":"DESCRIPCION","t":"VARCHAR(50)"},{"n":"ESTADO","t":"VARCHAR(1)"},{"n":"FACTURA","t":"VARCHAR(10)"},{"n":"FUENTE","t":"VARCHAR(10)"},{"n":"MEDIO","t":"VARCHAR(1)"}]},"SEGUIMIENTO_ORDEN":{"m":"","d":"","f":[{"n":"CONSECUTIVO","t":"INT"},{"n":"DESCRIPCION","t":"VARCHAR(50)"},{"n":"ESTADO","t":"VARCHAR(1)"},{"n":"FUENTE","t":"VARCHAR(25)"},{"n":"MEDIO","t":"VARCHAR(1)"},{"n":"ORDEN_COMPRA","t":"VARCHAR(10)"}]},"SERIE_CADENA":{"m":"CI","d":"Números de serie para control de activos serializados.","f":[{"n":"FECHA_HORA","t":"DATETIME"},{"n":"MODULO_ORIGEN","t":"VARCHAR(4)"},{"n":"SERIE_CADENA","t":"INT"},{"n":"USUARIO","t":"VARCHAR(50)"}]},"SERIE_CADENA_DET":{"m":"CI","d":"Números de serie para control de activos serializados.","f":[{"n":"CANTIDAD","t":"DECIMAL"},{"n":"SERIE_CADENA","t":"INT"},{"n":"SERIE_FINAL","t":"VARCHAR(20)"},{"n":"SERIE_INICIAL","t":"VARCHAR(20)"}]},"SERIE_PLANTILLA":{"m":"CI","d":"Números de serie para control de activos serializados.","f":[{"n":"DESCRIPCION","t":"VARCHAR(40)"},{"n":"MASCARA","t":"VARCHAR(20)"},{"n":"SERIE_MAXIMA","t":"VARCHAR(20)"},{"n":"SERIE_MINIMA","t":"VARCHAR(20)"},{"n":"SERIE_PLANTILLA","t":"VARCHAR(4)"},{"n":"TIPO_SERIE","t":"VARCHAR(1)"}]},"SISTEMA":{"m":"","d":"","f":[{"n":"DESCRIPCION","t":"VARCHAR(80)"},{"n":"SISTEMA","t":"VARCHAR(4)"}]},"SOFTLAND_AFV_ARTICULO":{"m":"","d":"","f":[{"n":"API_RESPONSE","t":"VARCHAR(255)"},{"n":"BDF","t":"VARCHAR(12)"},{"n":"CANTIDADRECIBIDA","t":"INT"},{"n":"CASA","t":"INT"},{"n":"CATEGORIACATALOGOID","t":"INT"},{"n":"CATEGORIAPADRECATALOGOID","t":"INT"},{"n":"CLASIFICACION","t":"VARCHAR(12)"},{"n":"CODIGO_BARRA","t":"VARCHAR(20)"},{"n":"CODIGO_SFL","t":"VARCHAR(20)"},{"n":"CREATE_DATE","t":"VARCHAR(30)"},{"n":"DESCRIPCION","t":"VARCHAR(254)"},{"n":"DESCRIPCION_UDF","t":"VARCHAR(8000)"},{"n":"DL_CODE","t":"VARCHAR(255)"},{"n":"ES_NVD","t":"VARCHAR(12)"},{"n":"ES_PATIO","t":"VARCHAR(12)"},{"n":"EXISTENCIA","t":"INT"},{"n":"FACTOR_EMPAQUE","t":"FLOAT"},{"n":"FACTOR_VENTA","t":"FLOAT"},{"n":"FECHA_ACTUALIZACION_LOTE","t":"DATETIME"},{"n":"FECHA_OPERACION","t":"VARCHAR(30)"},{"n":"ID","t":"INT"},{"n":"IDIMPUESTO","t":"INT"},{"n":"IDMARCA","t":"INT"},{"n":"IDMARCACATALOGO","t":"INT"},{"n":"LOTE_MULTIPLO","t":"FLOAT"}]},"SOFTLAND_AFV_ARTICULO_HISTORY":{"m":"","d":"","f":[{"n":"API_RESPONSE","t":"VARCHAR(255)"},{"n":"BDF","t":"VARCHAR(12)"},{"n":"CANTIDADRECIBIDA","t":"INT"},{"n":"CASA","t":"INT"},{"n":"CATEGORIACATALOGOID","t":"INT"},{"n":"CATEGORIAPADRECATALOGOID","t":"INT"},{"n":"CLASIFICACION","t":"VARCHAR(12)"},{"n":"CODIGO_BARRA","t":"VARCHAR(20)"},{"n":"CODIGO_SFL","t":"VARCHAR(20)"},{"n":"CREATE_DATE","t":"VARCHAR(30)"},{"n":"DESCRIPCION","t":"VARCHAR(254)"},{"n":"DESCRIPCION_UDF","t":"VARCHAR(8000)"},{"n":"DL_CODE","t":"VARCHAR(255)"},{"n":"ES_NVD","t":"VARCHAR(12)"},{"n":"ES_PATIO","t":"VARCHAR(12)"},{"n":"EXISTENCIA","t":"INT"},{"n":"FACTOR_EMPAQUE","t":"FLOAT"},{"n":"FACTOR_VENTA","t":"FLOAT"},{"n":"FECHA_ACTUALIZACION_LOTE","t":"DATETIME"},{"n":"FECHA_OPERACION","t":"VARCHAR(30)"},{"n":"ID","t":"INT"},{"n":"IDIMPUESTO","t":"INT"},{"n":"IDMARCA","t":"INT"},{"n":"IDMARCACATALOGO","t":"INT"},{"n":"LOTE_MULTIPLO","t":"FLOAT"}]},"SOFTLAND_AFV_ARTICULO_LPV":{"m":"","d":"","f":[{"n":"AP_ID","t":"INT"},{"n":"API_RESPONSE","t":"VARCHAR(255)"},{"n":"CASA","t":"INT"},{"n":"DESCUENTO_POR_EMPAQUE","t":"DECIMAL"},{"n":"DL_CODE","t":"VARCHAR(255)"},{"n":"EXISTENCIA","t":"INT"},{"n":"FECHA_ACTUALIZACION_LOTE","t":"DATETIME"},{"n":"FECHA_OPERACION","t":"DATETIME"},{"n":"ID","t":"INT"},{"n":"MULTIPLO_VENTA","t":"INT"},{"n":"NIVEL_PRECIO","t":"INT"},{"n":"PRECIO","t":"DECIMAL"},{"n":"PRECIO_ALT","t":"DECIMAL"},{"n":"SINCRONIZADO","t":"VARCHAR(1)"},{"n":"TIPO_TRANSACCION","t":"VARCHAR(6)"},{"n":"UNIDAD_DESCUENTO_POR_EMPAQUE","t":"INT"},{"n":"UNIDAD_VENTA_MULTIPLO_VENTA","t":"VARCHAR(5)"}]},"SOFTLAND_AFV_ARTICULO_LPV_HISTORY":{"m":"","d":"","f":[{"n":"AP_ID","t":"INT"},{"n":"API_RESPONSE","t":"VARCHAR(255)"},{"n":"CASA","t":"INT"},{"n":"DESCUENTO_POR_EMPAQUE","t":"DECIMAL"},{"n":"DL_CODE","t":"VARCHAR(255)"},{"n":"EXISTENCIA","t":"INT"},{"n":"FECHA_ACTUALIZACION_LOTE","t":"DATETIME"},{"n":"FECHA_OPERACION","t":"DATETIME"},{"n":"ID","t":"INT"},{"n":"MULTIPLO_VENTA","t":"INT"},{"n":"NIVEL_PRECIO","t":"INT"},{"n":"PRECIO","t":"DECIMAL"},{"n":"PRECIO_ALT","t":"DECIMAL"},{"n":"SINCRONIZADO","t":"VARCHAR(1)"},{"n":"TIPO_TRANSACCION","t":"VARCHAR(6)"},{"n":"UNIDAD_DESCUENTO_POR_EMPAQUE","t":"INT"},{"n":"UNIDAD_VENTA_MULTIPLO_VENTA","t":"VARCHAR(5)"}]},"SOFTLAND_AFV_ARTICULO_REFERENCIA":{"m":"","d":"","f":[{"n":"API_RESPONSE","t":"VARCHAR(255)"},{"n":"CASA","t":"INT"},{"n":"DL_CODE","t":"VARCHAR(255)"},{"n":"FECHA_ACTUALIZACION_LOTE","t":"DATETIME"},{"n":"ID","t":"INT"},{"n":"SINCRONIZADO","t":"VARCHAR(1)"},{"n":"TIPO_TRANSACCION","t":"VARCHAR(6)"},{"n":"U_REFERENCIA_PROVEEDOR","t":"VARCHAR(30)"}]},"SOFTLAND_AFV_ARTICULO_REFERENCIA_HISTORY":{"m":"","d":"","f":[{"n":"API_RESPONSE","t":"VARCHAR(255)"},{"n":"CASA","t":"INT"},{"n":"DL_CODE","t":"VARCHAR(255)"},{"n":"FECHA_ACTUALIZACION_LOTE","t":"DATETIME"},{"n":"ID","t":"INT"},{"n":"SINCRONIZADO","t":"VARCHAR(1)"},{"n":"TIPO_TRANSACCION","t":"VARCHAR(6)"},{"n":"U_REFERENCIA_PROVEEDOR","t":"VARCHAR(30)"}]},"SOFTLAND_AFV_CATEGORIA":{"m":"","d":"","f":[{"n":"AGRUPACION","t":"INT"},{"n":"API_RESPONSE","t":"VARCHAR(255)"},{"n":"CASA","t":"INT"},{"n":"CATEGORIACATALOGOID","t":"INT"},{"n":"CATEGORIAPADRECATALOGOID","t":"INT"},{"n":"CLASIFICACION","t":"VARCHAR(12)"},{"n":"DESCRIPCION","t":"VARCHAR(40)"},{"n":"DL_CODE","t":"VARCHAR(255)"},{"n":"FECHA_ACTUALIZACION_LOTE","t":"DATETIME"},{"n":"ID","t":"INT"},{"n":"NOMBRE","t":"VARCHAR(40)"},{"n":"SINCRONIZADO","t":"VARCHAR(1)"},{"n":"TIPO_TRANSACCION","t":"VARCHAR(6)"}]},"SOFTLAND_AFV_CATEGORIA_HISTORY":{"m":"","d":"","f":[{"n":"AGRUPACION","t":"INT"},{"n":"API_RESPONSE","t":"VARCHAR(255)"},{"n":"CASA","t":"INT"},{"n":"CATEGORIACATALOGOID","t":"INT"},{"n":"CATEGORIAPADRECATALOGOID","t":"INT"},{"n":"CLASIFICACION","t":"VARCHAR(12)"},{"n":"DESCRIPCION","t":"VARCHAR(40)"},{"n":"DL_CODE","t":"VARCHAR(255)"},{"n":"FECHA_ACTUALIZACION_LOTE","t":"DATETIME"},{"n":"ID","t":"INT"},{"n":"NOMBRE","t":"VARCHAR(40)"},{"n":"SINCRONIZADO","t":"VARCHAR(1)"},{"n":"TIPO_TRANSACCION","t":"VARCHAR(6)"}]},"SOFTLAND_AFV_CIUDAD":{"m":"","d":"","f":[{"n":"ACTIVO","t":"VARCHAR(1)"},{"n":"API_RESPONSE","t":"VARCHAR(255)"},{"n":"CASA","t":"INT"},{"n":"CODNEMONICO","t":"VARCHAR(1)"},{"n":"DL_CODE","t":"VARCHAR(255)"},{"n":"FECHA_ACTUALIZACION_LOTE","t":"DATETIME"},{"n":"ID_ESTADO","t":"INT"},{"n":"IDCIUDAD","t":"INT"},{"n":"IDESQUEMAPRECIOS","t":"INT"},{"n":"NOMBRECIUDAD","t":"VARCHAR(45)"},{"n":"SINCRONIZADO","t":"VARCHAR(1)"},{"n":"TIPO_TRANSACCION","t":"VARCHAR(6)"}]},"SOFTLAND_AFV_CLIENTE":{"m":"","d":"","f":[{"n":"ACTIVO","t":"VARCHAR(1)"},{"n":"ALIAS","t":"VARCHAR(150)"},{"n":"API_RESPONSE","t":"VARCHAR(255)"},{"n":"CASA","t":"INT"},{"n":"CODNEMONICO","t":"VARCHAR(20)"},{"n":"CONTRIBUYENTE","t":"VARCHAR(20)"},{"n":"CREATEDATE","t":"VARCHAR(24)"},{"n":"CREATEDBY","t":"VARCHAR(50)"},{"n":"DIRECCION_COBRO","t":"VARCHAR"},{"n":"DIRECCION_EMBARQUE","t":"VARCHAR(8)"},{"n":"DISPONIBLE","t":"FLOAT"},{"n":"DL_CODE","t":"VARCHAR(255)"},{"n":"E_MAIL","t":"VARCHAR(249)"},{"n":"ESTATUS_COBRO","t":"VARCHAR(20)"},{"n":"ESTATUS_EMBARQUE","t":"INT"},{"n":"ESTATUS_MASTER","t":"INT"},{"n":"ESTATUS_NIVEL_PRECIO","t":"VARCHAR(1)"},{"n":"ESTATUS_PRINCIPAL","t":"VARCHAR(50)"},{"n":"FECHA_ACTUALIZACION_LOTE","t":"DATETIME"},{"n":"ID","t":"INT"},{"n":"ID_LISTAPRECIO","t":"INT"},{"n":"ID_NIVEL_PRECIO","t":"INT"},{"n":"ID_REGLADESCUENTO","t":"INT"},{"n":"IDCATEGORIA","t":"VARCHAR(20)"},{"n":"IDCIUDAD_COBRO","t":"INT"}]},"SOFTLAND_AFV_CLIENTE_CONCEPTO_TRIBUTARIO":{"m":"","d":"","f":[{"n":"API_RESPONSE","t":"VARCHAR(255)"},{"n":"CASA","t":"INT"},{"n":"CREATEDATE","t":"VARCHAR(24)"},{"n":"CREATEDBY","t":"VARCHAR(50)"},{"n":"DL_CODE","t":"VARCHAR(255)"},{"n":"FECHA_ACTUALIZACION_LOTE","t":"DATETIME"},{"n":"ID","t":"INT"},{"n":"IDCONCEPTOTRIBUTARIO","t":"INT"},{"n":"SINCRONIZADO","t":"VARCHAR(1)"},{"n":"TIPO_TRANSACCION","t":"VARCHAR(6)"},{"n":"UPDATEDBY","t":"VARCHAR(50)"}]},"SOFTLAND_AFV_CLIENTE_CONCEPTO_TRIBUTARIO_HISTORY":{"m":"","d":"","f":[{"n":"API_RESPONSE","t":"VARCHAR(255)"},{"n":"CASA","t":"INT"},{"n":"CREATEDATE","t":"VARCHAR(24)"},{"n":"CREATEDBY","t":"VARCHAR(50)"},{"n":"DL_CODE","t":"VARCHAR(255)"},{"n":"FECHA_ACTUALIZACION_LOTE","t":"DATETIME"},{"n":"ID","t":"INT"},{"n":"IDCONCEPTOTRIBUTARIO","t":"INT"},{"n":"SINCRONIZADO","t":"VARCHAR(1)"},{"n":"TIPO_TRANSACCION","t":"VARCHAR(6)"},{"n":"UPDATEDBY","t":"VARCHAR(50)"}]},"SOFTLAND_AFV_CLIENTE_DIRECCION":{"m":"","d":"Direcciones de clientes, proveedores o empleados: fiscal, cobro, entrega.","f":[{"n":"API_RESPONSE","t":"VARCHAR(255)"},{"n":"CASA","t":"INT"},{"n":"DIRECCION","t":"VARCHAR(12)"},{"n":"DL_CODE","t":"VARCHAR(255)"},{"n":"ESTATUS","t":"INT"},{"n":"FECHA_ACTUALIZACION_LOTE","t":"DATETIME"},{"n":"ID","t":"INT"},{"n":"IDCIUDAD","t":"INT"},{"n":"IDDIRECCION","t":"INT"},{"n":"IDTIPODIRECCION","t":"INT"},{"n":"SINCRONIZADO","t":"VARCHAR(1)"},{"n":"TIPO_TRANSACCION","t":"VARCHAR(6)"}]},"SOFTLAND_AFV_CLIENTE_DIRECCION_HISTORY":{"m":"","d":"Direcciones de clientes, proveedores o empleados: fiscal, cobro, entrega.","f":[{"n":"API_RESPONSE","t":"VARCHAR(255)"},{"n":"CASA","t":"INT"},{"n":"DIRECCION","t":"VARCHAR(12)"},{"n":"DL_CODE","t":"VARCHAR(255)"},{"n":"ESTATUS","t":"INT"},{"n":"FECHA_ACTUALIZACION_LOTE","t":"DATETIME"},{"n":"ID","t":"INT"},{"n":"IDCIUDAD","t":"INT"},{"n":"IDDIRECCION","t":"INT"},{"n":"IDTIPODIRECCION","t":"INT"},{"n":"SINCRONIZADO","t":"VARCHAR(1)"},{"n":"TIPO_TRANSACCION","t":"VARCHAR(6)"}]},"SOFTLAND_AFV_CLIENTE_HISTORY":{"m":"","d":"","f":[{"n":"ACTIVO","t":"VARCHAR(1)"},{"n":"ALIAS","t":"VARCHAR(150)"},{"n":"API_RESPONSE","t":"VARCHAR(255)"},{"n":"CASA","t":"INT"},{"n":"CODNEMONICO","t":"VARCHAR(20)"},{"n":"CONTRIBUYENTE","t":"VARCHAR(20)"},{"n":"CREATEDATE","t":"VARCHAR(24)"},{"n":"CREATEDBY","t":"VARCHAR(50)"},{"n":"DIRECCION_COBRO","t":"VARCHAR"},{"n":"DIRECCION_EMBARQUE","t":"VARCHAR(8)"},{"n":"DISPONIBLE","t":"FLOAT"},{"n":"DL_CODE","t":"VARCHAR(255)"},{"n":"E_MAIL","t":"VARCHAR(249)"},{"n":"ESTATUS_COBRO","t":"VARCHAR(20)"},{"n":"ESTATUS_EMBARQUE","t":"INT"},{"n":"ESTATUS_MASTER","t":"INT"},{"n":"ESTATUS_NIVEL_PRECIO","t":"VARCHAR(1)"},{"n":"ESTATUS_PRINCIPAL","t":"VARCHAR(50)"},{"n":"FECHA_ACTUALIZACION_LOTE","t":"DATETIME"},{"n":"ID","t":"INT"},{"n":"ID_LISTAPRECIO","t":"INT"},{"n":"ID_NIVEL_PRECIO","t":"INT"},{"n":"ID_REGLADESCUENTO","t":"INT"},{"n":"IDCATEGORIA","t":"VARCHAR(20)"},{"n":"IDCIUDAD_COBRO","t":"INT"}]},"SOFTLAND_AFV_CLIENTE_LIMITE_CREDITO":{"m":"","d":"","f":[{"n":"ACTIVO","t":"VARCHAR(1)"},{"n":"API_RESPONSE","t":"VARCHAR(255)"},{"n":"CASA","t":"INT"},{"n":"DISPONIBLE","t":"FLOAT"},{"n":"DL_CODE","t":"VARCHAR(255)"},{"n":"FECHA_ACTUALIZACION_LOTE","t":"DATETIME"},{"n":"ID","t":"INT"},{"n":"LIMITE_CREDITO","t":"FLOAT"},{"n":"SALDO","t":"FLOAT"},{"n":"SALDO_DOLAR","t":"FLOAT"},{"n":"SALDO_LOCAL","t":"FLOAT"},{"n":"SINCRONIZADO","t":"VARCHAR(1)"},{"n":"TIPO_TRANSACCION","t":"VARCHAR(6)"}]},"SOFTLAND_AFV_CLIENTE_LIMITE_CREDITO_HISTORY":{"m":"","d":"","f":[{"n":"ACTIVO","t":"VARCHAR(1)"},{"n":"API_RESPONSE","t":"VARCHAR(255)"},{"n":"CASA","t":"INT"},{"n":"DISPONIBLE","t":"FLOAT"},{"n":"DL_CODE","t":"VARCHAR(255)"},{"n":"FECHA_ACTUALIZACION_LOTE","t":"DATETIME"},{"n":"ID","t":"INT"},{"n":"LIMITE_CREDITO","t":"FLOAT"},{"n":"SALDO","t":"FLOAT"},{"n":"SALDO_DOLAR","t":"FLOAT"},{"n":"SALDO_LOCAL","t":"FLOAT"},{"n":"SINCRONIZADO","t":"VARCHAR(1)"},{"n":"TIPO_TRANSACCION","t":"VARCHAR(6)"}]},"SOFTLAND_AFV_CLIENTE_REPRESENTANTE":{"m":"","d":"","f":[{"n":"API_RESPONSE","t":"VARCHAR(255)"},{"n":"CASA","t":"INT"},{"n":"DL_CODE","t":"VARCHAR(255)"},{"n":"FECHA_ACTUALIZACION_LOTE","t":"DATETIME"},{"n":"ID","t":"INT"},{"n":"IDREPRESENTANTE","t":"INT"},{"n":"SINCRONIZADO","t":"VARCHAR(1)"},{"n":"TIPO_TRANSACCION","t":"VARCHAR(6)"},{"n":"U_NOMBRE_REPR","t":"VARCHAR(254)"}]},"SOFTLAND_AFV_CLIENTE_REPRESENTANTE_HISTORY":{"m":"","d":"","f":[{"n":"API_RESPONSE","t":"VARCHAR(255)"},{"n":"CASA","t":"INT"},{"n":"DL_CODE","t":"VARCHAR(255)"},{"n":"FECHA_ACTUALIZACION_LOTE","t":"DATETIME"},{"n":"ID","t":"INT"},{"n":"IDREPRESENTANTE","t":"INT"},{"n":"SINCRONIZADO","t":"VARCHAR(1)"},{"n":"TIPO_TRANSACCION","t":"VARCHAR(6)"},{"n":"U_NOMBRE_REPR","t":"VARCHAR(254)"}]},"SOFTLAND_AFV_CLIENTE_TELEFONO":{"m":"","d":"","f":[{"n":"API_RESPONSE","t":"VARCHAR(255)"},{"n":"CASA","t":"INT"},{"n":"DL_CODE","t":"VARCHAR(255)"},{"n":"ESTATUS","t":"INT"},{"n":"FECHA_ACTUALIZACION_LOTE","t":"DATETIME"},{"n":"ID","t":"INT"},{"n":"IDTELEFONO","t":"INT"},{"n":"IDTIPOTELEFONO","t":"INT"},{"n":"SINCRONIZADO","t":"VARCHAR(1)"},{"n":"TELEFONO","t":"VARCHAR(50)"},{"n":"TIPO_TRANSACCION","t":"VARCHAR(6)"}]},"SOFTLAND_AFV_CLIENTE_TELEFONO_HISTORY":{"m":"","d":"","f":[{"n":"API_RESPONSE","t":"VARCHAR(255)"},{"n":"CASA","t":"INT"},{"n":"DL_CODE","t":"VARCHAR(255)"},{"n":"ESTATUS","t":"INT"},{"n":"FECHA_ACTUALIZACION_LOTE","t":"DATETIME"},{"n":"ID","t":"INT"},{"n":"IDTELEFONO","t":"INT"},{"n":"IDTIPOTELEFONO","t":"INT"},{"n":"SINCRONIZADO","t":"VARCHAR(1)"},{"n":"TELEFONO","t":"VARCHAR(50)"},{"n":"TIPO_TRANSACCION","t":"VARCHAR(6)"}]},"SOFTLAND_AFV_COLABORADORES":{"m":"","d":"","f":[{"n":"ACTIVO","t":"VARCHAR(1)"},{"n":"API_RESPONSE","t":"VARCHAR(255)"},{"n":"CASA","t":"INT"},{"n":"CELULAR","t":"VARCHAR(100)"},{"n":"CORREO","t":"VARCHAR(255)"},{"n":"DL_CODE","t":"VARCHAR(255)"},{"n":"FECHA_ACTUALIZACION_LOTE","t":"DATETIME"},{"n":"ID","t":"INT"},{"n":"NOMBRE_VENDEDOR","t":"VARCHAR(45)"},{"n":"PASSWORD","t":"VARCHAR(10)"},{"n":"SINCRONIZADO","t":"VARCHAR(1)"},{"n":"TIPO_TRANSACCION","t":"VARCHAR(6)"},{"n":"USERNAME","t":"VARCHAR(10)"}]},"SOFTLAND_AFV_CONDICION_PAGO":{"m":"","d":"","f":[{"n":"API_RESPONSE","t":"VARCHAR(255)"},{"n":"CASA","t":"INT"},{"n":"DESCRIPCION","t":"VARCHAR(300)"},{"n":"DL_CODE","t":"VARCHAR(255)"},{"n":"FECHA_ACTUALIZACION_LOTE","t":"DATETIME"},{"n":"FECHAEFECTIVA","t":"VARCHAR(30)"},{"n":"FECHAUA","t":"VARCHAR(30)"},{"n":"ID","t":"INT"},{"n":"SINCRONIZADO","t":"VARCHAR(1)"},{"n":"TIPO_TRANSACCION","t":"VARCHAR(6)"},{"n":"USUARIOCREACION","t":"VARCHAR(30)"},{"n":"USUARIOUA","t":"VARCHAR(30)"}]},"SOFTLAND_AFV_CONDICION_PAGO_HISTORY":{"m":"","d":"","f":[{"n":"API_RESPONSE","t":"VARCHAR(255)"},{"n":"CASA","t":"INT"},{"n":"DESCRIPCION","t":"VARCHAR(300)"},{"n":"DL_CODE","t":"VARCHAR(255)"},{"n":"FECHA_ACTUALIZACION_LOTE","t":"DATETIME"},{"n":"FECHAEFECTIVA","t":"VARCHAR(30)"},{"n":"FECHAUA","t":"VARCHAR(30)"},{"n":"ID","t":"INT"},{"n":"SINCRONIZADO","t":"VARCHAR(1)"},{"n":"TIPO_TRANSACCION","t":"VARCHAR(6)"},{"n":"USUARIOCREACION","t":"VARCHAR(30)"},{"n":"USUARIOUA","t":"VARCHAR(30)"}]},"SOFTLAND_AFV_CUENTA_BANCARIA":{"m":"","d":"","f":[{"n":"ANEXO","t":"VARCHAR(1)"},{"n":"API_RESPONSE","t":"VARCHAR(255)"},{"n":"CASA","t":"INT"},{"n":"DL_CODE","t":"VARCHAR(255)"},{"n":"FECHA_ACTUALIZACION_LOTE","t":"DATETIME"},{"n":"IDCUENTABANCARIA","t":"INT"},{"n":"IDENTIDADFINANCIERA","t":"INT"},{"n":"IDMONEDA","t":"INT"},{"n":"NOMBRECUENTABANCARIA","t":"VARCHAR(45)"},{"n":"NUMEROCUENTABANCARIA","t":"VARCHAR(45)"},{"n":"SINCRONIZADO","t":"VARCHAR(1)"},{"n":"STATUS","t":"VARCHAR(1)"},{"n":"TIPO_TRANSACCION","t":"VARCHAR(6)"}]},"SOFTLAND_AFV_DELETE_ARTICULO":{"m":"","d":"","f":[{"n":"API_RESPONSE","t":"VARCHAR(255)"},{"n":"CASA","t":"INT"},{"n":"DL_CODE","t":"VARCHAR(255)"},{"n":"FECHA_ACTUALIZACION_LOTE","t":"DATETIME"},{"n":"ID","t":"INT"},{"n":"SINCRONIZADO","t":"VARCHAR(1)"},{"n":"TIPO_TRANSACCION","t":"VARCHAR(6)"}]},"SOFTLAND_AFV_DELETE_ARTICULO_HISTORY":{"m":"","d":"","f":[{"n":"API_RESPONSE","t":"VARCHAR(255)"},{"n":"CASA","t":"INT"},{"n":"DL_CODE","t":"VARCHAR(255)"},{"n":"FECHA_ACTUALIZACION_LOTE","t":"DATETIME"},{"n":"ID","t":"INT"},{"n":"SINCRONIZADO","t":"VARCHAR(1)"},{"n":"TIPO_TRANSACCION","t":"VARCHAR(6)"}]},"SOFTLAND_AFV_DELETE_CLIENTE":{"m":"","d":"","f":[{"n":"API_RESPONSE","t":"VARCHAR(255)"},{"n":"CASA","t":"INT"},{"n":"DL_CODE","t":"VARCHAR(255)"},{"n":"FECHA_ACTUALIZACION_LOTE","t":"DATETIME"},{"n":"ID","t":"INT"},{"n":"SINCRONIZADO","t":"VARCHAR(1)"},{"n":"TIPO_TRANSACCION","t":"VARCHAR(6)"}]},"SOFTLAND_AFV_DELETE_CLIENTE_HISTORY":{"m":"","d":"","f":[{"n":"API_RESPONSE","t":"VARCHAR(255)"},{"n":"CASA","t":"INT"},{"n":"DL_CODE","t":"VARCHAR(255)"},{"n":"FECHA_ACTUALIZACION_LOTE","t":"DATETIME"},{"n":"ID","t":"INT"},{"n":"SINCRONIZADO","t":"VARCHAR(1)"},{"n":"TIPO_TRANSACCION","t":"VARCHAR(6)"}]},"SOFTLAND_AFV_DELETE_COLABORADORES":{"m":"","d":"","f":[{"n":"API_RESPONSE","t":"VARCHAR(255)"},{"n":"CASA","t":"INT"},{"n":"DL_CODE","t":"VARCHAR(255)"},{"n":"FECHA_ACTUALIZACION_LOTE","t":"DATETIME"},{"n":"ID","t":"INT"},{"n":"SINCRONIZADO","t":"VARCHAR(1)"},{"n":"TIPO_TRANSACCION","t":"VARCHAR(6)"}]},"SOFTLAND_AFV_DELETE_DOCUMENTO_COMERCIAL_VIUDO":{"m":"","d":"","f":[{"n":"API_RESPONSE","t":"VARCHAR(255)"},{"n":"CASA","t":"INT"},{"n":"DL_CODE","t":"VARCHAR(255)"},{"n":"DOCUMENTO_ORIGEN","t":"INT"},{"n":"FECHA_ACTUALIZACION_LOTE","t":"DATETIME"},{"n":"IDTRANSACCION","t":"INT"},{"n":"MONTO_DOLAR","t":"FLOAT"},{"n":"SINCRONIZADO","t":"VARCHAR(1)"},{"n":"TIPO_TRANSACCION","t":"VARCHAR(6)"}]},"SOFTLAND_AFV_DELETE_PROMOCION":{"m":"","d":"","f":[{"n":"API_RESPONSE","t":"VARCHAR(255)"},{"n":"CASA","t":"INT"},{"n":"DL_CODE","t":"VARCHAR(255)"},{"n":"FECHA_ACTUALIZACION_LOTE","t":"DATETIME"},{"n":"PS_ID_AFV_PROMOCION","t":"INT"},{"n":"SINCRONIZADO","t":"VARCHAR(1)"},{"n":"TIPO_TRANSACCION","t":"VARCHAR(6)"}]},"SOFTLAND_AFV_DELETE_PROMOCION_HISTORY":{"m":"","d":"","f":[{"n":"API_RESPONSE","t":"VARCHAR(255)"},{"n":"CASA","t":"INT"},{"n":"DL_CODE","t":"VARCHAR(255)"},{"n":"FECHA_ACTUALIZACION_LOTE","t":"DATETIME"},{"n":"PS_ID_AFV_PROMOCION","t":"INT"},{"n":"SINCRONIZADO","t":"VARCHAR(1)"},{"n":"TIPO_TRANSACCION","t":"VARCHAR(6)"}]},"SOFTLAND_AFV_DELETE_ZONA_REPRESENTANTE":{"m":"","d":"Zonas geográficas o rutas de distribución para análisis territorial.","f":[{"n":"API_RESPONSE","t":"VARCHAR(255)"},{"n":"CASA","t":"INT"},{"n":"DL_CODE","t":"VARCHAR(255)"},{"n":"FECHA_ACTUALIZACION_LOTE","t":"DATETIME"},{"n":"ID","t":"INT"},{"n":"IDZONAS","t":"INT"},{"n":"SINCRONIZADO","t":"VARCHAR(1)"},{"n":"TIPO_TRANSACCION","t":"VARCHAR(6)"}]},"SOFTLAND_AFV_DESC_PRON_CONDICION_PAGO":{"m":"","d":"","f":[{"n":"API_RESPONSE","t":"VARCHAR(255)"},{"n":"CASA","t":"INT"},{"n":"CREATED","t":"VARCHAR(30)"},{"n":"CREATEDBY","t":"VARCHAR(30)"},{"n":"DESCRIPCION","t":"VARCHAR(300)"},{"n":"DIAS_FIN","t":"INT"},{"n":"DIAS_INICIO","t":"INT"},{"n":"DL_CODE","t":"VARCHAR(255)"},{"n":"FECHA_ACTUALIZACION_LOTE","t":"DATETIME"},{"n":"ID","t":"INT"},{"n":"IDNEGOCIACIONNIVEL","t":"INT"},{"n":"IDNIVEL","t":"INT"},{"n":"PORCENTAJETOTAL","t":"FLOAT"},{"n":"SINCRONIZADO","t":"VARCHAR(1)"},{"n":"TIPO_TRANSACCION","t":"VARCHAR(6)"},{"n":"UPDATED","t":"VARCHAR(30)"},{"n":"UPDATEDBY","t":"VARCHAR(30)"},{"n":"VALORPORCENTAJE1","t":"FLOAT"}]},"SOFTLAND_AFV_DESC_PRON_CONDICION_PAGO_HISTORY":{"m":"","d":"","f":[{"n":"API_RESPONSE","t":"VARCHAR(255)"},{"n":"CASA","t":"INT"},{"n":"CREATED","t":"VARCHAR(30)"},{"n":"CREATEDBY","t":"VARCHAR(30)"},{"n":"DESCRIPCION","t":"VARCHAR(300)"},{"n":"DIAS_FIN","t":"INT"},{"n":"DIAS_INICIO","t":"INT"},{"n":"DL_CODE","t":"VARCHAR(255)"},{"n":"FECHA_ACTUALIZACION_LOTE","t":"DATETIME"},{"n":"ID","t":"INT"},{"n":"IDNEGOCIACIONNIVEL","t":"INT"},{"n":"IDNIVEL","t":"INT"},{"n":"PORCENTAJETOTAL","t":"FLOAT"},{"n":"SINCRONIZADO","t":"VARCHAR(1)"},{"n":"TIPO_TRANSACCION","t":"VARCHAR(6)"},{"n":"UPDATED","t":"VARCHAR(30)"},{"n":"UPDATEDBY","t":"VARCHAR(30)"},{"n":"VALORPORCENTAJE1","t":"FLOAT"}]},"SOFTLAND_AFV_DOCUMENTO_COMERCIAL":{"m":"","d":"","f":[{"n":"API_RESPONSE","t":"VARCHAR(255)"},{"n":"CASA","t":"INT"},{"n":"CLIENTE","t":"INT"},{"n":"DL_CODE","t":"VARCHAR(255)"},{"n":"DOCUMENTO_ORIGEN","t":"INT"},{"n":"DOCUMENTOSCOMERCIALESDETALLE","t":"VARCHAR"},{"n":"ESTATUSMOVIMIENTO","t":"VARCHAR(1)"},{"n":"FECHA_ACTUALIZACION","t":"VARCHAR(24)"},{"n":"FECHA_ACTUALIZACION_LOTE","t":"DATETIME"},{"n":"FECHA_DOCUMENTO","t":"VARCHAR(24)"},{"n":"FECHA_RIGE","t":"VARCHAR(24)"},{"n":"FECHA_VENCE","t":"VARCHAR(24)"},{"n":"ID","t":"INT"},{"n":"ID_LISTAPRECIO","t":"INT"},{"n":"IDCONDICIONCOBRANZA","t":"INT"},{"n":"IDDOCUMENTOREF","t":"VARCHAR(3)"},{"n":"IDINSTRUMENTOPAGO","t":"INT"},{"n":"IDMONEDA","t":"INT"},{"n":"IDMOVCOMERCIALREF","t":"INT"},{"n":"IDTRANSACCION","t":"INT"},{"n":"IDZONA","t":"INT"},{"n":"IMPUESTO1","t":"FLOAT"},{"n":"MONTO_DOLAR","t":"FLOAT"},{"n":"MONTO_LOCAL","t":"FLOAT"},{"n":"MONTOBASE_D","t":"FLOAT"}]},"SOFTLAND_AFV_DOCUMENTO_COMERCIAL_VIUDO":{"m":"","d":"","f":[{"n":"API_RESPONSE","t":"VARCHAR(255)"},{"n":"CASA","t":"INT"},{"n":"CLIENTE","t":"INT"},{"n":"DL_CODE","t":"VARCHAR(255)"},{"n":"DOCUMENTO_ORIGEN","t":"INT"},{"n":"ESTATUSMOVIMIENTO","t":"VARCHAR(1)"},{"n":"FECHA_ACTUALIZACION_LOTE","t":"DATETIME"},{"n":"FECHA_DOCUMENTO","t":"VARCHAR(24)"},{"n":"FECHA_RIGE","t":"VARCHAR(24)"},{"n":"FECHA_VENCE","t":"VARCHAR(24)"},{"n":"ID","t":"INT"},{"n":"IDCONDICIONCOBRANZA","t":"INT"},{"n":"IDINSTRUMENTOPAGO","t":"INT"},{"n":"IDMONEDA","t":"INT"},{"n":"IDMOVCOMERCIALREF","t":"INT"},{"n":"IDTRANSACCION","t":"INT"},{"n":"IDZONA","t":"INT"},{"n":"IMPUESTO1","t":"FLOAT"},{"n":"MONTO_DOLAR","t":"FLOAT"},{"n":"MONTO_LOCAL","t":"FLOAT"},{"n":"MONTOBASE_D","t":"FLOAT"},{"n":"MONTOIMPUESTO_D","t":"FLOAT"},{"n":"NROMOVFISCAL","t":"VARCHAR(20)"},{"n":"NROMOVFISCAL_LARGO","t":"VARCHAR(50)"},{"n":"NUMEROFISCAL","t":"VARCHAR(20)"}]},"SOFTLAND_AFV_ENTIDAD_FINANCIERA":{"m":"","d":"Catálogo de entidades financieras (bancos) para operaciones bancarias.","f":[{"n":"API_RESPONSE","t":"VARCHAR(255)"},{"n":"CASA","t":"INT"},{"n":"CONVENIOANEXO","t":"VARCHAR(45)"},{"n":"CREATEDATE","t":"VARCHAR(30)"},{"n":"CREATEDBY","t":"VARCHAR(30)"},{"n":"DESCRIPCION","t":"VARCHAR(45)"},{"n":"DL_CODE","t":"VARCHAR(255)"},{"n":"FECHA_ACTUALIZACION_LOTE","t":"DATETIME"},{"n":"IDENTIDADFINANCIERA","t":"INT"},{"n":"RECORDDATE","t":"VARCHAR(30)"},{"n":"SINCRONIZADO","t":"VARCHAR(1)"},{"n":"STATUS","t":"VARCHAR(1)"},{"n":"TIPO_TRANSACCION","t":"VARCHAR(6)"},{"n":"UPDATEDBY","t":"VARCHAR(30)"}]},"SOFTLAND_AFV_ESTADO":{"m":"","d":"","f":[{"n":"ABREVIA","t":"VARCHAR(45)"},{"n":"ACTIVO","t":"VARCHAR(1)"},{"n":"API_RESPONSE","t":"VARCHAR(255)"},{"n":"BYUSER","t":"VARCHAR(30)"},{"n":"CASA","t":"INT"},{"n":"CODNEMONICO","t":"VARCHAR(1)"},{"n":"DL_CODE","t":"VARCHAR(255)"},{"n":"ESTADO","t":"VARCHAR(45)"},{"n":"FECHA_ACTUALIZACION_LOTE","t":"DATETIME"},{"n":"ID_ESTADO","t":"INT"},{"n":"IDPAIS","t":"INT"},{"n":"IDREGION","t":"INT"},{"n":"IDZONADESP","t":"INT"},{"n":"SINCRONIZADO","t":"VARCHAR(1)"},{"n":"TIPO_TRANSACCION","t":"VARCHAR(6)"},{"n":"UPDFECHA","t":"VARCHAR(30)"},{"n":"UPDHORA","t":"VARCHAR(8)"}]},"SOFTLAND_AFV_IMPUESTO":{"m":"","d":"Configuración de impuestos: tasas, tipos y reglas de aplicación.","f":[{"n":"ALICUOTA","t":"INT"},{"n":"API_RESPONSE","t":"VARCHAR(255)"},{"n":"CASA","t":"INT"},{"n":"CREATED","t":"VARCHAR(30)"},{"n":"DL_CODE","t":"VARCHAR(255)"},{"n":"FECHA_ACTUALIZACION_LOTE","t":"DATETIME"},{"n":"ID","t":"INT"},{"n":"IDIMPUESTO_SFL","t":"INT"},{"n":"RECORDDATE","t":"VARCHAR(30)"},{"n":"SINCRONIZADO","t":"VARCHAR(1)"},{"n":"TIPO_TRANSACCION","t":"VARCHAR(6)"}]},"SOFTLAND_AFV_JOB_LOGS":{"m":"","d":"Registro de auditoría y trazabilidad de cambios en el sistema.","f":[{"n":"CANTIDAD_REGISTROS_ACTUALIZADOS","t":"INT"},{"n":"CANTIDAD_REGISTROS_LEIDOS","t":"INT"},{"n":"DESCRIPCION","t":"VARCHAR"},{"n":"ENTIDAD","t":"VARCHAR(100)"},{"n":"FECHA_OPERACION","t":"DATETIME"},{"n":"FECHA_REGISTRO","t":"DATETIME"},{"n":"ID","t":"INT"},{"n":"JOB_CODIGO_LOTE","t":"VARCHAR(32)"},{"n":"JOB_EJECUCION_ID","t":"VARCHAR(100)"},{"n":"JOB_FECHA_EJECUCION","t":"DATETIME"},{"n":"JOB_NOMBRE","t":"VARCHAR(100)"},{"n":"TIPO_LOG","t":"VARCHAR(50)"}]},"SOFTLAND_AFV_LISTA_PRECIO":{"m":"","d":"Lista de precios: tarifas por artículo, cliente o segmento.","f":[{"n":"API_RESPONSE","t":"VARCHAR(255)"},{"n":"CASA","t":"INT"},{"n":"CREATEDATE","t":"VARCHAR(50)"},{"n":"DL_CODE","t":"VARCHAR(255)"},{"n":"ESTATUS_NIVEL_PRECIO","t":"VARCHAR(1)"},{"n":"FACTOR","t":"FLOAT"},{"n":"FECHA_ACTUALIZACION_LOTE","t":"DATETIME"},{"n":"ID","t":"INT"},{"n":"ID_LISTA_ALT","t":"INT"},{"n":"ID_LISTAPRECIO","t":"INT"},{"n":"NIVEL_PRECIO","t":"VARCHAR(12)"},{"n":"NOMBRE","t":"VARCHAR(12)"},{"n":"NOMBRE_LISTA_ALT","t":"VARCHAR(200)"},{"n":"PORCENTAJE","t":"FLOAT"},{"n":"SINCRONIZADO","t":"VARCHAR(1)"},{"n":"TIPO_TRANSACCION","t":"VARCHAR(6)"},{"n":"UPDATE_DATE","t":"VARCHAR(50)"}]},"SOFTLAND_AFV_MARCA_CATALOGO":{"m":"","d":"","f":[{"n":"API_RESPONSE","t":"VARCHAR(255)"},{"n":"CASA","t":"INT"},{"n":"CLASIFICACION_3","t":"VARCHAR(12)"},{"n":"DESCRIPCION","t":"VARCHAR(40)"},{"n":"DL_CODE","t":"VARCHAR(255)"},{"n":"FECHA_ACTUALIZACION_LOTE","t":"DATETIME"},{"n":"IDMARCACATALOGO","t":"INT"},{"n":"SINCRONIZADO","t":"VARCHAR(1)"},{"n":"TIPO_TRANSACCION","t":"VARCHAR(6)"}]},"SOFTLAND_AFV_MARCA_CATALOGO_HISTORY":{"m":"","d":"","f":[{"n":"API_RESPONSE","t":"VARCHAR(255)"},{"n":"CASA","t":"INT"},{"n":"CLASIFICACION_3","t":"VARCHAR(12)"},{"n":"DESCRIPCION","t":"VARCHAR(40)"},{"n":"DL_CODE","t":"VARCHAR(255)"},{"n":"FECHA_ACTUALIZACION_LOTE","t":"DATETIME"},{"n":"IDMARCACATALOGO","t":"INT"},{"n":"SINCRONIZADO","t":"VARCHAR(1)"},{"n":"TIPO_TRANSACCION","t":"VARCHAR(6)"}]},"SOFTLAND_AFV_MOV_COMERCIAL_PUT":{"m":"","d":"","f":[{"n":"API_RESPONSE","t":"VARCHAR(255)"},{"n":"CASA","t":"INT"},{"n":"DL_CODE","t":"VARCHAR(255)"},{"n":"ESTATUSMOVIMIENTO","t":"VARCHAR(12)"},{"n":"ESTATUSREGISTRO","t":"VARCHAR(12)"},{"n":"FECHA_ACTUALIZACION","t":"VARCHAR(30)"},{"n":"FECHA_ACTUALIZACION_LOTE","t":"DATETIME"},{"n":"ID","t":"INT"},{"n":"SALDO_DOLAR","t":"FLOAT"},{"n":"SALDO_LOCAL","t":"FLOAT"},{"n":"SINCRONIZADO","t":"VARCHAR(1)"},{"n":"TIPO_TRANSACCION","t":"VARCHAR(6)"}]},"SOFTLAND_AFV_MOV_COMERCIAL_PUT_HISTORY":{"m":"","d":"","f":[{"n":"API_RESPONSE","t":"VARCHAR(255)"},{"n":"CASA","t":"INT"},{"n":"DL_CODE","t":"VARCHAR(255)"},{"n":"ESTATUSMOVIMIENTO","t":"VARCHAR(12)"},{"n":"ESTATUSREGISTRO","t":"VARCHAR(12)"},{"n":"FECHA_ACTUALIZACION","t":"VARCHAR(30)"},{"n":"FECHA_ACTUALIZACION_LOTE","t":"DATETIME"},{"n":"ID","t":"INT"},{"n":"SALDO_DOLAR","t":"FLOAT"},{"n":"SALDO_LOCAL","t":"FLOAT"},{"n":"SINCRONIZADO","t":"VARCHAR(1)"},{"n":"TIPO_TRANSACCION","t":"VARCHAR(6)"}]},"SOFTLAND_AFV_MOV_TRANSACCIONES_PUT":{"m":"","d":"","f":[{"n":"API_RESPONSE","t":"VARCHAR(255)"},{"n":"CASA","t":"INT"},{"n":"DL_CODE","t":"VARCHAR(255)"},{"n":"DOCUMENTO_ORIGEN","t":"VARCHAR(254)"},{"n":"ESTATUSMOVIMIENTO","t":"VARCHAR(12)"},{"n":"ESTATUSREGISTRO","t":"VARCHAR(12)"},{"n":"FECHA_ACTUALIZACION","t":"VARCHAR(30)"},{"n":"FECHA_ACTUALIZACION_LOTE","t":"DATETIME"},{"n":"IDTRANSACCION","t":"INT"},{"n":"MONTO_DOLAR","t":"FLOAT"},{"n":"MONTO_LOCAL","t":"FLOAT"},{"n":"SALDO_DOLAR","t":"FLOAT"},{"n":"SALDO_LOCAL","t":"FLOAT"},{"n":"SINCRONIZADO","t":"VARCHAR(1)"},{"n":"TIPO_TRANSACCION","t":"VARCHAR(6)"}]},"SOFTLAND_AFV_MOV_TRANSACCIONES_PUT_HISTORY":{"m":"","d":"","f":[{"n":"API_RESPONSE","t":"VARCHAR(255)"},{"n":"CASA","t":"INT"},{"n":"DL_CODE","t":"VARCHAR(255)"},{"n":"DOCUMENTO_ORIGEN","t":"VARCHAR(254)"},{"n":"ESTATUSMOVIMIENTO","t":"VARCHAR(12)"},{"n":"ESTATUSREGISTRO","t":"VARCHAR(12)"},{"n":"FECHA_ACTUALIZACION","t":"VARCHAR(30)"},{"n":"FECHA_ACTUALIZACION_LOTE","t":"DATETIME"},{"n":"IDTRANSACCION","t":"INT"},{"n":"MONTO_DOLAR","t":"FLOAT"},{"n":"MONTO_LOCAL","t":"FLOAT"},{"n":"SALDO_DOLAR","t":"FLOAT"},{"n":"SALDO_LOCAL","t":"FLOAT"},{"n":"SINCRONIZADO","t":"VARCHAR(1)"},{"n":"TIPO_TRANSACCION","t":"VARCHAR(6)"}]},"SOFTLAND_AFV_PAIS":{"m":"","d":"Catálogo de países con cuentas contables asociadas para integración.","f":[{"n":"API_RESPONSE","t":"VARCHAR(255)"},{"n":"CASA","t":"INT"},{"n":"DL_CODE","t":"VARCHAR(255)"},{"n":"FECHA_ACTUALIZACION_LOTE","t":"DATETIME"},{"n":"IDPAIS","t":"INT"},{"n":"NOMBREPAIS","t":"VARCHAR(45)"},{"n":"SINCRONIZADO","t":"VARCHAR(1)"},{"n":"TIPO_TRANSACCION","t":"VARCHAR(6)"}]},"SOFTLAND_AFV_PROMOCION":{"m":"","d":"","f":[{"n":"API_RESPONSE","t":"VARCHAR(255)"},{"n":"CASA","t":"INT"},{"n":"DESCRIPCION","t":"VARCHAR(250)"},{"n":"DL_CODE","t":"VARCHAR(255)"},{"n":"FECHA_ACTUALIZACION_LOTE","t":"DATETIME"},{"n":"FECHA_EMISION","t":"VARCHAR(24)"},{"n":"FECHA_FIN","t":"VARCHAR(24)"},{"n":"FECHA_INICIO","t":"VARCHAR(24)"},{"n":"FECHA_OPERACION","t":"VARCHAR(30)"},{"n":"IDSTATUS","t":"INT"},{"n":"OBSERVACIONES","t":"VARCHAR(250)"},{"n":"PS_ID_AFV_PROMOCION","t":"INT"},{"n":"SINCRONIZADO","t":"VARCHAR(1)"},{"n":"TIPO_TRANSACCION","t":"VARCHAR(6)"},{"n":"USUARIO","t":"VARCHAR(30)"}]},"SOFTLAND_AFV_PROMOCION_ARTICULO":{"m":"","d":"","f":[{"n":"API_RESPONSE","t":"VARCHAR(255)"},{"n":"CASA","t":"INT"},{"n":"DESTINOPROMO","t":"VARCHAR(1)"},{"n":"DL_CODE","t":"VARCHAR(255)"},{"n":"FECHA_ACTUALIZACION_LOTE","t":"DATETIME"},{"n":"FECHA_OPERACION","t":"VARCHAR(30)"},{"n":"FECHAAUDITORIA","t":"DATETIME"},{"n":"ID","t":"INT"},{"n":"IDAGRUPACION","t":"INT"},{"n":"IDSTATUS","t":"INT"},{"n":"IDTIPOPROMOCION","t":"INT"},{"n":"PS_AFV_ARTICULO_ID","t":"INT"},{"n":"SINCRONIZADO","t":"VARCHAR(1)"},{"n":"TIPO_TRANSACCION","t":"VARCHAR(6)"}]},"SOFTLAND_AFV_PROMOCION_ARTICULO_HISTORY":{"m":"","d":"","f":[{"n":"API_RESPONSE","t":"VARCHAR(255)"},{"n":"CASA","t":"INT"},{"n":"DESTINOPROMO","t":"VARCHAR(1)"},{"n":"DL_CODE","t":"VARCHAR(255)"},{"n":"FECHA_ACTUALIZACION_LOTE","t":"DATETIME"},{"n":"FECHA_OPERACION","t":"VARCHAR(30)"},{"n":"FECHAAUDITORIA","t":"DATETIME"},{"n":"ID","t":"INT"},{"n":"IDAGRUPACION","t":"INT"},{"n":"IDSTATUS","t":"INT"},{"n":"IDTIPOPROMOCION","t":"INT"},{"n":"PS_AFV_ARTICULO_ID","t":"INT"},{"n":"SINCRONIZADO","t":"VARCHAR(1)"},{"n":"TIPO_TRANSACCION","t":"VARCHAR(6)"}]},"SOFTLAND_AFV_PROMOCION_DETALLE":{"m":"","d":"","f":[{"n":"API_RESPONSE","t":"VARCHAR(255)"},{"n":"CASA","t":"INT"},{"n":"DL_CODE","t":"VARCHAR(255)"},{"n":"FECHA_ACTUALIZACION_LOTE","t":"DATETIME"},{"n":"FECHA_OPERACION","t":"VARCHAR(30)"},{"n":"ID","t":"INT"},{"n":"IDSTATUS","t":"INT"},{"n":"IDTIPOPROMOCION","t":"INT"},{"n":"PS_AFV_ARTICULO_ID","t":"INT"},{"n":"PS_AFV_CLASIFICACION_ID","t":"INT"},{"n":"PS_AFV_ID_CLIENTE","t":"INT"},{"n":"PS_ID_AFV_PROMOCION","t":"INT"},{"n":"SINCRONIZADO","t":"VARCHAR(1)"},{"n":"TIPO_TRANSACCION","t":"VARCHAR(6)"}]},"SOFTLAND_AFV_PROMOCION_DETALLE_HISTORY":{"m":"","d":"","f":[{"n":"API_RESPONSE","t":"VARCHAR(255)"},{"n":"CASA","t":"INT"},{"n":"DL_CODE","t":"VARCHAR(255)"},{"n":"FECHA_ACTUALIZACION_LOTE","t":"DATETIME"},{"n":"FECHA_OPERACION","t":"VARCHAR(30)"},{"n":"ID","t":"INT"},{"n":"IDSTATUS","t":"INT"},{"n":"IDTIPOPROMOCION","t":"INT"},{"n":"PS_AFV_ARTICULO_ID","t":"INT"},{"n":"PS_AFV_CLASIFICACION_ID","t":"INT"},{"n":"PS_AFV_ID_CLIENTE","t":"INT"},{"n":"PS_ID_AFV_PROMOCION","t":"INT"},{"n":"SINCRONIZADO","t":"VARCHAR(1)"},{"n":"TIPO_TRANSACCION","t":"VARCHAR(6)"}]},"SOFTLAND_AFV_PROMOCION_DETALLE_NIVEL":{"m":"","d":"","f":[{"n":"API_RESPONSE","t":"VARCHAR(255)"},{"n":"CANTIDAD","t":"INT"},{"n":"CASA","t":"INT"},{"n":"DL_CODE","t":"VARCHAR(255)"},{"n":"FECHA_ACTUALIZACION_LOTE","t":"DATETIME"},{"n":"FECHA_OPERACION","t":"VARCHAR(30)"},{"n":"ID","t":"INT"},{"n":"IDSTATUS","t":"INT"},{"n":"IDTIPOPROMOCION","t":"INT"},{"n":"PORCENTAJE","t":"FLOAT"},{"n":"PS_AFV_ARTICULO_ID","t":"INT"},{"n":"PS_AFV_CLASIFICACION_ID","t":"INT"},{"n":"PS_AFV_ID_CLIENTE","t":"INT"},{"n":"PS_ID_AFV_PROMOCION","t":"INT"},{"n":"PS_ID_AFV_PROMOCION_NIVEL","t":"INT"},{"n":"SINCRONIZADO","t":"VARCHAR(1)"},{"n":"TIPO_TRANSACCION","t":"VARCHAR(6)"},{"n":"TIPONIVEL","t":"INT"}]},"SOFTLAND_AFV_PROMOCION_DETALLE_NIVEL_HISTORY":{"m":"","d":"","f":[{"n":"API_RESPONSE","t":"VARCHAR(255)"},{"n":"CANTIDAD","t":"INT"},{"n":"CASA","t":"INT"},{"n":"DL_CODE","t":"VARCHAR(255)"},{"n":"FECHA_ACTUALIZACION_LOTE","t":"DATETIME"},{"n":"FECHA_OPERACION","t":"VARCHAR(30)"},{"n":"ID","t":"INT"},{"n":"IDSTATUS","t":"INT"},{"n":"IDTIPOPROMOCION","t":"INT"},{"n":"PORCENTAJE","t":"FLOAT"},{"n":"PS_AFV_ARTICULO_ID","t":"INT"},{"n":"PS_AFV_CLASIFICACION_ID","t":"INT"},{"n":"PS_AFV_ID_CLIENTE","t":"INT"},{"n":"PS_ID_AFV_PROMOCION","t":"INT"},{"n":"PS_ID_AFV_PROMOCION_NIVEL","t":"INT"},{"n":"SINCRONIZADO","t":"VARCHAR(1)"},{"n":"TIPO_TRANSACCION","t":"VARCHAR(6)"},{"n":"TIPONIVEL","t":"INT"}]},"SOFTLAND_AFV_PROMOCION_HISTORY":{"m":"","d":"","f":[{"n":"API_RESPONSE","t":"VARCHAR(255)"},{"n":"CASA","t":"INT"},{"n":"DESCRIPCION","t":"VARCHAR(250)"},{"n":"DL_CODE","t":"VARCHAR(255)"},{"n":"FECHA_ACTUALIZACION_LOTE","t":"DATETIME"},{"n":"FECHA_EMISION","t":"VARCHAR(24)"},{"n":"FECHA_FIN","t":"VARCHAR(24)"},{"n":"FECHA_INICIO","t":"VARCHAR(24)"},{"n":"FECHA_OPERACION","t":"VARCHAR(30)"},{"n":"IDSTATUS","t":"INT"},{"n":"OBSERVACIONES","t":"VARCHAR(250)"},{"n":"PS_ID_AFV_PROMOCION","t":"INT"},{"n":"SINCRONIZADO","t":"VARCHAR(1)"},{"n":"TIPO_TRANSACCION","t":"VARCHAR(6)"},{"n":"USUARIO","t":"VARCHAR(30)"}]},"SOFTLAND_AFV_PROMOCION_ZONA":{"m":"","d":"Zonas geográficas o rutas de distribución para análisis territorial.","f":[{"n":"API_RESPONSE","t":"VARCHAR(255)"},{"n":"CASA","t":"INT"},{"n":"DL_CODE","t":"VARCHAR(255)"},{"n":"FECHA","t":"DATETIME"},{"n":"FECHA_ACTUALIZACION_LOTE","t":"DATETIME"},{"n":"FECHA_OPERACION","t":"VARCHAR(30)"},{"n":"NOMBREZONA","t":"VARCHAR(30)"},{"n":"PS_AFV_ID_ZONA","t":"INT"},{"n":"PS_ID_AFV_PROMOCION","t":"INT"},{"n":"SINCRONIZADO","t":"VARCHAR(1)"},{"n":"TIPO_TRANSACCION","t":"VARCHAR(6)"}]},"SOFTLAND_AFV_PROMOCION_ZONA_HISTORY":{"m":"","d":"Zonas geográficas o rutas de distribución para análisis territorial.","f":[{"n":"API_RESPONSE","t":"VARCHAR(255)"},{"n":"CASA","t":"INT"},{"n":"DL_CODE","t":"VARCHAR(255)"},{"n":"FECHA","t":"DATETIME"},{"n":"FECHA_ACTUALIZACION_LOTE","t":"DATETIME"},{"n":"FECHA_OPERACION","t":"VARCHAR(30)"},{"n":"NOMBREZONA","t":"VARCHAR(30)"},{"n":"PS_AFV_ID_ZONA","t":"INT"},{"n":"PS_ID_AFV_PROMOCION","t":"INT"},{"n":"SINCRONIZADO","t":"VARCHAR(1)"},{"n":"TIPO_TRANSACCION","t":"VARCHAR(6)"}]},"SOFTLAND_AFV_RUTAS":{"m":"","d":"Zonas geográficas o rutas de distribución para análisis territorial.","f":[{"n":"API_RESPONSE","t":"VARCHAR(255)"},{"n":"CASA","t":"INT"},{"n":"CODIGO_RUTA","t":"VARCHAR(4)"},{"n":"CODIGO_ZONA","t":"VARCHAR(4)"},{"n":"DL_CODE","t":"VARCHAR(255)"},{"n":"FECHA_ACTUALIZACION_LOTE","t":"DATETIME"},{"n":"IDRUTAS","t":"INT"},{"n":"IDZONAS","t":"INT"},{"n":"NOMBRERUTA","t":"VARCHAR(40)"},{"n":"SINCRONIZADO","t":"VARCHAR(1)"},{"n":"TIPO_TRANSACCION","t":"VARCHAR(6)"}]},"SOFTLAND_AFV_RUTAS_DETALLE":{"m":"","d":"Zonas geográficas o rutas de distribución para análisis territorial.","f":[{"n":"API_RESPONSE","t":"VARCHAR(255)"},{"n":"CASA","t":"INT"},{"n":"DL_CODE","t":"VARCHAR(255)"},{"n":"FECHA_ACTUALIZACION_LOTE","t":"DATETIME"},{"n":"IDCLIENTE","t":"INT"},{"n":"IDRUTAS","t":"INT"},{"n":"IDZONAS","t":"INT"},{"n":"SINCRONIZADO","t":"VARCHAR(1)"},{"n":"TIPO_TRANSACCION","t":"VARCHAR(6)"}]},"SOFTLAND_AFV_RUTAS_DETALLE_HISTORY":{"m":"","d":"Zonas geográficas o rutas de distribución para análisis territorial.","f":[{"n":"API_RESPONSE","t":"VARCHAR(255)"},{"n":"CASA","t":"INT"},{"n":"DL_CODE","t":"VARCHAR(255)"},{"n":"FECHA_ACTUALIZACION_LOTE","t":"DATETIME"},{"n":"IDCLIENTE","t":"INT"},{"n":"IDRUTAS","t":"INT"},{"n":"IDZONAS","t":"INT"},{"n":"SINCRONIZADO","t":"VARCHAR(1)"},{"n":"TIPO_TRANSACCION","t":"VARCHAR(6)"}]},"SOFTLAND_AFV_RUTAS_HISTORY":{"m":"","d":"Zonas geográficas o rutas de distribución para análisis territorial.","f":[{"n":"API_RESPONSE","t":"VARCHAR(255)"},{"n":"CASA","t":"INT"},{"n":"CODIGO_RUTA","t":"VARCHAR(4)"},{"n":"CODIGO_ZONA","t":"VARCHAR(4)"},{"n":"DL_CODE","t":"VARCHAR(255)"},{"n":"FECHA_ACTUALIZACION_LOTE","t":"DATETIME"},{"n":"IDRUTAS","t":"INT"},{"n":"IDZONAS","t":"INT"},{"n":"NOMBRERUTA","t":"VARCHAR(40)"},{"n":"SINCRONIZADO","t":"VARCHAR(1)"},{"n":"TIPO_TRANSACCION","t":"VARCHAR(6)"}]},"SOFTLAND_AFV_TIPO_DOCUMENTO":{"m":"","d":"","f":[{"n":"ACTIVO","t":"VARCHAR(1)"},{"n":"DESCRIPCION","t":"VARCHAR(40)"},{"n":"IDDOCUMENTO","t":"INT"},{"n":"NOMBRECORTO","t":"VARCHAR(24)"},{"n":"SUBTIPO","t":"VARCHAR(24)"},{"n":"TIPO","t":"VARCHAR(3)"}]},"SOFTLAND_AFV_ZONA_CLIENTE":{"m":"","d":"Zonas geográficas o rutas de distribución para análisis territorial.","f":[{"n":"API_RESPONSE","t":"VARCHAR(255)"},{"n":"CASA","t":"INT"},{"n":"DL_CODE","t":"VARCHAR(255)"},{"n":"FECHA_ACTUALIZACION_LOTE","t":"DATETIME"},{"n":"FECHAEFECTIVA","t":"VARCHAR(24)"},{"n":"IDCLIENTE","t":"INT"},{"n":"IDRUTAS","t":"INT"},{"n":"IDZONAS","t":"INT"},{"n":"SINCRONIZADO","t":"VARCHAR(1)"},{"n":"TIPO_TRANSACCION","t":"VARCHAR(6)"}]},"SOFTLAND_AFV_ZONA_CLIENTE_HISTORY":{"m":"","d":"Zonas geográficas o rutas de distribución para análisis territorial.","f":[{"n":"API_RESPONSE","t":"VARCHAR(255)"},{"n":"CASA","t":"INT"},{"n":"DL_CODE","t":"VARCHAR(255)"},{"n":"FECHA_ACTUALIZACION_LOTE","t":"DATETIME"},{"n":"FECHAEFECTIVA","t":"VARCHAR(24)"},{"n":"IDCLIENTE","t":"INT"},{"n":"IDRUTAS","t":"INT"},{"n":"IDZONAS","t":"INT"},{"n":"SINCRONIZADO","t":"VARCHAR(1)"},{"n":"TIPO_TRANSACCION","t":"VARCHAR(6)"}]},"SOFTLAND_AFV_ZONA_REPRESENTANTE":{"m":"","d":"Zonas geográficas o rutas de distribución para análisis territorial.","f":[{"n":"API_RESPONSE","t":"VARCHAR(255)"},{"n":"CASA","t":"INT"},{"n":"DL_CODE","t":"VARCHAR(255)"},{"n":"FECHA_ACTUALIZACION_LOTE","t":"DATETIME"},{"n":"FECHAEFECTIVA","t":"VARCHAR(45)"},{"n":"ID","t":"INT"},{"n":"ID_VEN_ZONA","t":"INT"},{"n":"IDNIVELJERARQUICO","t":"INT"},{"n":"IDZONAS","t":"INT"},{"n":"SINCRONIZADO","t":"VARCHAR(1)"},{"n":"TIPO_TRANSACCION","t":"VARCHAR(6)"},{"n":"U_ESTATUS_VENDEDOR","t":"VARCHAR(1)"},{"n":"VENDEDOR","t":"VARCHAR(45)"}]},"SOFTLAND_AFV_ZONAS":{"m":"","d":"Zonas geográficas o rutas de distribución para análisis territorial.","f":[{"n":"API_RESPONSE","t":"VARCHAR(255)"},{"n":"CASA","t":"INT"},{"n":"DESCRIPCIONZONA","t":"VARCHAR(254)"},{"n":"DL_CODE","t":"VARCHAR(255)"},{"n":"FECHA_ACTUALIZACION_LOTE","t":"DATETIME"},{"n":"IDRUTA","t":"VARCHAR(4)"},{"n":"IDSTATUS","t":"VARCHAR(1)"},{"n":"IDZONAS","t":"INT"},{"n":"NOMBREZONA","t":"VARCHAR(254)"},{"n":"SINCRONIZADO","t":"VARCHAR(1)"},{"n":"TIPO_TRANSACCION","t":"VARCHAR(6)"}]},"SOFTLAND_AFV_ZONAS_HISTORY":{"m":"","d":"Zonas geográficas o rutas de distribución para análisis territorial.","f":[{"n":"API_RESPONSE","t":"VARCHAR(255)"},{"n":"CASA","t":"INT"},{"n":"DESCRIPCIONZONA","t":"VARCHAR(254)"},{"n":"DL_CODE","t":"VARCHAR(255)"},{"n":"FECHA_ACTUALIZACION_LOTE","t":"DATETIME"},{"n":"IDRUTA","t":"VARCHAR(4)"},{"n":"IDSTATUS","t":"VARCHAR(1)"},{"n":"IDZONAS","t":"INT"},{"n":"NOMBREZONA","t":"VARCHAR(254)"},{"n":"SINCRONIZADO","t":"VARCHAR(1)"},{"n":"TIPO_TRANSACCION","t":"VARCHAR(6)"}]},"SOLIC_TRASP_LINEA":{"m":"","d":"","f":[{"n":"ARTICULO","t":"VARCHAR(20)"},{"n":"CANTIDAD","t":"INT"},{"n":"COBRABLE","t":"VARCHAR(1)"},{"n":"ESTADO","t":"VARCHAR(1)"},{"n":"FECHA_TRASPASO","t":"DATETIME"},{"n":"LINEA","t":"INT"},{"n":"SOLICITUD_TRASPASO","t":"VARCHAR(10)"}]},"SOLIC_TRASP_LINEA_HIST":{"m":"","d":"","f":[{"n":"ARTICULO","t":"VARCHAR(20)"},{"n":"CANTIDAD","t":"INT"},{"n":"CANTIDAD_DEV","t":"INT"},{"n":"CANTIDAD_FAC","t":"INT"},{"n":"COBRABLE","t":"VARCHAR(1)"},{"n":"CONSECUTIVO","t":"INT"},{"n":"ESTADO","t":"VARCHAR(1)"},{"n":"FECHA_TRASPASO","t":"DATETIME"},{"n":"LINEA","t":"INT"},{"n":"SOLICITUD_TRASPASO","t":"VARCHAR(10)"}]},"SOLICITUD_AF_AUDIT":{"m":"","d":"Registro de auditoría y trazabilidad de cambios en el sistema.","f":[{"n":"ESTADO","t":"VARCHAR(1)"},{"n":"ESTADO_NOT","t":"VARCHAR(1)"},{"n":"FECHA_ESTADO","t":"DATETIME"},{"n":"NIVEL","t":"INT"},{"n":"OBSERVACIONES","t":"TEXT"},{"n":"SOLICITUD","t":"INT"},{"n":"USUARIO","t":"VARCHAR(50)"}]},"SOLICITUD_AF_NOTIF":{"m":"","d":"","f":[{"n":"CAMBIA_CENTRO_COSTO","t":"INT"},{"n":"ESTADO_SOLICITUD","t":"VARCHAR(1)"},{"n":"FECHA","t":"DATETIME"},{"n":"FECHA_RIGE","t":"DATETIME"},{"n":"GEN_OTRO_RESP","t":"INT"},{"n":"NOTAS","t":"TEXT"},{"n":"RESPONSABLE_CREADOPOR","t":"VARCHAR(20)"},{"n":"RESPONSABLE_CREADOR","t":"VARCHAR(20)"},{"n":"RESPONSABLE_TRASLADO","t":"VARCHAR(20)"},{"n":"SOLICITUD","t":"INT"},{"n":"TIPO_ACCION","t":"VARCHAR(4)"}]},"SOLICITUD_OC":{"m":"CO","d":"","f":[{"n":"AUTORIZADA_POR","t":"VARCHAR(50)"},{"n":"COMENTARIO","t":"TEXT"},{"n":"DEPARTAMENTO","t":"VARCHAR(10)"},{"n":"ESTADO","t":"VARCHAR(1)"},{"n":"FECHA_AUTORIZADA","t":"DATETIME"},{"n":"FECHA_HORA","t":"DATETIME"},{"n":"FECHA_HORA_CANCELA","t":"DATETIME"},{"n":"FECHA_REQUERIDA","t":"DATETIME"},{"n":"FECHA_SOLICITUD","t":"DATETIME"},{"n":"LINEAS_NO_ASIG","t":"INT"},{"n":"PRIORIDAD","t":"VARCHAR(1)"},{"n":"RUBRO1","t":"VARCHAR(50)"},{"n":"RUBRO2","t":"VARCHAR(50)"},{"n":"RUBRO3","t":"VARCHAR(50)"},{"n":"RUBRO4","t":"VARCHAR(50)"},{"n":"RUBRO5","t":"VARCHAR(50)"},{"n":"SOLICITUD_OC","t":"VARCHAR(10)"},{"n":"USUARIO","t":"VARCHAR(50)"},{"n":"USUARIO_CANCELA","t":"VARCHAR(50)"}]},"SOLICITUD_OC_IMP":{"m":"CO","d":"","f":[{"n":"SOLICITUD_OC","t":"VARCHAR(10)"},{"n":"USUARIO","t":"VARCHAR(50)"}]},"SOLICITUD_OC_LINEA":{"m":"CO","d":"","f":[{"n":"ARTICULO","t":"VARCHAR(20)"},{"n":"CANTIDAD","t":"DECIMAL"},{"n":"CENTRO_COSTO","t":"VARCHAR(25)"},{"n":"COMENTARIO","t":"VARCHAR(250)"},{"n":"CUENTA_CONTABLE","t":"VARCHAR(25)"},{"n":"DESCRIPCION","t":"TEXT"},{"n":"E_MAIL","t":"VARCHAR(250)"},{"n":"ESTADO","t":"VARCHAR(1)"},{"n":"FASE","t":"VARCHAR(25)"},{"n":"FECHA_HORA_CANCELA","t":"DATETIME"},{"n":"FECHA_REQUERIDA","t":"DATETIME"},{"n":"ORDEN_CAMBIO","t":"INT"},{"n":"PROYECTO","t":"VARCHAR(25)"},{"n":"SALDO","t":"DECIMAL"},{"n":"SOLICITUD_OC","t":"VARCHAR(10)"},{"n":"SOLICITUD_OC_LINEA","t":"INT"},{"n":"UNIDAD_DISTRIBUCIO","t":"VARCHAR(6)"},{"n":"USUARIO_CANCELA","t":"VARCHAR(50)"}]},"SOLICITUD_ORDEN_CO":{"m":"","d":"","f":[{"n":"CANTIDAD","t":"DECIMAL"},{"n":"ORDEN_COMPRA","t":"VARCHAR(10)"},{"n":"ORDEN_COMPRA_LINEA","t":"INT"},{"n":"SOLICITUD_OC","t":"VARCHAR(10)"},{"n":"SOLICITUD_OC_LINEA","t":"INT"}]},"SOLICITUD_RH":{"m":"","d":"","f":[{"n":"DIAS","t":"FLOAT"},{"n":"EMPLEADO","t":"VARCHAR(20)"},{"n":"ESTADO","t":"VARCHAR(1)"},{"n":"FECHA_ESTADO","t":"DATETIME"},{"n":"FECHA_HORA","t":"DATETIME"},{"n":"FECHA_RIGE","t":"DATETIME"},{"n":"FECHA_VENCE","t":"DATETIME"},{"n":"GENERADA_POR","t":"VARCHAR(20)"},{"n":"NUMERO_ACCION","t":"INT"},{"n":"OBSERVACIONES","t":"TEXT"},{"n":"SOLICITUD_RH","t":"INT"},{"n":"TIPO_SOLICITUD_RH","t":"VARCHAR(4)"}]},"SOLICITUD_RH_AUDIT":{"m":"","d":"Registro de auditoría y trazabilidad de cambios en el sistema.","f":[{"n":"ESTADO","t":"VARCHAR(1)"},{"n":"FECHA_ESTADO","t":"DATETIME"},{"n":"NIVEL","t":"INT"},{"n":"OBSERVACIONES","t":"TEXT"},{"n":"SOLICITUD_RH","t":"INT"},{"n":"USUARIO","t":"VARCHAR(50)"}]},"SOLICITUD_RH_DOC":{"m":"","d":"","f":[{"n":"DOCUMENTO","t":"INT"},{"n":"SOLICITUD_RH","t":"INT"}]},"SOLICITUD_RH_NOTIF":{"m":"","d":"","f":[{"n":"CONSECUTIVO","t":"INT"},{"n":"EMPLEADO","t":"VARCHAR(20)"},{"n":"ESTADO","t":"VARCHAR(1)"},{"n":"FECHA_HORA","t":"DATETIME"},{"n":"SOLICITUD_RH","t":"INT"}]},"SOLICITUD_TRASPASO":{"m":"","d":"","f":[{"n":"BODEGA_DESTINO","t":"VARCHAR(4)"},{"n":"BODEGA_ORIGEN","t":"VARCHAR(4)"},{"n":"BOLETA","t":"VARCHAR(14)"},{"n":"FECHA_SOLICITUD","t":"DATETIME"},{"n":"LOCALIZACION_DESTINO","t":"VARCHAR(8)"},{"n":"LOCALIZACION_ORIGEN","t":"VARCHAR(8)"},{"n":"OBSERVACIONES","t":"TEXT"},{"n":"SOLICITUD_TRASPASO","t":"VARCHAR(10)"}]},"SP_ARTICULO":{"m":"","d":"","f":[{"n":"ACTIVO","t":"VARCHAR(1)"},{"n":"ARTICULO","t":"VARCHAR(20)"},{"n":"ARTICULO_DEL_PROV","t":"VARCHAR(30)"},{"n":"CLASE_ABC","t":"VARCHAR(1)"},{"n":"CLASIFICACION_1","t":"VARCHAR(12)"},{"n":"CLASIFICACION_2","t":"VARCHAR(12)"},{"n":"CLASIFICACION_3","t":"VARCHAR(12)"},{"n":"CLASIFICACION_4","t":"VARCHAR(12)"},{"n":"CLASIFICACION_5","t":"VARCHAR(12)"},{"n":"CLASIFICACION_6","t":"VARCHAR(12)"},{"n":"COSTO_COMPARATIVO","t":"VARCHAR(1)"},{"n":"COSTO_FISCAL","t":"VARCHAR(1)"},{"n":"COSTO_PROM_DOL","t":"DECIMAL"},{"n":"COSTO_PROM_LOC","t":"DECIMAL"},{"n":"DESCRIPCION","t":"VARCHAR(254)"},{"n":"EXISTENCIA_MAXIMA","t":"DECIMAL"},{"n":"EXISTENCIA_MINIMA","t":"DECIMAL"},{"n":"FACTOR_EMPAQUE","t":"DECIMAL"},{"n":"FRECUENCIA_CONTEO","t":"INT"},{"n":"IMPUESTO","t":"VARCHAR(4)"},{"n":"LOTE_MULTIPLO","t":"DECIMAL"},{"n":"ORDEN_MINIMA","t":"DECIMAL"},{"n":"PLAZO_REABAST","t":"INT"},{"n":"PROVEEDOR","t":"VARCHAR(20)"},{"n":"PUNTO_DE_REORDEN","t":"DECIMAL"}]},"SP_ARTICULO_PROVEEDOR":{"m":"","d":"","f":[{"n":"ARTICULO","t":"VARCHAR(20)"},{"n":"CANT_ECONOMICA_COM","t":"DECIMAL"},{"n":"CODIGO_CATALOGO","t":"VARCHAR(20)"},{"n":"DESCRIP_CATALOGO","t":"VARCHAR(254)"},{"n":"FACTOR_CONVERSION","t":"DECIMAL"},{"n":"FECHA_ULT_COTIZACI","t":"DATETIME"},{"n":"LOTE_ESTANDAR","t":"DECIMAL"},{"n":"LOTE_MINIMO","t":"DECIMAL"},{"n":"MULTIPLO_COMPRA","t":"DECIMAL"},{"n":"NOTAS","t":"TEXT"},{"n":"PAIS","t":"VARCHAR(4)"},{"n":"PESO_MINIMO_ORDEN","t":"DECIMAL"},{"n":"PLAZO_REABASTECIMI","t":"INT"},{"n":"PORC_AJUSTE_COSTO","t":"DECIMAL"},{"n":"PROVEEDOR","t":"VARCHAR(20)"},{"n":"TIPO","t":"VARCHAR(1)"},{"n":"UNIDAD_MEDIDA_COMP","t":"VARCHAR(10)"}]},"SP_ARTICULO_TEMP":{"m":"","d":"Tabla temporal de procesamiento. Datos intermedios de procesos batch.","f":[{"n":"CLASE_TOTAL","t":"VARCHAR(10)"},{"n":"CODIGO","t":"VARCHAR(20)"},{"n":"CONSUMO_PROMEDIO","t":"DECIMAL"},{"n":"DESCRIPCION","t":"VARCHAR(254)"},{"n":"FKSP_HISTORIAL","t":"INT"},{"n":"FKVERSION","t":"INT"},{"n":"INV_ACTUAL","t":"DECIMAL"},{"n":"INV_MAXIMO","t":"DECIMAL"},{"n":"INV_TRANSITO","t":"DECIMAL"},{"n":"PKSP_ARTICULO_TEMP","t":"INT"},{"n":"PLANIFICADOR","t":"VARCHAR(10)"},{"n":"PRECIO_TOTAL","t":"DECIMAL"},{"n":"PRECIO_UNITARIO","t":"DECIMAL"},{"n":"PROVEEDOR","t":"VARCHAR(20)"},{"n":"REFERENCIA_PEDIDO","t":"DECIMAL"},{"n":"SUGERENCIA_PEDIDO","t":"DECIMAL"},{"n":"SUGERIDO","t":"DECIMAL"}]},"SP_AUDIT_TRANS_INV":{"m":"","d":"Registro de auditoría y trazabilidad de cambios en el sistema.","f":[{"n":"APLICACION","t":"VARCHAR(249)"},{"n":"ASIENTO","t":"VARCHAR(10)"},{"n":"AUDIT_TRANS_INV","t":"INT"},{"n":"CONSECUTIVO","t":"VARCHAR(10)"},{"n":"FECHA_HORA","t":"DATETIME"},{"n":"FECHA_HORA_APROB","t":"DATETIME"},{"n":"MODULO_ORIGEN","t":"VARCHAR(4)"},{"n":"PAQUETE_INVENTARIO","t":"VARCHAR(4)"},{"n":"REFERENCIA","t":"VARCHAR(200)"},{"n":"USUARIO","t":"VARCHAR(25)"},{"n":"USUARIO_APRO","t":"VARCHAR(25)"}]},"SP_BODEGA":{"m":"","d":"Catálogo de bodegas/almacenes con parámetros logísticos.","f":[{"n":"BODEGA","t":"VARCHAR(4)"},{"n":"DIRECCION","t":"VARCHAR(120)"},{"n":"NOMBRE","t":"VARCHAR(40)"},{"n":"TELEFONO","t":"VARCHAR(15)"},{"n":"TIPO","t":"VARCHAR(1)"}]},"SP_DEPARTAMENTO":{"m":"","d":"","f":[{"n":"DEPARTAMENTO","t":"VARCHAR(10)"},{"n":"DESCRIPCION","t":"VARCHAR(40)"}]},"SP_EMBARQUE":{"m":"","d":"Embarques de importación: proveedor, origen, fechas y costos totales.","f":[{"n":"ASIENTO","t":"VARCHAR(10)"},{"n":"AUDIT_TRANS_INV","t":"INT"},{"n":"AUDIT_TRANS_LIQ","t":"INT"},{"n":"EMBARQUE","t":"VARCHAR(10)"},{"n":"ESTADO","t":"VARCHAR(1)"},{"n":"FECHA_CRM","t":"DATETIME"},{"n":"FECHA_EMBARQUE","t":"DATETIME"},{"n":"FECHA_HORA_APLICAC","t":"DATETIME"},{"n":"FECHA_HORA_CREADO","t":"DATETIME"},{"n":"FECHA_OFRECIDA","t":"DATETIME"},{"n":"FECHA_REQUERIDA","t":"DATETIME"},{"n":"LIQUIDAC_COMPRA","t":"VARCHAR(15)"},{"n":"PROVEEDOR","t":"VARCHAR(20)"},{"n":"TIENE_FACTURA","t":"VARCHAR(1)"},{"n":"USUARIO_APLICADO","t":"VARCHAR(25)"},{"n":"USUARIO_CREADO","t":"VARCHAR(25)"}]},"SP_EMBARQUE_LINEA":{"m":"","d":"Líneas de embarque: artículos importados con costos desagregados.","f":[{"n":"ARTICULO","t":"VARCHAR(20)"},{"n":"BODEGA","t":"VARCHAR(4)"},{"n":"CANTIDAD_EMBARCADA","t":"DECIMAL"},{"n":"CANTIDAD_RECHAZADA","t":"DECIMAL"},{"n":"CANTIDAD_RECIBIDA","t":"DECIMAL"},{"n":"DESCUENTO","t":"DECIMAL"},{"n":"DOCUMENTO","t":"VARCHAR(50)"},{"n":"EMBARQUE","t":"VARCHAR(10)"},{"n":"EMBARQUE_LINEA","t":"INT"},{"n":"IMPUESTO1","t":"DECIMAL"},{"n":"IMPUESTO2","t":"DECIMAL"},{"n":"ORDEN_COMPRA","t":"VARCHAR(10)"},{"n":"ORDEN_COMPRA_LINEA","t":"INT"},{"n":"PRECIO_UNITARIO","t":"DECIMAL"},{"n":"SUBTOTAL","t":"DECIMAL"},{"n":"TIPO_DOCUMENTO","t":"VARCHAR(1)"}]},"SP_EXISTENCIA_BODEGA":{"m":"","d":"Catálogo de bodegas/almacenes con parámetros logísticos.","f":[{"n":"ARTICULO","t":"VARCHAR(20)"},{"n":"BLOQUEA_TRANS","t":"VARCHAR(1)"},{"n":"BODEGA","t":"VARCHAR(4)"},{"n":"CANT_DISPONIBLE","t":"DECIMAL"},{"n":"CANT_NO_APROBADA","t":"DECIMAL"},{"n":"CANT_PEDIDA","t":"DECIMAL"},{"n":"CANT_PRODUCCION","t":"DECIMAL"},{"n":"CANT_REMITIDA","t":"DECIMAL"},{"n":"CANT_RESERVADA","t":"DECIMAL"},{"n":"CANT_TRANSITO","t":"DECIMAL"},{"n":"CANT_VENCIDA","t":"DECIMAL"},{"n":"CONGELADO","t":"VARCHAR(1)"},{"n":"COSTO_PROM_COMPARATIVO_DOLAR","t":"DECIMAL"},{"n":"COSTO_PROM_COMPARATIVO_LOC","t":"DECIMAL"},{"n":"COSTO_UNT_ESTANDAR_DOL","t":"DECIMAL"},{"n":"COSTO_UNT_ESTANDAR_LOC","t":"DECIMAL"},{"n":"COSTO_UNT_PROMEDIO_DOL","t":"DECIMAL"},{"n":"COSTO_UNT_PROMEDIO_LOC","t":"DECIMAL"},{"n":"EXISTENCIA_MAXIMA","t":"DECIMAL"},{"n":"EXISTENCIA_MINIMA","t":"DECIMAL"},{"n":"FECHA_CONG","t":"DATETIME"},{"n":"FECHA_DESCONG","t":"DATETIME"},{"n":"PUNTO_DE_REORDEN","t":"DECIMAL"}]},"SP_FACTURA_LINEA":{"m":"","d":"","f":[{"n":"ANULADA","t":"VARCHAR(1)"},{"n":"ARTICULO","t":"VARCHAR(20)"},{"n":"BASE_IMPUESTO1","t":"DECIMAL"},{"n":"BASE_IMPUESTO2","t":"DECIMAL"},{"n":"BODEGA","t":"VARCHAR(4)"},{"n":"CANTIDAD","t":"DECIMAL"},{"n":"COMENTARIO","t":"VARCHAR(100)"},{"n":"COSTO_ESTIM_DOLAR","t":"DECIMAL"},{"n":"COSTO_ESTIM_LOCAL","t":"DECIMAL"},{"n":"COSTO_TOTAL","t":"DECIMAL"},{"n":"COSTO_TOTAL_DOLAR","t":"DECIMAL"},{"n":"COSTO_TOTAL_LOCAL","t":"DECIMAL"},{"n":"DESC_TOT_GENERAL","t":"DECIMAL"},{"n":"DESC_TOT_LINEA","t":"DECIMAL"},{"n":"DOCUMENTO_ORIGEN","t":"VARCHAR(50)"},{"n":"FACTURA","t":"VARCHAR(50)"},{"n":"FECHA_FACTURA","t":"DATETIME"},{"n":"LINEA","t":"INT"},{"n":"MONTO_RETENCION","t":"DECIMAL"},{"n":"PEDIDO","t":"VARCHAR(50)"},{"n":"PEDIDO_LINEA","t":"INT"},{"n":"PRECIO_TOTAL","t":"DECIMAL"},{"n":"PRECIO_UNITARIO","t":"DECIMAL"},{"n":"TIPO_DOCUMENTO","t":"VARCHAR(1)"},{"n":"TOTAL_IMPUESTO1","t":"DECIMAL"}]},"SP_HISTORIAL":{"m":"","d":"","f":[{"n":"ARTICULO","t":"VARCHAR(20)"},{"n":"ARTICULO_PROVEEDOR","t":"VARCHAR(20)"},{"n":"CANTIDAD_COMPRADA","t":"DECIMAL"},{"n":"CONJUNTO","t":"VARCHAR(10)"},{"n":"CONSECUTIVO","t":"VARCHAR(10)"},{"n":"CONSUMO_PROMEDIO","t":"DECIMAL"},{"n":"DESCRIPCION","t":"VARCHAR(254)"},{"n":"FECHA_HORA","t":"DATETIME"},{"n":"FKVERSION","t":"INT"},{"n":"ID","t":"INT"},{"n":"INV_ACTUAL","t":"DECIMAL"},{"n":"INV_MAXIMO","t":"DECIMAL"},{"n":"INV_TRANSITO","t":"DECIMAL"},{"n":"NOTAS","t":"VARCHAR(250)"},{"n":"PLANIFICADOR","t":"VARCHAR(10)"},{"n":"PRECIO_TOTAL","t":"DECIMAL"},{"n":"PRECIO_UNITARIO","t":"DECIMAL"},{"n":"REFERENCIA_PEDIDO","t":"DECIMAL"},{"n":"SUGERENCIA_PEDIDO","t":"DECIMAL"},{"n":"USUARIO","t":"VARCHAR(30)"}]},"SP_ORDEN_COMPRA":{"m":"","d":"Órdenes de compra a proveedores: artículos, cantidades y condiciones.","f":[{"n":"BODEGA","t":"VARCHAR(4)"},{"n":"CONDICION_PAGO","t":"VARCHAR(4)"},{"n":"ESTADO","t":"VARCHAR(1)"},{"n":"FECHA","t":"DATETIME"},{"n":"FECHA_COTIZACION","t":"DATETIME"},{"n":"FECHA_EMISION","t":"DATETIME"},{"n":"FECHA_HORA","t":"DATETIME"},{"n":"FECHA_OFRECIDA","t":"DATETIME"},{"n":"FECHA_REQ_EMBARQUE","t":"DATETIME"},{"n":"FECHA_REQUERIDA","t":"DATETIME"},{"n":"MONTO_DESCUENTO","t":"DECIMAL"},{"n":"ORDEN_COMPRA","t":"VARCHAR(10)"},{"n":"PRIORIDAD","t":"VARCHAR(1)"},{"n":"PROVEEDOR","t":"VARCHAR(20)"},{"n":"TOTAL_A_COMPRAR","t":"DECIMAL"},{"n":"TOTAL_IMPUESTO1","t":"DECIMAL"},{"n":"TOTAL_IMPUESTO2","t":"DECIMAL"},{"n":"TOTAL_MERCADERIA","t":"DECIMAL"},{"n":"USUARIO","t":"VARCHAR(25)"}]},"SP_ORDEN_COMPRA_LINEA":{"m":"","d":"Órdenes de compra a proveedores: artículos, cantidades y condiciones.","f":[{"n":"ARTICULO","t":"VARCHAR(20)"},{"n":"BODEGA","t":"VARCHAR(4)"},{"n":"CANTIDAD_EMBARCADA","t":"DECIMAL"},{"n":"CANTIDAD_ORDENADA","t":"DECIMAL"},{"n":"CANTIDAD_RECHAZADA","t":"DECIMAL"},{"n":"CANTIDAD_RECIBIDA","t":"DECIMAL"},{"n":"DESCRIPCION","t":"TEXT"},{"n":"E_MAIL","t":"VARCHAR(250)"},{"n":"ESTADO","t":"VARCHAR(1)"},{"n":"FACTURA","t":"VARCHAR(50)"},{"n":"FECHA","t":"DATETIME"},{"n":"FECHA_REQUERIDA","t":"DATETIME"},{"n":"IMPUESTO1","t":"DECIMAL"},{"n":"IMPUESTO2","t":"DECIMAL"},{"n":"MONTO_DESCUENTO","t":"DECIMAL"},{"n":"ORDEN_COMPRA","t":"VARCHAR(10)"},{"n":"ORDEN_COMPRA_LINEA","t":"INT"},{"n":"PRECIO_ART_PROV","t":"DECIMAL"},{"n":"PRECIO_UNITARIO","t":"DECIMAL"}]},"SP_PRECIO_ART_PROV":{"m":"","d":"Lista de precios: tarifas por artículo, cliente o segmento.","f":[{"n":"ARTICULO","t":"VARCHAR(20)"},{"n":"CANTIDAD_HASTA","t":"DECIMAL"},{"n":"LINEA","t":"INT"},{"n":"PRECIO","t":"DECIMAL"},{"n":"PROVEEDOR","t":"VARCHAR(20)"}]},"SP_PROB_DETALLE":{"m":"","d":"","f":[{"n":"COMBINACION","t":"VARCHAR(4)"},{"n":"PORCENTAJE","t":"VARCHAR(3)"}]},"SP_PROBABILIDAD":{"m":"","d":"","f":[{"n":"COMBINACION","t":"VARCHAR(4)"},{"n":"PORCENTAJE","t":"VARCHAR(3)"}]},"SP_PRONOSTICO":{"m":"","d":"","f":[{"n":"DESCRIPCION","t":"VARCHAR(40)"},{"n":"PDO_FIN_PRONOST","t":"DATETIME"},{"n":"PDO_INI_PRONOST","t":"DATETIME"},{"n":"PRONOSTICO","t":"VARCHAR(20)"}]},"SP_PRONOSTICO_DETALLE":{"m":"","d":"","f":[{"n":"ARTICULO","t":"VARCHAR(20)"},{"n":"BODEGA","t":"VARCHAR(4)"},{"n":"CANTIDAD_PRONOSTICADA","t":"DECIMAL"},{"n":"ID","t":"INT"},{"n":"ITEM_PRONOSTICADO","t":"INT"},{"n":"PERIODO","t":"DATETIME"},{"n":"PRONOSTICO","t":"VARCHAR(20)"}]},"SP_PROVEEDOR":{"m":"","d":"","f":[{"n":"CONDICION_PAGO","t":"VARCHAR(4)"},{"n":"CONTACTO","t":"VARCHAR(30)"},{"n":"DIRECCION","t":"TEXT"},{"n":"IMPUESTO1_INCLUIDO","t":"VARCHAR(1)"},{"n":"LOCAL","t":"VARCHAR(1)"},{"n":"MONEDA","t":"VARCHAR(4)"},{"n":"NOMBRE","t":"VARCHAR(150)"},{"n":"ORDEN_MINIMA","t":"DECIMAL"},{"n":"PAIS","t":"VARCHAR(4)"},{"n":"PROVEEDOR","t":"VARCHAR(20)"},{"n":"SALDO","t":"DECIMAL"},{"n":"TELEFONO1","t":"VARCHAR(50)"}]},"SP_TRANSACCION_INV":{"m":"","d":"","f":[{"n":"AJUSTE_CONFIG","t":"VARCHAR(4)"},{"n":"ARTICULO","t":"VARCHAR(20)"},{"n":"ASIENTO_CARDEX","t":"VARCHAR(10)"},{"n":"AUDIT_TRANS_INV","t":"INT"},{"n":"BODEGA","t":"VARCHAR(4)"},{"n":"CANTIDAD","t":"DECIMAL"},{"n":"CENTRO_COSTO","t":"VARCHAR(25)"},{"n":"CONSECUTIVO","t":"INT"},{"n":"CONTABILIZADA","t":"VARCHAR(1)"},{"n":"COSTO_TOT_COMP_DOL","t":"DECIMAL"},{"n":"COSTO_TOT_COMP_LOC","t":"DECIMAL"},{"n":"COSTO_TOT_FISC_DOL","t":"DECIMAL"},{"n":"COSTO_TOT_FISC_LOC","t":"DECIMAL"},{"n":"CUENTA_CONTABLE","t":"VARCHAR(25)"},{"n":"FECHA","t":"DATETIME"},{"n":"FECHA_HORA_TRANSAC","t":"DATETIME"},{"n":"LOCALIZACION","t":"VARCHAR(8)"},{"n":"LOTE","t":"VARCHAR(15)"},{"n":"NATURALEZA","t":"VARCHAR(1)"},{"n":"NIT","t":"VARCHAR(20)"},{"n":"PRECIO_TOTAL_DOLAR","t":"DECIMAL"},{"n":"PRECIO_TOTAL_LOCAL","t":"DECIMAL"},{"n":"SERIE_CADENA","t":"INT"},{"n":"SUBSUBTIPO","t":"VARCHAR(1)"},{"n":"SUBTIPO","t":"VARCHAR(1)"}]},"SP_VERSION_PLANIFICADOR_TEMP":{"m":"","d":"Tabla temporal de procesamiento. Datos intermedios de procesos batch.","f":[{"n":"FECHA_FIN_PLANIFICADOR","t":"DATETIME"},{"n":"FECHA_INI_PLANIFICADOR","t":"DATETIME"},{"n":"FKPLANIFICADOR","t":"VARCHAR(10)"},{"n":"PKSP_VERSION_TEMP","t":"INT"},{"n":"VERSION_PLANIFICADOR","t":"INT"}]},"SpecificNotes":{"m":"","d":"","f":[{"n":"NoteContent","t":"TEXT"},{"n":"NoteDesc","t":"VARCHAR(255)"},{"n":"SpecificNoteToken","t":"DECIMAL"}]},"STMPDP":{"m":"","d":"","f":[{"n":"STMPDP_ARTCOD","t":"VARCHAR(30)"},{"n":"STMPDP_ARTFOR","t":"VARCHAR(30)"},{"n":"STMPDP_CADENC","t":"VARCHAR(1)"},{"n":"STMPDP_CNTFIJ","t":"DECIMAL"},{"n":"STMPDP_DIADOM","t":"VARCHAR(1)"},{"n":"STMPDP_DIAENT","t":"INT"},{"n":"STMPDP_DIAFI1","t":"INT"},{"n":"STMPDP_DIAFI2","t":"INT"},{"n":"STMPDP_DIAJUE","t":"VARCHAR(1)"},{"n":"STMPDP_DIALUN","t":"VARCHAR(1)"},{"n":"STMPDP_DIAMAR","t":"VARCHAR(1)"},{"n":"STMPDP_DIAMIE","t":"VARCHAR(1)"},{"n":"STMPDP_DIAPRE","t":"INT"},{"n":"STMPDP_DIASAB","t":"VARCHAR(1)"},{"n":"STMPDP_DIAVIE","t":"VARCHAR(1)"},{"n":"STMPDP_FACFCO","t":"DECIMAL"},{"n":"STMPDP_FORMUL","t":"VARCHAR(8)"},{"n":"STMPDP_MAXIMO","t":"DECIMAL"},{"n":"STMPDP_MINIMO","t":"DECIMAL"},{"n":"STMPDP_NORMAR","t":"VARCHAR(1)"},{"n":"STMPDP_NROCTA","t":"VARCHAR(20)"},{"n":"STMPDP_NROITM","t":"INT"},{"n":"STMPDP_ORDPRI","t":"INT"},{"n":"STMPDP_RUTFAB","t":"VARCHAR(8)"},{"n":"STMPDP_TIPFOR","t":"VARCHAR(6)"}]},"SUBSECCION_REPORTES":{"m":"","d":"","f":[{"n":"ACUMULADO","t":"VARCHAR(40)"},{"n":"CODIGO_R","t":"VARCHAR(4)"},{"n":"DESCRIPCION","t":"VARCHAR(40)"},{"n":"SECCION_R","t":"VARCHAR(4)"},{"n":"SECUENCIA","t":"INT"},{"n":"SUBSECCION","t":"VARCHAR(4)"},{"n":"TIPO","t":"VARCHAR(1)"},{"n":"TIPO_R","t":"VARCHAR(2)"}]},"SUBTIPO_COTIZANTE":{"m":"","d":"","f":[{"n":"DESCRIPCION","t":"VARCHAR(254)"},{"n":"SUBTIPO_COTIZANTE","t":"VARCHAR(2)"}]},"SUBTIPO_DOC_CB":{"m":"","d":"","f":[{"n":"CENTRO_COSTO","t":"VARCHAR(25)"},{"n":"CUENTA_CONTABLE","t":"VARCHAR(25)"},{"n":"DESCRIPCION","t":"VARCHAR(40)"},{"n":"DOCUMENTO_GLOBAL","t":"VARCHAR(10)"},{"n":"FLUJO_CAJA","t":"VARCHAR(20)"},{"n":"NATURALEZA_CF","t":"VARCHAR(1)"},{"n":"PAQUETE","t":"VARCHAR(4)"},{"n":"RUBRO_CF","t":"VARCHAR(20)"},{"n":"RUBRO_PADRE","t":"VARCHAR(20)"},{"n":"SUBTIPO","t":"INT"},{"n":"TIPO","t":"VARCHAR(3)"},{"n":"TIPO_ASIENTO","t":"VARCHAR(4)"},{"n":"TIPO_SERVICIO","t":"VARCHAR(2)"}]},"SUBTIPO_DOC_CC":{"m":"CC","d":"","f":[{"n":"ACTIVO","t":"VARCHAR(1)"},{"n":"AUTODETRACCION_CLIENTE","t":"VARCHAR(1)"},{"n":"CALCULA_IMP2","t":"VARCHAR(1)"},{"n":"CENTRO_COSTO","t":"VARCHAR(25)"},{"n":"CODIGO_HACIENDA","t":"VARCHAR(50)"},{"n":"CONSECUTIVO_FAC","t":"VARCHAR(10)"},{"n":"CUENTA_CONTABLE","t":"VARCHAR(25)"},{"n":"DESCRIPCION","t":"VARCHAR(25)"},{"n":"DOCUMENTO_GLOBAL","t":"VARCHAR(10)"},{"n":"FORMA_FARMACEUTICA","t":"VARCHAR(25)"},{"n":"FORMA_PAGO","t":"VARCHAR(2)"},{"n":"INGRESOS_FISICOS","t":"VARCHAR(1)"},{"n":"NIT_TERCERO","t":"VARCHAR(4)"},{"n":"PAQUETE","t":"VARCHAR(4)"},{"n":"PARTICIPA_SEMT","t":"VARCHAR(1)"},{"n":"PARTIDA_ARANCELARIA","t":"VARCHAR(12)"},{"n":"REGISTRO_LEGAL","t":"VARCHAR(10)"},{"n":"REGISTRO_MEDICAMENTOS","t":"VARCHAR(254)"},{"n":"RET_IVA_DTE_SLV","t":"VARCHAR(100)"},{"n":"SUBTIPO","t":"INT"},{"n":"SUBTIPO_CB","t":"INT"},{"n":"TIPO","t":"VARCHAR(3)"},{"n":"TIPO_ANULACION","t":"VARCHAR(1)"},{"n":"TIPO_ASIENTO","t":"VARCHAR(4)"},{"n":"TIPO_CAMBIO","t":"VARCHAR(4)"}]},"SUBTIPO_DOC_CP":{"m":"CP","d":"","f":[{"n":"ACTIVO","t":"VARCHAR(1)"},{"n":"CENTRO_COSTO","t":"VARCHAR(25)"},{"n":"CODIGO_HACIENDA","t":"VARCHAR(50)"},{"n":"CUENTA_CONTABLE","t":"VARCHAR(25)"},{"n":"DESCRIPCION","t":"VARCHAR(25)"},{"n":"DOCUMENTO_GLOBAL","t":"VARCHAR(10)"},{"n":"ES_SERVICIO_EXT","t":"VARCHAR(1)"},{"n":"FORMA_FARMACEUTICA","t":"VARCHAR(25)"},{"n":"FORMA_PAGO_COMPRA","t":"VARCHAR(2)"},{"n":"GENERA_RET_MANUAL","t":"VARCHAR(1)"},{"n":"INGRESOS_FISICOS","t":"VARCHAR(1)"},{"n":"PAQUETE","t":"VARCHAR(4)"},{"n":"PARTICIPA_SEMT","t":"VARCHAR(1)"},{"n":"REGISTRO_LEGAL","t":"VARCHAR(10)"},{"n":"REGISTRO_MEDICAMENTOS","t":"VARCHAR(254)"},{"n":"RET_IVA_DTE_SLV","t":"VARCHAR(100)"},{"n":"SUBTIPO","t":"INT"},{"n":"SUBTIPO_CB","t":"INT"},{"n":"SUBTIPO_SERVICIO_EXT","t":"VARCHAR(2)"},{"n":"TIPO","t":"VARCHAR(3)"},{"n":"TIPO_ANULACION","t":"VARCHAR(1)"},{"n":"TIPO_ASIENTO","t":"VARCHAR(4)"},{"n":"TIPO_CAMBIO","t":"VARCHAR(4)"},{"n":"TIPO_CB","t":"VARCHAR(3)"},{"n":"TIPO_COSTO_GASTO","t":"VARCHAR(2)"}]},"SUBTIPO_SERVICIO_EXT":{"m":"","d":"","f":[{"n":"DESCRIPCION","t":"VARCHAR(249)"},{"n":"TIPO","t":"VARCHAR(2)"}]},"SUBTIPO_TRABAJADOR_NE":{"m":"","d":"","f":[{"n":"NOMBRE","t":"VARCHAR(254)"},{"n":"SUBTIPO_TRABAJADOR_NE","t":"VARCHAR(10)"}]},"SystemNotes":{"m":"","d":"","f":[{"n":"NoteContent","t":"TEXT"},{"n":"NoteDesc","t":"VARCHAR(255)"},{"n":"SystemNoteToken","t":"DECIMAL"}]},"TABLA_UDF":{"m":"","d":"","f":[{"n":"DESCRIPCION","t":"VARCHAR(30)"},{"n":"LARGO","t":"INT"},{"n":"ORDEN","t":"INT"},{"n":"PERMITE_NULOS","t":"VARCHAR(1)"},{"n":"SQL","t":"VARCHAR(8000)"},{"n":"TABLA","t":"VARCHAR(30)"},{"n":"TIPO","t":"VARCHAR(1)"},{"n":"TIPO_FUENTE","t":"VARCHAR(1)"},{"n":"UDF","t":"VARCHAR(30)"},{"n":"UDT","t":"VARCHAR(72)"},{"n":"VALOR_DEFAULT","t":"VARCHAR(254)"}]},"TECNICO":{"m":"","d":"","f":[{"n":"DIRECCION","t":"TEXT"},{"n":"FAX","t":"VARCHAR(15)"},{"n":"FECHA_EGRESO","t":"DATETIME"},{"n":"FECHA_INGRESO","t":"DATETIME"},{"n":"HORARIO_CS","t":"VARCHAR(5)"},{"n":"NOTAS","t":"TEXT"},{"n":"PUESTO","t":"VARCHAR(40)"},{"n":"TELEFONO","t":"VARCHAR(15)"},{"n":"USUARIO_CS","t":"VARCHAR(25)"}]},"TEMP_HIST_DEPR":{"m":"","d":"","f":[{"n":"ACTIVO_FIJO","t":"VARCHAR(10)"},{"n":"CONSECUTIVO","t":"INT"},{"n":"CONTABILIDAD","t":"VARCHAR(1)"},{"n":"DEPR_DOLAR","t":"DECIMAL"},{"n":"DEPR_LOCAL","t":"DECIMAL"},{"n":"DEPR_REV_DOLAR","t":"DECIMAL"},{"n":"DEPR_REV_LOCAL","t":"DECIMAL"},{"n":"MEJORA","t":"VARCHAR(10)"},{"n":"METODO","t":"VARCHAR(1)"},{"n":"TIPO_ACTIVO","t":"VARCHAR(4)"},{"n":"USUARIO","t":"VARCHAR(50)"}]},"TEMP_HIST_REVAL":{"m":"","d":"","f":[{"n":"ACTIVO_FIJO","t":"VARCHAR(10)"},{"n":"CONSECUTIVO","t":"INT"},{"n":"MEJORA","t":"VARCHAR(10)"},{"n":"METODO","t":"VARCHAR(1)"},{"n":"METODO_C","t":"VARCHAR(1)"},{"n":"REVAL_DEPR_ACUM_C","t":"DECIMAL"},{"n":"REVAL_DEPR_ACUM_F","t":"DECIMAL"},{"n":"REVAL_VALOR","t":"DECIMAL"},{"n":"REVAL_VALOR_C","t":"DECIMAL"},{"n":"TIPO_ACTIVO","t":"VARCHAR(4)"},{"n":"USUARIO","t":"VARCHAR(50)"}]},"TEMP_PRIMITIVA_HISTORICA":{"m":"","d":"","f":[{"n":"centro_costo","t":"VARCHAR(25)"},{"n":"empleado","t":"VARCHAR(20)"},{"n":"nomina","t":"VARCHAR(4)"},{"n":"total","t":"DECIMAL"}]},"TEXTO":{"m":"","d":"","f":[{"n":"COLOR_CUERPO","t":"VARCHAR(15)"},{"n":"COLOR_TITULO","t":"VARCHAR(15)"},{"n":"INFORMACION","t":"INT"},{"n":"MODULO","t":"INT"},{"n":"POSICION_TITULO","t":"VARCHAR(15)"},{"n":"TITULO","t":"VARCHAR(50)"}]},"TEXTOS_DOCS_CC":{"m":"","d":"","f":[{"n":"DOC_CER","t":"VARCHAR(50)"},{"n":"DOC_CHK","t":"VARCHAR(50)"},{"n":"DOC_DEP","t":"VARCHAR(50)"},{"n":"DOC_OTROS","t":"VARCHAR(50)"},{"n":"DOC_TAR","t":"VARCHAR(50)"},{"n":"DOC_TEF","t":"VARCHAR(50)"},{"n":"DOCUMENTO","t":"VARCHAR(50)"},{"n":"ENTIDAD_FINANCIERA_CHEQ","t":"VARCHAR(50)"},{"n":"ENTIDAD_FINANCIERA_TEF","t":"VARCHAR(50)"},{"n":"MONTO_CER","t":"DECIMAL"},{"n":"MONTO_CHK","t":"DECIMAL"},{"n":"MONTO_DEP","t":"DECIMAL"},{"n":"MONTO_EFECTIVO","t":"DECIMAL"},{"n":"MONTO_OTROS","t":"DECIMAL"},{"n":"MONTO_TAR","t":"DECIMAL"},{"n":"MONTO_TEF","t":"DECIMAL"},{"n":"RECIBIDO_DE","t":"VARCHAR(80)"},{"n":"TEXTO","t":"TEXT"},{"n":"TEXTO_ID","t":"VARCHAR(18)"},{"n":"TIPO","t":"VARCHAR(3)"}]},"TIP_SOL_RH_USUARIO":{"m":"","d":"Usuarios del sistema: credenciales, perfil, estado y auditoría.","f":[{"n":"PRIVILEGIO","t":"VARCHAR(1)"},{"n":"TIPO_SOLICITUD_RH","t":"VARCHAR(4)"},{"n":"USUARIO","t":"VARCHAR(50)"}]},"TIPO_ACADEMICO":{"m":"","d":"","f":[{"n":"DESCRIPCION","t":"VARCHAR(40)"},{"n":"TIPO_ACADEMICO","t":"VARCHAR(4)"}]},"TIPO_ACCIDENTE":{"m":"","d":"","f":[{"n":"DESCRIPCION","t":"VARCHAR(40)"},{"n":"TIPO_ACCIDENTE","t":"VARCHAR(4)"}]},"TIPO_ACCION":{"m":"","d":"","f":[{"n":"CODIF_APLIC_RUBROS","t":"VARCHAR(10)"},{"n":"CODIF_TEXTOPREDEF_RUBROS","t":"VARCHAR(255)"},{"n":"DESCRIPCION","t":"VARCHAR(40)"},{"n":"ESTADO_EMPLEADO","t":"VARCHAR(4)"},{"n":"FIJA","t":"VARCHAR(1)"},{"n":"MOD_ESTADO_EMP","t":"VARCHAR(1)"},{"n":"REPORTE","t":"VARCHAR(100)"},{"n":"RESTAURA_ESTADOEMP","t":"VARCHAR(1)"},{"n":"TEXTO_PREDEF","t":"TEXT"},{"n":"TIPO_ACCION","t":"VARCHAR(4)"},{"n":"TIPO_ACCION_PREDEF","t":"INT"},{"n":"TIPO_INCAPACIDAD","t":"VARCHAR(10)"},{"n":"U_AUMENTOS_MASIV","t":"VARCHAR(1)"},{"n":"U_CANT_PASOS","t":"INT"},{"n":"U_MOV_ESCALAS","t":"VARCHAR(1)"}]},"TIPO_ACCION_AF":{"m":"","d":"","f":[{"n":"DESCRIPCION","t":"VARCHAR(40)"},{"n":"TEXTO_PREDEF","t":"TEXT"},{"n":"TIPO_ACCION_AF","t":"VARCHAR(4)"},{"n":"TIPO_ACCION_PREDEF","t":"INT"}]},"TIPO_ACCION_CONCEP":{"m":"","d":"","f":[{"n":"CONCEPTO","t":"VARCHAR(20)"},{"n":"NOMINA","t":"VARCHAR(4)"},{"n":"SECUENCIA","t":"INT"},{"n":"TIPO_ACCION","t":"VARCHAR(4)"}]},"TIPO_ACCION_USUARIO":{"m":"","d":"Usuarios del sistema: credenciales, perfil, estado y auditoría.","f":[{"n":"ANULAR","t":"VARCHAR(1)"},{"n":"APLICAR","t":"VARCHAR(1)"},{"n":"APROBAR","t":"VARCHAR(1)"},{"n":"CREAR","t":"VARCHAR(1)"},{"n":"DESAPLICAR","t":"VARCHAR(1)"},{"n":"DESAPROBAR","t":"VARCHAR(1)"},{"n":"PRIVILEGIO","t":"VARCHAR(1)"},{"n":"TIPO_ACCION","t":"VARCHAR(4)"},{"n":"TOTAL","t":"VARCHAR(1)"},{"n":"USUARIO","t":"VARCHAR(50)"}]},"TIPO_ACTIVO":{"m":"AF","d":"","f":[{"n":"CONCEPTO_ME","t":"VARCHAR(4)"},{"n":"CONSECUTIVO","t":"VARCHAR(10)"},{"n":"CTA_ACTIVO","t":"VARCHAR(25)"},{"n":"CTA_ACTIVO_C","t":"VARCHAR(25)"},{"n":"CTA_AI_DEPREC","t":"VARCHAR(25)"},{"n":"CTA_AI_DEPREC_C","t":"VARCHAR(25)"},{"n":"CTA_AJU_INFLAC","t":"VARCHAR(25)"},{"n":"CTA_AJU_INFLAC_C","t":"VARCHAR(25)"},{"n":"CTA_DEPR_ACUM_AI_C","t":"VARCHAR(25)"},{"n":"CTA_DEPR_ACUM_AI_F","t":"VARCHAR(25)"},{"n":"CTA_DEPR_ACUM_NORM","t":"VARCHAR(25)"},{"n":"CTA_DEPR_ACUM_NORM_C","t":"VARCHAR(25)"},{"n":"CTA_DEPR_ACUM_REV","t":"VARCHAR(25)"},{"n":"CTA_DEPR_ACUM_REV_C","t":"VARCHAR(25)"},{"n":"CTA_DEPR_DESMAN_C","t":"VARCHAR(25)"},{"n":"CTA_DEPR_DESMAN_F","t":"VARCHAR(25)"},{"n":"CTA_DESMAN_C","t":"VARCHAR(25)"},{"n":"CTA_DESMAN_F","t":"VARCHAR(25)"},{"n":"CTA_DETERIORO_C","t":"VARCHAR(25)"},{"n":"CTA_DETERIORO_F","t":"VARCHAR(25)"},{"n":"CTA_GASTO_DETERIORO_C","t":"VARCHAR(25)"},{"n":"CTA_GASTO_DETERIORO_F","t":"VARCHAR(25)"},{"n":"CTA_REVAL_DA","t":"VARCHAR(25)"},{"n":"CTA_REVAL_DA_C","t":"VARCHAR(25)"},{"n":"CTA_REVALUACION","t":"VARCHAR(25)"}]},"TIPO_ACTIVO_FIJO_PERU":{"m":"AF","d":"Activos fijos: código, descripción, valor histórico, vida útil y depreciación.","f":[{"n":"CODIGO","t":"VARCHAR(2)"},{"n":"DESCRIPCION","t":"VARCHAR(100)"}]},"TIPO_AJUSTE":{"m":"","d":"Ajustes de inventario: correcciones por diferencias entre conteo y sistema.","f":[{"n":"AJUSTE_A_CANT","t":"VARCHAR(1)"},{"n":"AJUSTE_NEGATIVO","t":"VARCHAR(1)"},{"n":"DESCRIPCION","t":"VARCHAR(15)"},{"n":"TIPO","t":"VARCHAR(1)"}]},"TIPO_ANULACIONES":{"m":"","d":"","f":[{"n":"DESCRIPCION","t":"VARCHAR(50)"},{"n":"TIPO_ANULACION","t":"VARCHAR(3)"}]},"TIPO_APORTANTE":{"m":"","d":"Tabla de catálogo/maestro de referencia con código y descripción.","f":[{"n":"CODIGO","t":"INT"},{"n":"DESCRIPCION","t":"VARCHAR(254)"}]},"TIPO_ASIENTO":{"m":"","d":"Cabecera de asientos contables generados por módulos auxiliares o manual.","f":[{"n":"DESCRIPCION","t":"VARCHAR(40)"},{"n":"TIPO_ASIENTO","t":"VARCHAR(4)"}]},"TIPO_AUSENCIA":{"m":"","d":"","f":[{"n":"DESCRIPCION","t":"VARCHAR(40)"},{"n":"JUSTIFICADA","t":"VARCHAR(1)"},{"n":"PAGO","t":"VARCHAR(1)"},{"n":"TIPO_AUSENCIA","t":"VARCHAR(4)"}]},"TIPO_CAMBIO":{"m":"AS","d":"Tipos de cambio históricos por moneda y fecha.","f":[{"n":"DESCRIPCION","t":"VARCHAR(40)"},{"n":"TIPO_CAMBIO","t":"VARCHAR(4)"}]},"TIPO_CAMBIO_HIST":{"m":"AS","d":"Tipos de cambio históricos por moneda y fecha para conversión.","f":[{"n":"FECHA","t":"DATETIME"},{"n":"MONTO","t":"DECIMAL"},{"n":"TIPO_CAMBIO","t":"VARCHAR(4)"},{"n":"USUARIO","t":"VARCHAR(50)"}]},"TIPO_CONTINGENCIA_ES":{"m":"","d":"Tabla de catálogo/maestro de referencia con código y descripción.","f":[{"n":"CODIGO","t":"VARCHAR(4)"},{"n":"DESCRIPCION","t":"VARCHAR(254)"}]},"TIPO_CONTRATO":{"m":"","d":"","f":[{"n":"DESCRIPCION","t":"VARCHAR(40)"},{"n":"HORAS","t":"DECIMAL"},{"n":"JORNADA_PARC_PERM","t":"VARCHAR(1)"},{"n":"TIPO_CONTRATO","t":"VARCHAR(4)"},{"n":"TIPO_CONTRATO_NE","t":"VARCHAR(10)"}]},"TIPO_CONTRATO_NE":{"m":"","d":"","f":[{"n":"NOMBRE","t":"VARCHAR(254)"},{"n":"TIPO_CONTRATO_NE","t":"VARCHAR(10)"}]},"TIPO_COSTO_GASTO":{"m":"","d":"","f":[{"n":"DESCRIPCION","t":"VARCHAR(249)"},{"n":"TIPO","t":"VARCHAR(2)"}]},"TIPO_COTIZANTE":{"m":"","d":"","f":[{"n":"DESCRIPCION","t":"VARCHAR(254)"},{"n":"TIPO_COTIZANTE","t":"VARCHAR(2)"}]},"TIPO_CUENTA":{"m":"","d":"","f":[{"n":"DESCRIPCION","t":"VARCHAR(40)"},{"n":"TIPO_CUENTA","t":"VARCHAR(12)"}]},"TIPO_DESCUENTO":{"m":"","d":"Estructura de descuentos por volumen, cliente o condición comercial.","f":[{"n":"CODIGO","t":"VARCHAR(2)"},{"n":"DESCRIPCION","t":"VARCHAR(100)"},{"n":"NIVEL","t":"VARCHAR(6)"}]},"TIPO_DIFERIDO":{"m":"CG","d":"","f":[{"n":"CONCEPTO_ME","t":"VARCHAR(4)"},{"n":"CTA_AMORTIZACION","t":"VARCHAR(25)"},{"n":"CTA_CONTRAASIENTO","t":"VARCHAR(25)"},{"n":"CTA_DIFERIDO","t":"VARCHAR(25)"},{"n":"CTA_GASTOINGRESO","t":"VARCHAR(25)"},{"n":"CTR_AMORTIZACION","t":"VARCHAR(25)"},{"n":"CTR_CONTRAASIENTO","t":"VARCHAR(25)"},{"n":"CTR_DIFERIDO","t":"VARCHAR(25)"},{"n":"CTR_GASTOINGRESO","t":"VARCHAR(25)"},{"n":"DESCRIPCION","t":"VARCHAR(60)"},{"n":"FECHA_INGRESO","t":"DATETIME"},{"n":"FECHA_ULT_MOD","t":"DATETIME"},{"n":"MODALIDAD","t":"VARCHAR(1)"},{"n":"NIT","t":"VARCHAR(20)"},{"n":"PAQUETE","t":"VARCHAR(4)"},{"n":"TIPO","t":"VARCHAR(1)"},{"n":"TIPO_ASIENTO","t":"VARCHAR(4)"},{"n":"TIPO_DIFERIDO","t":"VARCHAR(4)"},{"n":"USUARIO_INGRESO","t":"VARCHAR(60)"},{"n":"USUARIO_ULT_MOD","t":"VARCHAR(60)"},{"n":"VALOR","t":"DECIMAL"}]},"TIPO_DOC_CONTENCION":{"m":"","d":"Tabla de catálogo/maestro de referencia con código y descripción.","f":[{"n":"CODIGO","t":"VARCHAR(4)"},{"n":"DESCRIPCION","t":"VARCHAR(254)"}]},"TIPO_DOC_IDREC":{"m":"","d":"Tabla de catálogo/maestro de referencia con código y descripción.","f":[{"n":"CODIGO","t":"VARCHAR(4)"},{"n":"DESCRIPCION","t":"VARCHAR(254)"}]},"TIPO_DOC_INVALIDACION":{"m":"","d":"Tabla de catálogo/maestro de referencia con código y descripción.","f":[{"n":"CODIGO","t":"VARCHAR(4)"},{"n":"DESCRIPCION","t":"VARCHAR(254)"}]},"TIPO_DOCUMENTO_AUTORIZACION":{"m":"","d":"Tabla de catálogo/maestro de referencia con código y descripción.","f":[{"n":"CODIGO","t":"VARCHAR(2)"},{"n":"DESCRIPCION","t":"VARCHAR(254)"}]},"TIPO_DOCUMENTOS":{"m":"","d":"Tabla de catálogo/maestro de referencia con código y descripción.","f":[{"n":"CODIGO","t":"VARCHAR(4)"},{"n":"DESCRIPCION","t":"VARCHAR(249)"}]},"TIPO_EQUIPO_CS":{"m":"","d":"","f":[{"n":"DESCRIPCION","t":"VARCHAR(40)"},{"n":"TIPO_EQUIPO_CS","t":"VARCHAR(5)"}]},"TIPO_ESTABLECIMIENTO":{"m":"","d":"Tabla de catálogo/maestro de referencia con código y descripción.","f":[{"n":"CODIGO","t":"VARCHAR(4)"},{"n":"DESCRIPCION","t":"VARCHAR(254)"}]},"TIPO_EXISTENCIA":{"m":"CI","d":"","f":[{"n":"DESCRIPCION","t":"VARCHAR(254)"},{"n":"TIPO_EXISTENCIA","t":"VARCHAR(4)"}]},"TIPO_FACTURA":{"m":"FA","d":"Tabla de catálogo/maestro de referencia con código y descripción.","f":[{"n":"BOLETA","t":"VARCHAR(30)"},{"n":"CODIGO","t":"VARCHAR(10)"},{"n":"DESCRIPCION","t":"VARCHAR(100)"},{"n":"FACTURA","t":"VARCHAR(30)"},{"n":"LIQUIDACION_COMPRA","t":"VARCHAR(30)"}]},"TIPO_FORMATO":{"m":"","d":"","f":[{"n":"DESC_TIPO_FORMATO","t":"VARCHAR(10)"},{"n":"MODULO","t":"INT"},{"n":"TIPO_FORMATO","t":"INT"}]},"TIPO_GARANTIA":{"m":"CC","d":"","f":[{"n":"DESCRIPCION","t":"VARCHAR(40)"},{"n":"DIAS_GARANTIA","t":"INT"},{"n":"TIPO_GARANTIA","t":"VARCHAR(5)"},{"n":"TIPO_TRANS_INV","t":"VARCHAR(1)"}]},"TIPO_HORA_EXTRA_RECAR":{"m":"","d":"","f":[{"n":"NOMBRE","t":"VARCHAR(254)"},{"n":"PORCENTAJE","t":"DECIMAL"},{"n":"TIPO_HORA_EXTRA","t":"VARCHAR(10)"}]},"TIPO_IMPUESTO":{"m":"CN","d":"Configuración de impuestos: tasas, tipos y reglas de aplicación.","f":[{"n":"ACTIVO","t":"VARCHAR(1)"},{"n":"APLICACION","t":"VARCHAR(20)"},{"n":"CODIGO_TRIBUTO","t":"VARCHAR(20)"},{"n":"DESCRIPCION","t":"VARCHAR(200)"},{"n":"TIPO_IMPUESTO","t":"VARCHAR(5)"}]},"TIPO_INCAPACIDAD":{"m":"CN","d":"","f":[{"n":"NOMBRE","t":"VARCHAR(254)"},{"n":"TIPO_INCAPACIDAD","t":"VARCHAR(10)"}]},"TIPO_INDICE_PRECIO":{"m":"","d":"Lista de precios: tarifas por artículo, cliente o segmento.","f":[{"n":"DESCRIPCION","t":"VARCHAR(40)"},{"n":"TIPO_INDICE_PRECIO","t":"VARCHAR(4)"}]},"TIPO_INFORMACION":{"m":"","d":"","f":[{"n":"DESC_TIPO_INFO","t":"VARCHAR(10)"},{"n":"MODULO","t":"INT"},{"n":"TIPO_INFORMACION","t":"INT"}]},"TIPO_INGRESO":{"m":"","d":"","f":[{"n":"DESCRIPCION","t":"VARCHAR(249)"},{"n":"TIPO","t":"VARCHAR(2)"}]},"TIPO_ITEM":{"m":"","d":"","f":[{"n":"DESCRIPCION","t":"VARCHAR(254)"},{"n":"TIPO_ITEM","t":"VARCHAR(4)"}]},"TIPO_NC":{"m":"","d":"Tabla de catálogo/maestro de referencia con código y descripción.","f":[{"n":"CODIGO","t":"VARCHAR(2)"},{"n":"DESCRIPCION","t":"VARCHAR(50)"}]},"TIPO_ND":{"m":"","d":"Tabla de catálogo/maestro de referencia con código y descripción.","f":[{"n":"CODIGO","t":"VARCHAR(2)"},{"n":"DESCRIPCION","t":"VARCHAR(50)"}]},"TIPO_NIT":{"m":"","d":"","f":[{"n":"ACTIVO","t":"VARCHAR(1)"},{"n":"CATEGORIA_TIPO_NIT","t":"VARCHAR(3)"},{"n":"DESCRIPCION","t":"VARCHAR(25)"},{"n":"MASCARA","t":"VARCHAR(20)"},{"n":"MASCARA_ABIERTA","t":"VARCHAR(1)"},{"n":"TIPO","t":"VARCHAR(25)"},{"n":"TIPO_DOC_IDREC","t":"VARCHAR(4)"},{"n":"U_TIPO_DOCUMENTO_IDENTIDAD","t":"VARCHAR(4)"}]},"TIPO_OPERAC_DS":{"m":"","d":"Tabla de catálogo/maestro de referencia con código y descripción.","f":[{"n":"CODIGO","t":"VARCHAR(4)"},{"n":"DESCRIPCION","t":"VARCHAR(100)"}]},"TIPO_OPERACION":{"m":"","d":"","f":[{"n":"DESCRIPCION","t":"VARCHAR(254)"},{"n":"TIPO_OPERACION","t":"VARCHAR(4)"}]},"TIPO_PAGO":{"m":"","d":"","f":[{"n":"DESCRIPCION","t":"VARCHAR(254)"},{"n":"TIPO_PAGO","t":"VARCHAR(10)"}]},"TIPO_PAIS":{"m":"","d":"Catálogo de países con cuentas contables asociadas para integración.","f":[{"n":"A2","t":"VARCHAR(2)"},{"n":"A3","t":"VARCHAR(3)"},{"n":"CODIGO","t":"VARCHAR(3)"},{"n":"DESCRIPCION","t":"VARCHAR(100)"}]},"TIPO_PERSONA":{"m":"","d":"Tabla de catálogo/maestro de referencia con código y descripción.","f":[{"n":"CODIGO","t":"VARCHAR(4)"},{"n":"DESCRIPCION","t":"VARCHAR(254)"}]},"TIPO_PLANILLA":{"m":"","d":"Tabla de catálogo/maestro de referencia con código y descripción.","f":[{"n":"ACT_ECONOMICA","t":"VARCHAR(25)"},{"n":"CLASE_PLANILLA","t":"VARCHAR(1)"},{"n":"CODIGO","t":"VARCHAR(10)"},{"n":"DEPARTAMENTO","t":"VARCHAR(25)"},{"n":"DESCRIPCION","t":"VARCHAR(100)"},{"n":"PERIODO_PLANILLA","t":"VARCHAR(1)"},{"n":"TIEMPO_CONTRATO","t":"VARCHAR(2)"},{"n":"TIPO_AFILIADO","t":"VARCHAR(1)"}]},"TIPO_REFERENCIA_DE":{"m":"","d":"Tabla de catálogo/maestro de referencia con código y descripción.","f":[{"n":"CODIGO","t":"VARCHAR(4)"},{"n":"DESCRIPCION","t":"VARCHAR(254)"}]},"TIPO_RELACION":{"m":"","d":"","f":[{"n":"DESCRIPCION","t":"VARCHAR(100)"},{"n":"TIPO_RELACION","t":"VARCHAR(2)"}]},"TIPO_RETENCION_RENTA":{"m":"","d":"Retenciones fiscales aplicadas en documentos de compra o venta.","f":[{"n":"DESCRIPCION","t":"VARCHAR(249)"},{"n":"TIPO","t":"VARCHAR(2)"}]},"TIPO_RETENIVA_MH_ES":{"m":"","d":"Tabla de catálogo/maestro de referencia con código y descripción.","f":[{"n":"CODIGO","t":"VARCHAR(4)"},{"n":"DESCRIPCION","t":"VARCHAR(254)"}]},"TIPO_SERVICIO":{"m":"","d":"","f":[{"n":"DESCRIPCION","t":"VARCHAR(40)"},{"n":"TIPO_SERVICIO","t":"VARCHAR(5)"}]},"TIPO_SERVICIO_CB":{"m":"","d":"","f":[{"n":"CENTRO_COSTO","t":"VARCHAR(25)"},{"n":"CUENTA_CONTABLE","t":"VARCHAR(25)"},{"n":"DESCRIPCION","t":"VARCHAR(249)"},{"n":"TIPO_SERVICIO","t":"VARCHAR(10)"}]},"TIPO_SERVICIO_CC":{"m":"","d":"","f":[{"n":"CENTRO_COSTO","t":"VARCHAR(25)"},{"n":"CUENTA_CONTABLE","t":"VARCHAR(25)"},{"n":"DESCRIPCION","t":"VARCHAR(249)"},{"n":"TIPO_SERVICIO","t":"VARCHAR(10)"}]},"TIPO_SERVICIO_CP":{"m":"","d":"","f":[{"n":"CENTRO_COSTO","t":"VARCHAR(25)"},{"n":"CUENTA_CONTABLE","t":"VARCHAR(25)"},{"n":"DESCRIPCION","t":"VARCHAR(249)"},{"n":"TIPO_SERVICIO","t":"VARCHAR(10)"}]},"TIPO_SERVICIO_EXTERIOR":{"m":"","d":"","f":[{"n":"DESCRIPCION","t":"VARCHAR(249)"},{"n":"TIPO","t":"VARCHAR(2)"}]},"TIPO_SOLI_RH_NOTIF":{"m":"","d":"","f":[{"n":"EMPLEADO","t":"VARCHAR(20)"},{"n":"TIPO_SOLICITUD_RH","t":"VARCHAR(4)"}]},"TIPO_SOLICITUD_RH":{"m":"","d":"","f":[{"n":"ACCESO_DIRECTO","t":"VARCHAR(1)"},{"n":"APROB_FINAL_RH","t":"VARCHAR(1)"},{"n":"APRUEBA_SUPERIOR","t":"VARCHAR(1)"},{"n":"DESC_ACCESO","t":"VARCHAR(15)"},{"n":"DESCRIPCION","t":"VARCHAR(50)"},{"n":"DIAS_PARA_ESCALAR","t":"INT"},{"n":"DIAS_PARA_VENCER","t":"INT"},{"n":"ESTADO_EMPLEADO","t":"VARCHAR(4)"},{"n":"MULTI_SUPERIORES","t":"VARCHAR(1)"},{"n":"NIVEL_APROBACION","t":"INT"},{"n":"OBSERVACIONES","t":"TEXT"},{"n":"TIPO_ACCION","t":"VARCHAR(4)"},{"n":"TIPO_AUSENCIA","t":"VARCHAR(4)"},{"n":"TIPO_SOLICITUD_RH","t":"VARCHAR(4)"}]},"TIPO_TARIFA_IVA":{"m":"","d":"","f":[{"n":"DESCRIPCION","t":"VARCHAR(100)"},{"n":"PORCENTAJE","t":"DECIMAL"},{"n":"TIPO_IMPUESTO","t":"VARCHAR(5)"},{"n":"TIPO_TARIFA","t":"VARCHAR(2)"}]},"TIPO_TARJETA":{"m":"","d":"","f":[{"n":"ASSEMBLY_INVOCACION","t":"VARCHAR(100)"},{"n":"TIPO_COBRO","t":"VARCHAR(1)"},{"n":"TIPO_MONEDA","t":"VARCHAR(1)"},{"n":"TIPO_TARJETA","t":"VARCHAR(12)"}]},"TIPO_TRABAJADOR_NE":{"m":"","d":"","f":[{"n":"NOMBRE","t":"VARCHAR(254)"},{"n":"TIPO_TRABAJADOR_NE","t":"VARCHAR(10)"}]},"TIPO_TRANSACCION":{"m":"","d":"Tabla de catálogo/maestro de referencia con código y descripción.","f":[{"n":"CODIGO","t":"VARCHAR(2)"},{"n":"DESCRIPCION","t":"VARCHAR(254)"}]},"TIPO_TRIBUTO":{"m":"","d":"Tabla de catálogo/maestro de referencia con código y descripción.","f":[{"n":"CLASIFICACION","t":"VARCHAR(1)"},{"n":"COD_INTERNACIONAL","t":"VARCHAR(5)"},{"n":"CODIGO","t":"VARCHAR(20)"},{"n":"DESCRIPCION","t":"VARCHAR(50)"},{"n":"NOMBRE","t":"VARCHAR(20)"},{"n":"PORCENTAJE","t":"DECIMAL"},{"n":"UN_ECE","t":"VARCHAR(2)"}]},"TIPO_VINCULACION_ECONOMICA":{"m":"","d":"","f":[{"n":"DESCRIPCION","t":"VARCHAR(4000)"},{"n":"TIPO_VINCULACION","t":"VARCHAR(4)"},{"n":"VINCULACION_ECONOMICA","t":"VARCHAR(50)"}]},"TIPOS_DETRACCIONES":{"m":"","d":"","f":[{"n":"COD_DETRACCION","t":"VARCHAR(4)"},{"n":"DESC_ACTIVIDAD","t":"VARCHAR(250)"},{"n":"DESC_TIPO_DETRACCION","t":"VARCHAR(250)"},{"n":"MIN_DETRACCION","t":"DECIMAL"},{"n":"PORC_DETRACCION","t":"DECIMAL"},{"n":"TIPO_DETRACCION","t":"VARCHAR(4)"}]},"TIPOS_RENTA":{"m":"","d":"","f":[{"n":"DESCRIPCION","t":"VARCHAR(800)"},{"n":"TIPO_RENTA","t":"VARCHAR(4)"}]},"TITULO_REMISION":{"m":"","d":"Tabla de catálogo/maestro de referencia con código y descripción.","f":[{"n":"CODIGO","t":"VARCHAR(4)"},{"n":"DESCRIPCION","t":"VARCHAR(254)"}]},"TOMA_ACTIVO_ACCION":{"m":"","d":"","f":[{"n":"ACTIVO_FIJO","t":"VARCHAR(10)"},{"n":"ACTIVO_OBSERVACION","t":"VARCHAR(4)"},{"n":"FIRME","t":"INT"},{"n":"NUEVO_VALOR","t":"VARCHAR(18)"},{"n":"POCKET_ID","t":"VARCHAR(25)"},{"n":"TIPO_ACCION","t":"VARCHAR(11)"}]},"TOMA_ACTIVO_CAMBIO":{"m":"","d":"","f":[{"n":"ACTIVO_FIJO","t":"VARCHAR(10)"},{"n":"CODIGO_BARRAS","t":"VARCHAR(20)"},{"n":"DESCRIPCION","t":"VARCHAR(40)"},{"n":"ESTADO_ACTIVO","t":"VARCHAR(4)"},{"n":"FECHA_SINCRO","t":"DATETIME"},{"n":"ID_SINCRO","t":"VARCHAR(25)"},{"n":"NOTAS","t":"TEXT"},{"n":"NUMERO_SERIE","t":"VARCHAR(20)"},{"n":"POCKET_ID","t":"VARCHAR(25)"},{"n":"RESPONSABLE","t":"VARCHAR(20)"},{"n":"RUBRO1_ACTIVO","t":"VARCHAR(40)"},{"n":"RUBRO10_ACTIVO","t":"VARCHAR(40)"},{"n":"RUBRO11_ACTIVO","t":"VARCHAR(40)"},{"n":"RUBRO12_ACTIVO","t":"VARCHAR(40)"},{"n":"RUBRO13_ACTIVO","t":"VARCHAR(40)"},{"n":"RUBRO14_ACTIVO","t":"VARCHAR(40)"},{"n":"RUBRO15_ACTIVO","t":"VARCHAR(40)"},{"n":"RUBRO2_ACTIVO","t":"VARCHAR(40)"},{"n":"RUBRO3_ACTIVO","t":"VARCHAR(40)"},{"n":"RUBRO4_ACTIVO","t":"VARCHAR(40)"},{"n":"RUBRO5_ACTIVO","t":"VARCHAR(40)"},{"n":"RUBRO6_ACTIVO","t":"VARCHAR(40)"},{"n":"RUBRO7_ACTIVO","t":"VARCHAR(40)"},{"n":"RUBRO8_ACTIVO","t":"VARCHAR(40)"},{"n":"RUBRO9_ACTIVO","t":"VARCHAR(40)"}]},"TOMA_ACTIVO_CONTROL":{"m":"","d":"","f":[{"n":"ACTIVO_FIJO","t":"VARCHAR(10)"},{"n":"CODIGO_ACTIVO","t":"VARCHAR(10)"},{"n":"ESTATUS_ACTIVO","t":"VARCHAR(25)"},{"n":"FECHA_SINCRO","t":"DATETIME"},{"n":"ID_SINCRO","t":"VARCHAR(25)"},{"n":"NUEVO","t":"INT"},{"n":"POCKET_ID","t":"VARCHAR(25)"}]},"TOMA_ACTIVO_OBSERV":{"m":"","d":"","f":[{"n":"ACTIVO_OBSERVACION","t":"VARCHAR(4)"},{"n":"DESCRIPCION","t":"VARCHAR(254)"},{"n":"TIPO_OBSERVACION","t":"INT"}]},"TRANS_INV_AUX":{"m":"","d":"","f":[{"n":"AUDIT_TRANS_INV","t":"INT"},{"n":"CONSECUTIVO","t":"INT"},{"n":"OPERACION","t":"VARCHAR(10)"},{"n":"ORDEN","t":"VARCHAR(10)"}]},"TRANSACCION_INV":{"m":"","d":"","f":[{"n":"AJUSTE_CONFIG","t":"VARCHAR(4)"},{"n":"ARTICULO","t":"VARCHAR(20)"},{"n":"ASIENTO_CARDEX","t":"VARCHAR(10)"},{"n":"AUDIT_TRANS_INV","t":"INT"},{"n":"BODEGA","t":"VARCHAR(4)"},{"n":"CANTIDAD","t":"DECIMAL"},{"n":"CENTRO_COSTO","t":"VARCHAR(25)"},{"n":"CONSECUTIVO","t":"INT"},{"n":"CONTABILIZADA","t":"VARCHAR(1)"},{"n":"COSTO_TOT_COMP_DOL","t":"DECIMAL"},{"n":"COSTO_TOT_COMP_LOC","t":"DECIMAL"},{"n":"COSTO_TOT_FISC_DOL","t":"DECIMAL"},{"n":"COSTO_TOT_FISC_LOC","t":"DECIMAL"},{"n":"CUENTA_CONTABLE","t":"VARCHAR(25)"},{"n":"DOC_FISCAL","t":"VARCHAR(50)"},{"n":"FECHA","t":"DATETIME"},{"n":"FECHA_HORA_TRANSAC","t":"DATETIME"},{"n":"GEN_DOC_ELE","t":"VARCHAR(1)"},{"n":"LOCALIZACION","t":"VARCHAR(8)"},{"n":"LOTE","t":"VARCHAR(15)"},{"n":"NATURALEZA","t":"VARCHAR(1)"},{"n":"NIT","t":"VARCHAR(20)"},{"n":"PRECIO_TOTAL_DOLAR","t":"DECIMAL"},{"n":"PRECIO_TOTAL_LOCAL","t":"DECIMAL"},{"n":"SERIE_CADENA","t":"INT"}]},"TRANSACCION_INV_SINCRO":{"m":"","d":"","f":[{"n":"AJUSTE_CONFIG","t":"VARCHAR(4)"},{"n":"ARTICULO","t":"VARCHAR(20)"},{"n":"BODEGA","t":"VARCHAR(4)"},{"n":"BODEGA_DESTINO","t":"VARCHAR(4)"},{"n":"CANTIDAD","t":"DECIMAL"},{"n":"CENTRO_COSTO","t":"VARCHAR(25)"},{"n":"CODRESERVAR","t":"VARCHAR(20)"},{"n":"CONSECUTIVO","t":"VARCHAR(100)"},{"n":"COSTO_TOTAL_DOLAR","t":"DECIMAL"},{"n":"COSTO_TOTAL_LOCAL","t":"DECIMAL"},{"n":"DOCUMENTO_INV","t":"VARCHAR(50)"},{"n":"ID_PDA","t":"VARCHAR(15)"},{"n":"ID_SINCRO","t":"VARCHAR(15)"},{"n":"LINEA_DOC_INV","t":"INT"},{"n":"LOCALIZACION","t":"VARCHAR(8)"},{"n":"LOCALIZACION_DESTINO","t":"VARCHAR(8)"},{"n":"LOTE","t":"VARCHAR(15)"},{"n":"NIT","t":"VARCHAR(20)"},{"n":"PAQUETE_INVENTARIO","t":"VARCHAR(4)"},{"n":"PRECIO_TOTAL_DOLAR","t":"DECIMAL"},{"n":"PRECIO_TOTAL_LOCAL","t":"DECIMAL"},{"n":"REFERENCIA","t":"VARCHAR(20)"},{"n":"SECUENCIA","t":"DATETIME"},{"n":"SERIE_CADENA","t":"INT"},{"n":"SUBSUBTIPO","t":"VARCHAR(1)"}]},"TRANSFERENCIA_CB":{"m":"CB","d":"Transacciones bancarias: depósitos, retiros y transferencias.","f":[{"n":"ASIENTO","t":"VARCHAR(10)"},{"n":"CUENTA_ORIGEN","t":"VARCHAR(20)"},{"n":"DESCRIPCION","t":"VARCHAR(80)"},{"n":"DOCUMENTO_FISCAL","t":"VARCHAR(50)"},{"n":"DOCUMENTO_GLOBAL","t":"VARCHAR(50)"},{"n":"ESTADO","t":"VARCHAR(1)"},{"n":"FCH_HORA_CREACION","t":"DATETIME"},{"n":"FCH_HORA_MODIFIC","t":"DATETIME"},{"n":"FECHA_APLICACION","t":"DATETIME"},{"n":"METODO_PAGO","t":"VARCHAR(10)"},{"n":"MONTO_COMISION","t":"DECIMAL"},{"n":"MONTO_ORIGEN","t":"DECIMAL"},{"n":"NUMERO_ORIGEN","t":"DECIMAL"},{"n":"RUBRO1_TRANS","t":"VARCHAR(100)"},{"n":"RUBRO10_TRANS","t":"VARCHAR(100)"},{"n":"RUBRO2_TRANS","t":"VARCHAR(100)"},{"n":"RUBRO3_TRANS","t":"VARCHAR(100)"},{"n":"RUBRO4_TRANS","t":"VARCHAR(100)"},{"n":"RUBRO5_TRANS","t":"VARCHAR(100)"},{"n":"RUBRO6_TRANS","t":"VARCHAR(100)"},{"n":"RUBRO7_TRANS","t":"VARCHAR(100)"},{"n":"RUBRO8_TRANS","t":"VARCHAR(100)"},{"n":"RUBRO9_TRANS","t":"VARCHAR(100)"},{"n":"TIPO_ORIGEN","t":"VARCHAR(3)"},{"n":"USUARIO_CREACION","t":"VARCHAR(50)"}]},"TRANSPORTE_ES":{"m":"","d":"Tabla de catálogo/maestro de referencia con código y descripción.","f":[{"n":"CODIGO","t":"VARCHAR(4)"},{"n":"DESCRIPCION","t":"VARCHAR(254)"}]},"TRANSPORTISTA":{"m":"","d":"","f":[{"n":"CODIGO","t":"VARCHAR(50)"},{"n":"DIRECCION","t":"VARCHAR(200)"},{"n":"ENTIDAD_EMISORA","t":"VARCHAR(50)"},{"n":"NUMERO_AUTORIZACION","t":"VARCHAR(20)"},{"n":"NUMERO_REGISTRO","t":"VARCHAR(20)"},{"n":"RAZON_SOCIAL","t":"VARCHAR(200)"},{"n":"RUC","t":"VARCHAR(20)"},{"n":"UBIGEO","t":"VARCHAR(20)"}]},"TRANSPORTISTA_SINCRO":{"m":"","d":"","f":[{"n":"CEDULA","t":"VARCHAR(15)"},{"n":"CONSECUTIVO","t":"INT"},{"n":"FECHA_CREACION","t":"DATETIME"},{"n":"ID_PDA","t":"VARCHAR(15)"},{"n":"ID_SINCRO","t":"VARCHAR(15)"},{"n":"MARCHAMO_TRANSPORTE","t":"VARCHAR(10)"},{"n":"NOMBRE","t":"VARCHAR(20)"},{"n":"PLACA_TRANSPORTE","t":"VARCHAR(10)"}]},"TRASLADO_IVA":{"m":"CI","d":"Traslados de mercancía entre bodegas con trazabilidad de movimiento.","f":[{"n":"APLICACION_DOC","t":"VARCHAR(249)"},{"n":"APLICACION_DOC2","t":"VARCHAR(249)"},{"n":"ASIENTO","t":"VARCHAR(10)"},{"n":"DOC_PAGO_RET","t":"VARCHAR(50)"},{"n":"DOCUMENTO","t":"VARCHAR(50)"},{"n":"DOCUMENTO_FISCAL","t":"VARCHAR(50)"},{"n":"DOCUMENTO_FISCAL2","t":"VARCHAR(50)"},{"n":"DOCUMENTO2","t":"VARCHAR(50)"},{"n":"ENTIDAD","t":"VARCHAR(40)"},{"n":"FECHA_DOC","t":"DATETIME"},{"n":"FECHA_DOC2","t":"DATETIME"},{"n":"IMPUESTO_DOC2","t":"DECIMAL"},{"n":"MODULO","t":"VARCHAR(2)"},{"n":"MONEDA_DOC","t":"VARCHAR(4)"},{"n":"MONEDA_DOC2","t":"VARCHAR(4)"},{"n":"MONTO_APLICADO_DOC","t":"DECIMAL"},{"n":"MONTO_APLICADO_DOC2","t":"DECIMAL"},{"n":"MONTO_DOC","t":"DECIMAL"},{"n":"MONTO_DOC2","t":"DECIMAL"},{"n":"MONTO_DOLAR_DOC","t":"DECIMAL"},{"n":"MONTO_DOLAR_DOC2","t":"DECIMAL"},{"n":"MONTO_LOCAL_DOC","t":"DECIMAL"},{"n":"MONTO_LOCAL_DOC2","t":"DECIMAL"},{"n":"NIT","t":"VARCHAR(20)"},{"n":"TIPO_CAMBIO_DOL_DOC","t":"DECIMAL"}]},"TRASLADO_IVA_CTAS_IMPUESTOS":{"m":"CI","d":"Configuración de impuestos: tasas, tipos y reglas de aplicación.","f":[{"n":"CENTRO_DESTINO","t":"VARCHAR(25)"},{"n":"CENTRO_ORIGEN","t":"VARCHAR(25)"},{"n":"CUENTA_DESTINO","t":"VARCHAR(25)"},{"n":"CUENTA_ORIGEN","t":"VARCHAR(25)"},{"n":"IMPUESTO","t":"VARCHAR(4)"},{"n":"MODULO","t":"VARCHAR(2)"}]},"TRASLADO_IVA_CUENTAS":{"m":"CI","d":"Traslados de mercancía entre bodegas con trazabilidad de movimiento.","f":[{"n":"CENTRO_DESTINO","t":"VARCHAR(25)"},{"n":"CENTRO_ORIGEN","t":"VARCHAR(25)"},{"n":"CUENTA_DESTINO","t":"VARCHAR(25)"},{"n":"CUENTA_ORIGEN","t":"VARCHAR(25)"},{"n":"MODULO","t":"VARCHAR(2)"}]},"TRASLADO_IVA_RETENCIONES":{"m":"CI","d":"Traslados de mercancía entre bodegas con trazabilidad de movimiento.","f":[{"n":"CODIGO_RETENCION","t":"VARCHAR(4)"},{"n":"CUENTA_DESTINO","t":"VARCHAR(25)"},{"n":"CUENTA_ORIGEN","t":"VARCHAR(25)"},{"n":"RET_DIFERENCIA_ACREDITABLE","t":"VARCHAR(1)"}]},"TRIBUTO":{"m":"","d":"","f":[{"n":"DESCRIPCION","t":"VARCHAR(200)"},{"n":"NOMBRE","t":"VARCHAR(100)"},{"n":"TRIBUTO","t":"VARCHAR(4)"}]},"U_ACTIV_ECONOMICA":{"m":"","d":"","f":[{"n":"U_CODIGO","t":"VARCHAR(4)"},{"n":"U_DESCRIP","t":"VARCHAR(249)"}]},"U_ADENDA_WM_TIPO_NC":{"m":"","d":"","f":[{"n":"U_CODIGO","t":"VARCHAR(30)"},{"n":"U_DESCRIP","t":"VARCHAR(30)"}]},"U_ADUANA":{"m":"","d":"","f":[{"n":"U_CODIGO","t":"VARCHAR(4)"},{"n":"U_DESCRIP","t":"VARCHAR(60)"}]},"U_AGENTE_ADUANAL":{"m":"","d":"","f":[{"n":"U_CODIGO","t":"VARCHAR(30)"},{"n":"U_DESCRIP","t":"VARCHAR(120)"},{"n":"U_U_CONSTRUCTORA","t":"DECIMAL"}]},"U_AGRUPACION_MARCA":{"m":"","d":"","f":[{"n":"U_AGRUPACION","t":"VARCHAR(100)"},{"n":"U_CODIGO","t":"VARCHAR(4)"},{"n":"U_DESCRIP","t":"VARCHAR(100)"},{"n":"U_ESPECIALIZACION","t":"VARCHAR(100)"},{"n":"U_FOCO","t":"VARCHAR(1)"},{"n":"U_MARCA","t":"VARCHAR(100)"}]},"U_ANALISTA":{"m":"","d":"","f":[{"n":"U_CODIGO","t":"VARCHAR(4)"},{"n":"U_DESCRIP","t":"VARCHAR(20)"}]},"U_ARTICULO_FOTO_SYNC":{"m":"CI","d":"","f":[{"n":"ARTICULO","t":"VARCHAR(20)"},{"n":"ESTADO","t":"VARCHAR(4)"},{"n":"FECHA_CREACION","t":"DATETIME"},{"n":"FECHA_ULT_EJECUCION","t":"DATETIME"},{"n":"IDARTICULO","t":"INT"},{"n":"PRIORIDAD","t":"INT"}]},"U_BOLETA":{"m":"","d":"","f":[{"n":"U_BOLETA","t":"VARCHAR(100)"},{"n":"U_CODIGO","t":"VARCHAR(10)"},{"n":"U_DESCRIP","t":"VARCHAR(20)"}]},"U_BOLETAS":{"m":"","d":"","f":[{"n":"U_CODIGO","t":"VARCHAR(4)"},{"n":"U_DESCRIP","t":"VARCHAR(20)"},{"n":"U_U_BOLETA","t":"VARCHAR(100)"}]},"U_COD_AGRUPADOR":{"m":"","d":"","f":[{"n":"U_CODIGO","t":"VARCHAR(6)"},{"n":"U_DESCRIP","t":"VARCHAR(249)"}]},"U_CORREO_OC_STREML":{"m":"","d":"","f":[{"n":"U_CODIGO","t":"VARCHAR(4)"},{"n":"U_CORREO","t":"VARCHAR(4000)"},{"n":"U_DESCRIP","t":"VARCHAR(800)"}]},"U_D151":{"m":"","d":"","f":[{"n":"U_CODIGO","t":"VARCHAR(4)"},{"n":"U_DESCRIP","t":"VARCHAR(40)"}]},"U_DEV_FR_WMS":{"m":"","d":"","f":[{"n":"U_AGENTE","t":"VARCHAR(4)"},{"n":"U_ARTDES","t":"VARCHAR(254)"},{"n":"U_ARTICULO","t":"VARCHAR(20)"},{"n":"U_BODEGA","t":"VARCHAR(4)"},{"n":"U_CANTIDAD","t":"VARCHAR(2)"},{"n":"U_CLIENTE","t":"VARCHAR(20)"},{"n":"U_CLINOM","t":"VARCHAR(50)"},{"n":"U_CODIGO","t":"VARCHAR(50)"},{"n":"U_DESCRIP","t":"VARCHAR(20)"},{"n":"U_DESCUENTO","t":"VARCHAR(2)"},{"n":"U_DEVOLUCION","t":"VARCHAR(50)"},{"n":"U_DOCUMENTO","t":"VARCHAR(50)"},{"n":"U_ESTADO_DEV","t":"VARCHAR(1)"},{"n":"U_ESTADO_DEV_LIN","t":"VARCHAR(1)"},{"n":"U_ESTADO_EPRAC","t":"VARCHAR(1)"},{"n":"U_FEC_DEV","t":"DATETIME"},{"n":"U_FECHA_EPRAC","t":"DATETIME"},{"n":"U_NOTAS","t":"VARCHAR(80)"},{"n":"U_OBSERVACIONES","t":"VARCHAR(80)"},{"n":"U_PRECIO_UNIT","t":"VARCHAR(2)"},{"n":"U_TOTAL","t":"VARCHAR(2)"},{"n":"U_USUARIO_EPRAC","t":"VARCHAR(50)"},{"n":"U_VENNOM","t":"VARCHAR(40)"},{"n":"U_ZONA","t":"VARCHAR(4)"}]},"U_DEVOLUCIONES_WMS":{"m":"","d":"Devoluciones de mercancía de clientes o a proveedores.","f":[{"n":"U_ARTICULO","t":"VARCHAR(20)"},{"n":"U_CANTIDAD","t":"INT"},{"n":"U_CLIENTE","t":"VARCHAR(20)"},{"n":"U_CODIGO","t":"VARCHAR(15)"},{"n":"U_DESCRIP","t":"VARCHAR(50)"},{"n":"U_ESTADO","t":"VARCHAR(1)"},{"n":"U_FACTURA","t":"VARCHAR(50)"},{"n":"U_FECHA","t":"DATETIME"},{"n":"U_NOMBRE","t":"VARCHAR(200)"},{"n":"U_NOTAS","t":"VARCHAR(80)"},{"n":"U_RUTA","t":"VARCHAR(4)"},{"n":"U_TIPO","t":"VARCHAR(20)"}]},"U_DIAS_HABILES":{"m":"","d":"","f":[{"n":"U_CODIGO","t":"VARCHAR(4)"},{"n":"U_DESCRIP","t":"VARCHAR(20)"},{"n":"U_U_DIA","t":"DATETIME"},{"n":"U_U_HABIL","t":"VARCHAR(1)"}]},"U_ELEMENTOS_PAGO":{"m":"","d":"Tabla de catálogo/maestro de referencia con código y descripción.","f":[{"n":"CODIGO","t":"VARCHAR(4)"},{"n":"DESCRIPCION","t":"VARCHAR(80)"},{"n":"ES_SALARIO_REFERENCIA","t":"VARCHAR(1)"}]},"U_ESQUEMA_FISCAL":{"m":"","d":"Tabla de catálogo/maestro de referencia con código y descripción.","f":[{"n":"CODIGO","t":"VARCHAR(4)"},{"n":"DESCRIPCION","t":"VARCHAR(200)"}]},"U_FACTOR_ARTICULO":{"m":"CI","d":"","f":[{"n":"U_ARTICULO","t":"VARCHAR(20)"},{"n":"U_CODIGO","t":"VARCHAR(10)"},{"n":"U_DESCRIP","t":"VARCHAR(20)"},{"n":"U_FACTOR","t":"DECIMAL"}]},"U_FEUNIDAD":{"m":"","d":"","f":[{"n":"U_CODIGO","t":"VARCHAR(20)"},{"n":"U_DESCRIP","t":"VARCHAR(100)"}]},"U_GRUPO_BODEGA":{"m":"CI","d":"Catálogo de bodegas/almacenes con parámetros logísticos.","f":[{"n":"U_CODIGO","t":"VARCHAR(4)"},{"n":"U_DESCRIP","t":"VARCHAR(100)"}]},"U_GRUPO_COMPRA":{"m":"","d":"","f":[{"n":"U_CODIGO","t":"VARCHAR(4)"},{"n":"U_DESCRIP","t":"VARCHAR(10)"},{"n":"U_E_MAIL","t":"VARCHAR(800)"},{"n":"U_RESPONSABLE","t":"VARCHAR(100)"}]},"U_JEFE_VENTAS":{"m":"","d":"","f":[{"n":"U_CODIGO","t":"VARCHAR(4)"},{"n":"U_DESCRIP","t":"VARCHAR(100)"},{"n":"U_EMAIL","t":"VARCHAR(200)"}]},"U_JM_ACT_RECLAMO":{"m":"","d":"","f":[{"n":"U_ARTICULO","t":"VARCHAR(20)"},{"n":"U_CODIGO","t":"VARCHAR(36)"},{"n":"U_DESCRIP","t":"VARCHAR(20)"},{"n":"U_DESCRIPCION","t":"VARCHAR(254)"},{"n":"U_ESTADO","t":"VARCHAR(150)"},{"n":"U_ESTADO_DESCRIPCION","t":"VARCHAR(150)"},{"n":"U_ONSERVACIONES","t":"VARCHAR(500)"},{"n":"U_RECLAMO_NUMERO","t":"VARCHAR(30)"}]},"U_JM_COFER_AUDIT":{"m":"","d":"Registro de auditoría y trazabilidad de cambios en el sistema.","f":[{"n":"U_CODIGO","t":"VARCHAR(36)"},{"n":"U_CODIGO_RECLAMO","t":"VARCHAR(36)"},{"n":"U_DESCRIP","t":"VARCHAR(500)"},{"n":"U_ESTADO","t":"VARCHAR(150)"}]},"U_JM_COFER_RECLAMO":{"m":"","d":"","f":[{"n":"U_ARTICULO","t":"VARCHAR(20)"},{"n":"U_CANTIDAD","t":"DECIMAL"},{"n":"U_CLIENTE","t":"VARCHAR(20)"},{"n":"U_CODIGO","t":"VARCHAR(36)"},{"n":"U_DESCRIP","t":"VARCHAR(20)"},{"n":"U_DESCRIPCION","t":"VARCHAR(254)"},{"n":"U_ESTADO","t":"VARCHAR(150)"},{"n":"U_FACTURA","t":"VARCHAR(50)"},{"n":"U_FECHA","t":"DATETIME"},{"n":"U_HORA","t":"DATETIME"},{"n":"U_IMPUESTO","t":"DECIMAL"},{"n":"U_MONTO_TOTAL","t":"DECIMAL"},{"n":"U_MOTIVO","t":"VARCHAR(500)"},{"n":"U_NIT","t":"VARCHAR(20)"},{"n":"U_NOMBRE_CLIENTE","t":"VARCHAR(150)"},{"n":"U_OBSERVACIONES","t":"VARCHAR(500)"},{"n":"U_PRECIO_UNITARIO","t":"DECIMAL"},{"n":"U_RECLAMO_NUMERO","t":"VARCHAR(30)"},{"n":"U_SUBTOTAL","t":"DECIMAL"},{"n":"U_UNIDAD_MEDIDA","t":"VARCHAR(6)"},{"n":"U_VENDEDOR","t":"VARCHAR(4)"}]},"U_JM_ESTADO_POS":{"m":"","d":"","f":[{"n":"U_CODIGO","t":"VARCHAR(4)"},{"n":"U_DESCRIP","t":"VARCHAR(20)"},{"n":"U_ESTADO","t":"VARCHAR(150)"},{"n":"U_ESTADO_POSTERIOR","t":"VARCHAR(150)"}]},"U_JM_ESTADO_RECLAM":{"m":"","d":"","f":[{"n":"U_CODIGO","t":"VARCHAR(4)"},{"n":"U_DESCRIP","t":"VARCHAR(150)"},{"n":"U_ORDEN","t":"INT"}]},"U_NIV_ART_MAR_DCTO":{"m":"","d":"","f":[{"n":"U_ARTICULO","t":"VARCHAR(20)"},{"n":"U_CODIGO","t":"VARCHAR(20)"},{"n":"U_DESCRIP","t":"VARCHAR(50)"},{"n":"U_DESCUENTO","t":"DECIMAL"},{"n":"U_MARCA","t":"VARCHAR(100)"},{"n":"U_PRECIO_FIJO","t":"DECIMAL"}]},"U_NIVEL_MARCA_DCTO":{"m":"","d":"","f":[{"n":"U_CODIGO","t":"VARCHAR(20)"},{"n":"U_DESCRIP","t":"VARCHAR(50)"},{"n":"U_DESCUENTO","t":"DECIMAL"},{"n":"U_MARCA","t":"VARCHAR(100)"}]},"U_NIVELES_ORGANI":{"m":"","d":"","f":[{"n":"U_CODIGO","t":"VARCHAR(4)"},{"n":"U_CONSECUTIVO","t":"INT"},{"n":"U_DESCRIP","t":"VARCHAR(50)"}]},"U_PASOS_SALARIALES":{"m":"","d":"","f":[{"n":"U_CODIGO","t":"VARCHAR(4)"},{"n":"U_CONSECUTIVO","t":"INT"},{"n":"U_DESCRIP","t":"VARCHAR(80)"}]},"U_PPTO_ANUAL_ART":{"m":"","d":"","f":[{"n":"U_CODIGO","t":"VARCHAR(10)"},{"n":"U_DESCRIP","t":"VARCHAR(20)"},{"n":"U_FECHA","t":"DATETIME"},{"n":"U_PPTO_MARGEN_ART","t":"DECIMAL"},{"n":"U_PPTO_RENTA_ART","t":"DECIMAL"},{"n":"U_PPTO_VTA_ART","t":"DECIMAL"}]},"U_PPTO_COBRO":{"m":"","d":"","f":[{"n":"U_CODIGO","t":"VARCHAR(4)"},{"n":"U_DESCRIP","t":"VARCHAR(20)"},{"n":"U_U_ANO","t":"VARCHAR(4)"},{"n":"U_U_AVALUO","t":"DECIMAL"},{"n":"U_U_COBRADOR","t":"VARCHAR(10)"},{"n":"U_U_FECHA","t":"DATETIME"},{"n":"U_U_MES","t":"VARCHAR(2)"},{"n":"U_U_MONTO","t":"INT"}]},"U_PPTO_COBRO_HIST":{"m":"","d":"","f":[{"n":"U_CODIGO","t":"VARCHAR(10)"},{"n":"U_DESCRIP","t":"VARCHAR(20)"},{"n":"U_FECHA","t":"DATETIME"},{"n":"U_MONTO","t":"DECIMAL"}]},"U_PPTO_MOVIL_ART":{"m":"","d":"","f":[{"n":"U_CODIGO","t":"VARCHAR(10)"},{"n":"U_DESCRIP","t":"VARCHAR(20)"},{"n":"U_FECHA","t":"DATETIME"},{"n":"U_PPTO_MARGEN_ART","t":"DECIMAL"},{"n":"U_PPTO_RENTA_ART","t":"DECIMAL"},{"n":"U_PPTO_VTA_ART","t":"DECIMAL"}]},"U_PPTO_VTA":{"m":"","d":"","f":[{"n":"U_CODIGO","t":"VARCHAR(4)"},{"n":"U_DESCRIP","t":"VARCHAR(20)"},{"n":"U_U_ANO","t":"VARCHAR(4)"},{"n":"U_U_FECHA","t":"DATETIME"},{"n":"U_U_MES","t":"VARCHAR(2)"},{"n":"U_U_MONTO","t":"INT"},{"n":"U_U_PPTO_BOSCH","t":"INT"},{"n":"U_U_PPTO_CAMPBELL","t":"INT"},{"n":"U_U_PPTO_CONSTRUCCION","t":"INT"},{"n":"U_U_PPTO_FERRETERIA","t":"INT"},{"n":"U_U_PPTO_HELECTRICA","t":"INT"},{"n":"U_U_PPTO_LIQUIDACION","t":"INT"},{"n":"U_U_PPTO_LORENZETTI","t":"INT"},{"n":"U_U_PPTO_METALCO","t":"INT"},{"n":"U_U_PPTO_PHELPS_DODGE","t":"INT"},{"n":"U_U_PPTO_SUR_QUIMICA","t":"INT"},{"n":"U_U_SKU","t":"INT"},{"n":"U_U_VENDEDOR","t":"VARCHAR(10)"}]},"U_REGLA_FLETE":{"m":"","d":"","f":[{"n":"U_CODIGO","t":"VARCHAR(4)"},{"n":"U_DESCRIP","t":"VARCHAR(20)"},{"n":"U_ESTATUS","t":"VARCHAR(1)"}]},"U_REPOSITOR":{"m":"","d":"","f":[{"n":"U_CODIGO","t":"VARCHAR(20)"},{"n":"U_DESCRIP","t":"VARCHAR(256)"}]},"U_SUPERVISOR":{"m":"","d":"","f":[{"n":"U_CODIGO","t":"VARCHAR(4)"},{"n":"U_DESCRIP","t":"VARCHAR(100)"},{"n":"U_EMAIL","t":"VARCHAR(200)"}]},"U_TDEPOSITO":{"m":"CB","d":"","f":[{"n":"U_CODIGO","t":"VARCHAR(4)"},{"n":"U_DESCRIP","t":"VARCHAR(50)"}]},"U_TIPO_DOCUMENTO":{"m":"","d":"","f":[{"n":"U_CODIGO","t":"VARCHAR(4)"},{"n":"U_DESCRIP","t":"VARCHAR(249)"}]},"U_ZONA_VENDEDOR":{"m":"FA","d":"Catálogo de vendedores/agentes comerciales con sus metas y parámetros.","f":[{"n":"PS_AFV_ID_U_ZONA_VENDEDOR","t":"INT"},{"n":"U_CODIGO","t":"VARCHAR(4)"},{"n":"U_DESCRIP","t":"VARCHAR(20)"},{"n":"U_ESTATUS_VENDEDOR","t":"VARCHAR(1)"},{"n":"U_PRIORIDAD","t":"DECIMAL"},{"n":"U_VENDEDOR","t":"VARCHAR(4)"},{"n":"U_ZONA","t":"VARCHAR(4)"}]},"UBICACION":{"m":"","d":"Ubicaciones físicas dentro del almacén (rack, pasillo, nivel).","f":[{"n":"DESCRIPCION","t":"VARCHAR(40)"},{"n":"UBICACION","t":"VARCHAR(8)"}]},"UBICACION_SINCRO":{"m":"","d":"Ubicaciones físicas dentro del almacén (rack, pasillo, nivel).","f":[{"n":"BODEGA","t":"VARCHAR(4)"},{"n":"ID_PDA","t":"VARCHAR(15)"},{"n":"ID_SINCRO","t":"VARCHAR(15)"},{"n":"LINEA","t":"INT"},{"n":"LOCALIZACION","t":"VARCHAR(8)"},{"n":"LOTE","t":"VARCHAR(15)"},{"n":"RECIBO","t":"VARCHAR(20)"}]},"UNIDAD":{"m":"","d":"","f":[{"n":"DESCRIPCION","t":"VARCHAR(40)"},{"n":"UNIDAD","t":"VARCHAR(15)"}]},"UNIDAD_DE_MEDIDA":{"m":"","d":"","f":[{"n":"DESCRIPCION","t":"VARCHAR(40)"},{"n":"U_FEUNIDAD","t":"VARCHAR(200)"},{"n":"U_MEDI_GUIA","t":"VARCHAR(6)"},{"n":"U_UNIDAD_MEDIDA_DE","t":"VARCHAR(20)"},{"n":"UNIDAD_MEDIDA","t":"VARCHAR(6)"},{"n":"UNIDAD_MEDIDA_DTE","t":"VARCHAR(4)"}]},"userdefinedfields_Hist":{"m":"","d":"","f":[{"n":"RowIdentifier","t":"GUID"},{"n":"TableName","t":"VARCHAR(128)"},{"n":"UDFDT1","t":"DATETIME"},{"n":"UDFDT2","t":"DATETIME"},{"n":"UDFDT3","t":"DATETIME"},{"n":"UDFDT4","t":"DATETIME"},{"n":"UDFDT5","t":"DATETIME"},{"n":"UDFDT6","t":"DATETIME"},{"n":"UDFINT1","t":"INT"},{"n":"UDFINT2","t":"INT"},{"n":"UDFINT3","t":"INT"},{"n":"UDFINT4","t":"INT"},{"n":"UDFINT5","t":"INT"},{"n":"UDFINT6","t":"INT"},{"n":"UDFNUM1","t":"DECIMAL"},{"n":"UDFNUM2","t":"DECIMAL"},{"n":"UDFNUM3","t":"DECIMAL"},{"n":"UDFNUM4","t":"DECIMAL"},{"n":"UDFNUM5","t":"DECIMAL"},{"n":"UDFNUM6","t":"DECIMAL"},{"n":"UDFVCLD1","t":"VARCHAR(255)"},{"n":"UDFVCLD2","t":"VARCHAR(255)"},{"n":"UDFVCMD1","t":"VARCHAR(80)"},{"n":"UDFVCMD2","t":"VARCHAR(80)"},{"n":"UDFVCMD3","t":"VARCHAR(80)"}]},"UserNotes":{"m":"","d":"","f":[{"n":"NoteContent","t":"TEXT"},{"n":"NoteDesc","t":"VARCHAR(255)"},{"n":"UserName","t":"VARCHAR(30)"},{"n":"UserNoteToken","t":"DECIMAL"}]},"USO_CFDI":{"m":"","d":"","f":[{"n":"DESCRIPCION","t":"VARCHAR(150)"},{"n":"TIPO_PERSONA_FISICA","t":"VARCHAR(1)"},{"n":"TIPO_PERSONA_MORAL","t":"VARCHAR(1)"},{"n":"USO_CFDI","t":"VARCHAR(3)"}]},"USUARIO_AJUSTE":{"m":"AS","d":"Ajustes de inventario: correcciones por diferencias entre conteo y sistema.","f":[{"n":"AJUSTE_CONFIG","t":"VARCHAR(4)"},{"n":"USUARIO","t":"VARCHAR(50)"}]},"USUARIO_BODEGA":{"m":"AS","d":"Catálogo de bodegas/almacenes con parámetros logísticos.","f":[{"n":"BODEGA","t":"VARCHAR(4)"},{"n":"USUARIO","t":"VARCHAR(50)"}]},"USUARIO_CAJA_FA":{"m":"AS","d":"Usuarios del sistema: credenciales, perfil, estado y auditoría.","f":[{"n":"CAJA","t":"VARCHAR(10)"},{"n":"MONTO_DIF_DOLAR","t":"DECIMAL"},{"n":"NOTAS","t":"TEXT"},{"n":"PORC_DIFERENCIA","t":"DECIMAL"},{"n":"PRIVILEGIOS","t":"VARCHAR(1)"},{"n":"USUARIO","t":"VARCHAR(50)"}]},"USUARIO_CE":{"m":"AS","d":"Usuarios del sistema: credenciales, perfil, estado y auditoría.","f":[{"n":"ACTIVO","t":"VARCHAR(1)"},{"n":"CLIENTE","t":"VARCHAR(20)"},{"n":"CODIGO","t":"VARCHAR(40)"},{"n":"EMAIL","t":"VARCHAR(100)"},{"n":"NOMBRE","t":"VARCHAR(100)"},{"n":"SUPERUSUARIO","t":"VARCHAR(1)"},{"n":"TELEFONO","t":"VARCHAR(15)"}]},"USUARIO_DIMENSIONADOR":{"m":"AS","d":"Usuarios del sistema: credenciales, perfil, estado y auditoría.","f":[{"n":"PASSWORD","t":"VARCHAR(150)"},{"n":"USUARIO","t":"VARCHAR(50)"}]},"USUARIO_PAQUETE":{"m":"AS","d":"Usuarios del sistema: credenciales, perfil, estado y auditoría.","f":[{"n":"AGREGAR","t":"VARCHAR(1)"},{"n":"APLICACION","t":"VARCHAR(1)"},{"n":"ELIMINAR","t":"VARCHAR(1)"},{"n":"PAQUETE","t":"VARCHAR(4)"},{"n":"SOLO_LECTURA","t":"VARCHAR(1)"},{"n":"TOTAL","t":"VARCHAR(1)"},{"n":"USUARIO","t":"VARCHAR(50)"}]},"USUARIOS":{"m":"AS","d":"Usuarios del sistema: credenciales, perfil, estado y auditoría.","f":[{"n":"CONTRIBUYENTE","t":"VARCHAR(20)"},{"n":"EMAIL","t":"VARCHAR(249)"},{"n":"EMAIL_DOC_ELECTRONICO","t":"VARCHAR(249)"},{"n":"ESTATUS_CONFIRMACION","t":"INT"},{"n":"ESTATUS_LOGIN","t":"INT"},{"n":"ESTATUS_PASSWORD","t":"INT"},{"n":"FECHA_CREACION","t":"DATETIME"},{"n":"ID","t":"INT"},{"n":"PASSWORD","t":"VARCHAR(256)"},{"n":"RAZON_SOCIAL","t":"VARCHAR(150)"},{"n":"TELEFONO1","t":"VARCHAR(50)"},{"n":"TELEFONO2","t":"VARCHAR(50)"},{"n":"ULTIMA_CONEXION_LOGIN","t":"DATETIME"}]},"USUARIOS_APROB_OC":{"m":"AS","d":"Usuarios del sistema: credenciales, perfil, estado y auditoría.","f":[{"n":"FECHA_APROB","t":"DATETIME"},{"n":"ORDEN_COMPRA","t":"VARCHAR(10)"},{"n":"USUARIO","t":"VARCHAR(50)"}]},"USUARIOS_DEPARTAMENTO":{"m":"AS","d":"Usuarios del sistema: credenciales, perfil, estado y auditoría.","f":[{"n":"DEPARTAMENTO","t":"VARCHAR(10)"},{"n":"MONTO_MAX_APROB_USR","t":"DECIMAL"},{"n":"USUARIO","t":"VARCHAR(50)"}]},"USUARIOS_X_CENTRO":{"m":"AS","d":"Usuarios del sistema: credenciales, perfil, estado y auditoría.","f":[{"n":"CENTRO_COSTO","t":"VARCHAR(25)"},{"n":"USUARIO","t":"VARCHAR(50)"}]},"VACACION":{"m":"CN","d":"Control de vacaciones: días acumulados, tomados y pendientes.","f":[{"n":"ANTIGUEDAD","t":"DECIMAL"},{"n":"CANTIDAD","t":"DECIMAL"},{"n":"SECUENCIA","t":"INT"}]},"VALE":{"m":"","d":"","f":[{"n":"ADMIN_ANULACION","t":"VARCHAR(20)"},{"n":"ADMIN_CREACION","t":"VARCHAR(20)"},{"n":"ADMIN_MODIFIC","t":"VARCHAR(20)"},{"n":"ASIENTO","t":"VARCHAR(10)"},{"n":"BENEFICIARIO","t":"VARCHAR(80)"},{"n":"CAJA_CHICA","t":"VARCHAR(20)"},{"n":"CONCEPTO_VALE","t":"VARCHAR(10)"},{"n":"CONSECUTIVO","t":"INT"},{"n":"CONSECUTIVO_DOC","t":"VARCHAR(10)"},{"n":"DEPARTAMENTO","t":"VARCHAR(10)"},{"n":"ESTADO","t":"VARCHAR(1)"},{"n":"FACTURA_ELECTRONICA","t":"VARCHAR(1)"},{"n":"FECHA_ANULACION","t":"DATETIME"},{"n":"FECHA_CONT_ANULACION","t":"DATETIME"},{"n":"FECHA_CREACION","t":"DATETIME"},{"n":"FECHA_EMISION","t":"DATETIME"},{"n":"FECHA_LIQUIDACION","t":"DATETIME"},{"n":"FECHA_MODIFIC","t":"DATETIME"},{"n":"MONTO_CAJA","t":"DECIMAL"},{"n":"MONTO_DOLAR","t":"DECIMAL"},{"n":"MONTO_EFECTIVO","t":"DECIMAL"},{"n":"MONTO_LOCAL","t":"DECIMAL"},{"n":"MONTO_VALE","t":"DECIMAL"},{"n":"NOTAS","t":"TEXT"},{"n":"PRESUPUESTO_CR","t":"VARCHAR(20)"}]},"VALOR_ADICIONAL_ME":{"m":"","d":"","f":[{"n":"ASIENTO","t":"VARCHAR(10)"},{"n":"ASUMIDO","t":"VARCHAR(1)"},{"n":"BASE_DOLAR","t":"DECIMAL"},{"n":"BASE_LOCAL","t":"DECIMAL"},{"n":"CENTRO_COSTO","t":"VARCHAR(25)"},{"n":"CONCEPTO_ME","t":"VARCHAR(4)"},{"n":"CONSECUTIVO","t":"INT"},{"n":"CUENTA_CONTABLE","t":"VARCHAR(25)"},{"n":"FECHA","t":"DATETIME"},{"n":"IVA_MAYOR_VALOR_COSTO","t":"VARCHAR(1)"},{"n":"MONTO_IVA","t":"DECIMAL"},{"n":"NIT","t":"VARCHAR(20)"},{"n":"PORCENTAJE_IVA","t":"DECIMAL"},{"n":"TIPO_IMPUESTO","t":"VARCHAR(5)"}]},"VEHICULO":{"m":"","d":"","f":[{"n":"CODIGO_CIRCULACION","t":"VARCHAR(20)"},{"n":"ENTIDAD_EMISORA","t":"VARCHAR(50)"},{"n":"NUMERO_AUTORIZACION","t":"VARCHAR(50)"},{"n":"NUMERO_PLACA","t":"VARCHAR(20)"}]},"VENDEDOR":{"m":"FA","d":"Catálogo de vendedores/agentes comerciales con sus metas y parámetros.","f":[{"n":"ACTIVO","t":"VARCHAR(1)"},{"n":"COMISION","t":"DECIMAL"},{"n":"CTA_COMISION","t":"VARCHAR(25)"},{"n":"CTR_COMISION","t":"VARCHAR(25)"},{"n":"E_MAIL","t":"VARCHAR(249)"},{"n":"EMPLEADO","t":"VARCHAR(20)"},{"n":"id_cat_VENDEDOR","t":"INT"},{"n":"NOMBRE","t":"VARCHAR(40)"},{"n":"TELEFONO","t":"VARCHAR(100)"},{"n":"U_COMPANIA","t":"VARCHAR(80)"},{"n":"U_JEFE_REGIONAL","t":"VARCHAR(200)"},{"n":"U_JEFE_VENTAS","t":"VARCHAR(150)"},{"n":"U_LOCALIDAD","t":"VARCHAR(150)"},{"n":"U_NOTAS","t":"VARCHAR(8000)"},{"n":"U_ROL","t":"VARCHAR(150)"},{"n":"U_SUPERVISOR","t":"VARCHAR(150)"},{"n":"U_TELEFONO","t":"VARCHAR(50)"},{"n":"VENDEDOR","t":"VARCHAR(4)"}]},"VENDEDOR_EMAIL":{"m":"FA","d":"Catálogo de vendedores/agentes comerciales con sus metas y parámetros.","f":[{"n":"EMAIL","t":"VARCHAR(80)"},{"n":"VENDEDOR","t":"VARCHAR(4)"}]},"VERSION_KIT_PRECIO":{"m":"","d":"Lista de precios: tarifas por artículo, cliente o segmento.","f":[{"n":"ARTICULO_HIJO","t":"VARCHAR(20)"},{"n":"ARTICULO_PADRE","t":"VARCHAR(20)"},{"n":"MONEDA","t":"VARCHAR(1)"},{"n":"NIVEL_PRECIO","t":"VARCHAR(12)"},{"n":"PRECIO_HIJO","t":"DECIMAL"},{"n":"VERSION","t":"INT"},{"n":"VERSION_ARTICULO","t":"INT"}]},"VERSION_NIVEL":{"m":"","d":"","f":[{"n":"ESTADO","t":"VARCHAR(1)"},{"n":"FCH_HORA_ANULACION","t":"DATETIME"},{"n":"FCH_HORA_APROBACIO","t":"DATETIME"},{"n":"FCH_HORA_CREACION","t":"DATETIME"},{"n":"FCH_HORA_ULT_MODIF","t":"DATETIME"},{"n":"FECHA_CORTE","t":"DATETIME"},{"n":"FECHA_INICIO","t":"DATETIME"},{"n":"IDENTIFICADOR","t":"VARCHAR(10)"},{"n":"IMPUESTO1_INCLUIDO","t":"VARCHAR(1)"},{"n":"MONEDA","t":"VARCHAR(1)"},{"n":"NIVEL_PRECIO","t":"VARCHAR(12)"},{"n":"PRECIO_REFERENCIA_DE","t":"VARCHAR(4)"},{"n":"PS_AFV_ID_VERSION_NIVEL","t":"INT"},{"n":"SINC_MOVIL","t":"VARCHAR(1)"},{"n":"TIPO_DESC_BONIFICADO","t":"VARCHAR(2)"},{"n":"TIPO_DESCUENTO","t":"VARCHAR(2)"},{"n":"TIPO_DESCUENTO_OTRO","t":"VARCHAR(100)"},{"n":"U_NOMBRE_LISTA_ALT","t":"VARCHAR(200)"},{"n":"U_PORCENTAJE_LISTA_ALT","t":"DECIMAL"},{"n":"U_TIPO_MONEDA","t":"VARCHAR(1)"},{"n":"USUARIO_ANULACION","t":"VARCHAR(50)"},{"n":"USUARIO_APROBACION","t":"VARCHAR(50)"},{"n":"USUARIO_CREACION","t":"VARCHAR(50)"},{"n":"USUARIO_ULT_MODIF","t":"VARCHAR(50)"},{"n":"VERSION","t":"INT"}]},"VIATICOS":{"m":"","d":"","f":[{"n":"AGENTE","t":"VARCHAR(255)"},{"n":"CEDULA","t":"VARCHAR(50)"},{"n":"ESTADO","t":"VARCHAR(1)"},{"n":"FACTURA","t":"VARCHAR(50)"},{"n":"FECHA","t":"DATETIME"},{"n":"ID","t":"INT"},{"n":"IMPUESTO","t":"DECIMAL"},{"n":"OBSERVACIONES","t":"VARCHAR(512)"},{"n":"RAZONSOCIAL","t":"VARCHAR(255)"},{"n":"SUBTOTAL","t":"DECIMAL"},{"n":"TOTAL","t":"DECIMAL"}]},"VISTA_BI":{"m":"","d":"","f":[{"n":"CONEXION","t":"TEXT"},{"n":"DESCRIPCION","t":"VARCHAR(254)"},{"n":"MODULO","t":"VARCHAR(4)"},{"n":"NOMBRE","t":"VARCHAR(60)"},{"n":"TIPO_CONEXION","t":"VARCHAR(1)"},{"n":"VISTA","t":"VARCHAR(30)"}]},"VISTAS_PIVOTE":{"m":"","d":"","f":[{"n":"CUBO","t":"VARCHAR(40)"},{"n":"DEFINICION","t":"TEXT"},{"n":"NOMBRE","t":"VARCHAR(50)"}]},"XX_LO_DIMENSION_ARTICULO":{"m":"CI","d":"","f":[{"n":"C_BPARTNER_ID","t":"VARCHAR(250)"},{"n":"CREATEDATE","t":"DATETIME"},{"n":"CREATEDBY","t":"VARCHAR(30)"},{"n":"ISACTIVE","t":"VARCHAR(1)"},{"n":"M_PRODUCT_ID","t":"VARCHAR(250)"},{"n":"NOTEEXISTSFLAG","t":"INT"},{"n":"RECORDDATE","t":"DATETIME"},{"n":"ROWPOINTER","t":"GUID"},{"n":"UPDATEDBY","t":"VARCHAR(30)"},{"n":"VENDORPRODUCTNO","t":"VARCHAR(250)"},{"n":"XX_LO_ALTURA","t":"DECIMAL"},{"n":"XX_LO_ANCHO","t":"DECIMAL"},{"n":"XX_LO_ARTICULO_IRREGULAR","t":"VARCHAR(1)"},{"n":"XX_LO_CANTIDAD_POR_EMPAQUE","t":"INT"},{"n":"XX_LO_CODIGO_ARTICULO","t":"VARCHAR(40)"},{"n":"XX_LO_CODIGO_BARRAS","t":"VARCHAR(20)"},{"n":"XX_LO_CODIGO_PROVEEDOR","t":"VARCHAR(40)"},{"n":"XX_LO_COMPANIA","t":"VARCHAR(100)"},{"n":"XX_LO_DESCRIPCION_ARTICULO","t":"VARCHAR(255)"},{"n":"XX_LO_DESCRIPCION_PROVEEDOR","t":"VARCHAR(255)"},{"n":"XX_LO_DIM_ID","t":"INT"},{"n":"XX_LO_DIMENSION_ARTICULO_ID","t":"INT"},{"n":"XX_LO_IMAGEN","t":"VARCHAR(250)"},{"n":"XX_LO_LARGO","t":"DECIMAL"},{"n":"XX_LO_PESO","t":"DECIMAL"}]},"ZONA":{"m":"","d":"Zonas geográficas o rutas de distribución para análisis territorial.","f":[{"n":"NOMBRE","t":"VARCHAR(40)"},{"n":"PS_AFV_ID_ZONA","t":"INT"},{"n":"ZONA","t":"VARCHAR(4)"}]},"ACTIVACION_ARTICULO":{"m":"CI","d":"","f":[{"n":"ANTES","t":"vc"},{"n":"ARTICULO","t":"vc"},{"n":"CANTIDAD_VENDIDA","t":"i"},{"n":"CLIENTE","t":"vc"},{"n":"CLINOM","t":"vc"},{"n":"DESCRIPCION","t":"vc"},{"n":"FECHA_FACTURA","t":"dt"},{"n":"VENDEDOR","t":"vc"},{"n":"VENDEDOR_HENKEL","t":"vc"},{"n":"VENNOM","t":"vc"},{"n":"VENNOM_HENKEL","t":"vc"}]},"ARANCEL_COFERSA":{"m":"CO","d":"","f":[{"n":"ANO","t":"i"},{"n":"DIA","t":"i"},{"n":"DOCUMENTO","t":"vc"},{"n":"EMBARQUE","t":"vc"},{"n":"MES","t":"i"},{"n":"MONTO_DOLAR","t":"dc"},{"n":"MONTO_LOCAL","t":"dc"},{"n":"NOMBRE","t":"vc"},{"n":"PROVEEDOR_LIQUIDAC","t":"vc"},{"n":"RUBRO","t":"vc"}]},"ARTICULO_ACE":{"m":"CI","d":"","f":[{"n":"ACTIVO","t":"vc"},{"n":"ARTICULO","t":"vc"},{"n":"ARTICULO_CUENTA","t":"vc"},{"n":"ARTICULO_DEL_PROV","t":"vc"},{"n":"BULTOS","t":"si"},{"n":"CLASE_ABC","t":"vc"},{"n":"CLASIFICACION_1","t":"vc"},{"n":"CLASIFICACION_2","t":"vc"},{"n":"CLASIFICACION_3","t":"vc"},{"n":"CODIGO_BARRAS_INVT","t":"vc"},{"n":"CODIGO_BARRAS_VENT","t":"vc"},{"n":"COSTO_COMPARATIVO","t":"vc"},{"n":"COSTO_FISCAL","t":"vc"},{"n":"COSTO_PROM_DOL","t":"dc"},{"n":"COSTO_PROM_LOC","t":"dc"},{"n":"COSTO_STD_DOL","t":"dc"},{"n":"COSTO_STD_LOC","t":"dc"},{"n":"COSTO_ULT_DOL","t":"dc"},{"n":"COSTO_ULT_LOC","t":"dc"},{"n":"DESCRIPCION","t":"vc"},{"n":"DIAS_CUARENTENA","t":"si"},{"n":"EXISTENCIA_MAXIMA","t":"dc"},{"n":"EXISTENCIA_MINIMA","t":"dc"},{"n":"FACTOR_CONVER_1","t":"dc"},{"n":"FACTOR_CONVER_2","t":"dc"}]},"ARTICULO_ACE_COFERSA":{"m":"CI","d":"","f":[{"n":"ACTIVO","t":"vc"},{"n":"ARTICULO","t":"vc"},{"n":"ARTICULO_CUENTA","t":"vc"},{"n":"ARTICULO_DEL_PROV","t":"vc"},{"n":"BULTOS","t":"si"},{"n":"CLASE_ABC","t":"vc"},{"n":"CLASIFICACION_1","t":"vc"},{"n":"CLASIFICACION_2","t":"vc"},{"n":"CLASIFICACION_3","t":"vc"},{"n":"CODIGO_BARRAS_INVT","t":"vc"},{"n":"CODIGO_BARRAS_VENT","t":"vc"},{"n":"COSTO_COMPARATIVO","t":"vc"},{"n":"COSTO_FISCAL","t":"vc"},{"n":"COSTO_PROM_DOL","t":"dc"},{"n":"COSTO_PROM_LOC","t":"dc"},{"n":"COSTO_STD_DOL","t":"dc"},{"n":"COSTO_STD_LOC","t":"dc"},{"n":"COSTO_ULT_DOL","t":"dc"},{"n":"COSTO_ULT_LOC","t":"dc"},{"n":"DESCRIPCION","t":"vc"},{"n":"DIAS_CUARENTENA","t":"si"},{"n":"EXISTENCIA_MAXIMA","t":"dc"},{"n":"EXISTENCIA_MINIMA","t":"dc"},{"n":"FACTOR_CONVER_1","t":"dc"},{"n":"FACTOR_CONVER_2","t":"dc"}]},"ARTICULO_CARGA_GEO":{"m":"CI","d":"","f":[{"n":"ACTIVO","t":"vc"},{"n":"ARTICULO","t":"vc"},{"n":"ARTICULO_CUENTA","t":"vc"},{"n":"ARTICULO_DEL_PROV","t":"vc"},{"n":"BULTOS","t":"si"},{"n":"CLASE_ABC","t":"vc"},{"n":"CLASIFICACION_1","t":"vc"},{"n":"CLASIFICACION_2","t":"vc"},{"n":"CLASIFICACION_3","t":"vc"},{"n":"CODIGO_BARRAS_INVT","t":"vc"},{"n":"CODIGO_BARRAS_VENT","t":"vc"},{"n":"COSTO_COMPARATIVO","t":"vc"},{"n":"COSTO_FISCAL","t":"vc"},{"n":"COSTO_PROM_DOL","t":"dc"},{"n":"COSTO_PROM_LOC","t":"dc"},{"n":"COSTO_STD_DOL","t":"dc"},{"n":"COSTO_STD_LOC","t":"dc"},{"n":"COSTO_ULT_DOL","t":"dc"},{"n":"COSTO_ULT_LOC","t":"dc"},{"n":"DESCRIPCION","t":"vc"},{"n":"DIAS_CUARENTENA","t":"si"},{"n":"EXISTENCIA_MAXIMA","t":"dc"},{"n":"EXISTENCIA_MINIMA","t":"dc"},{"n":"FACTOR_CONVER_1","t":"dc"},{"n":"FACTOR_CONVER_2","t":"dc"}]},"ARTICULO_COF":{"m":"CI","d":"","f":[{"n":"ACTIVO","t":"vc"},{"n":"ARTICULO","t":"vc"},{"n":"BODEGA","t":"vc"},{"n":"CATEGORIA","t":"vc"},{"n":"CLASE_BDF","t":"vc"},{"n":"COD_CATEGORIA","t":"vc"},{"n":"COD_GRUPO","t":"vc"},{"n":"COD_MARCA","t":"vc"},{"n":"COD_PROVEEDOR","t":"vc"},{"n":"COD_SUB_CATEGORIA","t":"vc"},{"n":"DESCRIPCION","t":"vc"},{"n":"GRUPO","t":"vc"},{"n":"ID_ARTICULO","t":"i"},{"n":"ID_BODEGA","t":"vc"},{"n":"ID_CLASE_BDF","t":"vc"},{"n":"MARCA","t":"vc"},{"n":"MARCA_PPTO","t":"vc"},{"n":"NACIONALIDAD","t":"vc"},{"n":"PAIS_ORIGEN","t":"vc"},{"n":"PROVEEDOR","t":"vc"},{"n":"REFERENCIA","t":"vc"},{"n":"SUB_CATEGORIA","t":"vc"},{"n":"TIPO_PROVEEDOR","t":"vc"}]},"ARTICULO_COFERSA":{"m":"CI","d":"","f":[{"n":"ARTICULO","t":"vc"},{"n":"CODIGO_BARRAS_VENT","t":"vc"},{"n":"DESCRIPCION","t":"vc"}]},"ARTICULO_COMISION":{"m":"CI","d":"","f":[{"n":"ARTICULO","t":"vc"},{"n":"PORCENTAJE","t":"dc"}]},"ARTICULO_ESPECIFICACIONES":{"m":"CI","d":"","f":[{"n":"ARTICULO","t":"vc"},{"n":"ATRIBUTO","t":"vc"},{"n":"DESCRIPCION","t":"vc"},{"n":"MARCA","t":"vc"},{"n":"NOTAS","t":"tx"},{"n":"NOTAS_ATRIBUTO","t":"tx"},{"n":"VALOR","t":"vc"}]},"ARTICULO_GEO":{"m":"CI","d":"","f":[{"n":"ACTIVO","t":"vc"},{"n":"ARTICULO","t":"vc"},{"n":"ARTICULO_CUENTA","t":"vc"},{"n":"ARTICULO_DEL_PROV","t":"vc"},{"n":"BULTOS","t":"si"},{"n":"CLASE_ABC","t":"vc"},{"n":"CLASIFICACION_1","t":"vc"},{"n":"CLASIFICACION_2","t":"vc"},{"n":"CLASIFICACION_3","t":"vc"},{"n":"CODIGO_BARRAS_INVT","t":"vc"},{"n":"CODIGO_BARRAS_VENT","t":"vc"},{"n":"COSTO_COMPARATIVO","t":"vc"},{"n":"COSTO_FISCAL","t":"vc"},{"n":"COSTO_PROM_DOL","t":"dc"},{"n":"COSTO_PROM_LOC","t":"dc"},{"n":"COSTO_STD_DOL","t":"dc"},{"n":"COSTO_STD_LOC","t":"dc"},{"n":"COSTO_ULT_DOL","t":"dc"},{"n":"COSTO_ULT_LOC","t":"dc"},{"n":"DESCRIPCION","t":"vc"},{"n":"DIAS_CUARENTENA","t":"si"},{"n":"EXISTENCIA_MAXIMA","t":"dc"},{"n":"EXISTENCIA_MINIMA","t":"dc"},{"n":"FACTOR_CONVER_1","t":"dc"},{"n":"FACTOR_CONVER_2","t":"dc"}]},"ARTICULO_LANCO":{"m":"CI","d":"","f":[{"n":"ARTICULO","t":"vc"},{"n":"DESCRIPCION","t":"vc"},{"n":"MARCA","t":"vc"}]},"ARTICULO_OIC":{"m":"CI","d":"","f":[{"n":"ACTIVO","t":"vc"},{"n":"ARTICULO","t":"vc"},{"n":"BODEGA","t":"vc"},{"n":"CATEGORIA","t":"vc"},{"n":"CLASE_BDF","t":"vc"},{"n":"COD_CATEGORIA","t":"vc"},{"n":"COD_GRUPO","t":"vc"},{"n":"COD_MARCA","t":"vc"},{"n":"COD_PROVEEDOR","t":"vc"},{"n":"COD_SUB_CATEGORIA","t":"vc"},{"n":"DESCRIPCION","t":"vc"},{"n":"GRUPO","t":"vc"},{"n":"ID_ARTICULO","t":"i"},{"n":"ID_BODEGA","t":"vc"},{"n":"ID_CLASE_BDF","t":"vc"},{"n":"MARCA","t":"vc"},{"n":"MARCA_PPTO","t":"vc"},{"n":"NACIONALIDAD","t":"vc"},{"n":"PAIS_ORIGEN","t":"vc"},{"n":"PROVEEDOR","t":"vc"},{"n":"REFERENCIA","t":"vc"},{"n":"SUB_CATEGORIA","t":"vc"},{"n":"TIPO_PROVEEDOR","t":"vc"}]},"ARTICULO_PIK":{"m":"CI","d":"","f":[{"n":"ARTICULO","t":"vc"},{"n":"BODEGA","t":"vc"},{"n":"CANT_DISPONIBLE_ACTUAL","t":"fl"},{"n":"CANT_DISPONIBLE_CARGA","t":"fl"}]},"ARTICULO_PROTECTO":{"m":"CI","d":"","f":[{"n":"ARTICULO","t":"vc"},{"n":"DESCRIPCION","t":"vc"},{"n":"MARCA","t":"vc"}]},"ARTICULO_STREAMLINE_COFERSA":{"m":"CI","d":"","f":[{"n":"ARTICULO","t":"vc"},{"n":"BATCH_CODE","t":"vc"},{"n":"CATEGORIA","t":"vc"},{"n":"CEDI","t":"vc"},{"n":"CICLO_FREC_PEDIDO","t":"i"},{"n":"CLASE_ABC","t":"vc"},{"n":"CLASE_BDF","t":"vc"},{"n":"COD_ARTICULO","t":"vc"},{"n":"COD_LOCALIZACION","t":"vc"},{"n":"COD_PROVEEDOR","t":"vc"},{"n":"COMPANIA","t":"vc"},{"n":"GRUPO","t":"vc"},{"n":"JOB_EXECUTION_DATE","t":"dt"},{"n":"JOB_EXECUTION_STATUS","t":"vc"},{"n":"LEAD_DIAS_ENTREGA","t":"i"},{"n":"LOCALIZACION","t":"vc"},{"n":"LOTE_MAX","t":"i"},{"n":"LOTE_MIN","t":"i"},{"n":"MARCA","t":"vc"},{"n":"MARCA_PPTO","t":"vc"},{"n":"MONEDA_PROV","t":"vc"},{"n":"PAIS_ORIGEN","t":"vc"},{"n":"PESO","t":"dc"},{"n":"PRECIO_COMPRA","t":"dc"},{"n":"PRECIO_VTA","t":"dc"}]},"C_ARTICULO":{"m":"CI","d":"","f":[{"n":"ACTIVO","t":"vc"},{"n":"ARTICULO","t":"vc"},{"n":"ARTICULO_CUENTA","t":"vc"},{"n":"ARTICULO_DEL_PROV","t":"vc"},{"n":"BULTOS","t":"si"},{"n":"CLASE_ABC","t":"vc"},{"n":"CLASIFICACION_1","t":"vc"},{"n":"CLASIFICACION_2","t":"vc"},{"n":"CLASIFICACION_3","t":"vc"},{"n":"CLASIFICACION_4","t":"vc"},{"n":"CLASIFICACION_5","t":"vc"},{"n":"CLASIFICACION_6","t":"vc"},{"n":"CODIGO_BARRAS_INVT","t":"vc"},{"n":"CODIGO_BARRAS_VENT","t":"vc"},{"n":"CODIGO_RETENCION","t":"vc"},{"n":"COSTO_COMPARATIVO","t":"vc"},{"n":"COSTO_FISCAL","t":"vc"},{"n":"COSTO_PROM_DOL","t":"dc"},{"n":"COSTO_PROM_LOC","t":"dc"},{"n":"COSTO_STD_DOL","t":"dc"},{"n":"COSTO_STD_LOC","t":"dc"},{"n":"COSTO_ULT_DOL","t":"dc"},{"n":"COSTO_ULT_LOC","t":"dc"},{"n":"DESCRIPCION","t":"vc"},{"n":"DIAS_CUARENTENA","t":"si"}]},"C_ARTICULO_CUENTA":{"m":"CI","d":"","f":[{"n":"ARTICULO_CUENTA","t":"vc"},{"n":"CTA_COMPRA_IMP","t":"vc"},{"n":"CTA_COMPRA_LOC","t":"vc"},{"n":"CTA_COMS_COBRO_EXP","t":"vc"},{"n":"CTA_COMS_COBRO_LOC","t":"vc"},{"n":"CTA_COMS_VENTA_EXP","t":"vc"},{"n":"CTA_COMS_VENTA_LOC","t":"vc"},{"n":"CTA_CONS_DESPERDIC","t":"vc"},{"n":"CTA_CONS_GASTO","t":"vc"},{"n":"CTA_CONS_NORMAL","t":"vc"},{"n":"CTA_CONS_RETRABAJO","t":"vc"},{"n":"CTA_COST_DESC_EXP","t":"vc"},{"n":"CTA_COST_DESC_LOC","t":"vc"},{"n":"CTA_COST_VENTA_EXP","t":"vc"},{"n":"CTA_COST_VENTA_LOC","t":"vc"},{"n":"CTA_CTB_AJU","t":"vc"},{"n":"CTA_CTB_AJU_CMV","t":"vc"},{"n":"CTA_CTB_CPGAR","t":"vc"},{"n":"CTA_CTB_ING_DEVOLUC","t":"vc"},{"n":"CTA_CTB_PERD_DEVOLUC","t":"vc"},{"n":"CTA_CTB_PUGAR","t":"vc"},{"n":"CTA_CTB_RET_ASUM","t":"vc"},{"n":"CTA_DESC_BONIF_EXP","t":"vc"},{"n":"CTA_DESC_BONIF_LOC","t":"vc"},{"n":"CTA_DESC_LINEA_EXP","t":"vc"}]},"C_CLASIFICACION":{"m":"CI","d":"","f":[{"n":"AGRUPACION","t":"si"},{"n":"APORTE_CODIGO","t":"vc"},{"n":"CLASIFICACION","t":"vc"},{"n":"DESCRIPCION","t":"vc"},{"n":"PLANTILLA_SERIE","t":"vc"},{"n":"TIPO_CODIGO_BARRAS","t":"vc"},{"n":"UNIDAD_MEDIDA","t":"vc"},{"n":"USA_NUMEROS_SERIE","t":"vc"}]},"C_IMPUESTO":{"m":"CN","d":"","f":[{"n":"CALCULO_IMP2","t":"vc"},{"n":"CONTAB_DEV_IMP1","t":"vc"},{"n":"CONTAB_DEV_IMP2","t":"vc"},{"n":"CTA_IMP1_DESC_CMPS","t":"vc"},{"n":"CTA_IMP1_DEV_CMPS","t":"vc"},{"n":"CTA_IMP1_DEV_VTS","t":"vc"},{"n":"CTA_IMP1_GEN","t":"vc"},{"n":"CTA_IMP1_GEN_VTS","t":"vc"},{"n":"CTA_IMP2_DESC_CMPS","t":"vc"},{"n":"CTA_IMP2_DEV_CMPS","t":"vc"},{"n":"CTA_IMP2_DEV_VTS","t":"vc"},{"n":"CTA_IMP2_GEN","t":"vc"},{"n":"CTA_IMP2_GEN_VTS","t":"vc"},{"n":"CTR_IMP1_DESC_CMPS","t":"vc"},{"n":"CTR_IMP1_DEV_CMPS","t":"vc"},{"n":"CTR_IMP1_DEV_VTS","t":"vc"},{"n":"CTR_IMP1_GEN","t":"vc"},{"n":"CTR_IMP1_GEN_VTS","t":"vc"},{"n":"CTR_IMP2_DESC_CMPS","t":"vc"},{"n":"CTR_IMP2_DEV_CMPS","t":"vc"},{"n":"CTR_IMP2_DEV_VTS","t":"vc"},{"n":"CTR_IMP2_GEN","t":"vc"},{"n":"CTR_IMP2_GEN_VTS","t":"vc"},{"n":"DESCRIPCION","t":"vc"},{"n":"ESTADO","t":"vc"}]},"C_LOTE":{"m":"CI","d":"","f":[{"n":"ARTICULO","t":"vc"},{"n":"CANTIDAD_INGRESADA","t":"dc"},{"n":"ESTADO","t":"vc"},{"n":"FECHA_CUARENTENA","t":"dt"},{"n":"FECHA_ENTRADA","t":"dt"},{"n":"FECHA_FABRICACION","t":"dt"},{"n":"FECHA_VENCIMIENTO","t":"dt"},{"n":"LOTE","t":"vc"},{"n":"LOTE_DEL_PROVEEDOR","t":"vc"},{"n":"NOTAS","t":"tx"},{"n":"PROVEEDOR","t":"vc"},{"n":"TIPO_INGRESO","t":"vc"},{"n":"ULTIMO_INGRESO","t":"i"}]},"CARGA_CONTACTO_CLIENTE":{"m":"CC","d":"","f":[{"n":"APELLIDOS","t":"vc"},{"n":"CARGO","t":"vc"},{"n":"CELULAR","t":"vc"},{"n":"CLIENTE","t":"vc"},{"n":"CONTACTO1","t":"vc"},{"n":"CONTACTO2","t":"vc"},{"n":"DEPARTAMENTO","t":"vc"},{"n":"EMAIL","t":"vc"},{"n":"FAX","t":"vc"},{"n":"GENERO","t":"vc"},{"n":"NOMBRE","t":"vc"},{"n":"NOTAS","t":"vc"},{"n":"TELEFONO","t":"vc"}]},"CARGADOR_GUIA_DESPACHO":{"m":"FA","d":"","f":[{"n":"FACTURA","t":"vc"},{"n":"FECHA","t":"dt"},{"n":"USUARIO","t":"vc"}]},"CENTRO_DEPARTAMENTO":{"m":"CN","d":"","f":[{"n":"CENTRO_COSTO","t":"vc"},{"n":"DESCRIPCION","t":"vc"}]},"CG_INV_BODEGA":{"m":"CI","d":"","f":[{"n":"ANO","t":"i"},{"n":"ASIENTO","t":"vc"},{"n":"CREDITO_LOCAL","t":"dc"},{"n":"DEBITO_LOCAL","t":"dc"},{"n":"DIA","t":"i"},{"n":"FECHA","t":"dt"},{"n":"MES","t":"i"},{"n":"ORIGEN","t":"vc"},{"n":"REFERENCIA","t":"vc"}]},"CLIENTE_FRECUENTE_MAR":{"m":"CC","d":"","f":[{"n":"ACEPTA_CHEQUES","t":"c"},{"n":"ACTIVO","t":"c"},{"n":"APARTADO","t":"vc"},{"n":"CEDULA","t":"vc"},{"n":"CLASE_ABC","t":"vc"},{"n":"CLIENTE","t":"vc"},{"n":"COMPANIA","t":"vc"},{"n":"DIRECCION","t":"tx"},{"n":"EMAIL","t":"vc"},{"n":"ESTADO_CIVIL","t":"vc"},{"n":"EXTTRABAJO","t":"vc"},{"n":"FAX","t":"vc"},{"n":"FECHA_INGRESO","t":"dt"},{"n":"NACIMIENTO","t":"dt"},{"n":"NOMBRE","t":"vc"},{"n":"OBSERVACIONES","t":"tx"},{"n":"OBSERVACIONES_2","t":"tx"},{"n":"OCUPACION","t":"vc"},{"n":"PAIS","t":"vc"},{"n":"PROVINCIA","t":"vc"},{"n":"SUBTIPO","t":"c"},{"n":"SUCURSAL","t":"vc"},{"n":"TELCASA","t":"vc"},{"n":"TELCELULAR","t":"vc"},{"n":"TELTRABAJO","t":"vc"}]},"CLIENTE_GEO":{"m":"CC","d":"","f":[{"n":"CLIENTE","t":"vc"},{"n":"SALDO_CREDITO","t":"fl"},{"n":"SALDO_DEBITO","t":"fl"},{"n":"SALDO_DOLAR_CREDITO","t":"fl"},{"n":"SALDO_DOLAR_DEBITO","t":"fl"},{"n":"SALDO_LOCAL_CREDITO","t":"fl"},{"n":"SALDO_LOCAL_DEBITO","t":"fl"}]},"CLIENTE_GEO_FINAL":{"m":"CC","d":"","f":[{"n":"CLIENTE","t":"vc"},{"n":"SALDO","t":"fl"},{"n":"SALDO_DOLAR","t":"fl"},{"n":"SALDO_LOCAL","t":"fl"}]},"cliente_limite":{"m":"CC","d":"","f":[{"n":"ACEPTA_BACKORDER","t":"vc"},{"n":"ACEPTA_DOC_EDI","t":"vc"},{"n":"ACEPTA_DOC_ELECTRONICO","t":"vc"},{"n":"ACEPTA_FRACCIONES","t":"vc"},{"n":"ACTIVO","t":"vc"},{"n":"AJUSTE_FECHA_COBRO","t":"vc"},{"n":"ALIAS","t":"vc"},{"n":"APLICAC_ABIERTAS","t":"vc"},{"n":"ASOCOBLIGCONTFACT","t":"vc"},{"n":"CARGO","t":"vc"},{"n":"CATEGORIA_CLIENTE","t":"vc"},{"n":"CLASE_ABC","t":"vc"},{"n":"CLASE_DOCUMENTO","t":"vc"},{"n":"CLI_CORPORAC_ASOC","t":"vc"},{"n":"CLIENTE","t":"vc"},{"n":"COBRADOR","t":"vc"},{"n":"COBRO_JUDICIAL","t":"vc"},{"n":"CODIGO_IMPUESTO","t":"vc"},{"n":"CONDICION_PAGO","t":"vc"},{"n":"CONFIRMA_DOC_ELECTRONICO","t":"vc"},{"n":"CONTACTO","t":"vc"},{"n":"CONTRIBUYENTE","t":"vc"},{"n":"CURP","t":"vc"},{"n":"DESCUENTO","t":"dc"},{"n":"DETALLE_DIRECCION","t":"i"}]},"CLIENTE_OC":{"m":"CC","d":"","f":[{"n":"CLIENTE","t":"vc"},{"n":"NOMBRE","t":"vc"},{"n":"NOMVEN","t":"vc"},{"n":"REQUIERE_OC","t":"vc"},{"n":"VENDEDOR","t":"vc"}]},"CLIENTE_OIC":{"m":"CC","d":"","f":[{"n":"CANTON","t":"vc"},{"n":"CLIENTE","t":"vc"},{"n":"CODIGO_VENDEDOR","t":"vc"},{"n":"CONDICION_PAGO","t":"i"},{"n":"DIRECCION","t":"vc"},{"n":"DISTRITO","t":"vc"},{"n":"PROVINCIA","t":"vc"},{"n":"RAZON_SOCIAL","t":"vc"},{"n":"REPRESENTANTE_VENTAS","t":"vc"},{"n":"SECTOR_DESPACHO","t":"vc"},{"n":"ZONA","t":"vc"}]},"CLIENTE_REACTIVO":{"m":"CC","d":"","f":[{"n":"CLIENTE","t":"vc"},{"n":"CLINOM","t":"vc"},{"n":"DIAS","t":"i"},{"n":"MES_ACTUAL","t":"vc"},{"n":"ULT_3M","t":"vc"},{"n":"ULTIMA_VENTA","t":"dt"},{"n":"VENDEDOR","t":"vc"},{"n":"VENDEDOR_HENKEL","t":"vc"},{"n":"VENNOM","t":"vc"},{"n":"VENNOM_HENKEL","t":"vc"}]},"CLIENTE_SOLICITUD":{"m":"CC","d":"","f":[{"n":"CLIENTE","t":"vc"},{"n":"EMAIL","t":"vc"},{"n":"NOMBRE","t":"vc"},{"n":"TELEFONO1","t":"vc"}]},"clientes_ab":{"m":"CC","d":"","f":[{"n":"campo1","t":"vc"},{"n":"campo2","t":"vc"},{"n":"campo3","t":"vc"},{"n":"campo4","t":"vc"}]},"COMISION":{"m":"FA","d":"","f":[{"n":"ALCANCE_INDIVIDUAL","t":"dc"},{"n":"COMISION_COBRO","t":"dc"},{"n":"COMISION_RENGLONES","t":"dc"},{"n":"DEVOLUCIONES","t":"dc"},{"n":"INGRESO_GARANTIZADO","t":"dc"},{"n":"NOMBRE","t":"vc"},{"n":"TOTAL_COBRADO","t":"dc"},{"n":"TOTAL_VENTAS","t":"dc"},{"n":"VENDEDOR","t":"vc"}]},"COMISION_PENDIENTE":{"m":"FA","d":"","f":[{"n":"ARTICULO","t":"vc"},{"n":"CLIENTE","t":"vc"},{"n":"COMISION","t":"dc"},{"n":"CREDITO","t":"vc"},{"n":"DEBITO","t":"vc"},{"n":"DESCRIPCION","t":"vc"},{"n":"DIAS_COBRO","t":"i"},{"n":"DIAS_FAC","t":"i"},{"n":"DOCUMENTO","t":"vc"},{"n":"FACTURA","t":"vc"},{"n":"FECHA_AUX","t":"dt"},{"n":"FECHA_DOCUMENTO","t":"dt"},{"n":"FECHA_VENCE","t":"dt"},{"n":"MARCA","t":"vc"},{"n":"MARGEN","t":"dc"},{"n":"MONTO","t":"dc"},{"n":"MONTO_CREDITO","t":"dc"},{"n":"MONTO_DEBITO_LINEA","t":"dc"},{"n":"MONTO_DEBITO_SIN_IV","t":"dc"},{"n":"NOMCLI","t":"vc"},{"n":"SALDO","t":"dc"},{"n":"TIPO_CREDITO","t":"vc"},{"n":"TIPO_DEBITO","t":"vc"},{"n":"TOTAL_IMPUESTO1","t":"dc"},{"n":"U_MARGEN","t":"dc"}]},"COMISION_TOTAL":{"m":"FA","d":"","f":[{"n":"ARTICULO","t":"vc"},{"n":"CLIENTE","t":"vc"},{"n":"COMISION","t":"dc"},{"n":"COMISION_FINAL","t":"dc"},{"n":"COMISION_TOTAL","t":"dc"},{"n":"CONDICION_PAGO_CLIENTE","t":"i"},{"n":"CONDICION_PAGO_DOC","t":"i"},{"n":"CREDITO","t":"vc"},{"n":"DEBITO","t":"vc"},{"n":"DESCRIPCION","t":"vc"},{"n":"DIAS","t":"i"},{"n":"DIAS_COBRO","t":"i"},{"n":"DIAS_FAC","t":"i"},{"n":"DOCUMENTO","t":"vc"},{"n":"FACTOR","t":"dc"},{"n":"FACTURA","t":"vc"},{"n":"FECHA_AUX","t":"dt"},{"n":"FECHA_DOCUMENTO","t":"dt"},{"n":"FECHA_RPT","t":"dt"},{"n":"FECHA_VENCE","t":"dt"},{"n":"HENKEL","t":"dc"},{"n":"MARCA","t":"vc"},{"n":"MARGEN","t":"dc"},{"n":"MONTO","t":"dc"},{"n":"MONTO_CREDITO","t":"dc"}]},"COMISION_V3_ABRIL20_BACK":{"m":"FA","d":"","f":[{"n":"ANO","t":"i"},{"n":"AVALUO","t":"dc"},{"n":"CCSS","t":"dc"},{"n":"CEDULA","t":"vc"},{"n":"COMENTARIOS","t":"vc"},{"n":"COMISION_AVALUO","t":"dc"},{"n":"COMISION_SKU","t":"dc"},{"n":"COMISION_TOTAL","t":"dc"},{"n":"COMISION_VTA","t":"dc"},{"n":"DIF_AVALUO","t":"dc"},{"n":"EMPLEADO","t":"vc"},{"n":"FECHA_EXEC","t":"dt"},{"n":"FECHA_RPT","t":"dt"},{"n":"MES","t":"i"},{"n":"POR_AVALUO","t":"dc"},{"n":"POR_SKU","t":"dc"},{"n":"POR_VTA","t":"dc"},{"n":"PORC_GERENCIA_VTAS","t":"dc"},{"n":"PORC_SKU","t":"dc"},{"n":"PORC_VTA","t":"dc"},{"n":"PPTO_AVALUO","t":"dc"},{"n":"PPTO_SKU","t":"i"},{"n":"PRESUPUESTO_VTA","t":"dc"},{"n":"SALARIO","t":"dc"},{"n":"SKU","t":"i"}]},"COMISION_ZERO":{"m":"FA","d":"","f":[{"n":"ARTICULO","t":"vc"},{"n":"CLIENTE","t":"vc"},{"n":"COMISION","t":"dc"},{"n":"CREDITO","t":"vc"},{"n":"DEBITO","t":"vc"},{"n":"DESCRIPCION","t":"vc"},{"n":"DIAS_COBRO","t":"i"},{"n":"DIAS_FAC","t":"i"},{"n":"DOCUMENTO","t":"vc"},{"n":"FACTURA","t":"vc"},{"n":"FECHA_AUX","t":"dt"},{"n":"FECHA_DOCUMENTO","t":"dt"},{"n":"FECHA_VENCE","t":"dt"},{"n":"MARCA","t":"vc"},{"n":"MARGEN","t":"dc"},{"n":"MONTO","t":"dc"},{"n":"MONTO_CREDITO","t":"dc"},{"n":"MONTO_DEBITO_LINEA","t":"dc"},{"n":"MONTO_DEBITO_SIN_IV","t":"dc"},{"n":"NOMCLI","t":"vc"},{"n":"SALDO","t":"dc"},{"n":"TIPO_CREDITO","t":"vc"},{"n":"TIPO_DEBITO","t":"vc"},{"n":"TOTAL_IMPUESTO1","t":"dc"},{"n":"U_MARGEN","t":"dc"}]},"COMPANIAS_REP_X_VENDEDORES":{"m":"FA","d":"","f":[{"n":"ID_COMPANIA","t":"i"},{"n":"VENDEDOR","t":"vc"}]},"CONSOLIDADO_COMISIONESSET":{"m":"FA","d":"","f":[{"n":"ARTICULO","t":"vc"},{"n":"CLASIFICACION_3","t":"vc"},{"n":"CLIENTE","t":"vc"},{"n":"DIAS_VENCIDO","t":"i"},{"n":"DOCUMENTO","t":"vc"},{"n":"MARGEN","t":"dc"},{"n":"MARGEN_MAXIMO","t":"dc"},{"n":"MARGEN_MINIMO","t":"dc"},{"n":"MONTO","t":"dc"},{"n":"NOMBRE_CLIENTE","t":"vc"},{"n":"NOMBRE_VENDEDOR","t":"vc"},{"n":"TIPO","t":"vc"},{"n":"TIPO_PRODUCTO","t":"vc"},{"n":"TIPO_RECUPERACION","t":"vc"},{"n":"VENCIDO","t":"vc"},{"n":"VENDEDOR","t":"vc"}]},"CONTROL_FACTURA":{"m":"FA","d":"","f":[{"n":"CLIENTE","t":"vc"},{"n":"CLINOM","t":"vc"},{"n":"COBRADOR","t":"vc"},{"n":"COBRANOM","t":"vc"},{"n":"DIA_TRAMITE","t":"vc"},{"n":"FACTURA","t":"vc"},{"n":"FECHA_HORA","t":"dt"},{"n":"MULTIPLICADOR_EV","t":"si"},{"n":"TOTAL_FACTURA","t":"dc"},{"n":"VENDEDOR","t":"vc"},{"n":"VENNOM","t":"vc"}]},"CXC_SEGUIMIENTO_PRESUPUESTO":{"m":"CN","d":"","f":[{"n":"CAMBIO_PLAZO","t":"dc"},{"n":"CATCLI","t":"vc"},{"n":"CENTRALIZACION","t":"dc"},{"n":"CLICOD","t":"vc"},{"n":"CLINOM","t":"vc"},{"n":"COBRACOD","t":"vc"},{"n":"COBRANOM","t":"vc"},{"n":"CURCOD","t":"vc"},{"n":"DESC_COMPRAS","t":"dc"},{"n":"DEVOLUCIONES","t":"dc"},{"n":"DIASAN","t":"i"},{"n":"DIFERENCIA_PRECIO","t":"dc"},{"n":"FCORTE","t":"dt"},{"n":"FECACT","t":"vc"},{"n":"FECVEN","t":"vc"},{"n":"MONTO","t":"dc"},{"n":"NUMDOC","t":"vc"},{"n":"PERIODO1","t":"i"},{"n":"PERIODO2","t":"i"},{"n":"PERIODO3","t":"i"},{"n":"PERIODO4","t":"i"},{"n":"PERIODO5","t":"i"},{"n":"PERIODO6","t":"i"},{"n":"PERIODO7","t":"i"},{"n":"PGPAN1","t":"dc"}]},"DEPOSITOS_FR":{"m":"CB","d":"","f":[{"n":"CTA_BCO","t":"vc"},{"n":"FEC_DEP","t":"dt"},{"n":"MON_CHE","t":"dc"},{"n":"MON_EFE","t":"dc"},{"n":"NOM_CTA","t":"vc"},{"n":"NOMBRE","t":"vc"},{"n":"NUM_DEP","t":"dc"},{"n":"REF","t":"vc"},{"n":"VENDEDOR","t":"vc"}]},"DESCUENTO_CLIENTE":{"m":"CC","d":"","f":[{"n":"CLASIFICACION","t":"vc"},{"n":"CLIENTE","t":"vc"},{"n":"NOMBRE","t":"vc"},{"n":"PORC_DESCUENTO","t":"dc"}]},"DO_ARTICULO":{"m":"CI","d":"","f":[{"n":"CATEGORÍA_DEL_PRODUCTO","t":"vc"},{"n":"CODIGO_ARANCELARIO","t":"vc"},{"n":"CODIGO_BARRA_EXTERNO","t":"vc"},{"n":"CODIGO_BARRA_INTERNO","t":"vc"},{"n":"CODIGO_PROVEEDOR","t":"vc"},{"n":"COLOR","t":"vc"},{"n":"CORRELATIVO","t":"vc"},{"n":"DESCRIPCION","t":"vc"},{"n":"EMP_COMER_CANTIDAD","t":"i"},{"n":"EMP_COMER_CODIGO_EDI","t":"vc"},{"n":"EMP_INVT_CANTIDAD","t":"i"},{"n":"EMP_INVT_CODIGO_EDI","t":"vc"},{"n":"GRUPO","t":"vc"},{"n":"MARCA_COMERCIAL","t":"vc"},{"n":"MEDIDA_ALTO","t":"vc"},{"n":"MEDIDA_CODIGO_EDI","t":"vc"},{"n":"MEDIDA_LARGO","t":"vc"},{"n":"MEDIDA_PROFUNDIDAD","t":"vc"},{"n":"MONEDA","t":"vc"},{"n":"MULTIPLO_DE_COMPRA","t":"vc"},{"n":"NOMBRE","t":"vc"},{"n":"ORIGEN","t":"vc"},{"n":"PARTIDA","t":"vc"},{"n":"PESO","t":"i"},{"n":"PROVEEDOR","t":"vc"}]},"DO_ARTICULO_WMS":{"m":"CI","d":"","f":[{"n":"ARTICULO","t":"vc"},{"n":"CODIGO_BARRA_EXTERNO","t":"vc"},{"n":"CODIGO_BARRA_INTERNO","t":"vc"},{"n":"CUERPO","t":"vc"},{"n":"DESCRIPCION","t":"vc"},{"n":"PASILLO","t":"vc"},{"n":"U_COD_AFV","t":"vc"},{"n":"UBIC_ALMANCEN_ENTREPANO","t":"vc"}]},"DO_CLIENTE":{"m":"CC","d":"","f":[{"n":"CED_REP_LEGAL","t":"vc"},{"n":"CIU","t":"vc"},{"n":"CIUDAD","t":"vc"},{"n":"CIUDAD_DESP_PRINC","t":"vc"},{"n":"CIUDAD_DESP_SUC","t":"vc"},{"n":"CODIGO_CLIENTE","t":"vc"},{"n":"CODIGO_POSTAL","t":"vc"},{"n":"CODIGO_POSTAL_SUC","t":"vc"},{"n":"CONDICION_PAGO","t":"vc"},{"n":"CONTRIBUYENTE","t":"vc"},{"n":"DEPARTAMENTO","t":"vc"},{"n":"DEPTO_DESP_PRINC","t":"vc"},{"n":"DEPTO_DESP_SUC","t":"vc"},{"n":"DIR_DESP_PRINC","t":"vc"},{"n":"DIR_DESP_SUC","t":"vc"},{"n":"DIRECCION","t":"vc"},{"n":"E_MAIL","t":"vc"},{"n":"FCHA_REG","t":"vc"},{"n":"FECHA_VENCE_NIT","t":"vc"},{"n":"LIMITE_CREDITO","t":"dc"},{"n":"NOMBRE_ESTABLECIMIENTO","t":"vc"},{"n":"PAIS","t":"vc"},{"n":"PAIS_DIR_DESP_PRINC","t":"vc"},{"n":"PAIS_DIR_DESP_SUC","t":"vc"},{"n":"PREFIJO_TEL1","t":"i"}]},"DO_PROVEEDOR":{"m":"CP","d":"","f":[{"n":"CODIGO_AREA","t":"vc"},{"n":"CODIGO_AREA2","t":"vc"},{"n":"CODIGO_CONTABLE","t":"vc"},{"n":"CODIGO_PAIS","t":"vc"},{"n":"CODIGO_PAIS2","t":"vc"},{"n":"CODIGO_POSTAL","t":"vc"},{"n":"CODIGO_PROVEEDOR","t":"vc"},{"n":"CONDICION_PAGO_OC","t":"vc"},{"n":"CONTACTO","t":"vc"},{"n":"CUIDAD","t":"vc"},{"n":"DEPARTAMENTO","t":"vc"},{"n":"DIRECCION","t":"vc"},{"n":"ES_AUTORETENEDOR","t":"vc"},{"n":"GRUPO_PROVEEDOR","t":"vc"},{"n":"LIMITE_CREDITO","t":"vc"},{"n":"MUNICIPIO","t":"vc"},{"n":"NIT","t":"vc"},{"n":"NOMBRE","t":"vc"},{"n":"PAIS","t":"vc"},{"n":"POLITICA_DEVOLUCION","t":"vc"},{"n":"RAZON_SOCIAL","t":"vc"},{"n":"TELEFONO1","t":"vc"},{"n":"TELEFONO2","t":"vc"},{"n":"TIEMPO_DESPACHO","t":"vc"},{"n":"TIPO_CONTRIBUYENTE","t":"vc"}]},"DOCUMENTO_INV_COFERSA":{"m":"CI","d":"","f":[{"n":"APROBADO","t":"vc"},{"n":"CONSECUTIVO","t":"vc"},{"n":"DOCUMENTO_INV","t":"vc"},{"n":"FECHA_DOCUMENTO","t":"dt"},{"n":"FECHA_HOR_CREACION","t":"dt"},{"n":"FECHA_HORA_APROB","t":"dt"},{"n":"MENSAJE_SISTEMA","t":"tx"},{"n":"PAQUETE_INVENTARIO","t":"vc"},{"n":"REFERENCIA","t":"vc"},{"n":"SELECCIONADO","t":"vc"},{"n":"USUARIO","t":"vc"},{"n":"USUARIO_APRO","t":"vc"}]},"EMBARQUE_ESTATUS":{"m":"CO","d":"","f":[{"n":"AGENTE_ADUANA","t":"vc"},{"n":"AGENTE_CARGA","t":"vc"},{"n":"ARANCEL_LOCAL","t":"dc"},{"n":"COSTO_AGENCIA_ADUANA_LOCAL","t":"dc"},{"n":"COSTO_FLETE_INTERNO_LOCAL","t":"dc"},{"n":"COSTO_MERCANCIA_LOCAL","t":"dc"},{"n":"DUA","t":"vc"},{"n":"EMBARQUE","t":"vc"},{"n":"FACTOR_IMPORTACION","t":"dc"},{"n":"FACTURA","t":"vc"},{"n":"FCH_LLEGADA_EMBARQUE","t":"dt"},{"n":"FCH_SALIDA_EMBARQUE","t":"dt"},{"n":"FCL_LCL","t":"vc"},{"n":"FECHA_INGRESO","t":"dt"},{"n":"LIQUIDAC_COMPRA","t":"vc"},{"n":"ORIGEN","t":"vc"},{"n":"OTRO_LOCAL","t":"dc"},{"n":"PROVEEDOR","t":"vc"},{"n":"SEGURO_LOCAL","t":"dc"},{"n":"TIPO_CAMBIO","t":"dc"},{"n":"TOTAL_NACIONALIZADO_LOCAL","t":"dc"},{"n":"VALOR_MERCANCIA_DOLAR","t":"dc"}]},"EMBARQUE_LINEA_RESP":{"m":"CO","d":"","f":[{"n":"ARTICULO","t":"vc"},{"n":"BODEGA","t":"vc"},{"n":"CAMBIO_PRESUP","t":"vc"},{"n":"CANT_DEVUELTAUA","t":"dc"},{"n":"CANT_RECHAZADA_UA","t":"dc"},{"n":"CANT_RECIBIDA_UA","t":"dc"},{"n":"CANTIDAD_DEVUELTA","t":"dc"},{"n":"CANTIDAD_EMBARCADA","t":"dc"},{"n":"CANTIDAD_RECHAZADA","t":"dc"},{"n":"CANTIDAD_RECIBIDA","t":"dc"},{"n":"CENTRO_COSTO","t":"vc"},{"n":"CODIGO_ARANCEL","t":"vc"},{"n":"COST_UN_ESTI_DOLAR","t":"dc"},{"n":"COST_UN_ESTI_LOCAL","t":"dc"},{"n":"COST_UN_FISC_DOLAR","t":"dc"},{"n":"COST_UN_FISC_LOCAL","t":"dc"},{"n":"COST_UN_REAL_DOLAR","t":"dc"},{"n":"COST_UN_REAL_LOCAL","t":"dc"},{"n":"CUENTA_CONTABLE","t":"vc"},{"n":"DESCUENTO","t":"dc"},{"n":"EMBARQUE","t":"vc"},{"n":"EMBARQUE_LINEA","t":"si"},{"n":"EXISTENCIA_TOT_ING","t":"dc"},{"n":"IMP1_AFECTACOSTO","t":"vc"},{"n":"IMP2_AFECTACOSTO","t":"vc"}]},"EMBARQUE_ORDEN_COMPRA":{"m":"CO","d":"","f":[{"n":"EMBARQUE","t":"vc"},{"n":"ORDEN_COMPRA","t":"vc"}]},"EMBARQUE_RECIBIDO_NOLIQUIDADO_ESTEBAN":{"m":"CO","d":"","f":[{"n":"APLICACION","t":"vc"},{"n":"ASIENTO","t":"vc"},{"n":"EMBARQUE","t":"vc"},{"n":"ESTADO","t":"vc"},{"n":"FACTURA","t":"vc"},{"n":"FECHA_EMBARQUE","t":"dt"},{"n":"LIQUIDADO","t":"vc"},{"n":"USUARIO_CREADO","t":"vc"}]},"EMPLEADO_CONC_NOMI_back":{"m":"CN","d":"","f":[{"n":"CANTIDAD","t":"dc"},{"n":"CENTRO_COSTO","t":"vc"},{"n":"CONCEPTO","t":"vc"},{"n":"CONSECUTIVO","t":"i"},{"n":"EMPLEADO","t":"vc"},{"n":"FASE","t":"vc"},{"n":"FECHA_MODIFICACION","t":"dt"},{"n":"FORMA_APLICACION","t":"vc"},{"n":"MONTO","t":"dc"},{"n":"NOMINA","t":"vc"},{"n":"NUMERO_LIQUIDAC","t":"si"},{"n":"NUMERO_NOMINA","t":"si"},{"n":"PROYECTO","t":"vc"},{"n":"TOTAL","t":"dc"},{"n":"USUARIO","t":"vc"}]},"EMPLEADO_X_VARIABLE":{"m":"CN","d":"","f":[{"n":"EMPLEADO","t":"vc"},{"n":"FIJA","t":"vc"},{"n":"JEFE","t":"vc"},{"n":"MONTO_VARIABLE","t":"dc"},{"n":"PERFIL_VARIABLE","t":"vc"},{"n":"PERIOCIDAD","t":"vc"},{"n":"PERIODO","t":"vc"}]},"esquema_comision":{"m":"FA","d":"","f":[{"n":"AGENTE","t":"vc"},{"n":"ESQUEMA","t":"i"}]},"ETIQUETAS_PRECIO_HHG_EMBARQUE":{"m":"CO","d":"","f":[{"n":"@labelcpy","t":"vc"},{"n":"ARTICULO","t":"vc"},{"n":"ARTICULO_CUENTA","t":"vc"},{"n":"CODIGO_BARRAS_VENT","t":"vc"},{"n":"DESCRIPCION","t":"vc"},{"n":"EMBARQUE","t":"vc"},{"n":"PRECIO","t":"fl"}]},"ETIQUETAS_PRECIO_MAR_EMBARQUE":{"m":"CO","d":"","f":[{"n":"@labelcpy","t":"vc"},{"n":"ARTICULO","t":"vc"},{"n":"ARTICULO_CUENTA","t":"vc"},{"n":"CODIGO_BARRAS_VENT","t":"vc"},{"n":"DESCRIPCION","t":"vc"},{"n":"EMBARQUE","t":"vc"},{"n":"PRECIO","t":"fl"}]},"ETIQUETAS_PRECIO_MAR_EMBARQUE_P":{"m":"CO","d":"","f":[{"n":"@labelcpy","t":"vc"},{"n":"ARTICULO","t":"vc"},{"n":"BARRAS","t":"vc"},{"n":"CUENTA","t":"vc"},{"n":"DESCRIPCION","t":"vc"},{"n":"EMBARQUE","t":"vc"},{"n":"PRECIO","t":"fl"}]},"EXIST_BODEGA_GEO_MAR":{"m":"CI","d":"","f":[{"n":"ARTICULO","t":"vc"},{"n":"BODEGA","t":"vc"},{"n":"CANT_DISPONIBLE","t":"dc"}]},"EXISTENCIA_LOTE_ANTHONy":{"m":"CI","d":"","f":[{"n":"ARTICULO","t":"vc"},{"n":"BODEGA","t":"vc"},{"n":"CANT_DISPONIBLE","t":"dc"},{"n":"CANT_NO_APROBADA","t":"dc"},{"n":"CANT_REMITIDA","t":"dc"},{"n":"CANT_RESERVADA","t":"dc"},{"n":"CANT_VENCIDA","t":"dc"},{"n":"COSTO_UNT_ESTANDAR_DOL","t":"dc"},{"n":"COSTO_UNT_ESTANDAR_LOC","t":"dc"},{"n":"COSTO_UNT_PROMEDIO_DOL","t":"dc"},{"n":"COSTO_UNT_PROMEDIO_LOC","t":"dc"},{"n":"LOCALIZACION","t":"vc"},{"n":"LOTE","t":"vc"}]},"EXISTENCIAS_EPRA_EXACTUS":{"m":"CI","d":"","f":[{"n":"ARTICULO","t":"vc"},{"n":"BACKORDER","t":"dc"},{"n":"CANT_TRANSITO","t":"dc"},{"n":"CANT_VTAS","t":"dc"},{"n":"CLASIFICACION_1","t":"vc"},{"n":"CLASIFICACION_3","t":"vc"},{"n":"DESCRIPCION","t":"vc"},{"n":"DESGRUPO","t":"vc"},{"n":"DESMARCA","t":"vc"},{"n":"EXISTENCIA_EPRAC","t":"dc"},{"n":"EXISTENCIA_EXACTUS","t":"dc"}]},"EXISTENCIAS_EPRAC_EXACTUS":{"m":"CI","d":"","f":[{"n":"ARTICULO","t":"vc"},{"n":"BACKORDER","t":"dc"},{"n":"CANT_TRANSITO","t":"dc"},{"n":"CANT_VTAS","t":"dc"},{"n":"CLASIFICACION_1","t":"vc"},{"n":"CLASIFICACION_3","t":"vc"},{"n":"DESCRIPCION","t":"vc"},{"n":"DESGRUPO","t":"vc"},{"n":"DESMARCA","t":"vc"},{"n":"EXISTENCIA_EPRAC","t":"dc"},{"n":"EXISTENCIA_EXACTUS","t":"dc"},{"n":"PRECIO","t":"dc"}]},"F06_ARTICULOS":{"m":"CI","d":"","f":[{"n":"BarCo1","t":"vc"},{"n":"BarCo2","t":"vc"},{"n":"BarCo3","t":"vc"},{"n":"CodCol","t":"i"},{"n":"CodDep","t":"vc"},{"n":"CodFam","t":"vc"},{"n":"CodLin","t":"vc"},{"n":"CodMar","t":"vc"},{"n":"CodPro","t":"vc"},{"n":"CodSec","t":"vc"},{"n":"CodSuf","t":"vc"},{"n":"CodTalla","t":"vc"},{"n":"Comentarios","t":"vc"},{"n":"CosteMedio","t":"fl"},{"n":"CosteStock","t":"fl"},{"n":"DesAdi","t":"vc"},{"n":"DesArt","t":"vc"},{"n":"DesCol","t":"vc"},{"n":"DesDep","t":"vc"},{"n":"DesFam","t":"vc"},{"n":"DesLin","t":"vc"},{"n":"DesMar","t":"vc"},{"n":"DesPro","t":"vc"},{"n":"DesSec","t":"vc"},{"n":"DesSuf","t":"vc"}]},"FACTURAS_PEDNDIENTE_CP_COFERSA":{"m":"FA","d":"","f":[{"n":"DOCUMENTO","t":"vc"},{"n":"FECHA_DOCUMENTO","t":"dt"},{"n":"IMPUESTO1","t":"dc"},{"n":"MONTO","t":"dc"},{"n":"NOMBRE","t":"vc"},{"n":"PROVEEDOR","t":"vc"},{"n":"SUBTOTAL","t":"dc"}]},"FACTURAS_PENDIENTE_CP_COFERSA":{"m":"FA","d":"","f":[{"n":"DOCUMENTO","t":"vc"},{"n":"FECHA_DOCUMENTO","t":"dt"},{"n":"IMPUESTO1","t":"dc"},{"n":"MONTO","t":"dc"},{"n":"NOMBRE","t":"vc"},{"n":"PROVEEDOR","t":"vc"},{"n":"SUBTOTAL","t":"dc"}]},"FRECUENCIA_CLIENTE":{"m":"CC","d":"","f":[{"n":"CLIENTE","t":"vc"},{"n":"DIA","t":"vc"},{"n":"FRECUENCIA","t":"vc"},{"n":"VENDEDOR","t":"vc"}]},"HHG_REORDEN":{"m":"CI","d":"","f":[{"n":"CODIGO_BARRAS_VENT","t":"vc"},{"n":"MAXIMO","t":"fl"},{"n":"REORDEN","t":"fl"}]},"HISTORICO_EXISTENCIA_ACTIVOS":{"m":"CI","d":"","f":[{"n":"ANO","t":"i"},{"n":"ARTICULO","t":"vc"},{"n":"CANT_DISPONIBLE","t":"dc"},{"n":"CANT_TRANSITO","t":"dc"},{"n":"DESCRIPCION","t":"vc"},{"n":"DIA","t":"i"},{"n":"MES","t":"i"}]},"IMPORTANCION_PRESUPUESTO_VENTAS":{"m":"CN","d":"","f":[{"n":"PRESUPUESTO_VENTAS","t":"nm"},{"n":"VENDEDOR","t":"vc"}]},"INFO_CLIENTE_CLA5_ANO_MES_ANTERIOR":{"m":"CC","d":"","f":[{"n":"ANO","t":"vc"},{"n":"CLASIFICACION_ARTICULO","t":"vc"},{"n":"INVENTARIO","t":"dc"},{"n":"INVENTARIO_TOTAL","t":"dc"},{"n":"MARGEN_LOCAL","t":"dc"},{"n":"MARGEN_TOTAL_LOCAL","t":"dc"},{"n":"MES","t":"vc"},{"n":"VENTA_LOCAL","t":"dc"},{"n":"VENTA_TOTAL_LOCAL","t":"dc"}]},"INFO_CLIENTE_CLA5_DOLAR":{"m":"CC","d":"","f":[{"n":"ANO","t":"vc"},{"n":"CLASIFICACION_ARTICULO","t":"vc"},{"n":"INVENTARIO","t":"dc"},{"n":"INVENTARIO_TOTAL","t":"dc"},{"n":"MARGEN_LOCAL","t":"dc"},{"n":"MARGEN_TOTAL_LOCAL","t":"dc"},{"n":"MES","t":"vc"},{"n":"VENTA_LOCAL","t":"dc"},{"n":"VENTA_TOTAL_LOCAL","t":"dc"}]},"INFO_CLIENTES":{"m":"CC","d":"","f":[{"n":"ACTIVACION","t":"dc"},{"n":"ACTIVACION_TOTAL","t":"i"},{"n":"ANO","t":"vc"},{"n":"CLASIFICACION_CLIENTE","t":"vc"},{"n":"MARGEN_LOCAL","t":"dc"},{"n":"MARGEN_TOTAL_LOCAL","t":"dc"},{"n":"MES","t":"vc"},{"n":"VENTA_LOCAL","t":"dc"},{"n":"VENTA_TOTAL_LOCAL","t":"dc"}]},"INFO_CLIENTES_ANO_ANTERIOR":{"m":"CC","d":"","f":[{"n":"ACTIVACION","t":"dc"},{"n":"ACTIVACION_TOTAL","t":"i"},{"n":"ANO","t":"vc"},{"n":"CLASIFICACION_CLIENTE","t":"vc"},{"n":"MARGEN_LOCAL","t":"dc"},{"n":"MARGEN_TOTAL_LOCAL","t":"dc"},{"n":"MES","t":"vc"},{"n":"VENTA_LOCAL","t":"dc"},{"n":"VENTA_TOTAL_LOCAL","t":"dc"}]},"INFO_CLIENTES_CONSOLIDA":{"m":"CC","d":"","f":[{"n":"ACTIVACION","t":"dc"},{"n":"ACTIVACION_TOTAL","t":"i"},{"n":"ANO","t":"vc"},{"n":"CLASIFICACION_CLIENTE","t":"vc"},{"n":"MARGEN_LOCAL","t":"dc"},{"n":"MARGEN_TOTAL_LOCAL","t":"dc"},{"n":"MES","t":"vc"},{"n":"VENTA_LOCAL","t":"dc"},{"n":"VENTA_TOTAL_LOCAL","t":"dc"}]},"INFO_CLIENTES_DOLAR":{"m":"CC","d":"","f":[{"n":"ACTIVACION","t":"dc"},{"n":"ACTIVACION_TOTAL","t":"i"},{"n":"ANO","t":"vc"},{"n":"CLASIFICACION_CLIENTE","t":"vc"},{"n":"MARGEN_LOCAL","t":"dc"},{"n":"MARGEN_TOTAL_LOCAL","t":"dc"},{"n":"MES","t":"vc"},{"n":"VENTA_LOCAL","t":"dc"},{"n":"VENTA_TOTAL_LOCAL","t":"dc"}]},"INFO_CLIENTES_MARCA":{"m":"CC","d":"","f":[{"n":"ANO","t":"vc"},{"n":"CLASIFICACION_ARTICULO","t":"vc"},{"n":"INVENTARIO","t":"dc"},{"n":"INVENTARIO_TOTAL","t":"dc"},{"n":"MARGEN_LOCAL","t":"dc"},{"n":"MARGEN_TOTAL_LOCAL","t":"dc"},{"n":"MES","t":"vc"},{"n":"VENTA_LOCAL","t":"dc"},{"n":"VENTA_TOTAL_LOCAL","t":"dc"}]},"INFO_CLIENTES_MARCA_ANO_MES_ANTERIOR":{"m":"CC","d":"","f":[{"n":"ANO","t":"vc"},{"n":"CLASIFICACION_ARTICULO","t":"vc"},{"n":"INVENTARIO","t":"dc"},{"n":"INVENTARIO_TOTAL","t":"dc"},{"n":"MARGEN_LOCAL","t":"dc"},{"n":"MARGEN_TOTAL_LOCAL","t":"dc"},{"n":"MES","t":"vc"},{"n":"VENTA_LOCAL","t":"dc"},{"n":"VENTA_TOTAL_LOCAL","t":"dc"}]},"INFO_CLIENTES_MARCA_DOLAR":{"m":"CC","d":"","f":[{"n":"ANO","t":"vc"},{"n":"CLASIFICACION_ARTICULO","t":"vc"},{"n":"INVENTARIO","t":"dc"},{"n":"INVENTARIO_TOTAL","t":"dc"},{"n":"MARGEN_LOCAL","t":"dc"},{"n":"MARGEN_TOTAL_LOCAL","t":"dc"},{"n":"MES","t":"vc"},{"n":"VENTA_LOCAL","t":"dc"},{"n":"VENTA_TOTAL_LOCAL","t":"dc"}]},"INFO_COMERCIAL_VENDEDOR":{"m":"FA","d":"","f":[{"n":"NOMBRE","t":"vc"},{"n":"VENDEDOR","t":"vc"},{"n":"VTAS","t":"dc"}]},"INFO_COMERCIAL_VENDEDOR_DOLAR":{"m":"FA","d":"","f":[{"n":"NOMBRE","t":"vc"},{"n":"VENDEDOR","t":"vc"},{"n":"VTAS","t":"dc"}]},"INFO_COMERCIAL_VENDEDOR_MES_ANTERIOR":{"m":"FA","d":"","f":[{"n":"NOMBRE","t":"vc"},{"n":"VENDEDOR","t":"vc"},{"n":"VTAS","t":"dc"}]},"INFO_EMBARQUE_LINEA":{"m":"CO","d":"","f":[{"n":"ARTICULO","t":"vc"},{"n":"CANT_DIF_OC_EM","t":"dc"},{"n":"CANTIDAD_EMBARCADA","t":"dc"},{"n":"CANTIDAD_ORDENADA_OC","t":"dc"},{"n":"CANTIDAD_RECIBIDA_EMBARQUE","t":"dc"},{"n":"CANTIDAD_RECIBIDA_OC","t":"dc"},{"n":"CONDICION_PAGO","t":"vc"},{"n":"DIAS","t":"dc"},{"n":"EMBARQUE","t":"vc"},{"n":"FECHA_EMBARQUE","t":"dt"},{"n":"FECHA_HORA_OC","t":"dt"},{"n":"ORDEN_COMPRA","t":"vc"},{"n":"PAIS","t":"vc"},{"n":"PRONOM","t":"vc"},{"n":"PROVEEDOR","t":"vc"}]},"INFO_EMPLEADO_COFERSA":{"m":"CN","d":"","f":[{"n":"CLASE_SEGURO","t":"vc"},{"n":"COD_CLASE_SEGURO","t":"vc"},{"n":"COD_DIVISION_GEOGRAFICA_1","t":"vc"},{"n":"COD_DIVISION_GEOGRAFICA_2","t":"vc"},{"n":"COD_HORARIO","t":"vc"},{"n":"COD_PAIS","t":"vc"},{"n":"COD_REGIMEN_VACACIONAL","t":"vc"},{"n":"DIRECCION_HABITACION","t":"vc"},{"n":"DIRECCION_POSTAL","t":"vc"},{"n":"DIVISION_GEOGRAFICA_1","t":"vc"},{"n":"DIVISION_GEOGRAFICA_2","t":"vc"},{"n":"EMAIL","t":"vc"},{"n":"EMPLEADO","t":"vc"},{"n":"HORARIO","t":"vc"},{"n":"NOMBRE","t":"vc"},{"n":"PAIS","t":"vc"},{"n":"REGIMEN_VACACIONAL","t":"vc"},{"n":"SUPERVISOR","t":"vc"},{"n":"TELEFONO_1","t":"vc"},{"n":"TELEFONO_2","t":"vc"}]},"LINEA_DOC_INV_COFERSA":{"m":"CI","d":"","f":[{"n":"AJUSTE_CONFIG","t":"vc"},{"n":"ARTICULO","t":"vc"},{"n":"BODEGA","t":"vc"},{"n":"BODEGA_DESTINO","t":"vc"},{"n":"CANTIDAD","t":"dc"},{"n":"CENTRO_COSTO","t":"vc"},{"n":"COSTO_TOTAL_DOLAR","t":"dc"},{"n":"COSTO_TOTAL_LOCAL","t":"dc"},{"n":"CUENTA_CONTABLE","t":"vc"},{"n":"DOCUMENTO_INV","t":"vc"},{"n":"LINEA_DOC_INV","t":"i"},{"n":"LOCALIZACION","t":"vc"},{"n":"LOCALIZACION_DEST","t":"vc"},{"n":"LOTE","t":"vc"},{"n":"NIT","t":"vc"},{"n":"PAQUETE_INVENTARIO","t":"vc"},{"n":"PRECIO_TOTAL_DOLAR","t":"dc"},{"n":"PRECIO_TOTAL_LOCAL","t":"dc"},{"n":"SECUENCIA","t":"dt"},{"n":"SERIE_CADENA","t":"i"},{"n":"SUBSUBTIPO","t":"vc"},{"n":"SUBTIPO","t":"vc"},{"n":"TIPO","t":"vc"},{"n":"UNIDAD_DISTRIBUCIO","t":"vc"}]},"LIQUIDACION_ARTICULOS_DCOFERSA":{"m":"CI","d":"","f":[{"n":"ARTICULO","t":"vc"},{"n":"BODEGA","t":"vc"},{"n":"CANT_DISPONIBLE","t":"dc"},{"n":"CANT_RESERVADA","t":"dc"},{"n":"CLASE_ABC","t":"vc"},{"n":"COSTO_PROM_LOC","t":"dc"},{"n":"DESCRIPCION","t":"vc"},{"n":"DIAS","t":"i"},{"n":"FECHA_INFO","t":"dt"}]},"LIQUIDACION_VENTAS_COFERSA":{"m":"CN","d":"","f":[{"n":"ARTICULO","t":"vc"},{"n":"BODEGA","t":"vc"},{"n":"CANTIDAD","t":"fl"},{"n":"CLASE_ABC","t":"vc"},{"n":"COSTO_ACTUAL","t":"fl"},{"n":"COSTO_TOTAL","t":"fl"},{"n":"DESCRIPCION","t":"vc"},{"n":"FECHA_INFO","t":"dt"},{"n":"MARGEN_ACTUAL","t":"fl"},{"n":"NOMBRE","t":"vc"},{"n":"PRECIO_ACTUAL","t":"fl"},{"n":"PRECIO_TOTAL","t":"fl"},{"n":"VENDEDOR","t":"vc"}]},"MARCA_COMISION":{"m":"FA","d":"","f":[{"n":"COMISION","t":"i"},{"n":"MARCA","t":"vc"}]},"MOV_BANCOS_COFERSA":{"m":"CB","d":"","f":[{"n":"ANULADO","t":"vc"},{"n":"ASIENTO","t":"vc"},{"n":"CONTRIBUYENTE","t":"vc"},{"n":"CUENTA_BANCO","t":"vc"},{"n":"DETALLE","t":"tx"},{"n":"ESTADO","t":"vc"},{"n":"FCH_HORA_CREACION","t":"dt"},{"n":"FECHA","t":"dt"},{"n":"MONTO","t":"dc"},{"n":"MONTO_ANULADO","t":"dc"},{"n":"NUMERO","t":"dc"},{"n":"ORIGEN","t":"vc"},{"n":"PAGADERO_A","t":"vc"},{"n":"PAQUETE","t":"vc"},{"n":"PROVEEDOR","t":"vc"},{"n":"REFERENCIA","t":"vc"},{"n":"TIPO_ASIENTO","t":"vc"},{"n":"TIPO_CAMBIO_DOLAR","t":"dc"},{"n":"TIPO_DOCUMENTO","t":"vc"}]},"MOV_BANCOS_otros":{"m":"CB","d":"","f":[{"n":"ACLARADA_DIF","t":"vc"},{"n":"ANULADO","t":"vc"},{"n":"APROBADO","t":"vc"},{"n":"ASIENTO","t":"vc"},{"n":"CLASE_DIF","t":"vc"},{"n":"CLASE_DOCUMENTO","t":"vc"},{"n":"CONCIL_ACLARACION","t":"i"},{"n":"CONCILIACION","t":"i"},{"n":"CONFIRMADO","t":"vc"},{"n":"CONTRIBUYENTE","t":"vc"},{"n":"CUENTA_BANCO","t":"vc"},{"n":"DEPENDIENTE_GP","t":"vc"},{"n":"DETALLE","t":"tx"},{"n":"DOC_AJUSTE","t":"i"},{"n":"DOC_REPORTADO","t":"i"},{"n":"DOCUMENTO_FISCAL","t":"vc"},{"n":"ESTADO","t":"vc"},{"n":"FCH_HORA_ANULADO","t":"dt"},{"n":"FCH_HORA_CREACION","t":"dt"},{"n":"FCH_HORA_MODIFIC","t":"dt"},{"n":"FECHA","t":"dt"},{"n":"FECHA_APROBACION","t":"dt"},{"n":"FECHA_CONTABLE","t":"dt"},{"n":"IMPRESO","t":"vc"},{"n":"LIQUIDADO","t":"vc"}]},"NIVEL_PRECIO_SEGMENTO":{"m":"FA","d":"","f":[{"n":"ARTICULO","t":"vc"},{"n":"CADENAS","t":"dc"},{"n":"CLAVE","t":"dc"},{"n":"GRANDES","t":"dc"},{"n":"MARCA","t":"vc"},{"n":"MEDIANOS","t":"dc"},{"n":"PEQUENOS","t":"dc"}]},"ORDEN_COMPRA_DETALLE_EDI":{"m":"CO","d":"","f":[{"n":"CANTIDAD","t":"fl"},{"n":"CANTIDAD_CAJA_EDI","t":"fl"},{"n":"COD_ART_PRO","t":"nvc"},{"n":"COD_ARTIC","t":"nvc"},{"n":"COD_INT_ARTIC","t":"nvc"},{"n":"DESCRIPCION","t":"nvc"},{"n":"DESCUENTO","t":"fl"},{"n":"GLN_CLIENTE","t":"nvc"},{"n":"GLN_PROVEE   DOR","t":"nvc"},{"n":"IMPUESTO","t":"fl"},{"n":"LINEA","t":"i"},{"n":"NUM_DOC","t":"nvc"},{"n":"PRECIO","t":"fl"},{"n":"TIPO_DOC","t":"nvc"},{"n":"TOTAL_GENERAL","t":"fl"}]},"ORDEN_COMPRA_EDI":{"m":"CO","d":"","f":[{"n":"CANT_LINEAS","t":"i"},{"n":"COD_INTER_PROVEE","t":"nvc"},{"n":"COMENTARIO","t":"nvc"},{"n":"DEPARTAMENTO","t":"nvc"},{"n":"DESCUENTOS","t":"fl"},{"n":"ERRORENVIO","t":"nvc"},{"n":"FECHA_DOC","t":"dt"},{"n":"FECHA_ENTREGA","t":"dt"},{"n":"FECHA_ENVIO","t":"dt"},{"n":"GLN_CLIENTE","t":"nvc"},{"n":"GLN_DESPACHO","t":"nvc"},{"n":"GLN_PROVEEDOR","t":"nvc"},{"n":"IMPUESTOS","t":"fl"},{"n":"INTENTOSENVIO","t":"i"},{"n":"NOMBRE_CLIENTE","t":"nvc"},{"n":"NUM_DOC","t":"nvc"},{"n":"PORCENTAJE_DESC","t":"fl"},{"n":"SUBTOTAL","t":"fl"},{"n":"TIPO_DOC","t":"nvc"},{"n":"TOTAL","t":"fl"}]},"ORDEN_COMPRA_TI":{"m":"CO","d":"","f":[{"n":"FECHA","t":"dt"},{"n":"ORDEN_COMPRA_TI","t":"vc"},{"n":"PROVEEDOR","t":"vc"}]},"PEDIDO_DESPACHO":{"m":"FA","d":"","f":[{"n":"FECHA_DESPACHO","t":"dt"},{"n":"PEDIDO","t":"vc"}]},"PEDIDOS_HORA_AFV":{"m":"FA","d":"","f":[{"n":"CANT_PEDIDO","t":"i"},{"n":"COD_ZON","t":"vc"},{"n":"DD","t":"i"},{"n":"HH","t":"i"},{"n":"MM","t":"i"},{"n":"YY","t":"i"}]},"PEDIDOS_STREAMLINE_COFERSA":{"m":"FA","d":"","f":[{"n":"ARTICULO","t":"vc"},{"n":"CANTIDAD_PEDIDA","t":"dc"},{"n":"FECHA_ENVIO","t":"dt"},{"n":"LOCALIZACION","t":"vc"},{"n":"PEDIDO","t":"vc"}]},"PRESUPUESTO_AVALUO_COBRO":{"m":"CN","d":"","f":[{"n":"AVALUO","t":"dc"},{"n":"VENDEDOR","t":"vc"}]},"PRESUPUESTO_AVALUO_SKU":{"m":"CN","d":"","f":[{"n":"AVALUO","t":"dc"},{"n":"FECHA","t":"dt"},{"n":"SKU","t":"i"},{"n":"VENDEDOR","t":"vc"}]},"PRESUPUESTO_COMPRAS_CATEGORIA":{"m":"CN","d":"","f":[{"n":"CATEGORIA","t":"vc"},{"n":"DIA_PAGO","t":"i"},{"n":"FECHA","t":"dt"},{"n":"INVENTARIO_INICIAL","t":"dc"},{"n":"INVENTARIO_INICIAL_TOTAL","t":"dc"},{"n":"MARGEN","t":"dc"},{"n":"MONTO","t":"dc"},{"n":"ROTACION","t":"dc"}]},"PRESUPUESTO_VENDEDOR":{"m":"FA","d":"","f":[{"n":"FECHA","t":"dt"},{"n":"MONTO","t":"dc"},{"n":"VENDEDOR","t":"vc"}]},"PRESUPUESTO_VENDEDOR_MARCA":{"m":"FA","d":"","f":[{"n":"FECHA","t":"dt"},{"n":"MARCA","t":"vc"},{"n":"MONTO","t":"dc"},{"n":"VENDEDOR","t":"vc"}]},"PRESUPUESTO_VENTAS_COFERSA":{"m":"CN","d":"","f":[{"n":"COORDINADOR","t":"vc"},{"n":"NOMBRE","t":"vc"},{"n":"REGLONES","t":"i"},{"n":"VENDEDOR","t":"vc"},{"n":"ZONA","t":"vc"}]},"PRESUPUESTO_VENTAS_GRUPO_MARCA":{"m":"CN","d":"","f":[{"n":"G_CONSTRUCCION","t":"dc"},{"n":"G_FERRETERIA","t":"dc"},{"n":"G_HE","t":"dc"},{"n":"G_LORENZETTI","t":"dc"},{"n":"VENDEDOR","t":"vc"},{"n":"VENNOM","t":"vc"}]},"PROVEEDOR_ENTIDAD_COFERSA":{"m":"CP","d":"","f":[{"n":"CTA_DEFAULT","t":"vc"},{"n":"CUENTA_BANCO","t":"vc"},{"n":"ENTIDAD_FINANCIERA","t":"vc"},{"n":"MONEDA","t":"vc"},{"n":"NOTAS","t":"tx"},{"n":"PROVEEDOR","t":"vc"}]},"PROVEEDOR_ENTIDAD_RSML":{"m":"CP","d":"","f":[{"n":"CTA_DEFAULT","t":"vc"},{"n":"CUENTA_BANCO","t":"vc"},{"n":"ENTIDAD_FINANCIERA","t":"vc"},{"n":"MONEDA","t":"vc"},{"n":"NOTAS","t":"tx"},{"n":"PROVEEDOR","t":"vc"}]},"PROVEEDOR_GEO":{"m":"CP","d":"","f":[{"n":"PROVEEDOR","t":"vc"},{"n":"SALDO_CREDITO","t":"fl"},{"n":"SALDO_DEBITO","t":"fl"},{"n":"SALDO_DOLAR_CREDITO","t":"fl"},{"n":"SALDO_DOLAR_DEBITO","t":"fl"},{"n":"SALDO_LOCAL_CREDITO","t":"fl"},{"n":"SALDO_LOCAL_DEBITO","t":"fl"}]},"PROVEEDOR_GEO_FINAL":{"m":"CP","d":"","f":[{"n":"PROVEEDOR","t":"vc"},{"n":"SALDO","t":"fl"},{"n":"SALDO_DOLAR","t":"fl"},{"n":"SALDO_LOCAL","t":"fl"}]},"REGION_VENDEDOR":{"m":"FA","d":"","f":[{"n":"JEFE_REGIONAL","t":"vc"},{"n":"REGION","t":"vc"},{"n":"REGNOM","t":"vc"},{"n":"VENDEDOR","t":"vc"}]},"REGION_VENDEDOR_TELE":{"m":"FA","d":"","f":[{"n":"JEFE_REGIONAL","t":"vc"},{"n":"REGION","t":"vc"},{"n":"REGNOM","t":"vc"},{"n":"VENDEDOR","t":"vc"}]},"REPORTE_SALDOS_CLIENTES":{"m":"CC","d":"","f":[{"n":"CODIGO_CLIENTE","t":"vc"},{"n":"CODIGO_VENDEDOR","t":"vc"},{"n":"MARGEN","t":"dc"},{"n":"MARGEN_TOTAL","t":"dc"},{"n":"MAS121","t":"dc"},{"n":"NC_DEV","t":"dc"},{"n":"NO_VENCIDO","t":"dc"},{"n":"NOMBRE_CLIENTE","t":"vc"},{"n":"P120","t":"dc"},{"n":"P30","t":"dc"},{"n":"P60","t":"dc"},{"n":"P90","t":"dc"},{"n":"PRESUPUESTO_REAL","t":"dc"},{"n":"PRESUPUESTO_REGLONES","t":"i"},{"n":"PRESUPUESTO_VENTAS","t":"dc"},{"n":"REAL_REGLONES","t":"i"},{"n":"TOTAL_CLIENTES_ASIGNADOS","t":"i"},{"n":"VTA_EFECTIVA_CLI_ASIGNADOS","t":"i"},{"n":"VTAS_NETAS_TOTAL","t":"dc"}]},"SABANA_PEDIDO":{"m":"FA","d":"","f":[{"n":"AUTORIZADO","t":"vc"},{"n":"CLIENTE","t":"vc"},{"n":"CLINOM","t":"vc"},{"n":"DIAS","t":"i"},{"n":"DOC_A_GENERAR","t":"vc"},{"n":"ESTADO","t":"vc"},{"n":"FECHA_HORA","t":"dt"},{"n":"IMPRESO","t":"vc"},{"n":"PEDIDO","t":"vc"},{"n":"TOTAL_A_FACTURAR","t":"dc"},{"n":"VENDEDOR","t":"vc"},{"n":"VENNOM","t":"vc"}]},"SEGUIMIENTO_OC_OIC":{"m":"CO","d":"","f":[{"n":"ARTICULO","t":"vc"},{"n":"CANTIDAD_ORDENADA","t":"dc"},{"n":"CANTIDAD_RECIBIDA","t":"dc"},{"n":"DESCRIPCION","t":"vc"},{"n":"DIFERENCIA","t":"dc"},{"n":"FECHA","t":"dt"},{"n":"FECHA_RECIBO","t":"dt"},{"n":"NOMBRE","t":"vc"},{"n":"NUMERO_EMBARQUE","t":"vc"},{"n":"ORDEN_COMPRA","t":"vc"},{"n":"PROVEEDOR","t":"vc"}]},"T_CLIENTE_EXCEP":{"m":"CC","d":"","f":[{"n":"CLIENTE","t":"vc"},{"n":"NIVEL_PRECIO","t":"vc"}]},"tbl_calculo_comisiones_rangos":{"m":"FA","d":"","f":[{"n":"Comision","t":"nm"},{"n":"id_calculo_comision","t":"i"},{"n":"Margen_maximo","t":"nm"},{"n":"Margen_minimo","t":"nm"}]},"TRACK_PEDIDOS":{"m":"FA","d":"","f":[{"n":"CLIENTE","t":"vc"},{"n":"CLINOM","t":"vc"},{"n":"FACTURA","t":"vc"},{"n":"FECHA_HORA_EMPAQUE","t":"dt"},{"n":"FECHA_HORA_FACTURA","t":"dt"},{"n":"FECHA_HORA_PEDIDO_APROBACION_CREDITO","t":"dt"},{"n":"FECHA_HORA_PEDIDO_RECIBIDO","t":"dt"},{"n":"FECHA_HORA_PREPARACION","t":"dt"},{"n":"PEDIDO","t":"vc"},{"n":"VENDEDOR","t":"vc"},{"n":"VENNOM","t":"vc"},{"n":"ZONA","t":"vc"}]},"TRACK_PEDIDOS_FINAL":{"m":"FA","d":"","f":[{"n":"CLIENTE","t":"vc"},{"n":"CLINOM","t":"vc"},{"n":"FACTURA","t":"vc"},{"n":"FECHA_HORA_EMPAQUE","t":"dt"},{"n":"FECHA_HORA_FACTURA","t":"dt"},{"n":"FECHA_HORA_PEDIDO_APROBACION_CREDITO","t":"dt"},{"n":"FECHA_HORA_PEDIDO_RECIBIDO","t":"dt"},{"n":"FECHA_HORA_PREPARACION","t":"dt"},{"n":"HORA_EMPAQUE","t":"i"},{"n":"HORA_FACTURA","t":"i"},{"n":"HORA_PEDIDO_APROBACION_CREDITO","t":"i"},{"n":"HORA_PEDIDO_RECIBIDO","t":"i"},{"n":"HORA_PREPARACION","t":"i"},{"n":"PEDIDO","t":"vc"},{"n":"VENDEDOR","t":"vc"},{"n":"VENNOM","t":"vc"},{"n":"ZONA","t":"vc"}]},"VARIABLE_EMPLEADO":{"m":"CN","d":"","f":[{"n":"ACTIVO","t":"vc"},{"n":"DESCRIPCION","t":"vc"},{"n":"EMPLEADO","t":"vc"},{"n":"FECHA_HORA","t":"dt"},{"n":"MONTO_VARIABLE_BASE","t":"dc"},{"n":"MONTO_VARIABLE_MES","t":"dc"},{"n":"NOTAS","t":"vc"},{"n":"PESO_BASE","t":"dc"},{"n":"PESO_MES","t":"dc"},{"n":"VARIABLE","t":"vc"}]},"VARIABLE_EMPLEADO_CARGA":{"m":"CN","d":"","f":[{"n":"EMPLEADO","t":"vc"},{"n":"MONTO_VARIABLE_BASE","t":"dc"},{"n":"PESO_BASE","t":"dc"},{"n":"PESO_MES","t":"dc"},{"n":"VARIABLE","t":"vc"}]},"VARIABLE_EMPLEADO_COMPRAS":{"m":"CN","d":"","f":[{"n":"DEPARTAMENTO","t":"vc"},{"n":"DEPTNOM","t":"vc"},{"n":"DESCRIPCION","t":"vc"},{"n":"EMPLEADO","t":"vc"},{"n":"FECHA_HORA","t":"dt"},{"n":"MONTO_VARIABLE_BASE","t":"dc"},{"n":"MONTO_VARIABLE_MES","t":"dc"},{"n":"NOMBRE","t":"vc"},{"n":"NOTAS","t":"vc"},{"n":"PESO_BASE","t":"dc"},{"n":"PESO_MES","t":"dc"},{"n":"VARIABLE","t":"vc"}]},"VARIABLE_EMPLEADO_LOGISTICA":{"m":"CN","d":"","f":[{"n":"DEPARTAMENTO","t":"vc"},{"n":"DEPTNOM","t":"vc"},{"n":"DESCRIPCION","t":"vc"},{"n":"EMPLEADO","t":"vc"},{"n":"FECHA_HORA","t":"dt"},{"n":"MONTO_VARIABLE_BASE","t":"dc"},{"n":"MONTO_VARIABLE_MES","t":"dc"},{"n":"NOMBRE","t":"vc"},{"n":"NOTAS","t":"vc"},{"n":"PESO_BASE","t":"dc"},{"n":"PESO_MES","t":"dc"},{"n":"VARIABLE","t":"vc"}]},"VARIABLE_EMPLEADO_PERSONAL":{"m":"CN","d":"","f":[{"n":"DEPARTAMENTO","t":"vc"},{"n":"DEPTNOM","t":"vc"},{"n":"DESCRIPCION","t":"vc"},{"n":"EMPLEADO","t":"vc"},{"n":"FECHA_HORA","t":"dt"},{"n":"MONTO_VARIABLE_BASE","t":"dc"},{"n":"MONTO_VARIABLE_MES","t":"dc"},{"n":"NOMBRE","t":"vc"},{"n":"NOTAS","t":"vc"},{"n":"PESO_BASE","t":"dc"},{"n":"PESO_MES","t":"dc"},{"n":"VARIABLE","t":"vc"}]},"VARIABLE_X_EMPLEADO":{"m":"CN","d":"","f":[{"n":"EMPLEADO","t":"vc"},{"n":"FECHA_HORA","t":"dt"},{"n":"MONTO_VARIABLE_BASE","t":"dc"},{"n":"MONTO_VARIABLE_MES","t":"dc"},{"n":"NOTAS","t":"vc"},{"n":"PESO_BASE","t":"dc"},{"n":"PESO_MES","t":"dc"},{"n":"VARIABLE","t":"vc"}]},"XDIRECC_EMBARQUE":{"m":"CO","d":"","f":[{"n":"CARGO","t":"vc"},{"n":"CLIENTE","t":"vc"},{"n":"DESCRIPCION","t":"tx"},{"n":"DETALLE_DIRECCION","t":"i"},{"n":"DIRECCION","t":"vc"},{"n":"EMAIL","t":"vc"},{"n":"FAX","t":"vc"},{"n":"NUEVO","t":"vc"},{"n":"TELEFONO1","t":"vc"},{"n":"TELEFONO2","t":"vc"}]},"ARTICULO_FOTO_STATUS":{"m":"CI","d":"","f":[{"n":"CREATEDATE","t":"dt"},{"n":"ID","t":"i"},{"n":"STATUS","t":"vc"}]},"ACUERDO_CLIENTE":{"m":"CC","d":"","f":[{"n":"ACUERDO_ACEPTADO","t":"tx"},{"n":"ESTADO","t":"vc"},{"n":"FECHA_ACEPTACION","t":"dt"},{"n":"FECHA_VIGENCIA","t":"dt"},{"n":"USUARIO_ACEPTACION","t":"vc"},{"n":"VERSION","t":"vc"}]},"ARTICULO_EXISTENCIA":{"m":"CI","d":"","f":[{"n":"ARTICULO","t":"vc"},{"n":"BODEGA","t":"vc"},{"n":"COMPANIA","t":"vc"},{"n":"EXISTENCIA","t":"dc"}]},"ARTICULO_EXISTENCIA_LOTE":{"m":"CI","d":"","f":[{"n":"ARTICULO","t":"vc"},{"n":"BODEGA","t":"vc"},{"n":"COMPANIA","t":"vc"},{"n":"EXISTENCIA","t":"dc"},{"n":"FECHA_VENCIMIENTO","t":"dt"},{"n":"LOCALIZACION","t":"vc"},{"n":"LOTE","t":"vc"},{"n":"TIPO_INGRESO","t":"vc"}]},"ARTICULO_RT":{"m":"CI","d":"","f":[{"n":"ARTICULO","t":"vc"},{"n":"BODEGA","t":"vc"},{"n":"COMPANIA","t":"vc"},{"n":"DESCRIPCION","t":"vc"},{"n":"FACTOR_PRECIO","t":"dc"},{"n":"LOCALIZACION","t":"vc"},{"n":"ORDEN_ARTICULO","t":"vc"}]},"BODEGA_ASOC_RT":{"m":"CI","d":"","f":[{"n":"BODEGA","t":"vc"},{"n":"CODIGO","t":"vc"},{"n":"CODIGO_BODEGA_RETABLECER","t":"vc"},{"n":"COMPANIA","t":"vc"},{"n":"CONSECUTIVO_CI","t":"vc"},{"n":"LOCALIZACION","t":"vc"},{"n":"PAQUETE_INVENTARIO","t":"vc"}]},"BODEGA_ASOC_RT_COFERSA":{"m":"CI","d":"","f":[{"n":"BODEGA","t":"vc"},{"n":"CODIGO","t":"vc"},{"n":"COMPANIA","t":"vc"}]},"BODEGA_RT":{"m":"CI","d":"","f":[{"n":"BODEGA","t":"vc"},{"n":"NOMBRE","t":"vc"}]},"CLASIFICACION_FR":{"m":"CI","d":"","f":[{"n":"AGRUPACION","t":"i"},{"n":"CLASIFICACION","t":"vc"},{"n":"COMPANIA","t":"vc"},{"n":"DESCRIPCION","t":"vc"}]},"CLIENTE_ASOC_RT":{"m":"CC","d":"","f":[{"n":"BODEGA_CONSIGNA","t":"vc"},{"n":"CLIENTE","t":"vc"},{"n":"CODIGO","t":"vc"},{"n":"COMPANIA","t":"vc"},{"n":"LOCALIZACION_CONSIGNA","t":"vc"}]},"CLIENTE_CIA":{"m":"CC","d":"","f":[{"n":"ACEPTA_FRACCIONES","t":"vc"},{"n":"BODEGA_CONSIGNA","t":"vc"},{"n":"CATEGORIA_TIPO_NIT","t":"vc"},{"n":"COD_CIA","t":"vc"},{"n":"COD_CLT","t":"vc"},{"n":"COD_CND","t":"vc"},{"n":"COD_PAIS","t":"vc"},{"n":"COD_TIP_CL","t":"vc"},{"n":"CODIGO","t":"vc"},{"n":"CONTRIBUYENTE","t":"vc"},{"n":"DESCUENTO","t":"dc"},{"n":"DIA_CRE","t":"i"},{"n":"DIR_EMB_DEFAULT","t":"vc"},{"n":"DIVISION_GEOGRAFICA1","t":"vc"},{"n":"DIVISION_GEOGRAFICA2","t":"vc"},{"n":"IND_MON","t":"vc"},{"n":"LIM_CRE","t":"dc"},{"n":"LOCALIZACION_CONSIGNA","t":"vc"},{"n":"LST_PRE","t":"i"},{"n":"MONTO_TOPE","t":"dc"},{"n":"MULT_MON","t":"vc"},{"n":"NOM_CTO","t":"vc"},{"n":"NUM_TEL","t":"vc"},{"n":"POR_EXC_CS","t":"dc"},{"n":"POR_EXC_VT","t":"dc"}]},"CLIENTE_RT":{"m":"CC","d":"","f":[{"n":"ALTITUD","t":"dc"},{"n":"CLIENTE","t":"vc"},{"n":"FECHA_ACTUALIZACION_UBICACION","t":"dt"},{"n":"LATITUD","t":"dc"},{"n":"LONGITUD","t":"dc"},{"n":"NOMBRE","t":"vc"}]},"CLIENTE_UBICACION":{"m":"CC","d":"","f":[{"n":"ALTITUD","t":"dc"},{"n":"CLIENTE","t":"vc"},{"n":"LATITUD","t":"dc"},{"n":"LONGITUD","t":"dc"},{"n":"RUTA","t":"vc"}]},"CLIENTE_UBICACION_LOG":{"m":"CC","d":"","f":[{"n":"ALTITUD","t":"dc"},{"n":"CLIENTE","t":"vc"},{"n":"ERROR","t":"vc"},{"n":"ESTADO","t":"vc"},{"n":"FECHA","t":"dt"},{"n":"LATITUD","t":"dc"},{"n":"LONGITUD","t":"dc"},{"n":"RUTA","t":"vc"}]},"DES_BON_ARTICULO":{"m":"CI","d":"","f":[{"n":"ACTIVO","t":"vc"},{"n":"ARTICULO","t":"vc"},{"n":"ARTICULO_DEL_PROV","t":"vc"},{"n":"BULTOS","t":"si"},{"n":"CLASE_ABC","t":"vc"},{"n":"CLASIFICACION_1","t":"vc"},{"n":"CLASIFICACION_2","t":"vc"},{"n":"CLASIFICACION_3","t":"vc"},{"n":"CLASIFICACION_4","t":"vc"},{"n":"CLASIFICACION_5","t":"vc"},{"n":"CLASIFICACION_6","t":"vc"},{"n":"CODIGO_BARRAS_INVT","t":"vc"},{"n":"CODIGO_BARRAS_VENT","t":"vc"},{"n":"COMPANIA","t":"vc"},{"n":"DESCRIPCION","t":"vc"},{"n":"FACTOR_EMPAQUE","t":"dc"},{"n":"FACTOR_VENTA","t":"dc"},{"n":"GRUPO_ARTICULO","t":"vc"},{"n":"IMPUESTO","t":"vc"},{"n":"ORIGEN_CORP","t":"vc"},{"n":"PERECEDERO","t":"vc"},{"n":"PESO_BRUTO","t":"dc"},{"n":"PESO_NETO","t":"dc"},{"n":"PROVEEDOR","t":"vc"},{"n":"TIPO","t":"vc"}]},"DES_BON_CLIENTE":{"m":"CC","d":"","f":[{"n":"ACEPTA_DOC_ELECTRONICO","t":"vc"},{"n":"ACTIVIDAD_ECONOMICA","t":"vc"},{"n":"ACTIVO","t":"vc"},{"n":"ALIAS","t":"vc"},{"n":"CATEGORIA_CLIENTE","t":"vc"},{"n":"CLASE_ABC","t":"vc"},{"n":"CLIENTE","t":"vc"},{"n":"COBRADOR","t":"vc"},{"n":"COD_CLI","t":"vc"},{"n":"COD_ZON","t":"vc"},{"n":"CODIGO_IMPUESTO","t":"vc"},{"n":"COMPANIA","t":"vc"},{"n":"CONDICION_PAGO","t":"vc"},{"n":"CONTACTO","t":"vc"},{"n":"DESCUENTO","t":"dc"},{"n":"DETALLE_DIRECCION","t":"i"},{"n":"DIR_EMB_DEFAULT","t":"vc"},{"n":"E_MAIL","t":"vc"},{"n":"ES_CORPORACION","t":"vc"},{"n":"EXCEDER_LIMITE","t":"vc"},{"n":"EXENTO_IMPUESTOS","t":"vc"},{"n":"FECHA_INGRESO","t":"dt"},{"n":"GIRO","t":"vc"},{"n":"GLN","t":"vc"},{"n":"LIMITE_CREDITO","t":"dc"}]},"GRUPO_ARTICULO_RT":{"m":"CI","d":"","f":[{"n":"DESCRIPCION","t":"vc"},{"n":"GRUPO_ARTICULO","t":"vc"}]},"LINEA_CONSIG_LOTE_LOC":{"m":"CI","d":"","f":[{"n":"ART_BON","t":"vc"},{"n":"ARTICULO","t":"vc"},{"n":"BODEGA","t":"vc"},{"n":"CNT_MAX","t":"dc"},{"n":"CNT_MIN","t":"dc"},{"n":"COMPANIA","t":"vc"},{"n":"DOC_PRO","t":"vc"},{"n":"LOCALIZACION","t":"vc"},{"n":"LOTE","t":"vc"},{"n":"NUM_CONSIG","t":"vc"},{"n":"NUM_LN","t":"i"}]},"LINEA_PED_LOTE_LOC":{"m":"CI","d":"","f":[{"n":"ART_BON","t":"vc"},{"n":"ARTICULO","t":"vc"},{"n":"BODEGA","t":"vc"},{"n":"CNT_MAX","t":"dc"},{"n":"CNT_MIN","t":"dc"},{"n":"COMPANIA","t":"vc"},{"n":"LOCALIZACION","t":"vc"},{"n":"LOTE","t":"vc"},{"n":"NUM_LN","t":"i"},{"n":"NUM_PED","t":"vc"}]},"NCF_CONSECUTIVO_RT":{"m":"FA","d":"","f":[{"n":"COMPANIA","t":"vc"},{"n":"DESCRIPCION","t":"vc"},{"n":"HANDHELD","t":"vc"},{"n":"NCF_CONTINGENCIA","t":"vc"},{"n":"PREFIJO","t":"vc"},{"n":"SECUENCIA","t":"i"},{"n":"SECUENCIA_FINAL","t":"vc"},{"n":"SECUENCIA_INICIAL","t":"vc"},{"n":"TIPO","t":"vc"},{"n":"TIPO_COMPROBANTE","t":"vc"},{"n":"TIPO_CONTRIBUYENTE","t":"vc"},{"n":"TIPO_DOC","t":"vc"},{"n":"ULTIMO_VALOR","t":"vc"}]},"REPORTE_FACTURA":{"m":"FA","d":"","f":[{"n":"DESCRIPCION","t":"vc"},{"n":"HANDHELD","t":"vc"},{"n":"REP_DEFAULT","t":"vc"},{"n":"REPORTE","t":"vc"},{"n":"TIPO_CREDITO_FACT","t":"vc"}]},"RESOLUCION_CONSECUTIVO_RT":{"m":"FA","d":"","f":[{"n":"COMPANIA","t":"vc"},{"n":"CONSEC_FINAL","t":"vc"},{"n":"CONSEC_INICIAL","t":"vc"},{"n":"ESTADO","t":"vc"},{"n":"FECHA_AUTORIZACION","t":"dt"},{"n":"FECHA_CREACION","t":"dt"},{"n":"FECHA_RESOLUCION","t":"dt"},{"n":"HANDHELD","t":"vc"},{"n":"MASCARA","t":"vc"},{"n":"NUMERO_AUTORIZACION","t":"vc"},{"n":"RESOLUCION","t":"vc"},{"n":"RUTA","t":"vc"},{"n":"SERIE","t":"vc"},{"n":"TIPO_DOCUMENTO","t":"vc"},{"n":"USUARIO_CREACION","t":"vc"},{"n":"VALOR","t":"vc"}]},"RUTA_CLIENTE":{"m":"CC","d":"","f":[{"n":"CLIENTE","t":"vc"},{"n":"DIA","t":"i"},{"n":"ORDEN","t":"i"},{"n":"RUTA","t":"vc"}]},"SCH_PUESTO":{"m":"CN","d":"","f":[{"n":"COD_INSTALACION","t":"vc"},{"n":"DESCRIPCION","t":"vc"},{"n":"ID","t":"i"},{"n":"IDARBOL","t":"i"},{"n":"IDARBOLEXTERNO","t":"vc"},{"n":"IDEXTERNO","t":"vc"}]},"SCH_USUARIOEMPLEADO":{"m":"CN","d":"","f":[{"n":"COMPANIA","t":"vc"},{"n":"EMPLEADO","t":"vc"},{"n":"USUARIO","t":"vc"}]},"SUBTIPO_DOC_CC_FR":{"m":"CC","d":"","f":[{"n":"CALCULA_IMP2","t":"vc"},{"n":"COMPANIA","t":"vc"},{"n":"DESCRIPCION","t":"vc"},{"n":"SUBTIPO","t":"si"},{"n":"TIPO","t":"vc"},{"n":"TIPO_DOCUMENTO","t":"vc"}]},"TIPO_IMPUESTO_RT":{"m":"CN","d":"","f":[{"n":"DESCRIPCION","t":"vc"},{"n":"TIPO_IMPUESTO","t":"vc"}]},"ASIENTOS_DOC_POS":{"m":"FA","d":"","f":[{"n":"ASIENTO","t":"vc"},{"n":"CAJA","t":"vc"},{"n":"DOCUMENTO","t":"vc"},{"n":"TIPO","t":"vc"},{"n":"TIPO_ASIENTO","t":"vc"}]},"CLIENTE_FORMA_PAGO":{"m":"CC","d":"","f":[{"n":"CLIENTE","t":"vc"},{"n":"ENTIDAD_FINANCIERA","t":"vc"},{"n":"ESTADO","t":"vc"},{"n":"FORMA_PAGO","t":"vc"},{"n":"NUMERO_CTA","t":"vc"},{"n":"RESP_CTA","t":"vc"}]},"CLIENTE_POS":{"m":"CC","d":"","f":[{"n":"CARNE","t":"vc"},{"n":"CLIENTE","t":"vc"},{"n":"FECHA_NACIMIENTO","t":"dt"},{"n":"PAIS_EMBAJADA","t":"vc"}]},"DEPOSITO_POS":{"m":"CB","d":"","f":[{"n":"APROBADO","t":"vc"},{"n":"CUENTA_BANCO","t":"vc"},{"n":"DEPOSITO","t":"i"},{"n":"DOCUMENTO","t":"i"},{"n":"FECHA","t":"dt"},{"n":"FECHA_HORA_CARGA","t":"dt"},{"n":"MONTO","t":"dc"},{"n":"TIENDA","t":"vc"}]},"DOC_POS_LINEA":{"m":"FA","d":"","f":[{"n":"ARTICULO","t":"vc"},{"n":"CAJA","t":"vc"},{"n":"CANTIDAD","t":"dc"},{"n":"DESCUENTO_GENERAL","t":"dc"},{"n":"DESCUENTO_LINEA","t":"dc"},{"n":"DOCUMENTO","t":"vc"},{"n":"LINEA","t":"vc"},{"n":"LOTE","t":"vc"},{"n":"PRECIO_VENTA","t":"dc"},{"n":"TIPO","t":"vc"},{"n":"TOTAL_IMPUESTO1","t":"dc"},{"n":"TOTAL_IMPUESTO2","t":"dc"}]},"PERFIL_CLIENTE":{"m":"CC","d":"","f":[{"n":"DESCRIPCION","t":"vc"},{"n":"MODIFICADOR","t":"dc"},{"n":"PERFIL","t":"vc"}]},"TRACK_PEDIDO_COFERSA":{"m":"FA","d":"","f":[{"n":"AUTORIZADO","t":"vc"},{"n":"CLIENTE","t":"vc"},{"n":"CLINOM","t":"vc"},{"n":"DOC_A_GENERAR","t":"vc"},{"n":"ESTADO","t":"vc"},{"n":"FECHA_HORA","t":"dt"},{"n":"IMPRESO","t":"vc"},{"n":"OBSERVACIONES","t":"vc"},{"n":"PEDIDO","t":"vc"},{"n":"RUBRO1","t":"vc"},{"n":"RUBRO2","t":"vc"},{"n":"RUBRO3","t":"vc"},{"n":"RUTA","t":"vc"},{"n":"TOTAL_PEDIDO","t":"dc"},{"n":"VENDEDOR","t":"vc"},{"n":"VENNOM","t":"vc"}]},"ASESOR_BODEGA":{"m":"CI","d":"","f":[{"n":"BODEGA","t":"i"},{"n":"VENDEDOR","t":"i"}]},"CONDICION_CLIENTE":{"m":"CC","d":"","f":[{"n":"ANTES_CONDICION","t":"nch"},{"n":"CODIGO","t":"nvc"},{"n":"DESCUENTO","t":"nch"},{"n":"NUEVA_CONDICION","t":"nch"}]},"DOCUMENTOS_CP_carga":{"m":"CP","d":"","f":[{"n":"DOCUMENTO","t":"vc"},{"n":"MONEDA","t":"vc"},{"n":"MONTO","t":"dc"},{"n":"MONTO_DOLAR","t":"dc"},{"n":"MONTO_LOCAL","t":"dc"},{"n":"MONTO_PROV","t":"dc"},{"n":"PROVEEDOR","t":"vc"},{"n":"SALDO","t":"dc"},{"n":"SALDO_DOLAR","t":"dc"},{"n":"SALDO_LOCAL","t":"dc"},{"n":"SALDO_PROV","t":"dc"},{"n":"TIPO","t":"vc"},{"n":"TIPO_CAMB_ACT_DOL","t":"dc"},{"n":"TIPO_CAMB_ACT_LOC","t":"dc"},{"n":"TIPO_CAMB_ACT_PROV","t":"dc"},{"n":"TIPO_CAMBIO","t":"dc"},{"n":"TIPO_CAMBIO_DOLAR","t":"dc"},{"n":"TIPO_CAMBIO_MONEDA","t":"dc"},{"n":"TIPO_CAMBIO_PROV","t":"dc"}]},"ESTADO_PEDIDO":{"m":"FA","d":"","f":[{"n":"CLIENTE","t":"vc"},{"n":"ESTADO","t":"vc"},{"n":"FECHA_PEDIDO","t":"dt"},{"n":"FECHA_REPORTE","t":"dt"},{"n":"MONTO_FACTURADO","t":"dc"},{"n":"MONTO_PEDIDO","t":"dc"},{"n":"NOMBRE_CLIENTE","t":"vc"},{"n":"NOMBRE_VENDEDOR","t":"vc"},{"n":"PEDIDO","t":"vc"},{"n":"VENDEDOR","t":"vc"}]},"LISTA_PRECIOS_EXISTENCIA_TELEVENTAS":{"m":"CI","d":"","f":[{"n":"ACTIVO","t":"vc"},{"n":"ARTICULO","t":"vc"},{"n":"BODEGA_100","t":"i"},{"n":"BODEGA_200","t":"i"},{"n":"CATEGORIA","t":"vc"},{"n":"CATEGORIA_DES","t":"vc"},{"n":"CODIGO_BARRAS_INV","t":"vc"},{"n":"CODIGO_BARRAS_VENT","t":"vc"},{"n":"COSTO","t":"dc"},{"n":"DESCRIPCION","t":"vc"},{"n":"FECHA_RPT","t":"dt"},{"n":"MARCA","t":"vc"},{"n":"MARCA_DES","t":"vc"},{"n":"PRECIO_1","t":"dc"},{"n":"PRECIO_2","t":"dc"},{"n":"REFERENCIA","t":"vc"},{"n":"SUBCATEGORIA","t":"vc"},{"n":"SUBCATEGORIA_DES","t":"vc"}]},"PRESUPUESTO_VENTAS_MUNDIAL":{"m":"CN","d":"","f":[{"n":"COORDINADOR","t":"vc"},{"n":"NOMBRE","t":"vc"},{"n":"REGLONES","t":"i"},{"n":"VENDEDOR","t":"vc"},{"n":"ZONA","t":"vc"}]},"PresupuestoPreliminar":{"m":"CN","d":"","f":[{"n":"CodCompania","t":"vc"},{"n":"CodVendedor","t":"vc"},{"n":"Fecha","t":"dt"},{"n":"MargenMensual","t":"dc"},{"n":"MontoMensualDolar","t":"dc"},{"n":"MontoMensualLocal","t":"dc"},{"n":"PresupuestoDeRentabilidad","t":"dc"},{"n":"UtilidadBrutaMetaDolar","t":"dc"},{"n":"UtilidadBrutaMetaLocal","t":"dc"}]},"SALDO_CLIENT":{"m":"CG","d":"","f":[{"n":"DOCUMENTO_NUEVO","t":"nvc"},{"n":"MONTO_DOLAR_NUEVO","t":"dc"},{"n":"SALDO_DOLAR_NUEVO","t":"dc"},{"n":"TIPO_CAMBIO_LOCAL","t":"dc"},{"n":"TIPO_CAMBIO_NUEVO","t":"dc"},{"n":"TIPO_NUEVO","t":"nch"}]},"SALDO_VAC":{"m":"CG","d":"","f":[{"n":"ACUMULADO","t":"dc"},{"n":"EMPLEADO","t":"vc"},{"n":"FECHA_ULT","t":"dt"}]},"VENDEDOR_BODEGA":{"m":"CI","d":"","f":[{"n":"BODEGA","t":"i"},{"n":"VENDEDOR","t":"i"}]},"ARTICULO_FOTO_AD":{"m":"CI","d":"","f":[{"n":"ARTICULO","t":"vc"},{"n":"IMAGEN","t":"img"},{"n":"TIPO_IMAGEN","t":"vc"}]},"BOLETA_DESPACHO_AD":{"m":"FA","d":"","f":[{"n":"BOLETA","t":"vc"},{"n":"CLIENTE","t":"vc"},{"n":"FECHA_DESPACHO","t":"dt"},{"n":"NOTAS","t":"vc"},{"n":"PEDIDO","t":"vc"},{"n":"UBICACION","t":"vc"}]},"DESG_IMPUESTO_CH":{"m":"CN","d":"","f":[{"n":"BASE","t":"dc"},{"n":"CODIGO_IMPUESTO","t":"vc"},{"n":"LINEA","t":"i"},{"n":"MONTO","t":"dc"},{"n":"PORCENTAJE","t":"dc"},{"n":"VALE","t":"i"}]},"EMPLEADO_RESPALDO_ESCALA":{"m":"CN","d":"","f":[{"n":"DEPARTAMENTO","t":"vc"},{"n":"EMPLEADO","t":"vc"},{"n":"NOMBRE","t":"vc"},{"n":"SALARIO_REFERENCIA","t":"dc"},{"n":"U_ERROR","t":"vc"},{"n":"U_FUERA_ESCALA","t":"vc"},{"n":"U_NIVEL_ORGANIZACIONAL","t":"vc"},{"n":"U_PASO_SALARIAL","t":"vc"}]},"LogCargaPresupuestos":{"m":"CN","d":"","f":[{"n":"COMISION","t":"dc"},{"n":"DESCRIPCION","t":"vc"},{"n":"EMPLEADO","t":"vc"},{"n":"ESTATUS","t":"vc"},{"n":"FECHA","t":"dt"},{"n":"ID","t":"i"},{"n":"ID_EMPLEADO","t":"vc"},{"n":"MONTO","t":"dc"},{"n":"TIPO","t":"vc"}]},"PED_LINEA_SERIE_AD":{"m":"CI","d":"","f":[{"n":"ARTICULO","t":"vc"},{"n":"CANT_ALISTADA","t":"dc"},{"n":"CANTIDAD","t":"dc"},{"n":"LINEA","t":"vc"},{"n":"LINEA_SERIE","t":"i"},{"n":"PEDIDO","t":"vc"},{"n":"SERIE_DESPACHADA","t":"vc"},{"n":"SERIE_FINAL","t":"vc"},{"n":"SERIE_INICIAL","t":"vc"}]},"PEDIDO_AD":{"m":"FA","d":"","f":[{"n":"CLIENTE","t":"vc"},{"n":"CLIENTE_NOMBRE","t":"vc"},{"n":"ESTADO","t":"vc"},{"n":"FCH_PED_PROMETIDA","t":"dt"},{"n":"FECHA_PEDIDO","t":"dt"},{"n":"GRUPO_PEDIDO","t":"vc"},{"n":"MARCA_DESPACHADO","t":"dt"},{"n":"MARCA_EN_ALISTO","t":"dt"},{"n":"MARCA_EN_DESPACHO","t":"dt"},{"n":"MARCA_X_ALISTAR","t":"dt"},{"n":"MARCA_X_DESPACHAR","t":"dt"},{"n":"NOTAS_ALISTO","t":"vc"},{"n":"NOTAS_DESPACHO","t":"vc"},{"n":"PEDIDO","t":"vc"},{"n":"PEDIDO_CON_PROBLEMAS","t":"vc"},{"n":"PEDIDO_RECUPERADO","t":"vc"},{"n":"PROBLEMA_CON_ALISTO","t":"vc"},{"n":"PROBLEMA_CON_DESPACHO","t":"vc"},{"n":"USUARIO_ALISTO","t":"vc"},{"n":"USUARIO_DESPACHO","t":"vc"},{"n":"VENDEDOR","t":"vc"},{"n":"VENDEDOR_NOMBRE","t":"vc"}]},"PRESUPUESTO_CENTRO_BI":{"m":"CN","d":"","f":[{"n":"CENTRO_COSTO","t":"vc"},{"n":"PRESUPUESTO","t":"vc"},{"n":"VERSION","t":"vc"}]},"PRESUPUESTO_CUENTA_BI":{"m":"CN","d":"","f":[{"n":"CUENTA_CONTABLE","t":"vc"},{"n":"PRESUPUESTO","t":"vc"},{"n":"VERSION","t":"vc"}]},"VALE_MOV_PRES":{"m":"CR","d":"","f":[{"n":"NUMERO_APARTADO","t":"i"},{"n":"NUMERO_EJERCIDO","t":"i"},{"n":"PRESUPUESTO","t":"vc"},{"n":"UNIDAD_OPERATIVA","t":"vc"},{"n":"VALE","t":"i"}]},"CLIENTE_ZONA":{"m":"CC","d":"","f":[{"n":"CODIGO","t":"fl"},{"n":"CONTRIBUYENTE","t":"nvc"},{"n":"RAZON","t":"nvc"},{"n":"ZONA","t":"nvc"}]},"Facturas":{"m":"FA","d":"","f":[{"n":"campo_vacio","t":"vc"},{"n":"cliente","t":"vc"},{"n":"fecha","t":"da"},{"n":"id","t":"bi"},{"n":"monto","t":"dc"},{"n":"numero_documento","t":"vc"},{"n":"otro_id","t":"bi"},{"n":"proveedor","t":"vc"},{"n":"rif","t":"vc"},{"n":"tipo_documento","t":"vc"}]},"CALCULO_FLUJO_CAJA":{"m":"CF","d":"","f":[{"n":"CONSECUTIVO_PERIODO","t":"i"},{"n":"EDITADO","t":"vc"},{"n":"FLUJO_CAJA","t":"vc"},{"n":"MONTO_TOTAL_DOLAR","t":"dc"},{"n":"MONTO_TOTAL_DOLAR_EJE","t":"dc"},{"n":"MONTO_TOTAL_LOCAL","t":"dc"},{"n":"MONTO_TOTAL_LOCAL_EJE","t":"dc"},{"n":"NATURALEZA","t":"vc"},{"n":"RUBRO_HIJO","t":"vc"},{"n":"RUBRO_PADRE","t":"vc"},{"n":"TIPO_CALCULO","t":"vc"},{"n":"VERSION","t":"i"}]},"Clientes_Data_Historica":{"m":"CC","d":"","f":[{"n":"ACONCL","t":"vc"},{"n":"ACUPCL","t":"vc"},{"n":"AELICL","t":"vc"},{"n":"AINICL","t":"vc"},{"n":"APTDCL","t":"vc"},{"n":"AREGCL","t":"vc"},{"n":"AULTCL","t":"vc"},{"n":"BCACCL","t":"vc"},{"n":"BCANCL","t":"vc"},{"n":"BCO1CL","t":"vc"},{"n":"BCO2CL","t":"vc"},{"n":"BCO3CL","t":"vc"},{"n":"BSACCL","t":"vc"},{"n":"BSANCL","t":"vc"},{"n":"CASACL","t":"vc"},{"n":"CBACCL","t":"vc"},{"n":"CBANCL","t":"vc"},{"n":"CDA1CL","t":"vc"},{"n":"CDA2CL","t":"vc"},{"n":"CDA3CL","t":"vc"},{"n":"CDA4CL","t":"vc"},{"n":"CDA5CL","t":"vc"},{"n":"CDA6CL","t":"vc"},{"n":"CDA7CL","t":"vc"},{"n":"CED1CL","t":"vc"}]},"DETALLE_FLUJO_CAJA":{"m":"CF","d":"","f":[{"n":"ASIENTO","t":"vc"},{"n":"CONSECUTIVO","t":"i"},{"n":"CONSECUTIVO_PERIODO","t":"i"},{"n":"DOCUMENTO","t":"vc"},{"n":"FLUJO_CAJA","t":"vc"},{"n":"MONTO_DOLAR","t":"dc"},{"n":"MONTO_LOCAL","t":"dc"},{"n":"NATURALEZA","t":"vc"},{"n":"NOMBRE","t":"vc"},{"n":"ORIGEN","t":"vc"},{"n":"PROPIETARIO","t":"vc"},{"n":"RUBRO_HIJO","t":"vc"},{"n":"RUBRO_PADRE","t":"vc"},{"n":"TIPO","t":"vc"},{"n":"VERSION","t":"i"}]},"DETALLE_FLUJO_CAJA_EJECUTA":{"m":"CF","d":"","f":[{"n":"CONSECUTIVO","t":"i"},{"n":"CONSECUTIVO_PERIODO","t":"i"},{"n":"FLUJO_CAJA","t":"vc"},{"n":"MONTO_DOLAR","t":"dc"},{"n":"MONTO_LOCAL","t":"dc"},{"n":"NATURALEZA","t":"vc"},{"n":"REFERENCIA","t":"vc"},{"n":"RUBRO_HIJO","t":"vc"},{"n":"RUBRO_PADRE","t":"vc"},{"n":"SUBTIPO","t":"si"},{"n":"TIPO_DOCUMENTO","t":"vc"},{"n":"VERSION","t":"i"}]},"FLUJO_CAJA":{"m":"CF","d":"","f":[{"n":"ACTIVO","t":"vc"},{"n":"DESCRIPCION","t":"vc"},{"n":"FECHA_CREACION","t":"dt"},{"n":"FECHA_FINAL","t":"dt"},{"n":"FECHA_INICIAL","t":"dt"},{"n":"FECHA_MODIFICACION","t":"dt"},{"n":"FLUJO_CAJA","t":"vc"},{"n":"NOTAS","t":"tx"},{"n":"TIPO_PERIODO","t":"vc"},{"n":"USUARIO_CREACION","t":"vc"},{"n":"USUARIO_MODIFICACION","t":"vc"}]},"FLUJO_CAJA_CUENTA_BANCO":{"m":"CF","d":"","f":[{"n":"ACTIVO","t":"vc"},{"n":"CUENTA_BANCO","t":"vc"},{"n":"FLUJO_CAJA","t":"vc"}]},"GLOBALES_CF":{"m":"CF","d":"","f":[{"n":"INTEGRACION_CC","t":"vc"},{"n":"INTEGRACION_CO","t":"vc"},{"n":"INTEGRACION_CP","t":"vc"},{"n":"INTEGRACION_FA","t":"vc"}]},"MOV_BANCOS_RUBROS_CF":{"m":"CB","d":"","f":[{"n":"CONSECUTIVO","t":"i"},{"n":"CUENTA_BANCO","t":"vc"},{"n":"FECHA","t":"dt"},{"n":"FLUJO_CAJA","t":"vc"},{"n":"MONTO","t":"dc"},{"n":"NATURALEZA","t":"vc"},{"n":"NUMERO","t":"dc"},{"n":"REFERENCIA","t":"vc"},{"n":"RUBRO_HIJO","t":"vc"},{"n":"RUBRO_PADRE","t":"vc"},{"n":"SUBTIPO","t":"si"},{"n":"TC_DOLAR","t":"dc"},{"n":"TC_LOCAL","t":"dc"},{"n":"TIPO_DOCUMENTO","t":"vc"}]},"PEDIDO_LINEA_REVISION":{"m":"FA","d":"","f":[{"n":"ARTICULO","t":"vc"},{"n":"BODEGA","t":"vc"},{"n":"CANTIDAD_A_FACTURA","t":"dc"},{"n":"CANTIDAD_BONIFICAD","t":"dc"},{"n":"CANTIDAD_CANCELADA","t":"dc"},{"n":"CANTIDAD_FACTURADA","t":"dc"},{"n":"CANTIDAD_PEDIDA","t":"dc"},{"n":"CANTIDAD_RESERVADA","t":"dc"},{"n":"CENTRO_COSTO","t":"vc"},{"n":"COMENTARIO","t":"vc"},{"n":"CUENTA_CONTABLE","t":"vc"},{"n":"DESCRIPCION","t":"tx"},{"n":"ES_CANASTA_BASICA","t":"vc"},{"n":"ES_OTRO_CARGO","t":"vc"},{"n":"ESTADO","t":"vc"},{"n":"FASE","t":"vc"},{"n":"FECHA_ENTREGA","t":"dt"},{"n":"FECHA_PROMETIDA","t":"dt"},{"n":"LINEA_ORDEN_COMPRA","t":"i"},{"n":"LINEA_USUARIO","t":"si"},{"n":"LOCALIZACION","t":"vc"},{"n":"LOTE","t":"vc"},{"n":"MONTO_DESCUENTO","t":"dc"},{"n":"MONTO_EXONERACION","t":"dc"},{"n":"MONTO_EXONERACION2","t":"dc"}]},"PEDIDO_REVISION":{"m":"FA","d":"","f":[{"n":"ACTIVIDAD_COMERCIAL","t":"vc"},{"n":"AUTORIZADO","t":"vc"},{"n":"BACKORDER","t":"vc"},{"n":"BASE_IMPUESTO1","t":"dc"},{"n":"BASE_IMPUESTO2","t":"dc"},{"n":"BODEGA","t":"vc"},{"n":"CAMBIOS_COTI","t":"vc"},{"n":"CLASE_PEDIDO","t":"vc"},{"n":"CLAVE_REFERENCIA_DE","t":"vc"},{"n":"CLIENTE","t":"vc"},{"n":"CLIENTE_CORPORAC","t":"vc"},{"n":"CLIENTE_DIRECCION","t":"vc"},{"n":"CLIENTE_ORIGEN","t":"vc"},{"n":"COBRADOR","t":"vc"},{"n":"CODIGO_REFERENCIA_DE","t":"vc"},{"n":"COMENTARIO_CXC","t":"vc"},{"n":"CONDICION_PAGO","t":"vc"},{"n":"CONSECUTIVO_FTC","t":"vc"},{"n":"CONTRATO","t":"vc"},{"n":"CONTRATO_AC","t":"vc"},{"n":"CONTRATO_REVENTA","t":"vc"},{"n":"CONTRATO_VIGENCIA_DESDE","t":"dt"},{"n":"CONTRATO_VIGENCIA_HASTA","t":"dt"},{"n":"CORREOS_ENVIO","t":"vc"},{"n":"COTIZACION_PADRE","t":"vc"}]},"PERIODOS_FLUJO_CAJA":{"m":"CF","d":"","f":[{"n":"CONSECUTIVO","t":"i"},{"n":"FECHA_FINAL","t":"dt"},{"n":"FECHA_INICIAL","t":"dt"},{"n":"FLUJO_CAJA","t":"vc"},{"n":"TIPO_PERIODO","t":"vc"}]},"RUBRO_FLUJO_CAJA":{"m":"CF","d":"","f":[{"n":"ACTIVO","t":"vc"},{"n":"FLUJO_CAJA","t":"vc"},{"n":"FORMULA","t":"tx"},{"n":"FORMULA_XML","t":"tx"},{"n":"NATURALEZA","t":"vc"},{"n":"NOMBRE","t":"vc"},{"n":"RUBRO_HIJO","t":"vc"},{"n":"RUBRO_PADRE","t":"vc"},{"n":"TIPO_RUBRO","t":"vc"}]},"VERSION_FLUJO_CAJA":{"m":"CF","d":"","f":[{"n":"ESTADO","t":"vc"},{"n":"FECHA_CALCULO","t":"dt"},{"n":"FECHA_CREACION","t":"dt"},{"n":"FECHA_FINAL","t":"dt"},{"n":"FECHA_HISTORICO","t":"dt"},{"n":"FECHA_INICIAL","t":"dt"},{"n":"FECHA_MODIFICACION","t":"dt"},{"n":"FLUJO_CAJA","t":"vc"},{"n":"USUARIO_CALCULO","t":"vc"},{"n":"USUARIO_CREACION","t":"vc"},{"n":"USUARIO_HISTORICO","t":"vc"},{"n":"USUARIO_MODIFICACION","t":"vc"},{"n":"VERSION","t":"i"}]},"ARTICULO_HISTORICO":{"m":"CI","d":"","f":[{"n":"ARTICULO","t":"nvc"},{"n":"FACTURA","t":"nvc"},{"n":"LINEA","t":"fl"}]},"CLIENTE_INACTIVAR":{"m":"CC","d":"","f":[{"n":"Agente","t":"nvc"},{"n":"Código","t":"nvc"},{"n":"Nombre","t":"nvc"},{"n":"Supervisor","t":"nvc"},{"n":"Zona","t":"fl"}]},"DOCUMENTOS_CC_A_INSERTAR":{"m":"CC","d":"","f":[{"n":"ACT_DETRAC","t":"nvc"},{"n":"ACTIVIDAD_COMERCIAL","t":"nvc"},{"n":"ANULADO","t":"nvc"},{"n":"APLICACION","t":"nvc"},{"n":"APROBADO","t":"nvc"},{"n":"ASIENTO","t":"nvc"},{"n":"ASIENTO_PENDIENTE","t":"nvc"},{"n":"AUD_FECHA_ANUL","t":"nvc"},{"n":"AUD_USUARIO_ANUL","t":"nvc"},{"n":"AUDITORIA_COBRO","t":"nvc"},{"n":"BASE_IMPUESTO1","t":"fl"},{"n":"BASE_IMPUESTO2","t":"fl"},{"n":"CANCELACION","t":"nvc"},{"n":"CARGADO_DE_FACT","t":"nvc"},{"n":"CLASE_DOC_ES","t":"nvc"},{"n":"CLASE_DOCUMENTO","t":"nvc"},{"n":"CLAVE_DE","t":"nvc"},{"n":"CLAVE_REFERENCIA_DE","t":"nvc"},{"n":"CLAVE_TECNICA","t":"nvc"},{"n":"CLIENTE","t":"nvc"},{"n":"CLIENTE_ORIGEN","t":"nvc"},{"n":"CLIENTE_REPORTE","t":"nvc"},{"n":"COBRADOR","t":"nvc"},{"n":"CODIGO_IMPUESTO","t":"nvc"},{"n":"CODIGO_REFERENCIA_DE","t":"nvc"}]},"FACTURA_AUXILIAR_CC":{"m":"FA","d":"","f":[{"n":"ASIENTO","t":"nvc"},{"n":"CLI_DOC_CREDIT","t":"nvc"},{"n":"CLI_DOC_DEBITO","t":"nvc"},{"n":"CLI_REPORTE_CREDIT","t":"nvc"},{"n":"CLI_REPORTE_DEBITO","t":"nvc"},{"n":"CREDITO","t":"nvc"},{"n":"DEBITO","t":"nvc"},{"n":"ES_INT_CORRIENTE","t":"nvc"},{"n":"FECHA","t":"nvc"},{"n":"FOLIOSAT_CREDITO","t":"nvc"},{"n":"FOLIOSAT_DEBITO","t":"nvc"},{"n":"MONEDA_CREDITO","t":"nvc"},{"n":"MONEDA_DEBITO","t":"nvc"},{"n":"MONTO_CLI_CREDITO","t":"nvc"},{"n":"MONTO_CLI_DEBITO","t":"nvc"},{"n":"MONTO_CREDITO","t":"nvc"},{"n":"MONTO_DEBITO","t":"nvc"},{"n":"MONTO_DOLAR","t":"nvc"},{"n":"MONTO_LOCAL","t":"fl"},{"n":"TIPO_CAMBIO_APLICA","t":"nvc"},{"n":"TIPO_CREDITO","t":"nvc"},{"n":"TIPO_DEBITO","t":"nvc"}]},"FACTURA_HISTORICA_ORIGINAL":{"m":"FA","d":"","f":[{"n":"AJUSTE_REDONDEO","t":"nvc"},{"n":"ANULADA","t":"nvc"},{"n":"ASIENTO_DOCUMENTO","t":"nvc"},{"n":"BASE_IMPUESTO1","t":"dc"},{"n":"BASE_IMPUESTO2","t":"nvc"},{"n":"CARGADO_CG","t":"nvc"},{"n":"CARGADO_CXC","t":"nvc"},{"n":"CLASE_DOCUMENTO","t":"nvc"},{"n":"CLIENTE","t":"nvc"},{"n":"CLIENTE_CORPORAC","t":"nvc"},{"n":"CLIENTE_DIRECCION","t":"nvc"},{"n":"CLIENTE_ORIGEN","t":"nvc"},{"n":"COBRADA","t":"nvc"},{"n":"COBRADOR","t":"nvc"},{"n":"COMENTARIO_CXC","t":"nvc"},{"n":"COMISION_COBRADOR","t":"nvc"},{"n":"COMISION_VENDEDOR","t":"nvc"},{"n":"CONDICION_PAGO","t":"nvc"},{"n":"CONSECUTIVO","t":"nvc"},{"n":"DESCUENTO_CASCADA","t":"nvc"},{"n":"DESCUENTO_VOLUMEN","t":"nvc"},{"n":"DIREC_EMBARQUE","t":"nvc"},{"n":"DIRECCION_FACTURA","t":"nvc"},{"n":"DIVISION_GEOGRAFICA1","t":"nvc"},{"n":"DIVISION_GEOGRAFICA2","t":"nvc"}]},"ZONA_VENDEDOR_TODAS":{"m":"FA","d":"","f":[{"n":"ESTATUS","t":"nvc"},{"n":"PRIORIDAD","t":"fl"},{"n":"U_CODIGO","t":"nvc"},{"n":"U_DESCRIP","t":"nvc"},{"n":"VENDEDOR","t":"fl"},{"n":"ZONA","t":"nvc"}]},"RPT_AUDIT_EMBARQUE_BEVAL":{"m":"CO","d":"","f":[{"n":"AJUSTE_CONFIG","t":"vc"},{"n":"APLICACION","t":"vc"},{"n":"ARTICULO","t":"vc"},{"n":"AUDIT_TRANS_INV","t":"i"},{"n":"CANTIDAD","t":"dc"},{"n":"COSTO_TOT_COMP_DOL","t":"dc"},{"n":"COSTO_TOT_COMP_LOC","t":"dc"},{"n":"COSTO_TOT_FISC_DOL","t":"dc"},{"n":"COSTO_TOT_FISC_LOC","t":"dc"},{"n":"DESCRIPCION","t":"vc"},{"n":"DOCUMENTO","t":"vc"},{"n":"EMBARQUE","t":"vc"},{"n":"ESTADO","t":"vc"},{"n":"FECHA_EMBARQUE","t":"dt"},{"n":"FECHA_HORA_TRANSAC","t":"dt"},{"n":"FECHA_OFRECIDA","t":"dt"},{"n":"MODULO_ORIGEN","t":"vc"},{"n":"NATURALEZA","t":"vc"},{"n":"ORDEN_COMPRA","t":"vc"},{"n":"ORDEN_COMPRA_LINEA","t":"si"},{"n":"PROVEEDOR","t":"vc"},{"n":"SUBSUBTIPO","t":"vc"},{"n":"SUBTIPO","t":"vc"},{"n":"SUBTOTAL","t":"dc"},{"n":"TC_PRECIO_DOC_DOLAR","t":"dc"}]},"DOCUMENTOS_CC_A_ENVIAR":{"m":"CC","d":"","f":[{"n":"ACT_DETRAC","t":"nvc"},{"n":"ACTIVIDAD_COMERCIAL","t":"nvc"},{"n":"ANULADO","t":"nvc"},{"n":"APLICACION","t":"nvc"},{"n":"APROBADO","t":"nvc"},{"n":"ASIENTO","t":"nvc"},{"n":"ASIENTO_PENDIENTE","t":"nvc"},{"n":"AUD_FECHA_ANUL","t":"nvc"},{"n":"AUD_USUARIO_ANUL","t":"nvc"},{"n":"AUDITORIA_COBRO","t":"nvc"},{"n":"BASE_IMPUESTO1","t":"fl"},{"n":"BASE_IMPUESTO2","t":"fl"},{"n":"CANCELACION","t":"nvc"},{"n":"CARGADO_DE_FACT","t":"nvc"},{"n":"CLASE_DOC_ES","t":"nvc"},{"n":"CLASE_DOCUMENTO","t":"nvc"},{"n":"CLAVE_DE","t":"nvc"},{"n":"CLAVE_REFERENCIA_DE","t":"nvc"},{"n":"CLAVE_TECNICA","t":"nvc"},{"n":"CLIENTE","t":"nvc"},{"n":"CLIENTE_ORIGEN","t":"nvc"},{"n":"CLIENTE_REPORTE","t":"nvc"},{"n":"COBRADOR","t":"nvc"},{"n":"CODIGO_IMPUESTO","t":"nvc"},{"n":"CODIGO_REFERENCIA_DE","t":"nvc"}]},"PEDIDO_CARGA":{"m":"FA","d":"","f":[{"n":"CLIENTE","t":"fl"},{"n":"CONDICION_PAGO","t":"fl"},{"n":"ESTADO","t":"nvc"},{"n":"FECHA_HORA","t":"nvc"},{"n":"OBSERVACIONES","t":"nvc"},{"n":"PEDIDO","t":"nvc"},{"n":"PORC_DESCUENTO1","t":"fl"},{"n":"RUTA","t":"fl"},{"n":"U_Descripcion","t":"nvc"},{"n":"U_Instrumento_Pago","t":"fl"},{"n":"U_ORIGENCATALOGO","t":"nvc"},{"n":"U_Pedido_Padre","t":"nvc"},{"n":"VENDEDOR","t":"fl"}]},"ZONAS_VENDEDOR_SILLACA":{"m":"FA","d":"","f":[{"n":"CODIGO","t":"nvc"},{"n":"DESCRIPCIÓN","t":"nvc"},{"n":"ESTATUS","t":"nvc"},{"n":"PRIORIDAD","t":"nvc"},{"n":"VENDEDOR","t":"nvc"},{"n":"ZONA","t":"nvc"}]},"ABC_GEO":{"m":"AS","d":"","f":[{"n":"ARTICULO","t":"vc"},{"n":"CLASE_ABC","t":"c"}]},"ACCION":{"m":"AS","d":"","f":[{"n":"ACCION","t":"i"},{"n":"DESCRIPCION","t":"vc"},{"n":"ESESTANDAR","t":"vc"},{"n":"ESMODULO","t":"vc"},{"n":"INVOCACION","t":"vc"},{"n":"NOMBREACCION","t":"vc"},{"n":"NOMBRECONSTANTE","t":"vc"},{"n":"SUBTIPO","t":"vc"},{"n":"TABLA","t":"vc"},{"n":"TIPO","t":"vc"}]},"ACCION_CARRO":{"m":"AS","d":"","f":[{"n":"ACCION","t":"i"},{"n":"ACCION_DOBLE","t":"i"},{"n":"ACCION_SIMPLE","t":"i"},{"n":"CLIENTE","t":"vc"},{"n":"CLINOM","t":"vc"},{"n":"FACTOR","t":"dc"},{"n":"PEDIDO","t":"vc"},{"n":"TOTAL_MERCADERIA_PEDIDO","t":"dc"},{"n":"VENDEDOR","t":"vc"},{"n":"VENNOM","t":"vc"}]},"ACCION_VERSION":{"m":"AS","d":"","f":[{"n":"ACCION","t":"i"},{"n":"FCH_HORA_VERSION","t":"dt"},{"n":"ULT_VERSION","t":"vc"},{"n":"ULT_VERSIONERP","t":"vc"},{"n":"USUARIO","t":"vc"}]},"AccountAuthorizations":{"m":"AS","d":"","f":[{"n":"BulkUpdatePrivilege","t":"si"},{"n":"DeletePrivilege","t":"si"},{"n":"EditPrivilege","t":"si"},{"n":"ExecutePrivilege","t":"si"},{"n":"Id","t":"dc"},{"n":"InsertPrivilege","t":"si"},{"n":"ObjectName1","t":"vc"},{"n":"ObjectName2","t":"vc"},{"n":"ObjectType","t":"si"},{"n":"ReadPrivilege","t":"si"},{"n":"UpdatePrivilege","t":"si"},{"n":"UserFlag","t":"si"}]},"ACE_COFERSA":{"m":"AS","d":"","f":[{"n":"ACTIVO","t":"vc"},{"n":"ARTICULO","t":"vc"},{"n":"ARTICULO_CUENTA","t":"vc"},{"n":"ARTICULO_DEL_PROV","t":"vc"},{"n":"BULTOS","t":"si"},{"n":"CLASE_ABC","t":"vc"},{"n":"CLASIFICACION_1","t":"vc"},{"n":"CLASIFICACION_2","t":"vc"},{"n":"CLASIFICACION_3","t":"vc"},{"n":"CODIGO_BARRAS_INVT","t":"vc"},{"n":"CODIGO_BARRAS_VENT","t":"vc"},{"n":"COSTO_COMPARATIVO","t":"vc"},{"n":"COSTO_FISCAL","t":"vc"},{"n":"COSTO_PROM_DOL","t":"dc"},{"n":"COSTO_PROM_LOC","t":"dc"},{"n":"COSTO_STD_DOL","t":"dc"},{"n":"COSTO_STD_LOC","t":"dc"},{"n":"COSTO_ULT_DOL","t":"dc"},{"n":"COSTO_ULT_LOC","t":"dc"},{"n":"DESCRIPCION","t":"vc"},{"n":"DIAS_CUARENTENA","t":"si"},{"n":"EXISTENCIA_MAXIMA","t":"dc"},{"n":"EXISTENCIA_MINIMA","t":"dc"},{"n":"FACTOR_CONVER_1","t":"dc"},{"n":"FACTOR_CONVER_2","t":"dc"}]},"ACE_FRANK":{"m":"AS","d":"","f":[{"n":"ARANCEL","t":"vc"},{"n":"BSSA","t":"fl"},{"n":"CANT","t":"fl"},{"n":"CD","t":"fl"},{"n":"CODIGO_BARRAS","t":"vc"},{"n":"DESCRIPCION","t":"vc"},{"n":"DIFEMAR","t":"fl"},{"n":"HHG","t":"fl"},{"n":"LINEA","t":"i"},{"n":"NEW","t":"c"},{"n":"PROV_ACE","t":"vc"}]},"ACOSTA":{"m":"AS","d":"","f":[{"n":"ARTICULO","t":"vc"},{"n":"CANT_DISPONIBLE","t":"dc"},{"n":"CODIGO_BARRAS_VENT","t":"vc"},{"n":"DESCRIPCION","t":"vc"}]},"ActiveBGTasks":{"m":"AS","d":"","f":[{"n":"Padding1","t":"c"},{"n":"RequestingUser","t":"vc"},{"n":"TaskDescription","t":"c"},{"n":"TaskExecutable","t":"vc"},{"n":"TaskName","t":"vc"},{"n":"TaskNumber","t":"dc"},{"n":"TaskParms1","t":"c"},{"n":"TaskParms2","t":"c"},{"n":"TaskStatusCode","t":"vc"},{"n":"TaskTypeCode","t":"vc"}]},"AGENTE_ANALISTA_COFERSA":{"m":"AS","d":"","f":[{"n":"ANALISTA","t":"vc"},{"n":"VENDEDOR","t":"vc"}]},"akira":{"m":"AS","d":"","f":[{"n":"CLIENTE","t":"vc"},{"n":"CONTRIBUYENTE","t":"vc"},{"n":"DESC_TOT_LINEA","t":"i"},{"n":"DESCRIPCION","t":"vc"},{"n":"DESCUENTO_VOLUMEN","t":"dc"},{"n":"FACTURA","t":"vc"},{"n":"FECHA_HORA","t":"dt"},{"n":"MONTO_DESCUENTO1","t":"dc"},{"n":"NOMBRE","t":"vc"},{"n":"RAZON_SOCIAL","t":"vc"},{"n":"TIPO_CAMBIO","t":"dc"},{"n":"TIPO_DOCUMENTO","t":"vc"},{"n":"TOTAL_FACTURA","t":"dc"},{"n":"TOTAL_IMPUESTO1","t":"dc"},{"n":"TOTAL_MERCADERIA","t":"dc"}]},"ALIAS_ACE":{"m":"AS","d":"","f":[{"n":"ARTICULO","t":"vc"},{"n":"CODIGO_CATALOGO","t":"vc"}]},"ALTA_DEMANDA_AFV":{"m":"AS","d":"","f":[{"n":"CLIENTE","t":"vc"},{"n":"CODIGO_AFV","t":"vc"},{"n":"FECHA_RIGE_FIN","t":"dt"},{"n":"FECHA_RIGE_INICIO","t":"dt"}]},"ANALISTA":{"m":"AS","d":"","f":[{"n":"ANALISTA","t":"vc"},{"n":"NOMBRE","t":"vc"}]},"APLICA_ESQUEMA":{"m":"AS","d":"","f":[{"n":"FECHA_APLICACION","t":"dt"},{"n":"IDAPLICA_ESQUEMA","t":"i"},{"n":"IDSQL","t":"i"},{"n":"NOMBRE_ESQUEMA","t":"vc"},{"n":"RESULTADO_APLICACION","t":"tx"},{"n":"USUARIO_APLICACION","t":"vc"},{"n":"VERSION","t":"i"}]},"ApplicationMessages":{"m":"AS","d":"","f":[{"n":"MessageLanguage","t":"i"},{"n":"MessageNo","t":"i"},{"n":"MessageText","t":"vc"}]},"Applications":{"m":"AS","d":"","f":[{"n":"ApplicationId","t":"uid"},{"n":"ApplicationName","t":"nvc"},{"n":"Description","t":"nvc"}]},"ARCHIVO_APLICADO":{"m":"AS","d":"","f":[{"n":"APLICADO_POR","t":"vc"},{"n":"ARCHIVO","t":"vc"},{"n":"COMPANIA","t":"vc"},{"n":"CONTENIDO","t":"tx"},{"n":"ESTADO","t":"vc"},{"n":"FECHA_HORA_APLIC","t":"dt"},{"n":"TIPO","t":"vc"}]},"ART_LIQUIDA":{"m":"AS","d":"","f":[{"n":"ABC","t":"vc"},{"n":"ARTICULO","t":"vc"},{"n":"LIQUIDAR","t":"vc"},{"n":"MARCA","t":"vc"}]},"ART_PREC_RSML":{"m":"AS","d":"","f":[{"n":"ARTICULO","t":"vc"},{"n":"CODIGO_BARRAS_VENT","t":"vc"},{"n":"MARGEN_MULR","t":"dc"},{"n":"PRECIO","t":"dc"}]},"ARTCOF":{"m":"AS","d":"","f":[{"n":"ARTICULO","t":"vc"},{"n":"CLASIFICACION_1","t":"vc"},{"n":"CLASIFICACION_2","t":"vc"},{"n":"CLASIFICACION_3","t":"vc"}]},"ARTEZ":{"m":"AS","d":"","f":[{"n":"ARTICULO_NEW","t":"vc"},{"n":"ARTICULO_OLD","t":"vc"},{"n":"CLASIFICACION_3","t":"vc"},{"n":"CODIGO_BARRAS_INVT","t":"vc"},{"n":"CODIGO_BARRAS_VENT","t":"vc"},{"n":"DESCRIPCION_NEW","t":"vc"}]},"ARTUNI":{"m":"AS","d":"","f":[{"n":"ARTBSA","t":"vc"},{"n":"ARTCOF","t":"vc"},{"n":"ARTDIF","t":"vc"},{"n":"ARTESZ","t":"vc"},{"n":"DESCRIPCION","t":"vc"},{"n":"MARCA","t":"vc"}]},"AspNetRoleClaims":{"m":"AS","d":"","f":[{"n":"ClaimType","t":"nvc"},{"n":"ClaimValue","t":"nvc"},{"n":"Id","t":"i"},{"n":"RoleId","t":"nvc"}]},"AspNetRoles":{"m":"AS","d":"","f":[{"n":"ConcurrencyStamp","t":"nvc"},{"n":"Id","t":"nvc"},{"n":"Name","t":"nvc"},{"n":"NormalizedName","t":"nvc"}]},"AspNetUserClaims":{"m":"AS","d":"","f":[{"n":"ClaimType","t":"nvc"},{"n":"ClaimValue","t":"nvc"},{"n":"Id","t":"i"},{"n":"UserId","t":"nvc"}]},"AspNetUserLogins":{"m":"AS","d":"","f":[{"n":"LoginProvider","t":"nvc"},{"n":"ProviderDisplayName","t":"nvc"},{"n":"ProviderKey","t":"nvc"},{"n":"UserId","t":"nvc"}]},"AspNetUserRoles":{"m":"AS","d":"","f":[{"n":"RoleId","t":"nvc"},{"n":"UserId","t":"nvc"}]},"AspNetUsers":{"m":"AS","d":"","f":[{"n":"AccessFailedCount","t":"i"},{"n":"ConcurrencyStamp","t":"nvc"},{"n":"Email","t":"nvc"},{"n":"EmailConfirmed","t":"bt"},{"n":"Id","t":"nvc"},{"n":"LockoutEnabled","t":"bt"},{"n":"LockoutEnd","t":"dt"},{"n":"Name","t":"nvc"},{"n":"NormalizedEmail","t":"nvc"},{"n":"NormalizedUserName","t":"nvc"},{"n":"PasswordHash","t":"nvc"},{"n":"PhoneNumber","t":"nvc"},{"n":"PhoneNumberConfirmed","t":"bt"},{"n":"SecurityStamp","t":"nvc"},{"n":"TwoFactorEnabled","t":"bt"},{"n":"UserName","t":"nvc"}]},"AspNetUserTokens":{"m":"AS","d":"","f":[{"n":"LoginProvider","t":"nvc"},{"n":"Name","t":"nvc"},{"n":"UserId","t":"nvc"},{"n":"Value","t":"nvc"}]},"AuditLog":{"m":"AS","d":"","f":[{"n":"AuditLogToken","t":"dc"},{"n":"LogDesc","t":"c"},{"n":"MessageType","t":"i"},{"n":"Username","t":"vc"}]},"AuditLogTypes":{"m":"AS","d":"","f":[{"n":"MessageDesc","t":"vc"},{"n":"MessageType","t":"i"}]},"AUTENTICA_CATALOGO":{"m":"AS","d":"","f":[{"n":"ACTIVO","t":"vc"},{"n":"CATALOGO","t":"vc"},{"n":"CODIGO","t":"vc"},{"n":"CODIGO_CATALOGO","t":"vc"},{"n":"CONJUNTO","t":"vc"},{"n":"USUARIO_PRIVILEGIOS","t":"vc"}]},"AUTENTICACION":{"m":"AS","d":"","f":[{"n":"CLAVE","t":"vc"},{"n":"CODIGO","t":"vc"},{"n":"USUARIO_EXACTUS","t":"vc"},{"n":"USUARIO_WINDOWS","t":"vc"}]},"AVALUO":{"m":"AS","d":"","f":[{"n":"FECHA","t":"dt"},{"n":"FECHA_VENCE","t":"dt"},{"n":"MONTO","t":"dc"},{"n":"SALDO","t":"dc"},{"n":"TIPO","t":"vc"}]},"AVALUO_OIC":{"m":"AS","d":"","f":[{"n":"FECHA","t":"dt"},{"n":"FECHA_VENCE","t":"dt"},{"n":"MONTO","t":"dc"},{"n":"SALDO","t":"dc"},{"n":"TIPO","t":"vc"}]},"AVG_GEO_RSML":{"m":"AS","d":"","f":[{"n":"CLIENTE","t":"vc"},{"n":"FACTURA","t":"vc"},{"n":"FECHA","t":"dt"},{"n":"LINEAS","t":"i"},{"n":"NOMBRE","t":"vc"}]},"AVG_GEO_RSML_FINAL":{"m":"AS","d":"","f":[{"n":"AVG_LINEA","t":"i"},{"n":"CLIENTE","t":"vc"},{"n":"NOMBRE","t":"vc"}]},"B_RALI":{"m":"AS","d":"","f":[{"n":"DEBITO","t":"vc"},{"n":"MONTO_COBRADO","t":"dc"}]},"BACKORDER_EDI_COFERSA":{"m":"AS","d":"","f":[{"n":"CANT_EDI","t":"fl"},{"n":"CANT_FACTURADA","t":"fl"},{"n":"CLIENTE","t":"vc"},{"n":"COD_INT_ARTICULO","t":"vc"},{"n":"DESCRIPCION","t":"vc"},{"n":"ESTADO_PEDIDO","t":"vc"},{"n":"EXISTENCIA_BODEGA_B001","t":"fl"},{"n":"FACTOR_CONVERSION","t":"fl"},{"n":"FECHA_DOC_EDI","t":"dt"},{"n":"FECHA_FACTURA","t":"dt"},{"n":"MARCA","t":"vc"},{"n":"NIVEL_PRECIO","t":"vc"},{"n":"NOMBRE","t":"vc"},{"n":"NUMDOC","t":"vc"},{"n":"PEDIDO_ERP","t":"vc"},{"n":"PRECIO_UNITARIO_PED","t":"dc"},{"n":"VERSION","t":"i"}]},"BACKORDER_EDI_EPA_COFERSA":{"m":"AS","d":"","f":[{"n":"CANT_DEVOLUCION","t":"dc"},{"n":"CANT_EDI","t":"fl"},{"n":"CANT_FACTURADA","t":"fl"},{"n":"CLIENTE","t":"vc"},{"n":"COD_INT_ARTICULO","t":"vc"},{"n":"CODIGO_ARTICULO_PROV","t":"vc"},{"n":"DESCRIPCION","t":"vc"},{"n":"DEVOLUCION","t":"vc"},{"n":"DIFERENCIA","t":"fl"},{"n":"ESTADO_PEDIDO","t":"vc"},{"n":"EXISTENCIA_BODEGA_B001","t":"fl"},{"n":"FACTOR_CONVERSION","t":"fl"},{"n":"FACTURA","t":"vc"},{"n":"FCH_DEV","t":"dt"},{"n":"FECHA_DOC_EDI","t":"dt"},{"n":"FECHA_FACTURA","t":"dt"},{"n":"MARCA","t":"vc"},{"n":"NIVEL_PRECIO","t":"vc"},{"n":"NOMBRE","t":"vc"},{"n":"NUMDOC","t":"vc"},{"n":"OBSERVACIONES_DEVOLUCION","t":"tx"},{"n":"PEDIDO_ERP","t":"vc"},{"n":"PRECIO_UNITARIO_PED","t":"dc"},{"n":"SUBTOTAL_OC_EDI","t":"fl"},{"n":"TOTAL_OC_EDI","t":"fl"}]},"BARRAS_ESCAZU":{"m":"AS","d":"","f":[{"n":"ARTICULO","t":"vc"},{"n":"CODIGO_BARRAS_VENT","t":"vc"},{"n":"LEN_ARTICULO","t":"i"},{"n":"LEN_BARRAS","t":"i"}]},"BASE_AGRUPACION":{"m":"AS","d":"","f":[{"n":"ANO","t":"vc"},{"n":"CODIGO_VENDEDOR","t":"vc"},{"n":"DIF_PPTO","t":"dc"},{"n":"HABILES_HOY","t":"i"},{"n":"HABILES_MES","t":"i"},{"n":"MES","t":"vc"},{"n":"NOMBRE_VENDEDOR","t":"vc"},{"n":"PRESUPUESTO_CONSTRUCCION","t":"dc"},{"n":"PRESUPUESTO_FERRETERIA","t":"dc"},{"n":"PRESUPUESTO_HELECTRICA","t":"dc"},{"n":"PRESUPUESTO_LIQUIDACION","t":"dc"},{"n":"PRESUPUESTO_LORENZETTI","t":"dc"},{"n":"PRESUPUESTO_VENTA","t":"dc"},{"n":"SUPERVISOR","t":"vc"},{"n":"VENTA_CONSTRUCCION","t":"dc"},{"n":"VENTA_FERRETERIA","t":"dc"},{"n":"VENTA_HELECTRICA","t":"dc"},{"n":"VENTA_LIQUIDACION","t":"dc"},{"n":"VENTA_LORENZETTI","t":"dc"},{"n":"VENTA_NETA","t":"dc"},{"n":"VENTA_NETA_TOTAL","t":"dc"}]},"BASE_AGUI_COFER":{"m":"AS","d":"","f":[{"n":"CONCEPTO","t":"vc"},{"n":"DESCRIPCION","t":"vc"},{"n":"EMPLEADO","t":"vc"},{"n":"FECHA_FIN","t":"dt"},{"n":"FECHA_INICIO","t":"dt"},{"n":"NOMBRE","t":"vc"},{"n":"NOMINA","t":"vc"},{"n":"NUMERO_NOMINA","t":"si"},{"n":"TOTAL","t":"dc"}]},"BASE_KARIN":{"m":"AS","d":"","f":[{"n":"ANO","t":"i"},{"n":"ARTICULO","t":"vc"},{"n":"CANTIDAD","t":"dc"},{"n":"CANTON","t":"vc"},{"n":"CLASIFICACION_1","t":"vc"},{"n":"CLASIFICACION_2","t":"vc"},{"n":"CLASIFICACION_3","t":"vc"},{"n":"CLASIFICACION_4","t":"vc"},{"n":"CLASIFICACION_5","t":"vc"},{"n":"CLIENTE","t":"vc"},{"n":"CLINOM","t":"vc"},{"n":"DESCRIPCION","t":"vc"},{"n":"DISTRITO","t":"vc"},{"n":"MARGEN","t":"dc"},{"n":"MES","t":"i"},{"n":"NOMBRE","t":"vc"},{"n":"PEDIDO","t":"vc"},{"n":"PROVINCIA","t":"vc"},{"n":"RUTA","t":"vc"},{"n":"SOLICITADO","t":"i"},{"n":"U_AGRUPACION","t":"vc"},{"n":"U_REGION_VTA","t":"vc"},{"n":"U_SEGMENTO","t":"vc"},{"n":"VENDEDOR","t":"vc"},{"n":"VTAS","t":"dc"}]},"BASE_RALI":{"m":"AS","d":"","f":[{"n":"CLIENTE","t":"vc"},{"n":"CREDITO","t":"vc"},{"n":"FACTURA","t":"vc"},{"n":"FECHA_COBRO","t":"dt"},{"n":"FECHA_FACTURA","t":"dt"},{"n":"MONTO_COBRADO_LOC","t":"dc"},{"n":"NOMBRE","t":"vc"},{"n":"PEDIDO","t":"vc"},{"n":"RUTA","t":"vc"},{"n":"RUTA_NOMBRE","t":"vc"},{"n":"TIPO_CREDITO","t":"vc"},{"n":"TOTAL_FACTURA","t":"dc"},{"n":"VENDEDOR_NOMBRE","t":"vc"},{"n":"VENDEDOR_PRINCIPAL","t":"vc"}]},"BASE_RPT":{"m":"AS","d":"","f":[{"n":"ANO","t":"vc"},{"n":"CODIGO_VENDEDOR","t":"vc"},{"n":"HABILES_HOY","t":"i"},{"n":"HABILES_MES","t":"i"},{"n":"MES","t":"vc"},{"n":"NOMBRE_VENDEDOR","t":"vc"},{"n":"PRESUPUESTO_CONSTRUCCION","t":"dc"},{"n":"PRESUPUESTO_FERRETERIA","t":"dc"},{"n":"PRESUPUESTO_HELECTRICA","t":"dc"},{"n":"PRESUPUESTO_LIQUIDACION","t":"dc"},{"n":"PRESUPUESTO_LORENZETTI","t":"dc"},{"n":"PRESUPUESTO_VENTA","t":"dc"},{"n":"SUPERVISOR","t":"vc"},{"n":"VENTA_CONSTRUCCION","t":"dc"},{"n":"VENTA_FERRETERIA","t":"dc"},{"n":"VENTA_HELECTRICA","t":"dc"},{"n":"VENTA_LIQUIDACION","t":"dc"},{"n":"VENTA_LORENZETTI","t":"dc"},{"n":"VENTA_NETA","t":"dc"},{"n":"VENTA_NETA_TOTAL","t":"dc"}]},"BASE_RPT_FINAL":{"m":"AS","d":"","f":[{"n":"ANO","t":"vc"},{"n":"CODIGO_VENDEDOR","t":"vc"},{"n":"DIF_PPTO","t":"dc"},{"n":"HABILES_HOY","t":"i"},{"n":"HABILES_MES","t":"i"},{"n":"MES","t":"vc"},{"n":"NOMBRE_VENDEDOR","t":"vc"},{"n":"PRESUPUESTO_CONSTRUCCION","t":"dc"},{"n":"PRESUPUESTO_FERRETERIA","t":"dc"},{"n":"PRESUPUESTO_HELECTRICA","t":"dc"},{"n":"PRESUPUESTO_LIQUIDACION","t":"dc"},{"n":"PRESUPUESTO_LORENZETTI","t":"dc"},{"n":"PRESUPUESTO_VENTA","t":"dc"},{"n":"SUPERVISOR","t":"vc"},{"n":"VENTA_CONSTRUCCION","t":"dc"},{"n":"VENTA_FERRETERIA","t":"dc"},{"n":"VENTA_HELECTRICA","t":"dc"},{"n":"VENTA_LIQUIDACION","t":"dc"},{"n":"VENTA_LORENZETTI","t":"dc"},{"n":"VENTA_NETA","t":"dc"},{"n":"VENTA_NETA_TOTAL","t":"dc"}]},"BASE_RUTA":{"m":"AS","d":"","f":[{"n":"CANTON","t":"vc"},{"n":"CLIENTE","t":"vc"},{"n":"DIAS_RUTA_ESF","t":"vc"},{"n":"DIAS_SEMANA_FR","t":"i"},{"n":"DOCUMENTO","t":"vc"},{"n":"FECHA_INICIO","t":"dt"},{"n":"HORA_FIN","t":"vc"},{"n":"MTO_PEDIDO","t":"dc"},{"n":"NOMBRE_CLIENTE","t":"vc"},{"n":"PROVINCIA","t":"vc"},{"n":"RAZON","t":"vc"},{"n":"RAZON_VISITA","t":"vc"},{"n":"RUTA","t":"vc"},{"n":"SEMANA_ANO_ESF","t":"i"},{"n":"SEMANA_ANO_SYSTEM","t":"i"},{"n":"SEMANA_MES_SYSTEM","t":"i"},{"n":"VISITA_VALIDA","t":"i"},{"n":"ZONA_HENKEL","t":"vc"}]},"BASE_RUTA_CARGA":{"m":"AS","d":"","f":[{"n":"CLIENTE","t":"vc"},{"n":"CODIGO_ESF","t":"vc"},{"n":"DIA_RUTA","t":"vc"},{"n":"SEMANA","t":"vc"},{"n":"ZONA_HENKEL","t":"vc"}]},"BASE_RUTA_COFERSA":{"m":"AS","d":"","f":[{"n":"CANTON","t":"vc"},{"n":"CLIENTE","t":"vc"},{"n":"COD_SUPERVISOR","t":"vc"},{"n":"COD_VENDEDOR","t":"vc"},{"n":"DIAS_RUTA_ESF","t":"vc"},{"n":"DIAS_SEMANA_FR","t":"i"},{"n":"DOCUMENTO","t":"vc"},{"n":"FECHA_INICIO","t":"dt"},{"n":"HORA_FIN","t":"vc"},{"n":"MTO_PEDIDO","t":"dc"},{"n":"NOMBRE_CLIENTE","t":"vc"},{"n":"PROVINCIA","t":"vc"},{"n":"RAZON","t":"vc"},{"n":"RAZON_VISITA","t":"vc"},{"n":"RUTA","t":"vc"},{"n":"SEMANA_ANO_ESF","t":"i"},{"n":"SEMANA_ANO_SYSTEM","t":"i"},{"n":"SEMANA_MES_SYSTEM","t":"i"},{"n":"SUPERVISOR","t":"vc"},{"n":"VENDEDOR","t":"vc"},{"n":"VISITA_VALIDA","t":"i"},{"n":"ZONA_HENKEL","t":"vc"}]},"basura":{"m":"AS","d":"","f":[{"n":"ARTICULO","t":"vc"},{"n":"CANTIDAD","t":"dc"},{"n":"LINEA","t":"i"}]},"BGTaskDefinitions":{"m":"AS","d":"","f":[{"n":"ExclusiveFlag","t":"ti"},{"n":"MaxConcurrent","t":"i"},{"n":"TaskDescription","t":"vc"},{"n":"TaskExecutable","t":"vc"},{"n":"TaskName","t":"vc"},{"n":"TaskTypeCode","t":"vc"}]},"BGTaskHistory":{"m":"AS","d":"","f":[{"n":"CompletionDate","t":"dt"},{"n":"CompletionStatus","t":"i"},{"n":"RequestingUser","t":"vc"},{"n":"StartDate","t":"dt"},{"n":"SubmissionDate","t":"dt"},{"n":"TaskDescription","t":"vc"},{"n":"TaskErrorMsg","t":"vc"},{"n":"TaskExecutable","t":"vc"},{"n":"TaskName","t":"vc"},{"n":"TaskNumber","t":"dc"},{"n":"TaskParms1","t":"vc"},{"n":"TaskParms2","t":"vc"},{"n":"TaskTypeCode","t":"vc"}]},"BI_DATO_DIARIO":{"m":"AS","d":"","f":[{"n":"ACUM_REGLONES_FACTURADOS","t":"dc"},{"n":"ACUMULADO_REGLON_PEDIDO_NORMAL_AUTORIZADO","t":"dc"},{"n":"ACUMULADO_REGLON_PEDIDO_NORMAL_NO_AUTORIZACION","t":"dc"},{"n":"ACUMULADO_REGLON_PEDIDO_PENDIENTE_APROBACION","t":"dc"},{"n":"BACKORDER","t":"dc"},{"n":"BACKORDER_ACUM","t":"dc"},{"n":"BACKORDER_MTO","t":"dc"},{"n":"BACKORDER_MTO_ACUM","t":"dc"},{"n":"DEVOLUCIONES","t":"dc"},{"n":"DEVOLUCIONES_ACUMULADAS","t":"dc"},{"n":"DIAS_ACUMULADOS","t":"i"},{"n":"MTO_COBRADO","t":"dc"},{"n":"MTO_COBRADO_ACUM","t":"dc"},{"n":"NOTA_CREDITO","t":"dc"},{"n":"NOTA_CREDITO_ACUMULADA","t":"dc"},{"n":"PEDIDO_NORMAL_AUTORIZADO","t":"dc"},{"n":"PEDIDO_NORMAL_AUTORIZADO_ACUM","t":"dc"},{"n":"PEDIDO_NORMAL_NO_AUTORIZACION","t":"dc"},{"n":"PEDIDO_NORMAL_NO_AUTORIZACION_ACUM","t":"dc"},{"n":"PEDIDO_NORMAL_PENDIENTE_AUTORIZACION","t":"dc"},{"n":"PEDIDO_NORMAL_PENDIENTE_AUTORIZACION_ACUM","t":"dc"},{"n":"PRESUPUESTO","t":"dc"},{"n":"REGLON_PEDIDO_NORMAL_AUTORIZADO","t":"dc"},{"n":"REGLON_PEDIDO_NORMAL_NO_AUTORIZACION","t":"dc"},{"n":"REGLON_PEDIDO_PENDIENTE_APROBACION","t":"dc"}]},"BOLETA_BI":{"m":"AS","d":"","f":[{"n":"ANO_INGRESO","t":"vc"},{"n":"ARTICULO","t":"vc"},{"n":"ARTICULO_DESCRIPCION","t":"vc"},{"n":"BOLETA","t":"vc"},{"n":"CLIENTE","t":"vc"},{"n":"CLIENTE_NOMBRE","t":"vc"},{"n":"COBRABLE","t":"vc"},{"n":"CONDICION_SERVICIO","t":"vc"},{"n":"CONDICION_SERVICIO_DES","t":"vc"},{"n":"DIA_INGRESO","t":"vc"},{"n":"ESTADO","t":"vc"},{"n":"FAST_SERVICE","t":"vc"},{"n":"HORAS_COBRO","t":"i"},{"n":"MARCA","t":"vc"},{"n":"MES_INGRESO","t":"vc"},{"n":"PEDIDO","t":"vc"},{"n":"PRESUPUESTO","t":"vc"},{"n":"TIPO_GAR_ENTREGA","t":"vc"},{"n":"TIPO_GAR_ENTREGA_DES","t":"vc"},{"n":"TIPO_SERVICIO","t":"vc"},{"n":"TIPO_SERVICIO_DESC","t":"vc"},{"n":"USUARIO_CREACION","t":"vc"},{"n":"VENDEDOR","t":"vc"},{"n":"VENDEDOR_NOMBRE","t":"vc"}]},"BOLETA_SERVICIO_TSMP":{"m":"AS","d":"","f":[{"n":"ACCESORIOS","t":"tx"},{"n":"AGENTE_RECEPTOR","t":"vc"},{"n":"ANO","t":"vc"},{"n":"CLINOM","t":"vc"},{"n":"CODIGO_CLIENTE","t":"vc"},{"n":"COMENTARIO_NOTAS_ORDEN","t":"tx"},{"n":"DIA","t":"vc"},{"n":"DIAS_NOTAS_ORDEN_SERVICIO","t":"i"},{"n":"DIAS_ORDEN_SERVICIO","t":"i"},{"n":"EMAIL_CLIENTE","t":"vc"},{"n":"ESTADO","t":"vc"},{"n":"FECHA_HORA_NOTAS_ORDEN","t":"dt"},{"n":"FECHA_REPORTE","t":"dt"},{"n":"ID_NOTAS_ORDEN","t":"i"},{"n":"MES","t":"vc"},{"n":"ORDEN_SERVICIO","t":"vc"},{"n":"RESPONSABLE","t":"vc"},{"n":"SERVICIO_CODIGO","t":"vc"},{"n":"SERVICIO_DETALLE","t":"tx"},{"n":"TIPO_CATEGORIA","t":"vc"},{"n":"TIPO_CATEGORIA_DESC","t":"tx"},{"n":"TIPO_DEPARTAMENTO","t":"vc"},{"n":"TIPO_DEPARTAMENTO_DESC","t":"tx"},{"n":"TIPO_SERVICIO","t":"vc"},{"n":"TIPO_SERVICIO_DESC","t":"tx"}]},"BORRA33_BACK":{"m":"AS","d":"","f":[{"n":"CLIENTE","t":"vc"},{"n":"COBRADOR","t":"vc"},{"n":"VENDEDOR","t":"vc"}]},"BOSCH":{"m":"AS","d":"","f":[{"n":"AGENTE","t":"vc"},{"n":"NUEVO","t":"vc"},{"n":"VIEJO","t":"vc"}]},"BULTOS_ZONA_RUTA":{"m":"AS","d":"","f":[{"n":"ANO","t":"i"},{"n":"CLINOM","t":"vc"},{"n":"DESCRIPCION","t":"vc"},{"n":"DIA","t":"i"},{"n":"IDCLIENTE","t":"vc"},{"n":"IDEXPEDICION","t":"vc"},{"n":"MES","t":"i"},{"n":"NOMBRE","t":"vc"},{"n":"RUTA","t":"vc"},{"n":"ZONA","t":"vc"}]},"C_DETALLE_DIRECCION":{"m":"AS","d":"","f":[{"n":"CAMPO_1","t":"vc"},{"n":"CAMPO_10","t":"vc"},{"n":"CAMPO_2","t":"vc"},{"n":"CAMPO_3","t":"vc"},{"n":"CAMPO_4","t":"vc"},{"n":"CAMPO_5","t":"vc"},{"n":"CAMPO_6","t":"vc"},{"n":"CAMPO_7","t":"vc"},{"n":"CAMPO_8","t":"vc"},{"n":"CAMPO_9","t":"vc"},{"n":"DETALLE_DIRECCION","t":"i"},{"n":"DIRECCION","t":"vc"}]},"C_NIT":{"m":"AS","d":"","f":[{"n":"ACTIVIDAD_ECONOMINA","t":"vc"},{"n":"ACTIVO","t":"vc"},{"n":"ALIAS","t":"vc"},{"n":"CARNE","t":"vc"},{"n":"CATEGORIA","t":"vc"},{"n":"CELULAR","t":"vc"},{"n":"CLASE_DOCUMENTO","t":"vc"},{"n":"CORREO","t":"vc"},{"n":"DEPARTAMENTO","t":"vc"},{"n":"DETALLE_DIRECCION","t":"i"},{"n":"DIGITO_VERIFICADOR","t":"vc"},{"n":"DIRECCION","t":"vc"},{"n":"DUI","t":"vc"},{"n":"EXTERIOR","t":"vc"},{"n":"GIRO","t":"vc"},{"n":"INF_LEGAL","t":"vc"},{"n":"MUNICIPIO","t":"vc"},{"n":"NATURALEZA","t":"vc"},{"n":"NIT","t":"vc"},{"n":"NOTAS","t":"tx"},{"n":"NRC","t":"vc"},{"n":"NUMERO_DOC_NIT","t":"vc"},{"n":"ORIGEN","t":"vc"},{"n":"OTRO","t":"vc"},{"n":"PAIS","t":"vc"}]},"C_UNIDAD_DE_MEDIDA":{"m":"AS","d":"","f":[{"n":"DESCRIPCION","t":"vc"},{"n":"U_FEUNIDAD","t":"vc"},{"n":"UNIDAD_MEDIDA","t":"vc"}]},"CADI_1_COFER":{"m":"AS","d":"","f":[{"n":"ARTICULO","t":"vc"},{"n":"COSTO_PROM_LOC","t":"dc"},{"n":"DESCRIPCION","t":"vc"},{"n":"MARGEN_ANTES","t":"dc"},{"n":"MARGEN_DESPUES","t":"nm"},{"n":"MARGEN_MULR_ANTES","t":"dc"},{"n":"PRECIO_ANTES","t":"dc"},{"n":"PRECIO_DESPUES","t":"nm"}]},"CAMBIO_RUTAS":{"m":"AS","d":"","f":[{"n":"CLIENTE","t":"vc"},{"n":"COD_NUEVO","t":"vc"},{"n":"COD_VIEJO","t":"vc"}]},"CAMBIOS_BOSCH":{"m":"AS","d":"","f":[{"n":"CLIENTE","t":"vc"},{"n":"VENDEDOR","t":"vc"}]},"CAPTURATOMA":{"m":"AS","d":"","f":[{"n":"ARTICULO","t":"vc"},{"n":"BODEGA","t":"vc"},{"n":"BOLETA","t":"vc"},{"n":"CANT_DISPONIBLE","t":"fl"},{"n":"CANT_INVENTARIADA","t":"fl"},{"n":"CODIGO_BARRAS_VENT","t":"vc"},{"n":"COMPANIA","t":"vc"},{"n":"DESCRIPCION","t":"vc"},{"n":"FECHA_HORA","t":"dt"},{"n":"TOMA","t":"vc"},{"n":"USUARIO","t":"vc"}]},"CARGA_BONIF":{"m":"AS","d":"","f":[{"n":"ARTICULO","t":"vc"},{"n":"ARTICULO_BONIF","t":"vc"},{"n":"ESCALA_BONIF","t":"i"},{"n":"FACTOR_BONIF","t":"dc"},{"n":"FECHA_FIN_ESC","t":"dt"},{"n":"FECHA_INICIO_ESC","t":"dt"},{"n":"FECHA_ULT_MODIF","t":"dt"},{"n":"MAX_ART_FACT","t":"i"},{"n":"MIN_ART_FACT","t":"i"},{"n":"UNIDADES_BONIF","t":"dc"},{"n":"VERSION_BONIF","t":"i"}]},"CARGA_DCTO":{"m":"AS","d":"","f":[{"n":"ARTICULO","t":"vc"},{"n":"ESCALA_DCTO","t":"i"},{"n":"FECHA_FIN_ESC","t":"dt"},{"n":"FECHA_INICIO_ESC","t":"dt"},{"n":"FECHA_ULT_MODIF","t":"dt"},{"n":"MAX_UNID_FACT","t":"i"},{"n":"MIN_UNID_FACT","t":"i"},{"n":"PORC_DCTO","t":"dc"},{"n":"VERSION_DCTO","t":"i"}]},"CARGA_MARCA_COFER":{"m":"AS","d":"","f":[{"n":"CLASIFICACION_3","t":"vc"},{"n":"CODIGO_BARRAS_VENT","t":"vc"}]},"CARGA_MARCA_RSML":{"m":"AS","d":"","f":[{"n":"CLASIFICACION_3","t":"vc"},{"n":"CODIGO_BARRAS_VENT","t":"vc"}]},"CARGA_MAX_MIN_COFER":{"m":"AS","d":"","f":[{"n":"CODIGO_BARRAS_VENT","t":"vc"},{"n":"EXISTENCIA_MAXIMA","t":"dc"},{"n":"EXISTENCIA_MINIMA","t":"dc"}]},"CARGA_MAX_MIN_ESCAZU":{"m":"AS","d":"","f":[{"n":"CODIGO_BARRAS_VENT","t":"vc"},{"n":"EXISTENCIA_MAXIMA","t":"dc"},{"n":"EXISTENCIA_MINIMA","t":"dc"}]},"CARGA_MAX_MIN_HHG":{"m":"AS","d":"","f":[{"n":"CODIGO_BARRAS_VENT","t":"vc"},{"n":"EXISTENCIA_MAXIMA","t":"dc"},{"n":"EXISTENCIA_MINIMA","t":"dc"}]},"CARGA_MODIF":{"m":"AS","d":"","f":[{"n":"CARGA_MODIF","t":"vc"},{"n":"GUID_DOCUMENTO","t":"vc"}]},"CARGA_PRECIO_ART_PROV":{"m":"AS","d":"","f":[{"n":"ARTICULO","t":"vc"},{"n":"PRECIO","t":"dc"},{"n":"PROVEEDOR","t":"vc"}]},"CARPETA_FAVORITOS":{"m":"AS","d":"","f":[{"n":"DESCRIPCION","t":"vc"},{"n":"ID_CARPETA","t":"i"},{"n":"PADRE","t":"i"},{"n":"POSICION","t":"i"},{"n":"USUARIO","t":"vc"}]},"CATALOGO_VARIABLES":{"m":"AS","d":"","f":[{"n":"ACTIVO","t":"bt"},{"n":"DESCRIPCION","t":"vc"},{"n":"FCH_HORA_ULT_MOD","t":"dt"},{"n":"FECHA_HORA_CREACION","t":"dt"},{"n":"PERFIL_VARIABLE","t":"vc"},{"n":"PESO_BASE","t":"dc"},{"n":"USUARIO_CREACION","t":"vc"},{"n":"USUARIO_ULT_MOD","t":"vc"},{"n":"VARIABLE","t":"nm"}]},"CODIGO_BARRAS_VENT":{"m":"AS","d":"","f":[{"n":"ARTICULO","t":"vc"},{"n":"CODIGO_BARRAS_VENT","t":"vc"},{"n":"DESCRIPCION","t":"vc"}]},"COF_CADI":{"m":"AS","d":"","f":[{"n":"CODIGO_BARRAS_VENT","t":"vc"},{"n":"DESCRIPCION","t":"vc"}]},"COMPANIAS_REP":{"m":"AS","d":"","f":[{"n":"ID_COMPANIA","t":"i"},{"n":"NOMBRE","t":"vc"}]},"COMPENSACION_VARIABLE":{"m":"AS","d":"","f":[{"n":"ARTICULO","t":"vc"},{"n":"CLASIFICACION_3","t":"vc"},{"n":"CLIENTE","t":"vc"},{"n":"DIAS_VENCIDO","t":"i"},{"n":"DOCUMENTO","t":"vc"},{"n":"FECHA_CIERRE","t":"dt"},{"n":"MARGEN","t":"dc"},{"n":"margen_maximo","t":"dc"},{"n":"margen_minimo","t":"dc"},{"n":"MONTO","t":"nm"},{"n":"NOMBRE_CLIENTE","t":"vc"},{"n":"NOMBRE_VENDEDOR","t":"vc"},{"n":"TIPO","t":"vc"},{"n":"TIPO_PRODUCTO","t":"vc"},{"n":"TIPO_RECUPERACION","t":"vc"},{"n":"VENCIDO","t":"vc"},{"n":"VENDEDOR","t":"vc"}]},"COMPRAS_OIC":{"m":"AS","d":"","f":[{"n":"ARTICULO","t":"vc"},{"n":"CATEGORIA","t":"vc"},{"n":"CLASIF_ARTICULO","t":"vc"},{"n":"CLIENTES_PROMOCION","t":"vc"},{"n":"COMPRA_MONEDA","t":"dc"},{"n":"COMPRA_UNIDADES","t":"dc"},{"n":"COSTO_RECEPCION","t":"dc"},{"n":"DESCRIPCION","t":"vc"},{"n":"DESCUENTO_AUTORIZ_PROMO","t":"dc"},{"n":"DESTINO_PROMOCION","t":"vc"},{"n":"FECHA","t":"dt"},{"n":"FECHA_FINAL_PROMO","t":"dt"},{"n":"FECHA_INICIAL_PROM","t":"dt"},{"n":"INVENTARIO_ACTUAL","t":"dc"},{"n":"INVENTARIO_ANTERIOR","t":"dc"},{"n":"MARCA_CAT","t":"vc"},{"n":"MARCA_COM","t":"vc"},{"n":"MARGEN","t":"dc"},{"n":"MOTIVO_PROMOCION","t":"vc"},{"n":"NUMERO_PROMOCION","t":"vc"},{"n":"ORDEN_COMPRA","t":"vc"},{"n":"PRESUPUESTO_COMPRAS","t":"dc"},{"n":"PROMOCION_BASADA_EN","t":"vc"},{"n":"PROVEEDOR","t":"vc"},{"n":"ROTACION","t":"dc"}]},"COMPRAVENTA_COFERSA":{"m":"AS","d":"","f":[{"n":"COMPRA_2021_DOL","t":"fl"},{"n":"COMPRA_2021_LOC","t":"fl"},{"n":"MONEDA","t":"vc"},{"n":"NOMBRE","t":"vc"},{"n":"PROVEEDOR","t":"vc"},{"n":"VENTA_2021_DOL","t":"fl"},{"n":"VENTA_2021_LOC","t":"fl"}]},"COMPRAVENTA2_COFERSA":{"m":"AS","d":"","f":[{"n":"COMPRA_ABR07","t":"fl"},{"n":"COMPRA_AGO07","t":"fl"},{"n":"COMPRA_DIC06","t":"fl"},{"n":"COMPRA_ENE07","t":"fl"},{"n":"COMPRA_FEB07","t":"fl"},{"n":"COMPRA_JUL07","t":"fl"},{"n":"COMPRA_JUN07","t":"fl"},{"n":"COMPRA_MAR07","t":"fl"},{"n":"COMPRA_MAY07","t":"fl"},{"n":"COMPRA_NOV06","t":"fl"},{"n":"COMPRA_OCT06","t":"fl"},{"n":"COMPRA_OCT07","t":"fl"},{"n":"COMPRA_SET07","t":"fl"},{"n":"MARCA","t":"vc"},{"n":"NOMBRE","t":"vc"},{"n":"VALORADO","t":"fl"},{"n":"VENTA_ABR07","t":"fl"},{"n":"VENTA_AGO07","t":"fl"},{"n":"VENTA_DIC06","t":"fl"},{"n":"VENTA_ENE07","t":"fl"},{"n":"VENTA_FEB07","t":"fl"},{"n":"VENTA_JUL07","t":"fl"},{"n":"VENTA_JUN07","t":"fl"},{"n":"VENTA_MAR07","t":"fl"},{"n":"VENTA_MAY07","t":"fl"}]},"CONCEPTO_quincena":{"m":"AS","d":"","f":[{"n":"ALIAS","t":"vc"},{"n":"CALCULO_POR_DLL","t":"vc"},{"n":"CALCULO_SPD","t":"vc"},{"n":"CANT_EDITABLE","t":"vc"},{"n":"CARGA_HORAS","t":"vc"},{"n":"CARGA_POR_DLL","t":"vc"},{"n":"CODIGO_ANEXO","t":"vc"},{"n":"CONCEPTO","t":"vc"},{"n":"DESCRIPCION","t":"vc"},{"n":"DIAS_PERIODO","t":"si"},{"n":"DISTRIBUYE_CENTROS","t":"vc"},{"n":"ELIMINAR_CONC_CERO","t":"vc"},{"n":"EXCLUYENTE","t":"vc"},{"n":"FACTOR_REDONDEO","t":"dc"},{"n":"FIJO","t":"vc"},{"n":"FORMULA_DEFINIDA","t":"vc"},{"n":"IMPRIMIR_ACUMULADO","t":"vc"},{"n":"IMPRIMIR_COMP_PAGO","t":"vc"},{"n":"IMPRIMIR_COND_PAGO","t":"vc"},{"n":"INCLUIR_DOC_RH","t":"vc"},{"n":"LIQUIDABLE","t":"vc"},{"n":"MAX_NIVEL","t":"si"},{"n":"MONTO_EDITABLE","t":"vc"},{"n":"NOTAS","t":"tx"},{"n":"OMITIR_MONT_CANT_CERO","t":"vc"}]},"CONFIG_SEGURIDAD":{"m":"AS","d":"","f":[{"n":"VALOR","t":"tx"},{"n":"VARIABLE","t":"vc"}]},"CONFIGURACION":{"m":"AS","d":"","f":[{"n":"VALOR","t":"tx"},{"n":"VARIABLE","t":"vc"}]},"CONJUNTO":{"m":"AS","d":"","f":[{"n":"BD_CIA_CONSOLIDAD","t":"vc"},{"n":"CONJUNTO","t":"vc"},{"n":"CONSOLIDA","t":"vc"},{"n":"CONSOLIDADORA","t":"vc"},{"n":"CONTA_A_CONSOLID","t":"si"},{"n":"DIREC1","t":"vc"},{"n":"DIREC2","t":"vc"},{"n":"DIRECCION_PAG_WEB","t":"vc"},{"n":"DIRECCION_WEB1","t":"vc"},{"n":"DIRECCION_WEB2","t":"vc"},{"n":"DIVISION_GEOGRAFICA1","t":"vc"},{"n":"DIVISION_GEOGRAFICA2","t":"vc"},{"n":"DOBLE_CONTABILIDAD","t":"vc"},{"n":"DOBLE_MONEDA","t":"vc"},{"n":"EMAIL_DOC_ELECTRONICO","t":"vc"},{"n":"FCH_HORA_MODIF_BD","t":"dt"},{"n":"FCH_HORA_ULT_MOD","t":"dt"},{"n":"GLN","t":"vc"},{"n":"IDIOMA","t":"vc"},{"n":"INVENTARIO_DOLAR","t":"vc"},{"n":"LOGO","t":"vc"},{"n":"LOGO_CIA","t":"vb"},{"n":"MASCARA_SUCURSAL","t":"vc"},{"n":"MISMO_CUADRO_CTB","t":"vc"},{"n":"MONEDA_CONSOLIDA","t":"vc"}]},"CONSOLIDA":{"m":"AS","d":"","f":[{"n":"ACTIVO","t":"c"},{"n":"CLASE_ABC","t":"vc"},{"n":"CLICOD","t":"vc"},{"n":"COMPAÑIA","t":"vc"},{"n":"CONDICION_PAGO","t":"vc"},{"n":"CONTRIBUYENTE","t":"vc"},{"n":"DIRECCION","t":"vc"},{"n":"FECHA_INGRESO","t":"dt"},{"n":"FECHA_ULT_MOV","t":"dt"},{"n":"NOMCLI","t":"vc"},{"n":"SALDO","t":"fl"},{"n":"VENDEDOR","t":"vc"},{"n":"VENOM","t":"vc"}]},"CONSOLIDA_CXC":{"m":"AS","d":"","f":[{"n":"APLICACION","t":"vc"},{"n":"ASIENTO","t":"vc"},{"n":"CLIENTE","t":"vc"},{"n":"COMPANIA","t":"vc"},{"n":"CONDICION_PAGO","t":"vc"},{"n":"DESCUENTO","t":"dc"},{"n":"DIAS_NETO","t":"i"},{"n":"DIASANT","t":"i"},{"n":"DOCUMENTO_CLIENTE","t":"vc"},{"n":"FECHA","t":"dt"},{"n":"FECHA_ANUL","t":"dt"},{"n":"FECHA_APROBACION","t":"dt"},{"n":"FECHA_CORTE","t":"dt"},{"n":"FECHA_DOCUMENTO","t":"dt"},{"n":"FECHA_ULT_CREDITO","t":"dt"},{"n":"FECHA_ULT_MOD","t":"dt"},{"n":"FECHA_VENCE","t":"dt"},{"n":"IMPUESTO1","t":"dc"},{"n":"MAS90","t":"dc"},{"n":"MONEDA","t":"vc"},{"n":"MONTO","t":"dc"},{"n":"MONTO_CLIENTE","t":"dc"},{"n":"MONTO_DOLAR","t":"dc"},{"n":"MONTO_LOCAL","t":"dc"},{"n":"NOMBRE_CLIENTE","t":"vc"}]},"CONSOLIDA_CXP":{"m":"AS","d":"","f":[{"n":"APLICACION","t":"vc"},{"n":"ASIENTO","t":"vc"},{"n":"COMPANIA","t":"vc"},{"n":"CONDICION_PAGO","t":"vc"},{"n":"DESCUENTO","t":"dc"},{"n":"DIASANT","t":"i"},{"n":"DOCUMENTO_PROVEEDOR","t":"vc"},{"n":"FECHA","t":"dt"},{"n":"FECHA_ANUL","t":"dt"},{"n":"FECHA_APROBACION","t":"dt"},{"n":"FECHA_CORTE","t":"dt"},{"n":"FECHA_DOCUMENTO","t":"dt"},{"n":"FECHA_ULT_CREDITO","t":"dt"},{"n":"FECHA_ULT_MOD","t":"dt"},{"n":"FECHA_VENCE","t":"dt"},{"n":"IMPUESTO1","t":"dc"},{"n":"MONEDA","t":"vc"},{"n":"MONTO","t":"dc"},{"n":"MONTO_DOLAR","t":"dc"},{"n":"MONTO_LOCAL","t":"dc"},{"n":"MONTO_PROV","t":"dc"},{"n":"NOMBRE_PROVEEDOR","t":"vc"},{"n":"PENDIENTE","t":"vc"},{"n":"PNV07","t":"dc"},{"n":"PNV0715","t":"dc"}]},"CONSOLIDACION_CG":{"m":"AS","d":"","f":[{"n":"ASIENTO","t":"vc"},{"n":"CONSOLIDADA","t":"vc"},{"n":"CONSOLIDADORA","t":"vc"},{"n":"CONTABILIDAD","t":"vc"},{"n":"FECHA_CONSOLIDAC","t":"dt"},{"n":"FECHA_HORA","t":"dt"},{"n":"USUARIO","t":"vc"}]},"CONTROL_CELULAR":{"m":"AS","d":"","f":[{"n":"CELULAR","t":"vc"},{"n":"CELULAR_B","t":"vc"},{"n":"DEPARTAMENTO","t":"vc"},{"n":"FINAL","t":"dt"},{"n":"FINAL_B","t":"dt"},{"n":"IMEI","t":"vc"},{"n":"IMEI2","t":"vc"},{"n":"INICIO","t":"dt"},{"n":"INICIO_B","t":"dt"},{"n":"NOMBRE","t":"vc"},{"n":"TERMINAL","t":"vc"}]},"CORTA":{"m":"AS","d":"","f":[{"n":"ARTICULO","t":"vc"},{"n":"DESCORTA","t":"vc"}]},"COTIZADOR_BI":{"m":"AS","d":"","f":[{"n":"ARTICULO","t":"vc"},{"n":"DESCRIPCION","t":"vc"}]},"CXC_BSSA_TRAN":{"m":"AS","d":"","f":[{"n":"CANT_TRANSACCIONES","t":"i"},{"n":"COMPANIA","t":"vc"},{"n":"FECHA_DOCUMENTO","t":"dt"},{"n":"TIPO","t":"vc"}]},"CXC_COF_TRAN":{"m":"AS","d":"","f":[{"n":"CANT_TRANSACCIONES","t":"i"},{"n":"COMPANIA","t":"vc"},{"n":"FECHA_DOCUMENTO","t":"dt"},{"n":"TIPO","t":"vc"}]},"CXC_DIFEMAR_TRAN":{"m":"AS","d":"","f":[{"n":"CANT_TRANSACCIONES","t":"i"},{"n":"COMPANIA","t":"vc"},{"n":"FECHA_DOCUMENTO","t":"dt"},{"n":"TIPO","t":"vc"}]},"CXC_DOCUMENTOS_SEGUIMIENTO":{"m":"AS","d":"","f":[{"n":"CATCLI","t":"vc"},{"n":"CLICOD","t":"vc"},{"n":"CLINOM","t":"vc"},{"n":"COBRACOD","t":"vc"},{"n":"COBRANOM","t":"vc"},{"n":"CURCOD","t":"vc"},{"n":"DIASAN","t":"i"},{"n":"FCORTE","t":"dt"},{"n":"FECACT","t":"vc"},{"n":"FECVEN","t":"vc"},{"n":"MONTO","t":"dc"},{"n":"NUMDOC","t":"vc"},{"n":"PERIODO1","t":"i"},{"n":"PERIODO2","t":"i"},{"n":"PERIODO3","t":"i"},{"n":"PERIODO4","t":"i"},{"n":"PERIODO5","t":"i"},{"n":"PERIODO6","t":"i"},{"n":"PERIODO7","t":"i"},{"n":"PGPAN1","t":"dc"},{"n":"PGPAN2","t":"dc"},{"n":"PGPAN3","t":"dc"},{"n":"PGPAN4","t":"dc"},{"n":"PGPAN5","t":"dc"},{"n":"PGPAN6","t":"dc"}]},"CXC_ESCAZU_TRAN":{"m":"AS","d":"","f":[{"n":"CANT_TRANSACCIONES","t":"i"},{"n":"COMPANIA","t":"vc"},{"n":"FECHA_DOCUMENTO","t":"dt"},{"n":"TIPO","t":"vc"}]},"CXC_ROSALA_TRAN":{"m":"AS","d":"","f":[{"n":"CANT_TRANSACCIONES","t":"i"},{"n":"COMPANIA","t":"vc"},{"n":"FECHA_DOCUMENTO","t":"dt"},{"n":"TIPO","t":"vc"}]},"CXC_RSML_TRAN":{"m":"AS","d":"","f":[{"n":"CANT_TRANSACCIONES","t":"i"},{"n":"COMPANIA","t":"vc"},{"n":"FECHA_DOCUMENTO","t":"dt"},{"n":"TIPO","t":"vc"}]},"CXCDATA":{"m":"AS","d":"","f":[{"n":"ANULADO","t":"vc"},{"n":"APLICACION","t":"vc"},{"n":"APROBADO","t":"vc"},{"n":"ASIENTO","t":"vc"},{"n":"ASIENTO_PENDIENTE","t":"vc"},{"n":"AUD_FECHA_ANUL","t":"dt"},{"n":"AUD_USUARIO_ANUL","t":"vc"},{"n":"AUDITORIA_COBRO","t":"vc"},{"n":"CARGADO_DE_FACT","t":"vc"},{"n":"CLASE_DOCUMENTO","t":"vc"},{"n":"CLIENTE","t":"vc"},{"n":"CLIENTE_ORIGEN","t":"vc"},{"n":"CLIENTE_REPORTE","t":"vc"},{"n":"COBRADOR","t":"vc"},{"n":"CODIGO_IMPUESTO","t":"vc"},{"n":"CONDICION_PAGO","t":"vc"},{"n":"CONTRARECIBO","t":"vc"},{"n":"CONTRATO","t":"vc"},{"n":"CTA_BANCARIA","t":"vc"},{"n":"DEPENDIENTE","t":"vc"},{"n":"DESCUENTO","t":"dc"},{"n":"DIA","t":"i"},{"n":"DOC_DOC_ORIGEN","t":"vc"},{"n":"DOCUMENTO","t":"vc"},{"n":"FECHA","t":"dt"}]},"DATASET_COFERSA":{"m":"AS","d":"","f":[{"n":"AGRUPACION","t":"vc"},{"n":"CANTON","t":"vc"},{"n":"CLIENTE","t":"vc"},{"n":"LATITUD","t":"dc"},{"n":"LONGUITUD","t":"dc"},{"n":"NOMBRE","t":"vc"},{"n":"PROVINCIA","t":"vc"},{"n":"RAZON_SOCIAL","t":"vc"},{"n":"REGION_VTA","t":"vc"},{"n":"SEGMENTO","t":"vc"}]},"DATASET_GEO":{"m":"AS","d":"","f":[{"n":"ANO","t":"i"},{"n":"ARTDES","t":"vc"},{"n":"ARTICULO","t":"vc"},{"n":"CANTON","t":"vc"},{"n":"CLIENTE","t":"vc"},{"n":"CLINOM","t":"vc"},{"n":"COSTO_TOTAL","t":"dc"},{"n":"DIA","t":"i"},{"n":"GRUPO","t":"vc"},{"n":"LATITUD","t":"dc"},{"n":"LONGITUD","t":"dc"},{"n":"MARCA","t":"vc"},{"n":"MARGEN","t":"dc"},{"n":"MES","t":"i"},{"n":"PRECIO_TOTAL","t":"dc"},{"n":"PROVINCIA","t":"vc"},{"n":"TOTAL_FACTURA","t":"dc"},{"n":"UNDS_VENTA","t":"dc"}]},"DATO_DIARIO":{"m":"AS","d":"","f":[{"n":"DEVOLUCIONES","t":"dc"},{"n":"DEVOLUCIONES_ACUMULADAS","t":"dc"},{"n":"VENTA_ACUMULADA","t":"dc"},{"n":"VENTAS","t":"dc"}]},"DATOS_FIJOS":{"m":"AS","d":"","f":[{"n":"AREA","t":"vc"},{"n":"AVEN_CALLE","t":"vc"},{"n":"CAMISA","t":"vc"},{"n":"CARGO","t":"vc"},{"n":"CEDULA","t":"vc"},{"n":"COD_AREA_TEL_HAB","t":"vc"},{"n":"COD_MOVIL","t":"vc"},{"n":"COD_MOVIL_2","t":"vc"},{"n":"CODIGO_COMPANIA","t":"vc"},{"n":"CODIGO_POSTAL","t":"vc"},{"n":"CODIGO_TRABAJADOR","t":"vc"},{"n":"COMPANIA","t":"vc"},{"n":"CONTRATO","t":"vc"},{"n":"CUIDAD","t":"vc"},{"n":"DEPARTAMENTO","t":"vc"},{"n":"DIAS_LABORA","t":"vc"},{"n":"DIAS_LIBRES","t":"vc"},{"n":"EMAIL","t":"vc"},{"n":"EMPRESA","t":"vc"},{"n":"ESTABLECIMIENTO","t":"vc"},{"n":"ESTADO","t":"vc"},{"n":"ESTADO_CIVIL","t":"vc"},{"n":"FECHA_EXP_CED","t":"dt"},{"n":"FECHA_EXP_RIF","t":"dt"},{"n":"FECHA_NACIMIENTO","t":"dt"}]},"DATOS_FIJOS_FORMULARIO":{"m":"AS","d":"","f":[{"n":"APELLIDO1_PAREN1","t":"vc"},{"n":"APELLIDO1_PAREN2","t":"vc"},{"n":"APELLIDO1_PAREN3","t":"vc"},{"n":"APELLIDO1_PAREN4","t":"vc"},{"n":"APELLIDO1_PAREN5","t":"vc"},{"n":"APELLIDO1_PAREN6","t":"vc"},{"n":"APELLIDO1_PAREN7","t":"vc"},{"n":"APELLIDO1_PAREN8","t":"vc"},{"n":"APELLIDO2_PAREN1","t":"vc"},{"n":"APELLIDO2_PAREN2","t":"vc"},{"n":"APELLIDO2_PAREN3","t":"vc"},{"n":"APELLIDO2_PAREN4","t":"vc"},{"n":"APELLIDO2_PAREN5","t":"vc"},{"n":"APELLIDO2_PAREN6","t":"vc"},{"n":"APELLIDO2_PAREN7","t":"vc"},{"n":"APELLIDO2_PAREN8","t":"vc"},{"n":"AVENIDA","t":"vc"},{"n":"BARRIO_CASERIO","t":"vc"},{"n":"CALLE","t":"vc"},{"n":"CALZADO","t":"vc"},{"n":"CAMISA","t":"vc"},{"n":"CANTON","t":"vc"},{"n":"CEDULA","t":"vc"},{"n":"CEDULA_PAREN1","t":"vc"},{"n":"CEDULA_PAREN2","t":"vc"}]},"dbo.PARAMETROS_LISTAS_PRECIOS":{"m":"AS","d":"","f":[{"n":"ACTUALIZACION","t":"vc"},{"n":"CLIENTES_ASIGNADOS","t":"i"},{"n":"CONTADOR","t":"i"},{"n":"DESC_BASE","t":"dc"},{"n":"DESCRIPCION","t":"vc"},{"n":"ESTADO","t":"vc"},{"n":"EXCEPCIONES_MARCA","t":"vc"},{"n":"HORARIO","t":"vc"},{"n":"NIVEL_PRECIO","t":"vc"}]},"DefaultTypes":{"m":"AS","d":"","f":[{"n":"AllowUserDfltFlag","t":"ti"},{"n":"DefaultType","t":"i"},{"n":"DefaultTypeDesc","t":"vc"}]},"DESC_FIN":{"m":"AS","d":"","f":[{"n":"CLIENTE","t":"vc"},{"n":"CREDITO","t":"vc"},{"n":"DEBITO","t":"vc"},{"n":"MONTO_CREDITO","t":"fl"},{"n":"NOM_VEN","t":"vc"},{"n":"NOMBRE","t":"vc"},{"n":"TIPO_CREDITO","t":"vc"},{"n":"TIPO_DEBITO","t":"vc"},{"n":"VENDEDOR","t":"vc"}]},"DESCHHG":{"m":"AS","d":"","f":[{"n":"ANO","t":"i"},{"n":"MARCA","t":"vc"},{"n":"MES","t":"i"},{"n":"PRECIO_TOTAL","t":"dc"}]},"DESCRIPCION_MACRO":{"m":"AS","d":"","f":[{"n":"Codigo","t":"vc"},{"n":"Descripcion","t":"vc"}]},"DESCRS":{"m":"AS","d":"","f":[{"n":"ANO","t":"i"},{"n":"MARCA","t":"vc"},{"n":"MES","t":"i"},{"n":"PRECIO_TOTAL","t":"dc"}]},"DETALLE_VARIABLE":{"m":"AS","d":"","f":[{"n":"APROBADO","t":"vc"},{"n":"EMPLEADO","t":"vc"},{"n":"FCH_HORA_ULT_MOD","t":"dt"},{"n":"FECHA_HORA_CREACION","t":"dt"},{"n":"META","t":"dc"},{"n":"MONTO_VARIABLE_BASE","t":"dc"},{"n":"MONTO_VARIABLE_MES","t":"dc"},{"n":"NOTAS","t":"vc"},{"n":"OBTENIDO","t":"dc"},{"n":"PERFIL_VARIABLE","t":"vc"},{"n":"PERIODO","t":"vc"},{"n":"PESO_BASE","t":"dc"},{"n":"PESO_MES","t":"dc"},{"n":"USUARIO_CREACION","t":"vc"},{"n":"USUARIO_ULT_MOD","t":"vc"},{"n":"VARIABLE","t":"nm"}]},"DETALLE_VARIABLE_INDICADORES":{"m":"AS","d":"","f":[{"n":"APROBADO","t":"vc"},{"n":"EMPLEADO","t":"vc"},{"n":"FCH_HORA_ULT_MOD","t":"dt"},{"n":"FECHA_HORA_CREACION","t":"dt"},{"n":"META","t":"dc"},{"n":"OBTENIDO","t":"dc"},{"n":"PERFIL_VARIABLE","t":"vc"},{"n":"PERIODO","t":"vc"},{"n":"USUARIO_CREACION","t":"vc"},{"n":"USUARIO_ULT_MOD","t":"vc"},{"n":"VARIABLE","t":"nm"}]},"DEV_FA":{"m":"AS","d":"","f":[{"n":"FACTURA","t":"vc"},{"n":"FECHA","t":"dt"},{"n":"MTODEV","t":"dc"},{"n":"NOTAS","t":"vc"},{"n":"SUBTIPO","t":"vc"},{"n":"TIPO","t":"vc"},{"n":"VENCOD","t":"vc"},{"n":"VENDEDOR","t":"vc"}]},"DEVOLUCIONES_OIC":{"m":"AS","d":"","f":[{"n":"ARTICULO","t":"vc"},{"n":"CANTIDAD_DEV","t":"dc"},{"n":"DESCRIPCION","t":"vc"},{"n":"FACTURA","t":"vc"},{"n":"FECHA","t":"dt"},{"n":"MONEDA","t":"vc"},{"n":"MTODEV","t":"dc"},{"n":"REGION","t":"vc"},{"n":"REGNOM","t":"vc"},{"n":"TIPO_CAMBIO","t":"dc"},{"n":"TIPODES","t":"vc"}]},"DIA_HABIL_COFERSA":{"m":"AS","d":"","f":[{"n":"DiaHabilCOFER","t":"ti"},{"n":"Pk_Fecha","t":"dt"}]},"DIA_RUTA":{"m":"AS","d":"","f":[{"n":"DIA_RUTA","t":"vc"},{"n":"DIA_SEMANA","t":"vc"}]},"DIARIO_ZONA":{"m":"AS","d":"","f":[{"n":"CANT_CLIENTES_FR","t":"i"},{"n":"CANT_CLIENTES_OF","t":"i"},{"n":"CANT_REGLONES_FR","t":"i"},{"n":"CANT_REGLONES_OF","t":"i"},{"n":"MONTO_FR","t":"dc"},{"n":"MONTO_OF","t":"dc"},{"n":"VENDEDOR","t":"vc"},{"n":"VENDEDOR_NOMBRE","t":"vc"},{"n":"ZONA","t":"vc"},{"n":"ZONA_NOMBRE","t":"vc"}]},"DIEGO_CLASE_ABC":{"m":"AS","d":"","f":[{"n":"ARTICULO","t":"vc"},{"n":"CANTIDAD","t":"dc"},{"n":"CLASE_ABC","t":"vc"},{"n":"CLASIFICACION_3","t":"vc"},{"n":"COSTO","t":"dc"},{"n":"DESCRIPCION","t":"vc"},{"n":"NOMBRE","t":"vc"},{"n":"PRECIO","t":"dc"},{"n":"VENDEDOR","t":"vc"}]},"DIEGUITO":{"m":"AS","d":"","f":[{"n":"ANO","t":"i"},{"n":"ARTICULO","t":"vc"},{"n":"CANTIDAD","t":"dc"},{"n":"COSTO","t":"dc"},{"n":"DESCRIPCION","t":"vc"},{"n":"MES","t":"i"}]},"DIRECC":{"m":"AS","d":"","f":[{"n":"CLIENTE","t":"vc"},{"n":"CLIENTE_NEW","t":"vc"},{"n":"DIRECCION","t":"vc"}]},"DIST_PED":{"m":"AS","d":"","f":[{"n":"CANT_PEDIDOS","t":"i"},{"n":"NOMBRE","t":"vc"},{"n":"TIPO","t":"vc"},{"n":"VENDEDOR","t":"vc"}]},"DOCUMENTOS_CXC_COFERSA":{"m":"AS","d":"","f":[{"n":"APLICACION","t":"vc"},{"n":"ASIENTO","t":"vc"},{"n":"CARGADO_DE_FACT","t":"vc"},{"n":"CLIENTE","t":"vc"},{"n":"COBRADOR","t":"vc"},{"n":"CONDICION_PAGO","t":"vc"},{"n":"DESCUENTO","t":"dc"},{"n":"DOCUMENTO","t":"vc"},{"n":"FECHA","t":"dt"},{"n":"FECHA_APROBACION","t":"dt"},{"n":"FECHA_DOCUMENTO","t":"dt"},{"n":"FECHA_VENCE","t":"dt"},{"n":"IMPUESTO1","t":"dc"},{"n":"MONEDA","t":"vc"},{"n":"MONTO","t":"dc"},{"n":"MONTO_CLIENTE","t":"dc"},{"n":"MONTO_DOLAR","t":"dc"},{"n":"MONTO_LOCAL","t":"dc"},{"n":"NOTAS","t":"tx"},{"n":"PAIS","t":"vc"},{"n":"SALDO","t":"dc"},{"n":"SALDO_CLIENTE","t":"dc"},{"n":"SALDO_DOLAR","t":"dc"},{"n":"SALDO_LOCAL","t":"dc"},{"n":"SUBTIPO","t":"si"}]},"DOCUMENTOS_CXP_COFERSA":{"m":"AS","d":"","f":[{"n":"APLICACION","t":"vc"},{"n":"ASIENTO","t":"vc"},{"n":"CHEQUE_CUENTA","t":"vc"},{"n":"CHEQUE_IMPRESO","t":"vc"},{"n":"CONDICION_PAGO","t":"vc"},{"n":"DESCUENTO","t":"dc"},{"n":"DOCUMENTO","t":"vc"},{"n":"FECHA","t":"dt"},{"n":"FECHA_APROBACION","t":"dt"},{"n":"FECHA_DOCUMENTO","t":"dt"},{"n":"FECHA_VENCE","t":"dt"},{"n":"IMPUESTO1","t":"dc"},{"n":"MONEDA","t":"vc"},{"n":"MONTO","t":"dc"},{"n":"MONTO_DOLAR","t":"dc"},{"n":"MONTO_LOCAL","t":"dc"},{"n":"MONTO_PROV","t":"dc"},{"n":"NOTAS","t":"tx"},{"n":"PAQUETE","t":"vc"},{"n":"PROVEEDOR","t":"vc"},{"n":"SALDO","t":"dc"},{"n":"SALDO_LOCAL","t":"dc"},{"n":"SUBTIPO","t":"si"},{"n":"TIPO","t":"vc"},{"n":"TIPO_ASIENTO","t":"vc"}]},"dtproperties":{"m":"AS","d":"","f":[{"n":"id","t":"i"},{"n":"lvalue","t":"img"},{"n":"objectid","t":"i"},{"n":"property","t":"vc"},{"n":"uvalue","t":"nvc"},{"n":"value","t":"vc"},{"n":"version","t":"i"}]},"DW_BD":{"m":"AS","d":"","f":[{"n":"ANO","t":"i"},{"n":"ARTICULO","t":"vc"},{"n":"CANTIDAD","t":"dc"},{"n":"CLASIFICACION_1","t":"vc"},{"n":"CLASIFICACION_2","t":"vc"},{"n":"CLASIFICACION_3","t":"vc"},{"n":"CODIGO_BARRAS_VENT","t":"vc"},{"n":"COSTO_TOTAL","t":"dc"},{"n":"DESCLASIFICACION_1","t":"vc"},{"n":"DESCLASIFICACION_2","t":"vc"},{"n":"DESCLASIFICACION_3","t":"vc"},{"n":"DESCRIPCION","t":"vc"},{"n":"MES","t":"i"},{"n":"PRECIO_TOTAL","t":"dc"},{"n":"TIPO_DOCUMENTO","t":"vc"}]},"EFINAL":{"m":"AS","d":"","f":[{"n":"ARTICULO","t":"vc"},{"n":"CORTA","t":"vc"},{"n":"DESCRIPCION","t":"vc"},{"n":"EAN","t":"vc"},{"n":"MAXIMO","t":"i"},{"n":"MINIMO","t":"i"},{"n":"PRESENTACION","t":"i"}]},"EMAIL_COFERSA":{"m":"AS","d":"","f":[{"n":"E_MAIL","t":"vc"},{"n":"NOMBRE","t":"vc"}]},"EMM_SESSIONCONTROL":{"m":"AS","d":"","f":[{"n":"CONDUIT","t":"vc"},{"n":"PDA","t":"vc"},{"n":"STATE","t":"tx"}]},"EMM_STATS":{"m":"AS","d":"","f":[{"n":"ACTION","t":"i"},{"n":"CONDUIT","t":"vc"},{"n":"ELAPSED_TIME","t":"i"},{"n":"EXECUTIONS","t":"i"},{"n":"SENT_BYTES","t":"i"}]},"EMM_SYNCINFO":{"m":"AS","d":"","f":[{"n":"CONDUIT","t":"vc"},{"n":"PDA","t":"vc"},{"n":"STATE","t":"vc"},{"n":"SYNC_END","t":"dt"},{"n":"SYNC_START","t":"dt"}]},"EMM_TABLECONTROL":{"m":"AS","d":"","f":[{"n":"CONDUIT","t":"vc"},{"n":"LASTSYNCHRONIZATION","t":"dt"},{"n":"PDA","t":"vc"},{"n":"TABLE_NAME","t":"vc"}]},"EPRAC_INV_COFERSA":{"m":"AS","d":"","f":[{"n":"ARTICULO","t":"vc"},{"n":"COD_ARTICULO","t":"vc"},{"n":"EXISTENCIA_BODEGA_B001","t":"i"},{"n":"MARCA","t":"vc"},{"n":"TOTAL_INVENTARIO","t":"i"},{"n":"UBICACION","t":"vc"},{"n":"UNDS_MAXIMAS","t":"i"},{"n":"UNDS_MINIMAS","t":"i"}]},"ERRORCXC":{"m":"AS","d":"","f":[{"n":"AUTORIZADO","t":"vc"},{"n":"CLIENTE","t":"vc"},{"n":"CLINOM","t":"vc"},{"n":"ESTADO","t":"vc"},{"n":"FECHA_PEDIDO","t":"dt"},{"n":"PEDIDO","t":"vc"},{"n":"TIPO_DOCUMENTO","t":"vc"},{"n":"VENDEDOR","t":"vc"}]},"escala_bonif_abre":{"m":"AS","d":"","f":[{"n":"ARTICULO","t":"vc"},{"n":"ARTICULO_BONIF","t":"vc"},{"n":"ESCALA_BONIF","t":"i"},{"n":"FACTOR_BONIF","t":"dc"},{"n":"FECHA_FIN_ESC","t":"dt"},{"n":"FECHA_INICIO_ESC","t":"dt"},{"n":"FECHA_ULT_MODIF","t":"dt"},{"n":"MAX_ART_FACT","t":"i"},{"n":"MIN_ART_FACT","t":"i"},{"n":"MONEDA","t":"vc"},{"n":"NIVEL_PRECIO","t":"vc"},{"n":"UNIDADES_BONIF","t":"dc"},{"n":"USUARIO_ULT_MODIF","t":"vc"},{"n":"VERSION","t":"i"},{"n":"VERSION_BONIF","t":"i"}]},"escala_bonif_maribel":{"m":"AS","d":"","f":[{"n":"ARTICULO","t":"vc"},{"n":"ARTICULO_BONIF","t":"vc"},{"n":"ESCALA_BONIF","t":"i"},{"n":"FACTOR_BONIF","t":"dc"},{"n":"FECHA_FIN_ESC","t":"dt"},{"n":"FECHA_INICIO_ESC","t":"dt"},{"n":"FECHA_ULT_MODIF","t":"dt"},{"n":"MAX_ART_FACT","t":"i"},{"n":"MIN_ART_FACT","t":"i"},{"n":"MONEDA","t":"vc"},{"n":"NIVEL_PRECIO","t":"vc"},{"n":"UNIDADES_BONIF","t":"dc"},{"n":"USUARIO_ULT_MODIF","t":"vc"},{"n":"VERSION","t":"i"},{"n":"VERSION_BONIF","t":"i"}]},"ESCALA_BONIFICACIONES_NIVEL":{"m":"AS","d":"","f":[{"n":"ARTICULO","t":"vc"},{"n":"ARTICULO_BONIF","t":"vc"},{"n":"DESCRIPCION","t":"vc"},{"n":"ESCALA_BONIF","t":"i"},{"n":"FECHA_FIN_ESC","t":"dt"},{"n":"FECHA_INICIO_ESC","t":"dt"},{"n":"MAX_ART_FACT","t":"i"},{"n":"MIN_ART_FACT","t":"i"},{"n":"NIVEL_PRECIO","t":"vc"},{"n":"UNIDADES_BONIF","t":"dc"}]},"ESCALA_DESCUENTOS_NIVEL":{"m":"AS","d":"","f":[{"n":"ARTICULO","t":"vc"},{"n":"DESCRIPCION","t":"vc"},{"n":"ESCALA_DCTO","t":"i"},{"n":"FECHA_FIN_ESC","t":"dt"},{"n":"FECHA_INICIO_ESC","t":"dt"},{"n":"MAX_UNID_FACT","t":"i"},{"n":"MIN_UNID_FACT","t":"i"},{"n":"NIVEL_PRECIO","t":"vc"},{"n":"PORC_DCTO","t":"dc"}]},"ETIQUETA_ESCAZU":{"m":"AS","d":"","f":[{"n":"ARTICULO","t":"vc"},{"n":"DESCRIPCION","t":"vc"}]},"ETIQUETAS_BOLETA_PRECIO":{"m":"AS","d":"","f":[{"n":"ARTICULO_CUENTA","t":"vc"},{"n":"CODIGO_BARRAS_VENT","t":"vc"},{"n":"DESCRIPCION","t":"vc"},{"n":"FECHA_HORA","t":"dt"},{"n":"PRECIO","t":"dc"}]},"ETIQUETAS_BOLETA_PRECIO_COFER":{"m":"AS","d":"","f":[{"n":"ARTICULO","t":"vc"},{"n":"ARTICULO_CUENTA","t":"vc"},{"n":"CODIGO_BARRAS_VENT","t":"vc"},{"n":"DESCRIPCION","t":"vc"},{"n":"FECHA_HORA","t":"dt"},{"n":"PRECIO","t":"dc"}]},"ETIQUETAS_BOLETA_PRECIO_ESCAZU":{"m":"AS","d":"","f":[{"n":"ARTICULO_CUENTA","t":"vc"},{"n":"CODIGO_BARRAS_VENT","t":"vc"},{"n":"DESCRIPCION","t":"vc"},{"n":"FECHA_HORA","t":"dt"},{"n":"PRECIO","t":"dc"}]},"ETIQUETAS_BOLETA_PRECIO_HHG":{"m":"AS","d":"","f":[{"n":"ARTICULO_CUENTA","t":"vc"},{"n":"CODIGO_BARRAS_VENT","t":"vc"},{"n":"DESCRIPCION","t":"vc"},{"n":"FECHA_HORA","t":"dt"},{"n":"PRECIO","t":"fl"}]},"ETIQUETAS_COFER":{"m":"AS","d":"","f":[{"n":"ARTICULO","t":"vc"},{"n":"CODIGO_BARRAS_VENT","t":"vc"},{"n":"DESCRIPCION","t":"vc"},{"n":"U_COD_AFV","t":"vc"}]},"ETIQUETAS_COFERSA":{"m":"AS","d":"","f":[{"n":"ARTICULO","t":"vc"},{"n":"CODIGO_BARRAS_VENT","t":"vc"},{"n":"DESCRIPCION","t":"vc"},{"n":"REFERENCIA","t":"vc"},{"n":"UBICACION","t":"tx"}]},"ETIQUETAS_ESCAZU":{"m":"AS","d":"","f":[{"n":"ARTICULO","t":"vc"},{"n":"CODIGO_BARRAS_VENT","t":"vc"},{"n":"DESCRIPCION","t":"vc"}]},"ETIQUETAS_HHG":{"m":"AS","d":"","f":[{"n":"ARTICULO","t":"vc"},{"n":"CODIGO_BARRAS_VENT","t":"vc"},{"n":"DESCRIPCION","t":"vc"}]},"ETIQUETAS_PRECIO_HHG":{"m":"AS","d":"","f":[{"n":"ARTICULO","t":"vc"},{"n":"ARTICULO_CUENTA","t":"vc"},{"n":"CODIGO_BARRAS_VENT","t":"vc"},{"n":"DESCRIPCION","t":"vc"},{"n":"PRECIO","t":"fl"}]},"ETIQUETAS_TALLER":{"m":"AS","d":"","f":[{"n":"ARTICULO","t":"vc"},{"n":"DESCRIPCION","t":"vc"}]},"EXACT_EXCEPCIONES":{"m":"AS","d":"","f":[{"n":"compannia","t":"vc"},{"n":"modulo","t":"vc"},{"n":"objeto","t":"vc"},{"n":"subObjeto","t":"vc"},{"n":"tipo","t":"vc"}]},"EXIST_ARTI":{"m":"AS","d":"","f":[{"n":"ARTICULO","t":"vc"},{"n":"CANTIDAD","t":"dc"}]},"EZ_ART_PRECIO":{"m":"AS","d":"","f":[{"n":"CODIGO_BARRAS_VENT","t":"vc"},{"n":"MARGEN_MULR","t":"dc"},{"n":"PRECIO","t":"fl"}]},"FACTOR_IMPORTACION_COFERSA":{"m":"AS","d":"","f":[{"n":"AGENTE_ADUANA","t":"vc"},{"n":"AGENTE_CARGA","t":"vc"},{"n":"ARANCEL_LOCAL","t":"dc"},{"n":"COSTO_AGENCIA_ADUANA_LOCAL","t":"dc"},{"n":"COSTO_FLETE_INTERNO_LOCAL","t":"dc"},{"n":"COSTO_MERCANCIA_LOCAL","t":"dc"},{"n":"DUA","t":"vc"},{"n":"EMBARQUE","t":"vc"},{"n":"FACTOR_IMPORTACION","t":"dc"},{"n":"FACTURA","t":"vc"},{"n":"FCH_LLEGADA_EMBARQUE","t":"dt"},{"n":"FCH_SALIDA_EMBARQUE","t":"dt"},{"n":"FCL_LCL","t":"vc"},{"n":"FECHA_INGRESO","t":"dt"},{"n":"LIQUIDAC_COMPRA","t":"vc"},{"n":"ORIGEN","t":"vc"},{"n":"OTRO_LOCAL","t":"dc"},{"n":"PROVEEDOR","t":"vc"},{"n":"SEGURO_LOCAL","t":"dc"},{"n":"TIPO_CAMBIO","t":"dc"},{"n":"TOTAL_NACIONALIZADO_LOCAL","t":"dc"},{"n":"VALOR_MERCANCIA_DOLAR","t":"dc"}]},"FAVORITOS":{"m":"AS","d":"","f":[{"n":"ACCION","t":"i"},{"n":"ACCION_MODULO","t":"i"},{"n":"PADRE","t":"i"},{"n":"POSICION","t":"i"},{"n":"USUARIO","t":"vc"}]},"FECHASEM_FR":{"m":"AS","d":"","f":[{"n":"DIA","t":"vc"},{"n":"DIA_FR","t":"i"},{"n":"DIA_SQL","t":"i"}]},"FER":{"m":"AS","d":"","f":[{"n":"ARTICULO","t":"vc"},{"n":"BODEGA","t":"vc"},{"n":"CANTIDAD_EMBARCADA","t":"dc"},{"n":"CANTIDAD_ORDENADA","t":"dc"},{"n":"CANTIDAD_RECHAZADA","t":"dc"},{"n":"CANTIDAD_RECIBIDA","t":"dc"},{"n":"COMENTARIO","t":"vc"},{"n":"DESCRIPCION","t":"tx"},{"n":"DIAS_PARA_ENTREGA","t":"si"},{"n":"E_MAIL","t":"vc"},{"n":"ESTADO","t":"vc"},{"n":"FACTOR_CONVERSION","t":"dc"},{"n":"FACTURA","t":"vc"},{"n":"FEC_EMBARQUE_PROV","t":"dt"},{"n":"FECHA","t":"dt"},{"n":"FECHA_REQUERIDA","t":"dt"},{"n":"IMPUESTO1","t":"dc"},{"n":"IMPUESTO2","t":"dc"},{"n":"LINEA_USUARIO","t":"si"},{"n":"MONTO_DESCUENTO","t":"dc"},{"n":"ORDEN_COMPRA","t":"vc"},{"n":"ORDEN_COMPRA_LINEA","t":"si"},{"n":"PORC_DESCUENTO","t":"rea"},{"n":"PRECIO_UNITARIO","t":"dc"},{"n":"TIPO_DESCUENTO","t":"vc"}]},"FerreteriasXNivelPrecio":{"m":"AS","d":"","f":[{"n":"Cliente","t":"vc"},{"n":"NivelPrecio","t":"vc"}]},"FH_ACT":{"m":"AS","d":"","f":[{"n":"ACTIVACION_TOTAL","t":"i"},{"n":"ANO","t":"i"},{"n":"CLIENTE","t":"vc"},{"n":"Mes","t":"i"}]},"FH_CATEGORIA":{"m":"AS","d":"","f":[{"n":"ANO","t":"i"},{"n":"CATEGORIA","t":"i"},{"n":"CLIENTE","t":"vc"},{"n":"MES","t":"i"}]},"FH_COBRADO":{"m":"AS","d":"","f":[{"n":"ANO","t":"i"},{"n":"CLIENTE","t":"vc"},{"n":"MES","t":"i"},{"n":"MONTO_COBRADO","t":"dc"}]},"FH_COBRADO_AVG":{"m":"AS","d":"","f":[{"n":"ANO","t":"i"},{"n":"CLIENTE","t":"vc"},{"n":"MES","t":"i"},{"n":"MONTO_COBRADO_PROMEDIO","t":"dc"}]},"FH_COBRADRO":{"m":"AS","d":"","f":[{"n":"ANO","t":"i"},{"n":"CLIENTE","t":"vc"},{"n":"MES","t":"i"},{"n":"MONTO_COBRADO","t":"dc"}]},"FH_DATA":{"m":"AS","d":"","f":[{"n":"ACTIVO","t":"vc"},{"n":"CLIENTE","t":"vc"},{"n":"CLINOM","t":"vc"},{"n":"CONDICION_PAGO","t":"i"},{"n":"RUTA","t":"vc"},{"n":"RUTADES","t":"vc"},{"n":"VENDEDOR","t":"vc"},{"n":"VENNOM","t":"vc"},{"n":"ZONA","t":"vc"},{"n":"ZONADES","t":"vc"}]},"FH_FINAL":{"m":"AS","d":"","f":[{"n":"ACTIVACION","t":"i"},{"n":"ANO","t":"vc"},{"n":"CANTON","t":"vc"},{"n":"CATEGORIA","t":"i"},{"n":"CLIENTE","t":"vc"},{"n":"DISTRITO","t":"vc"},{"n":"MARCAS","t":"i"},{"n":"MES","t":"vc"},{"n":"MONTO_COBRADO","t":"dc"},{"n":"MONTO_COBRADO_AVG","t":"dc"},{"n":"NOMBRE","t":"vc"},{"n":"NOMZON","t":"vc"},{"n":"PROVINCIA","t":"vc"},{"n":"REGION","t":"vc"},{"n":"REGNOM","t":"vc"},{"n":"RENGLONES","t":"i"},{"n":"RUTA","t":"vc"},{"n":"RUTADES","t":"vc"},{"n":"SEGMENTO","t":"vc"},{"n":"VENDEDOR","t":"vc"},{"n":"VENNOM","t":"vc"},{"n":"VENTAS","t":"dc"},{"n":"VENTAS_MAX","t":"dc"},{"n":"ZONA","t":"vc"}]},"FH_MARCA":{"m":"AS","d":"","f":[{"n":"ANO","t":"i"},{"n":"CLIENTE","t":"vc"},{"n":"MARCAS","t":"i"},{"n":"MES","t":"i"}]},"FH_REGION":{"m":"AS","d":"","f":[{"n":"CLIENTE","t":"vc"},{"n":"REGION","t":"vc"},{"n":"REGNOM","t":"vc"},{"n":"VEN_CLI","t":"vc"},{"n":"VENDEDOR","t":"vc"}]},"FINAL_CO":{"m":"AS","d":"","f":[{"n":"EMBARQUE","t":"vc"},{"n":"OC_CONFIRMADA","t":"vc"},{"n":"OC_ESTADO","t":"vc"},{"n":"OC_PROVEEDOR","t":"vc"},{"n":"OC_PROVEEDOR_NOMBRE","t":"vc"},{"n":"OC_TOTAL_A_COMPRAR","t":"dc"},{"n":"OC_TOTAL_MERCADERIA","t":"dc"},{"n":"ORDEN_COMPRA","t":"vc"}]},"FIXCC":{"m":"AS","d":"","f":[{"n":"CLIENTE","t":"vc"},{"n":"CONDICION_PAGO","t":"vc"},{"n":"DIAS_NETO","t":"i"},{"n":"DOCUMENTO","t":"vc"},{"n":"FECHA","t":"dt"},{"n":"FECHA_DOCUMENTO","t":"dt"},{"n":"FECHA_FIX","t":"dt"},{"n":"FECHA_VENCE","t":"dt"},{"n":"TIPO","t":"vc"}]},"GBS":{"m":"AS","d":"","f":[{"n":"ANO","t":"i"},{"n":"ARTICULO","t":"vc"},{"n":"CANTIDAD","t":"dc"},{"n":"CLASIFICACION_1","t":"vc"},{"n":"CLASIFICACION_2","t":"vc"},{"n":"CLASIFICACION_3","t":"vc"},{"n":"CODIGO_BARRAS_VENT","t":"vc"},{"n":"COSTO_TOTAL","t":"dc"},{"n":"DESCLASIFICACION_1","t":"vc"},{"n":"DESCLASIFICACION_2","t":"vc"},{"n":"DESCLASIFICACION_3","t":"vc"},{"n":"DESCRIPCION","t":"vc"},{"n":"MES","t":"i"},{"n":"PRECIO_TOTAL","t":"dc"},{"n":"TIPO_DOCUMENTO","t":"vc"}]},"GEO":{"m":"AS","d":"","f":[{"n":"ARTICULO","t":"vc"},{"n":"BOLETA","t":"vc"},{"n":"CANT_DISP_RESERV","t":"dc"},{"n":"CANT_DISPONIBLE","t":"dc"},{"n":"CANT_RESERVADA","t":"dc"},{"n":"CANT_TRANSAC","t":"dc"},{"n":"COSTO_PROM_LOC","t":"dc"},{"n":"COSTO_TOT_TRANS","t":"dc"},{"n":"DESCRIPCION","t":"vc"},{"n":"NATURALEZA","t":"vc"}]},"GEO_ACE":{"m":"AS","d":"","f":[{"n":"ARTICULO","t":"vc"},{"n":"BODEGA","t":"vc"},{"n":"CANTIDAD_EMBARCADA","t":"dc"},{"n":"CANTIDAD_ORDENADA","t":"dc"},{"n":"CANTIDAD_RECHAZADA","t":"dc"},{"n":"CANTIDAD_RECIBIDA","t":"dc"},{"n":"COMENTARIO","t":"vc"},{"n":"DESCRIPCION","t":"tx"},{"n":"DIAS_PARA_ENTREGA","t":"si"},{"n":"E_MAIL","t":"vc"},{"n":"ESTADO","t":"vc"},{"n":"FACTOR_CONVERSION","t":"dc"},{"n":"FACTURA","t":"vc"},{"n":"FEC_EMBARQUE_PROV","t":"dt"},{"n":"FECHA","t":"dt"},{"n":"FECHA_REQUERIDA","t":"dt"},{"n":"IMPUESTO1","t":"dc"},{"n":"IMPUESTO2","t":"dc"},{"n":"LINEA_USUARIO","t":"si"},{"n":"MONTO_DESCUENTO","t":"dc"},{"n":"ORDEN_COMPRA","t":"vc"},{"n":"ORDEN_COMPRA_LINEA","t":"si"},{"n":"PORC_DESCUENTO","t":"rea"},{"n":"PRECIO_UNITARIO","t":"dc"},{"n":"TIPO_DESCUENTO","t":"vc"}]},"GEOBS":{"m":"AS","d":"","f":[{"n":"CODIGO_BARRAS_VENT","t":"vc"},{"n":"EXISTENCIA_MAXIMA","t":"dc"},{"n":"EXISTENCIA_MINIMA","t":"dc"},{"n":"PUNTO_DE_REORDEN","t":"dc"}]},"GEODES":{"m":"AS","d":"","f":[{"n":"ARTICULO","t":"vc"},{"n":"DESCRIPCION","t":"vc"}]},"GEODIARIO_ZONA":{"m":"AS","d":"","f":[{"n":"CANT_CLIENTES_FR","t":"i"},{"n":"CANT_CLIENTES_OF","t":"i"},{"n":"CANT_CLIENTES_TOT","t":"i"},{"n":"CANT_REGLONES_FR","t":"i"},{"n":"CANT_REGLONES_OF","t":"i"},{"n":"CANT_REGLONES_TOT","t":"i"},{"n":"MONTO_FR","t":"dc"},{"n":"MONTO_OF","t":"dc"},{"n":"MONTO_TOT","t":"dc"},{"n":"VENDEDOR","t":"vc"},{"n":"VENDEDOR_NOMBRE","t":"vc"},{"n":"ZONA","t":"vc"},{"n":"ZONA_NOMBRE","t":"vc"}]},"GEODIF":{"m":"AS","d":"","f":[{"n":"CODIGO_BARRAS_VENT","t":"vc"},{"n":"EXISTENCIA_MAXIMA","t":"dc"},{"n":"EXISTENCIA_MINIMA","t":"dc"},{"n":"PUNTO_DE_REORDEN","t":"dc"}]},"GEOEZ":{"m":"AS","d":"","f":[{"n":"CODIGO_BARRAS_VENT","t":"vc"},{"n":"EXISTENCIA_MAXIMA","t":"dc"},{"n":"EXISTENCIA_MINIMA","t":"dc"},{"n":"PUNTO_DE_REORDEN","t":"dc"}]},"GEOFIN":{"m":"AS","d":"","f":[{"n":"ARTICULO","t":"vc"},{"n":"CANT_ECONOMICA_COM","t":"dc"},{"n":"CANTIDAD_HASTA_1","t":"dc"},{"n":"CANTIDAD_HASTA_2","t":"dc"},{"n":"CODIGO_CATALOGO","t":"vc"},{"n":"DESCRIP_CATALOGO","t":"vc"},{"n":"FACTOR_CONVERSION","t":"dc"},{"n":"FECHA_ULT_COTIZACI","t":"dt"},{"n":"LOTE_ESTANDAR","t":"dc"},{"n":"LOTE_MINIMO","t":"dc"},{"n":"MULTIPLO_COMPRA","t":"dc"},{"n":"NOTAS","t":"vc"},{"n":"PESO_MINIMO_ORDEN","t":"dc"},{"n":"PLAZO_REABASTECIMI","t":"si"},{"n":"PORC_AJUSTE_COSTO","t":"dc"},{"n":"PRECIO_HASTA1","t":"dc"},{"n":"PRECIO2","t":"dc"},{"n":"PRECIO3","t":"dc"},{"n":"PROVEEDOR","t":"vc"},{"n":"UNIDAD_MEDIDA_COMP","t":"vc"}]},"GEOMAX":{"m":"AS","d":"","f":[{"n":"ARTICULO","t":"vc"},{"n":"CODIGO_BARRAS_VENT","t":"vc"},{"n":"EXISTENCIA_MAXIMA","t":"dc"},{"n":"EXISTENCIA_MINIMA","t":"dc"},{"n":"PUNTO_DE_REORDEN","t":"dc"}]},"GEOT":{"m":"AS","d":"","f":[{"n":"ARTICULO","t":"vc"},{"n":"BODEGA","t":"vc"},{"n":"BOLETA","t":"vc"},{"n":"CANT_DISP_RESERV","t":"dc"},{"n":"CANT_DISPONIBLE","t":"dc"},{"n":"CANT_RESERVADA","t":"dc"},{"n":"CANT_TRANSAC","t":"dc"},{"n":"COSTO_PROM_LOC","t":"dc"},{"n":"COSTO_TOT_TRANS","t":"dc"},{"n":"DESCRIPCION","t":"vc"},{"n":"NATURALEZA","t":"vc"}]},"GEOX":{"m":"AS","d":"","f":[{"n":"ARTICULO","t":"vc"},{"n":"BOLETA","t":"vc"},{"n":"CANT_DISP_RESERV","t":"dc"},{"n":"CANT_DISPONIBLE","t":"dc"},{"n":"CANT_RESERVADA","t":"dc"},{"n":"CANT_TRANSAC","t":"dc"},{"n":"COSTO_PROM_LOC","t":"dc"},{"n":"COSTO_TOT_TRANS","t":"dc"},{"n":"DESCRIPCION","t":"vc"},{"n":"NATURALEZA","t":"vc"}]},"GEOXXX":{"m":"AS","d":"","f":[{"n":"ARTICULO","t":"vc"},{"n":"CANT_DISPONIBLE_BSSA","t":"i"},{"n":"CANT_DISPONIBLE_COFERSA","t":"i"},{"n":"CANT_DISPONIBLE_DIFEMAR","t":"i"},{"n":"CANT_DISPONIBLE_ESCAZU","t":"i"},{"n":"CLASIFICACION_1","t":"vc"},{"n":"CODIGO_BARRAS_VENT","t":"vc"},{"n":"DESCRIPCION","t":"vc"},{"n":"EXISTENCIA_MAXIMA_BSSA","t":"i"},{"n":"EXISTENCIA_MAXIMA_COFERSA","t":"dc"},{"n":"EXISTENCIA_MAXIMA_DIFEMAR","t":"i"},{"n":"EXISTENCIA_MAXIMA_ESCAZU","t":"i"},{"n":"EXISTENCIA_MINIMA_BSSA","t":"i"},{"n":"EXISTENCIA_MINIMA_COFERSA","t":"dc"},{"n":"EXISTENCIA_MINIMA_DIFEMAR","t":"i"},{"n":"EXISTENCIA_MINIMA_ESCAZU","t":"i"},{"n":"PUNTO_DE_REORDEN_BSSA","t":"i"},{"n":"PUNTO_DE_REORDEN_COFERSA","t":"dc"},{"n":"PUNTO_DE_REORDEN_DIFEMAR","t":"i"},{"n":"PUNTO_DE_REORDEN_ESCAZU","t":"i"}]},"GEOZN":{"m":"AS","d":"","f":[{"n":"CLIENTE","t":"vc"},{"n":"RUTA","t":"vc"},{"n":"ZONA","t":"vc"}]},"GESTION_LISTAS_PRECIOS":{"m":"AS","d":"","f":[{"n":"ACTIVO","t":"vc"},{"n":"COLUMNA_DCTO","t":"vc"},{"n":"COMPANIA","t":"vc"},{"n":"FACTOR_MULTIPLICADOR","t":"dc"},{"n":"FECHA_CORTE","t":"dt"},{"n":"FECHA_INICIO","t":"dt"},{"n":"HORAS_ATRAS","t":"si"},{"n":"ID","t":"i"},{"n":"MONEDA","t":"vc"},{"n":"MONEDA_BASE","t":"vc"},{"n":"NIVEL_PRECIO","t":"vc"},{"n":"NIVEL_PRECIO_BASE","t":"vc"},{"n":"ORDEN_EJECUCION","t":"si"},{"n":"TIPO_EJECUCION","t":"vc"},{"n":"TIPO_VARIACION","t":"vc"},{"n":"VARIACION_PORC","t":"dc"},{"n":"VERSION","t":"si"}]},"GH":{"m":"AS","d":"","f":[{"n":"DOS","t":"dc"},{"n":"UNO","t":"dc"}]},"GLOBALES_CO_QA":{"m":"AS","d":"","f":[{"n":"AGREGAR_INTERSECCI","t":"vc"},{"n":"APLICAR_NC","t":"vc"},{"n":"APROBAR_OC_JERARQUIA","t":"vc"},{"n":"BODEGA_DEFAULT","t":"vc"},{"n":"CANT_DIAS_ENV_NOTIF","t":"i"},{"n":"CANTIDAD_DEC","t":"si"},{"n":"CAPAS_AFEC_CAPA_RESPEC","t":"vc"},{"n":"CAPAS_AFEC_OTRAS_CAPAS","t":"vc"},{"n":"CAPAS_AFEC_PRIMER_CAPA","t":"vc"},{"n":"CAPAS_APLIC_VARIACION","t":"vc"},{"n":"CAPAS_CONT_VARIACION","t":"vc"},{"n":"CODIGO_DEVOLUCION","t":"vc"},{"n":"CONSECUTIVO_CI","t":"vc"},{"n":"CONSOLIDAR_LINEAS","t":"vc"},{"n":"CP_EN_LINEA","t":"vc"},{"n":"CRIT_EVAL_PROV1","t":"vc"},{"n":"CRIT_EVAL_PROV10","t":"vc"},{"n":"CRIT_EVAL_PROV2","t":"vc"},{"n":"CRIT_EVAL_PROV3","t":"vc"},{"n":"CRIT_EVAL_PROV4","t":"vc"},{"n":"CRIT_EVAL_PROV5","t":"vc"},{"n":"CRIT_EVAL_PROV6","t":"vc"},{"n":"CRIT_EVAL_PROV7","t":"vc"},{"n":"CRIT_EVAL_PROV8","t":"vc"},{"n":"CRIT_EVAL_PROV9","t":"vc"}]},"GOGO":{"m":"AS","d":"","f":[{"n":"ARTICULO","t":"vc"},{"n":"CANTIDAD","t":"i"},{"n":"CLIENTE","t":"vc"},{"n":"COD_HENKEL","t":"vc"},{"n":"DESCRIPCION_ARTICULO","t":"vc"},{"n":"FECHA","t":"dt"},{"n":"MARCA","t":"vc"},{"n":"NOMBRE_CLIENTE","t":"vc"},{"n":"NOMBRE_HENKEL","t":"vc"},{"n":"NOMBRE_VENDEDOR","t":"vc"},{"n":"PEDIDO","t":"vc"},{"n":"VENDEDOR","t":"vc"},{"n":"VENTAS","t":"dc"}]},"GORVIN":{"m":"AS","d":"","f":[{"n":"ARTICULO","t":"vc"},{"n":"CANT_DISPONIBLE","t":"dc"},{"n":"DESCRIPCION","t":"vc"}]},"GPS_CARGA":{"m":"AS","d":"","f":[{"n":"CLIENTE","t":"vc"},{"n":"LATITUD","t":"dc"},{"n":"LONGITUD","t":"dc"}]},"GPS_GEO":{"m":"AS","d":"","f":[{"n":"CLIENTE","t":"vc"},{"n":"FRECUENCIA","t":"i"},{"n":"GPS","t":"vc"},{"n":"LATITUD","t":"dc"},{"n":"LONGUITUD","t":"dc"},{"n":"NOMBRE","t":"vc"},{"n":"NOMVEN","t":"vc"},{"n":"VENDEDOR","t":"vc"}]},"GroupNames":{"m":"AS","d":"","f":[{"n":"GroupDesc","t":"vc"},{"n":"GroupId","t":"dc"},{"n":"GroupName","t":"vc"}]},"H_S":{"m":"AS","d":"","f":[{"n":"ACTIVO","t":"vc"},{"n":"ARTICULO","t":"vc"},{"n":"ARTICULO_CUENTA","t":"vc"},{"n":"ARTICULO_DEL_PROV","t":"vc"},{"n":"BULTOS","t":"si"},{"n":"CLASE_ABC","t":"vc"},{"n":"CLASIFICACION_1","t":"vc"},{"n":"CLASIFICACION_2","t":"vc"},{"n":"CLASIFICACION_3","t":"vc"},{"n":"CLASIFICACION_4","t":"vc"},{"n":"CLASIFICACION_5","t":"vc"},{"n":"CLASIFICACION_6","t":"vc"},{"n":"CODIGO_BARRAS_INVT","t":"vc"},{"n":"CODIGO_BARRAS_VENT","t":"vc"},{"n":"COSTO_COMPARATIVO","t":"vc"},{"n":"COSTO_FISCAL","t":"vc"},{"n":"COSTO_PROM_DOL","t":"dc"},{"n":"COSTO_PROM_LOC","t":"dc"},{"n":"COSTO_STD_DOL","t":"dc"},{"n":"COSTO_STD_LOC","t":"dc"},{"n":"COSTO_ULT_DOL","t":"dc"},{"n":"COSTO_ULT_LOC","t":"dc"},{"n":"DESCRIPCION","t":"vc"},{"n":"DIAS_CUARENTENA","t":"si"},{"n":"EXISTENCIA_MAXIMA","t":"dc"}]},"H_SUGERIDO":{"m":"AS","d":"","f":[{"n":"ARTICULO","t":"vc"},{"n":"CANT_DISPONIBLE","t":"fl"},{"n":"CANT_DISPONIBLE_COFERSA","t":"fl"},{"n":"CANT_HHG_ABR08","t":"fl"},{"n":"CANT_HHG_FEB08","t":"fl"},{"n":"CANT_HHG_JUL08","t":"fl"},{"n":"CANT_HHG_JUN08","t":"fl"},{"n":"CANT_HHG_MAR08","t":"fl"},{"n":"CANT_HHG_MAY08","t":"fl"},{"n":"CLA1DES","t":"vc"},{"n":"CLA2DES","t":"vc"},{"n":"CLA3DES","t":"vc"},{"n":"CLASE_ABC","t":"vc"},{"n":"CLASIFICACION_1","t":"vc"},{"n":"CLASIFICACION_2","t":"vc"},{"n":"CLASIFICACION_3","t":"vc"},{"n":"CODIGO_BARRAS_VENT","t":"vc"},{"n":"COSTO_PROM_DOL","t":"fl"},{"n":"COSTO_PROM_LOC","t":"fl"},{"n":"DESCRIPCION","t":"vc"},{"n":"DESV_STA_PROM6","t":"fl"},{"n":"EXISTENCIA_MAXIMA","t":"fl"},{"n":"FECH_HORA_CREACION","t":"dt"},{"n":"FECHA_INFO","t":"dt"},{"n":"ORIGEN","t":"vc"}]},"HHG_PRECIO":{"m":"AS","d":"","f":[{"n":"CODIGO_BARRAS_VENT","t":"vc"},{"n":"MARGEN_MULR","t":"fl"},{"n":"PRECIO","t":"fl"}]},"HISTORICO_CLAVE":{"m":"AS","d":"","f":[{"n":"CLAVE","t":"vc"},{"n":"LLAVE_HIST_CLAVE","t":"i"},{"n":"USUARIO","t":"vc"}]}};

// ════════════════════════════════════════════════════════
//  COMPONENTE: BUSCADOR DE TABLAS
// ════════════════════════════════════════════════════════
function TableSearchView() {
  const [query,    setQuery]    = useState("");
  const [modFilter,setModFilter]= useState("ALL");
  const [selected, setSelected] = useState(null);
  const [page,     setPage]     = useState(0);
  const PAGE_SIZE = 20;

  const MOD_COLORS = {
    CI:"#16a085",CG:"#c0392b",CC:"#2980b9",CP:"#8e44ad",FA:"#27ae60",
    CO:"#e67e22",CB:"#2c3e50",CN:"#e74c3c",AF:"#795548",CH:"#f39c12",
    CR:"#9b59b6",CF:"#1abc9c",AS:"#455A64",
  };

  const allEntries = useMemo(() => Object.entries(TABLE_CATALOG), []);

  const results = useMemo(() => {
    const q = query.trim().toUpperCase();
    return allEntries.filter(([name, data]) => {
      const modOk = modFilter === "ALL" || data.m === modFilter;
      if (!modOk) return false;
      if (!q) return true;
      if (name.includes(q)) return true;
      if (data.d && data.d.toUpperCase().includes(q)) return true;
      if (data.f && data.f.some(f => f.n.toUpperCase().includes(q))) return true;
      return false;
    });
  }, [query, modFilter, allEntries]);

  useEffect(() => { setPage(0); setSelected(null); }, [query, modFilter]);

  const paginated = results.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const totalPages = Math.ceil(results.length / PAGE_SIZE);

  const mods = ["ALL","CI","FA","CO","CC","CP","CG","CB","CN","AF","CR","CF","CH","AS"];

  return (
    <div style={{fontFamily:"Arial,Helvetica,sans-serif", color:"#1D1D1B"}}>

      {/* ── Barra de búsqueda ── */}
      <div style={{display:"flex",gap:10,flexWrap:"wrap",alignItems:"center",marginBottom:14}}>
        <div style={{position:"relative",flex:1,minWidth:220}}>
          <span style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",fontSize:14,color:"#aaa",pointerEvents:"none"}}>🔍</span>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Buscar tabla, campo o descripción…"
            style={{
              width:"100%", boxSizing:"border-box",
              padding:"9px 12px 9px 32px",
              border:"1px solid #d0d0d0", borderRadius:8,
              fontSize:13, fontFamily:"monospace",
              outline:"none", background:"#fff",
            }}
            autoFocus
          />
          {query && (
            <button onClick={()=>setQuery("")} style={{position:"absolute",right:8,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",fontSize:14,color:"#999",padding:"2px 4px"}}>✕</button>
          )}
        </div>
        <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
          {mods.map(m => {
            const col = m==="ALL"?"#1D1D1B":(MOD_COLORS[m]||"#888");
            const active = modFilter===m;
            const cnt = m==="ALL" ? allEntries.length : allEntries.filter(([,v])=>v.m===m).length;
            return (
              <button key={m} onClick={()=>setModFilter(m)} style={{
                background: active ? col : "transparent",
                border:`1px solid ${active?col:col+"55"}`,
                color: active ? "#fff" : col,
                padding:"4px 11px", borderRadius:20, cursor:"pointer",
                fontSize:10, fontWeight:active?700:500,
                transition:"all 0.15s",
              }}>
                {m==="ALL"?"Todos":m} <span style={{opacity:0.7}}>({cnt})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── KPIs ── */}
      <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap"}}>
        {[
          {label:"Resultados",val:results.length,col:"#0097A7"},
          {label:"Tablas totales",val:allEntries.length,col:"#455A64"},
          {label:"Con descripción",val:allEntries.filter(([,v])=>v.d).length,col:"#2E7D32"},
          {label:"Campos indexados",val:allEntries.reduce((s,[,v])=>s+v.f.length,0).toLocaleString(),col:"#7B1FA2"},
        ].map(k=>(
          <div key={k.label} style={{background:"#f8f9fa",border:`1px solid ${k.col}33`,borderTop:`3px solid ${k.col}`,borderRadius:8,padding:"8px 16px",minWidth:110,textAlign:"center"}}>
            <div style={{fontSize:18,fontWeight:800,color:k.col}}>{k.val}</div>
            <div style={{fontSize:10,color:"#888"}}>{k.label}</div>
          </div>
        ))}
        {query && <div style={{display:"flex",alignItems:"center",fontSize:11,color:"#555",padding:"0 4px"}}>
          ← Filtrando por <strong style={{marginLeft:4,fontFamily:"monospace",color:"#0097A7"}}>"{query}"</strong>
        </div>}
      </div>

      {/* ── Layout: lista + detalle ── */}
      <div style={{display:"flex",gap:12,minHeight:500}}>

        {/* Lista de resultados */}
        <div style={{width:300,flexShrink:0,border:"1px solid #e0e0e0",borderRadius:8,overflow:"hidden",background:"#fff",display:"flex",flexDirection:"column"}}>
          <div style={{padding:"8px 12px",background:"#f5f5f5",borderBottom:"1px solid #e0e0e0",fontSize:10,fontWeight:700,color:"#555",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span>TABLAS ({results.length})</span>
            <span style={{color:"#aaa",fontWeight:400}}>Página {page+1}/{Math.max(1,totalPages)}</span>
          </div>
          <div style={{flex:1,overflowY:"auto"}}>
            {paginated.length === 0 && (
              <div style={{padding:20,textAlign:"center",color:"#aaa",fontSize:12}}>
                No se encontraron tablas para <strong>"{query}"</strong>
              </div>
            )}
            {paginated.map(([name, data]) => {
              const col = MOD_COLORS[data.m] || "#888";
              const active = selected === name;
              const matchFields = query ? data.f.filter(f=>f.n.toUpperCase().includes(query.toUpperCase())) : [];
              return (
                <div key={name} onClick={()=>setSelected(active?null:name)} style={{
                  padding:"9px 12px",
                  borderBottom:"1px solid #f0f0f0",
                  cursor:"pointer",
                  background: active ? col+"10" : "transparent",
                  borderLeft: active ? `3px solid ${col}` : "3px solid transparent",
                  transition:"background 0.1s",
                }}>
                  <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:2}}>
                    <span style={{fontSize:11,fontWeight:700,color:active?col:"#1D1D1B",fontFamily:"monospace",flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{name}</span>
                    {data.m && (
                      <span style={{fontSize:9,background:col+"20",color:col,border:`1px solid ${col}44`,borderRadius:4,padding:"1px 5px",fontWeight:700,flexShrink:0}}>{data.m}</span>
                    )}
                  </div>
                  {data.d && (
                    <div style={{fontSize:9,color:"#777",lineHeight:1.4,overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"}}>{data.d}</div>
                  )}
                  {matchFields.length>0 && (
                    <div style={{marginTop:3,display:"flex",gap:3,flexWrap:"wrap"}}>
                      {matchFields.slice(0,4).map(f=>(
                        <span key={f.n} style={{fontSize:8,background:"#fff3e0",color:"#E65100",border:"1px solid #FFCC80",borderRadius:3,padding:"1px 4px",fontFamily:"monospace"}}>
                          {f.n}
                        </span>
                      ))}
                      {matchFields.length>4 && <span style={{fontSize:8,color:"#aaa"}}>+{matchFields.length-4}</span>}
                    </div>
                  )}
                  <div style={{fontSize:8,color:"#ccc",marginTop:2}}>{data.f.length} campos</div>
                </div>
              );
            })}
          </div>
          {/* Paginación */}
          {totalPages > 1 && (
            <div style={{padding:"8px 12px",borderTop:"1px solid #e0e0e0",display:"flex",gap:6,justifyContent:"center",background:"#f9f9f9"}}>
              <button onClick={()=>setPage(p=>Math.max(0,p-1))} disabled={page===0} style={{padding:"4px 10px",border:"1px solid #ddd",borderRadius:4,cursor:page===0?"not-allowed":"pointer",background:"#fff",color:page===0?"#ccc":"#555",fontSize:11}}>‹ Ant.</button>
              {[...Array(Math.min(5,totalPages))].map((_,i)=>{
                const pi = Math.max(0,Math.min(page-2,totalPages-5))+i;
                return (
                  <button key={pi} onClick={()=>setPage(pi)} style={{padding:"4px 8px",border:"1px solid "+(pi===page?"#0097A7":"#ddd"),borderRadius:4,cursor:"pointer",background:pi===page?"#0097A7":"#fff",color:pi===page?"#fff":"#555",fontSize:11,fontWeight:pi===page?700:400}}>{pi+1}</button>
                );
              })}
              <button onClick={()=>setPage(p=>Math.min(totalPages-1,p+1))} disabled={page===totalPages-1} style={{padding:"4px 10px",border:"1px solid #ddd",borderRadius:4,cursor:page===totalPages-1?"not-allowed":"pointer",background:"#fff",color:page===totalPages-1?"#ccc":"#555",fontSize:11}}>Sig. ›</button>
            </div>
          )}
        </div>

        {/* Panel de detalle */}
        <div style={{flex:1,border:"1px solid #e0e0e0",borderRadius:8,background:"#fff",overflow:"hidden",display:"flex",flexDirection:"column"}}>
          {!selected ? (
            <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",color:"#ccc",gap:10}}>
              <div style={{fontSize:36}}>🗃</div>
              <div style={{fontSize:13,fontWeight:600}}>Selecciona una tabla para ver sus campos</div>
              <div style={{fontSize:11}}>También puedes buscar por nombre de campo</div>
            </div>
          ) : (() => {
            const data = TABLE_CATALOG[selected];
            if (!data) return null;
            const col = MOD_COLORS[data.m] || "#0097A7";
            const fieldQuery = query.toUpperCase();
            return (
              <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
                {/* Header tabla */}
                <div style={{padding:"14px 18px",borderBottom:`1px solid ${col}33`,background:col+"08"}}>
                  <div style={{display:"flex",alignItems:"flex-start",gap:10,marginBottom:6}}>
                    <div style={{flex:1}}>
                      <div style={{fontSize:16,fontWeight:800,fontFamily:"monospace",color:col}}>{selected}</div>
                      {data.m && (
                        <div style={{fontSize:10,color:col,marginTop:2,fontWeight:600}}>
                          Módulo: <strong>{data.m}</strong> · {data.f.length} campos · Schema COFER (CR)
                        </div>
                      )}
                      {!data.m && (
                        <div style={{fontSize:10,color:"#999",marginTop:2}}>
                          {data.f.length} campos · Schema COFER (CR)
                        </div>
                      )}
                    </div>
                    <button onClick={()=>setSelected(null)} style={{background:"none",border:"none",cursor:"pointer",fontSize:16,color:"#aaa",padding:"2px 6px",borderRadius:4}}>✕</button>
                  </div>
                  {data.d ? (
                    <p style={{margin:0,fontSize:12,color:"#444",lineHeight:1.6,background:"#fff",borderRadius:6,padding:"8px 12px",border:`1px solid ${col}22`}}>{data.d}</p>
                  ) : (
                    <p style={{margin:0,fontSize:11,color:"#aaa",fontStyle:"italic"}}>Sin descripción registrada en el diccionario.</p>
                  )}
                </div>
                {/* Lista de campos */}
                <div style={{flex:1,overflowY:"auto"}}>
                  <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
                    <thead style={{position:"sticky",top:0,background:"#f5f5f5",zIndex:1}}>
                      <tr>
                        <th style={{textAlign:"left",padding:"8px 14px",color:"#555",fontWeight:700,borderBottom:"1px solid #e0e0e0",fontSize:11}}>Campo</th>
                        <th style={{textAlign:"left",padding:"8px 14px",color:"#555",fontWeight:700,borderBottom:"1px solid #e0e0e0",fontSize:11}}>Tipo</th>
                        <th style={{textAlign:"center",padding:"8px 14px",color:"#555",fontWeight:700,borderBottom:"1px solid #e0e0e0",fontSize:11}}>UDF</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.f.map(f => {
                        const isMatch = fieldQuery && f.n.toUpperCase().includes(fieldQuery);
                        const isUdf = f.n.startsWith("U_") || f.n.startsWith("UDF_");
                        return (
                          <tr key={f.n} style={{
                            background: isMatch ? "#FFF8E1" : isUdf ? "#F3E5F5" : "transparent",
                            borderBottom:"1px solid #f5f5f5",
                          }}>
                            <td style={{padding:"7px 14px",fontFamily:"monospace",fontWeight:isMatch?700:isUdf?600:400,color:isMatch?"#E65100":isUdf?"#7B1FA2":"#1D1D1B",fontSize:11}}>
                              {isMatch ? (
                                <span dangerouslySetInnerHTML={{__html: f.n.replace(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")})`, "gi"), '<mark style="background:#FFE082;padding:0 1px;border-radius:2px">$1</mark>')}} />
                              ) : f.n}
                            </td>
                            <td style={{padding:"7px 14px",fontFamily:"monospace",fontSize:10,color:col+"99"}}>{f.t}</td>
                            <td style={{padding:"7px 14px",textAlign:"center"}}>
                              {isUdf && <span style={{fontSize:9,background:"#F3E5F5",color:"#7B1FA2",border:"1px solid #CE93D8",borderRadius:4,padding:"1px 5px",fontWeight:700}}>UDF</span>}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}

function DataModelView() {
  const [subTab, setSubTab] = useState("search");
  const [selectedTable, setSelectedTable] = useState("ARTICULO");
  const [projFilter, setProjFilter] = useState(null);

  const projUnits = [...new Set(projects.map(p => p[1]))];
  const filteredProjects = projFilter ? projects.filter(p => p[1]===projFilter) : projects;

  return (
    <div>
      {/* Sub-tabs */}
      <div style={{ display:"flex", gap:4, marginBottom:20, borderBottom:"1px solid #e0e0e0" }}>
        {[
          { id:"search",   label:"🔍 Buscador de Tablas" },
          { id:"udfs",     label:"🔧 UDFs"               },
          { id:"tables",   label:"🗃 Tablas BD"           },
          { id:"projects", label:"📋 Proyectos"           },
        ].map(t => (
          <button key={t.id} onClick={() => setSubTab(t.id)} style={{ background:subTab===t.id?"rgba(255,255,255,0.08)":"transparent", border:"none", borderBottom:subTab===t.id?"2px solid #f39c12":"2px solid transparent", color:subTab===t.id?"#fff":"#666", padding:"8px 16px", cursor:"pointer", fontSize:13, fontWeight:subTab===t.id?700:400, borderRadius:"6px 6px 0 0" }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── UDFs ── */}
      {subTab==="search"  && <TableSearchView />}

      {subTab==="udfs" && (
        <div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(140px, 1fr))", gap:10, marginBottom:24 }}>
            {[
              { label:"UDFs únicos totales", value:633, color:"#f39c12" },
              { label:"Tablas con UDFs",     value:102, color:"#e67e22" },
              { label:"Empresas con UDFs",   value:5,   color:"#3498db" },
            ].map(s => (
              <div key={s.label} style={{ background:"#ffffff", border:"1px solid #e0e0e0", borderRadius:10, padding:"12px 16px" }}>
                <div style={{ fontSize:28, fontWeight:800, color:s.color }}>{s.value}</div>
                <div style={{ fontSize:11, color:"#888" }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* UDFs por módulo */}
          <h4 style={{ fontSize:13, fontWeight:700, color:"#1D1D1B", marginBottom:10 }}>UDFs por módulo</h4>
          <div style={{ display:"flex", flexDirection:"column", gap:5, marginBottom:24 }}>
            {Object.entries(udfByModule).sort((a,b)=>b[1]-a[1]).map(([mod, count]) => {
              const maxCount = 143;
              const modInfo = modules[mod];
              const color = modInfo ? modInfo.color : "#666";
              return (
                <div key={mod} style={{ display:"flex", alignItems:"center", gap:10, background:"#fafafa", borderRadius:6, padding:"6px 12px" }}>
                  <span style={{ fontFamily:"monospace", fontWeight:700, color:color, minWidth:130, fontSize:11 }}>{mod}</span>
                  <div style={{ flex:1, height:8, background:"#f5f5f5", borderRadius:4, overflow:"hidden" }}>
                    <div style={{ width:(count/maxCount*100)+"%", height:"100%", background:color, borderRadius:4 }} />
                  </div>
                  <span style={{ fontSize:12, color:"#777", minWidth:30, textAlign:"right" }}>{count}</span>
                </div>
              );
            })}
          </div>

          {/* UDFs por empresa */}
          <h4 style={{ fontSize:13, fontWeight:700, color:"#e0e0e8", marginBottom:10 }}>UDFs por empresa</h4>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(160px, 1fr))", gap:8, marginBottom:24 }}>
            {Object.entries(udfByCompany).sort((a,b)=>b[1]-a[1]).map(([co, count]) => {
              const comp = companies.find(c => c.name===co || c.name.startsWith(co));
              const color = comp ? comp.color : "#888";
              return (
                <div key={co} style={{ background:"#fafafa", border:"1px solid "+color+"33", borderRadius:8, padding:"10px 14px", borderLeft:"3px solid "+color }}>
                  <div style={{ fontSize:14, fontWeight:700, color:color }}>{co}</div>
                  <div style={{ fontSize:22, fontWeight:800, color:"#e0e0e8", marginTop:2 }}>{count}</div>
                  <div style={{ fontSize:10, color:"#888" }}>UDFs registrados</div>
                </div>
              );
            })}
          </div>

          {/* Top tablas con UDFs */}
          <h4 style={{ fontSize:13, fontWeight:700, color:"#e0e0e8", marginBottom:10 }}>Top 10 tablas con más UDFs</h4>
          <div style={{ display:"flex", flexDirection:"column", gap:4, marginBottom:24 }}>
            {topUdfTables.map(t => {
              const modInfo = modules[t.mod];
              const color = modInfo ? modInfo.color : "#888";
              return (
                <div key={t.table} onClick={() => { setSelectedTable(t.table); setSubTab("tables"); }}
                  style={{ display:"flex", alignItems:"flex-start", gap:12, background:"#fafafa", border:"1px solid #e0e0e0", borderRadius:7, padding:"8px 12px", cursor:sampleUdfs[t.table]?"pointer":"default" }}>
                  <span style={{ fontFamily:"monospace", fontWeight:700, color:"#e0e0e8", minWidth:180, fontSize:11 }}>{t.table}</span>
                  <span style={{ background:color+"22", border:"1px solid "+color+"44", borderRadius:4, padding:"1px 6px", fontSize:9, fontWeight:700, color:color, minWidth:28, textAlign:"center" }}>{t.mod}</span>
                  <span style={{ fontSize:13, fontWeight:700, color:"#f39c12", minWidth:30 }}>{t.udfs}</span>
                  <span style={{ fontSize:11, color:"#888", lineHeight:1.4 }}>{t.desc}</span>
                  {sampleUdfs[t.table] && <span style={{ fontSize:9, color:"#e67e22", marginLeft:"auto", whiteSpace:"nowrap" }}>ver →</span>}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── TABLAS ── */}
      {subTab==="tables" && (
        <div>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:16 }}>
            {Object.keys(sampleUdfs).map(t => (
              <button key={t} onClick={() => setSelectedTable(t)} style={{ background:selectedTable===t?"rgba(243,156,18,0.2)":"rgba(255,255,255,0.04)", border:"1px solid rgba(243,156,18,"+(selectedTable===t?"0.4":"0.1")+")", color:selectedTable===t?"#f39c12":"#888", padding:"5px 12px", borderRadius:6, cursor:"pointer", fontSize:11, fontWeight:600, fontFamily:"monospace" }}>
                {t}
              </button>
            ))}
          </div>
          {selectedTable && sampleUdfs[selectedTable] && (
            <div>
              <div style={{ background:"#ffffff", border:"1px solid #e0e0e0", borderRadius:10, padding:"14px 18px", marginBottom:16 }}>
                <div style={{ fontSize:16, fontWeight:700, color:"#e0e0e8", fontFamily:"monospace" }}>{selectedTable}</div>
                <div style={{ fontSize:11, color:"#888", marginTop:4 }}>
                  {topUdfTables.find(t => t.table===selectedTable)?.desc || ""}
                  {" · "}{sampleUdfs[selectedTable].length} UDFs mostrados
                </div>
              </div>
              <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
                <thead>
                  <tr style={{ borderBottom:"1px solid #e0e0e0" }}>
                    <th style={{ textAlign:"left", padding:"8px 10px", color:"#777", fontWeight:600 }}>Nombre UDF</th>
                    <th style={{ textAlign:"left", padding:"8px 10px", color:"#777", fontWeight:600 }}>Campo DB</th>
                    <th style={{ textAlign:"left", padding:"8px 10px", color:"#777", fontWeight:600 }}>Empresas</th>
                    <th style={{ textAlign:"center", padding:"8px 10px", color:"#777", fontWeight:600 }}>Cobertura</th>
                  </tr>
                </thead>
                <tbody>
                  {sampleUdfs[selectedTable].map(u => {
                    const coverage = u.cos.length;
                    const coverageColor = coverage>=5?"#2ecc71":coverage>=3?"#f39c12":"#e74c3c";
                    return (
                      <tr key={u.ud} style={{ borderBottom:"1px solid #e0e0e0" }}>
                        <td style={{ padding:"7px 10px", fontFamily:"monospace", fontWeight:600, color:"#e0e0e8", fontSize:11 }}>{u.ud}</td>
                        <td style={{ padding:"7px 10px", fontFamily:"monospace", fontSize:10, color:"#f39c12" }}>U_{u.ud}</td>
                        <td style={{ padding:"7px 10px" }}>
                          <div style={{ display:"flex", gap:4, flexWrap:"wrap" }}>
                            {u.cos.map(c => <span key={c} style={{ background:"#f5f5f5", border:"1px solid #e0e0e0", borderRadius:4, padding:"1px 6px", fontSize:9, color:"#666" }}>{c}</span>)}
                          </div>
                        </td>
                        <td style={{ textAlign:"center", padding:"7px 10px" }}>
                          <span style={{ background:coverageColor+"22", color:coverageColor, border:"1px solid "+coverageColor+"44", borderRadius:10, padding:"2px 8px", fontSize:10, fontWeight:700 }}>{coverage}/{companies.length}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── PROYECTOS ── */}
      {subTab==="projects" && (
        <div>
          <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:16 }}>
            <button onClick={() => setProjFilter(null)} style={{ background:!projFilter?"rgba(255,255,255,0.1)":"rgba(255,255,255,0.04)", border:"1px solid #e0e0e0", color:!projFilter?"#fff":"#888", padding:"5px 12px", borderRadius:6, cursor:"pointer", fontSize:10, fontWeight:600 }}>
              Todos ({projects.length})
            </button>
            {projUnits.map(u => {
              const count = projects.filter(p => p[1]===u).length;
              const color = unitColors[u] || "#888";
              return (
                <button key={u} onClick={() => setProjFilter(projFilter===u?null:u)} style={{ background:projFilter===u?color+"22":"rgba(255,255,255,0.04)", border:"1px solid "+color+(projFilter===u?"55":"22"), color:projFilter===u?color:"#888", padding:"5px 12px", borderRadius:6, cursor:"pointer", fontSize:10, fontWeight:600 }}>
                  {u} ({count})
                </button>
              );
            })}
          </div>

          <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
            {filteredProjects.map((p, i) => {
              const [name, unit, prio, estado] = p;
              const color = unitColors[unit] || "#888";
              const prioColor = prio==="Alta"?"#e74c3c":prio==="Media"?"#f39c12":"#888";
              const estadoColor = estado==="Iniciado"?"#2E7D32":"#B8860B";
              return (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:10, background:"#fafafa", border:"1px solid #ebebeb", borderRadius:7, padding:"8px 12px", borderLeft:"3px solid "+color }}>
                  <div style={{ flex:1, fontSize:12, color:"#e0e0e8" }}>{name}</div>
                  <span style={{ fontSize:9, color:color, background:color+"18", border:"1px solid "+color+"33", padding:"1px 7px", borderRadius:10, whiteSpace:"nowrap" }}>{unit}</span>
                  <span style={{ fontSize:9, color:prioColor, background:prioColor+"18", border:"1px solid "+prioColor+"33", padding:"1px 7px", borderRadius:10, whiteSpace:"nowrap" }}>{prio}</span>
                  {estado && <span style={{ fontSize:9, color:estadoColor, background:estadoColor+"18", border:"1px solid "+estadoColor+"33", padding:"1px 7px", borderRadius:10, whiteSpace:"nowrap" }}>{estado}</span>}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}



// ════════════════════════════════════════════════════════
//  BPA — MODELO DE PROCESOS · GRUPO MAYOREO
// ════════════════════════════════════════════════════════

const erpColors = {
  AS:"#475569", CG:"#c0392b", CB:"#2980b9", CC:"#27ae60",
  CP:"#8e44ad", CO:"#d35400", CI:"#f39c12", FA:"#16a085",
  CN:"#e74c3c", AF:"#7f8c8d", CF:"#0284c7", EV:"#be185d",
};

const sysColor = {
  "AFV":"#16a085","SIM":"#f39c12","Power BI / Fabric":"#3498db",
  "Streamline GMDH":"#d35400","WMS ePrac":"#2980b9","Torre de Control":"#2980b9",
  "Portal Pedidos":"#16a085","Portal de Clientes":"#16a085","Portal Proveedores":"#d35400",
  "Sage XRT":"#27ae60","Host to Host":"#27ae60","The Factory HKA":"#27ae60",
  "GTI / FE":"#27ae60","Galac":"#e74c3c","Cubos OLAP":"#3498db","Réplicas SQL":"#3498db",
  "EDI":"#9b59b6","Trade":"#2980b9","Google Workspace":"#f39c12","Monday.com":"#e67e22",
  "GLPI":"#e67e22","Respond.io":"#9b59b6","Catálogo Digital":"#16a085",
  "Última milla":"#2980b9","Agente Cobranza":"#27ae60","n8n":"#9b59b6","Portal Interno":"#f39c12",
};

const bpaAreas = [
  {
    id:"PL", label:"PL — Planificación", color:"#27ae60",
    bg:"#f0faf4", border:"#a8d5bb",
    processes:[
      { id:"PL-P01", code:"PL P01", name:"Formulación del plan estratégico",
        desc:"Define objetivos estratégicos del Grupo Mayoreo, metas por empresa y línea de negocio. Establece KPIs, horizontes de planificación y lineamientos para el presupuesto operativo.",
        erp:["CG","FA","CI","CO"], systems:["SIM","Power BI / Fabric","Monday.com","Google Workspace"],
        dms:["DM Presupuesto","Gestión de Proyectos","Análisis de Rentabilidad"], outputs:["PL-P02","PL-P03"] },
      { id:"PL-P02", code:"PL P02", name:"Formulación del presupuesto operativo",
        desc:"Traduce el plan estratégico en presupuestos detallados por unidad de negocio: ventas, compras, nómina y logística. Se carga en el DM Presupuesto integrado con el ERP Softland.",
        erp:["CG","FA","CO","CI","CN","CP"], systems:["SIM","Power BI / Fabric","Google Workspace"],
        dms:["DM Presupuesto","Análisis de Rentabilidad","Presupuesto consolidado"], outputs:["CVP01","CVP04"] },
      { id:"PL-P03", code:"PL P03", name:"Monitoreo",
        desc:"Seguimiento continuo de KPIs vs presupuesto: ventas, margen, inventario, cobranza y nómina. Genera alertas y reportes ejecutivos consolidados para las 10 empresas del grupo.",
        erp:["CG","FA","CI","CC","CB","CN"], systems:["SIM","Power BI / Fabric","Cubos OLAP","Réplicas SQL"],
        dms:["Análisis de Rentabilidad","Presupuesto consolidado","Data Lake Logístico"], outputs:[] },
    ],
  },
  {
    id:"CV", label:"CV — Cadena de Valor", color:"#2980b9",
    bg:"#f0f6fc", border:"#a8c8e8",
    subareas:[
      {
        id:"DISPONIBLE", label:"DISPONIBLE", color:"#5dade2",
        processes:[
          { id:"CVP01", code:"CVP01", name:"Definición de Surtido",
            desc:"Determina el portafolio de artículos por empresa, canal y mercado. Define clasificación ABC, grupos de compra, políticas de stock mínimo y cobertura por bodega.",
            erp:["CI","CO","FA","CG"], systems:["Streamline GMDH","SIM","Power BI / Fabric"],
            dms:["Corrida BDF y Ajustes de Clasificación","Cálculo de Inventario de Seguridad Dinámico","Homologación de Artículos"],
            outputs:["CVP02","CVP05"] },
          { id:"CVP02", code:"CVP02", name:"Estudio de Factibilidad",
            desc:"Evalúa viabilidad comercial y financiera de artículos y proveedores. Analiza márgenes, costos de importación, aranceles, incoterms y condiciones de pago.",
            erp:["CO","CI","CG","CP"], systems:["Streamline GMDH","Power BI / Fabric","Google Workspace"],
            dms:["DM Presupuesto","Análisis de Rentabilidad"], outputs:["CVP03"] },
          { id:"CVP03", code:"CVP03", name:"Negociación con Proveedores",
            desc:"Gestión de condiciones comerciales: precios, descuentos, plazos, incoterms. Generación y aprobación de órdenes de compra. Portal de proveedores y EDI.",
            erp:["CO","CP","CI"], systems:["Portal Proveedores","EDI","Trade","Google Workspace"],
            dms:["Tracking OC","Indicadores de medición proveedores","Proveedor certificado"],
            outputs:["CVP04","CVP06"] },
          { id:"CVP04", code:"CVP04", name:"Compra",
            desc:"Emisión y seguimiento de OC nacionales e importaciones. Control de embarques, liquidación de costos de importación y arancel. Registro en Cuentas por Pagar.",
            erp:["CO","CP","CI","CG"], systems:["Trade","EDI","Portal Proveedores"],
            dms:["DM de Fletes","Tracking OC"], outputs:["CVP06"] },
          { id:"CVP05", code:"CVP05", name:"Seguimiento Proveedores",
            desc:"Evaluación continua: cumplimiento de entrega, calidad, precio y servicio. Genera indicadores de desempeño y retroalimenta la selección de surtido.",
            erp:["CO","CI"], systems:["SIM","Power BI / Fabric","Portal Proveedores"],
            dms:["Indicadores de medición proveedores","Proveedor certificado"], outputs:["CVP01"] },
          { id:"CVP06", code:"CVP06", name:"Recepción y almacenaje de mercancía",
            desc:"Recepción física en bodega (Centro de Distribución), control de calidad, registro de embarques. Actualización de existencias, lotes y ubicaciones. WMS integrado con ERP para trazabilidad completa.",
            erp:["CI","CO","CG"], systems:["WMS ePrac","Torre de Control"],
            dms:["eFLOW WMS","Combo Kit Maquila y Transformación","Peso cubicaje y código de barras"],
            outputs:["CVP07"] },
        ],
      },
      {
        id:"VENTA", label:"VENTA", color:"#2E7D32",
        processes:[
          { id:"CVP07", code:"CVP07", name:"Oferta del Producto",
            desc:"Gestión del portafolio para venta: precios, niveles, descuentos y promociones. Publicación en canales: AFV (fuerza de ventas en ruta), catálogo digital y portal de pedidos.",
            erp:["FA","CI","CC"], systems:["AFV","Catálogo Digital","Portal Pedidos","SIM"],
            dms:["DM de Promociones","Cargador de Precios Cofersa","Homologación de Artículos"],
            outputs:["CVP11"] },
          { id:"CVP08", code:"CVP08", name:"Administración de Clientes",
            desc:"Gestión del ciclo del cliente: crédito, segmentación, contacto y fidelización. Control de límites de crédito, antigüedad de saldos y gestión de documentos vencidos.",
            erp:["CC","CB","FA","CG"], systems:["AFV","Portal de Clientes","SIM","Agente Cobranza"],
            dms:["Limpieza de Saldos","Alerta temprana de Cobro","Facturas MPPV","Visualizador de Documentos"],
            outputs:["CVP11","CVP12"] },
          { id:"CVP09", code:"CVP09", name:"Evaluación potencial de la zona",
            desc:"Análisis de demanda por zona, canal, artículo y período. Pronostica reposición óptima integrando histórico de ventas FA, tendencias de mercado y visitas AFV.",
            erp:["FA","CI","CO"], systems:["Streamline GMDH","Power BI / Fabric","SIM","Cubos OLAP"],
            dms:["Data Lake Logístico","Optimización de Streamline GMDH","Reporte 4 y Disponibilidad"],
            outputs:["CVP01"] },
          { id:"CVP10", code:"CVP10", name:"Administración de ventas",
            desc:"Gestión del equipo comercial: cuotas, rutas, visitas y cobranzas en campo. Análisis de productividad por vendedor/ruta/zona. Seguimiento de campañas y push money.",
            erp:["FA","CC"], systems:["AFV","SIM","Power BI / Fabric","Respond.io"],
            dms:["Push Money","Indicadores potencial de venta SIM","Formato SIM"],
            outputs:["CVP11"] },
          { id:"CVP11", code:"CVP11", name:"Negociación de Venta",
            desc:"Toma de pedidos con condiciones negociadas: precios, descuentos, plazos. Aprobación de crédito en tiempo real. Pedidos desde AFV, portal web o EDI.",
            erp:["FA","CI","CC","CG"], systems:["AFV","Portal Pedidos","EDI","SIM"],
            dms:["DM de Promociones","DM de Fletes"], outputs:["CVP14"] },
          { id:"CVP12", code:"CVP12", name:"Gestión de crédito y cobranza",
            desc:"Seguimiento de documentos vencidos, gestión activa de cobro, aplicación de pagos y conciliación. Integra AFV (cobro en ruta), Host to Host y Sage XRT.",
            erp:["CC","CB","CG","FA"], systems:["AFV","Sage XRT","Host to Host","Agente Cobranza","The Factory HKA"],
            dms:["DM Auditorías","DM Conciliaciones","Limpieza de Saldos","Alerta temprana de Cobro"],
            outputs:[] },
          { id:"CVP13", code:"CVP13", name:"Atención al cliente",
            desc:"Gestión de solicitudes, reclamaciones, devoluciones y posventa. Canal unificado de atención con trazabilidad de casos y mensajería omnicanal (WhatsApp, email).",
            erp:["FA","CC","CI"], systems:["AFV","Portal de Clientes","Respond.io","GLPI"],
            dms:["Visualizador de Documentos","CRM para gestión de tickets de servicio"],
            outputs:[] },
        ],
      },
      {
        id:"ENTREGA", label:"ENTREGA", color:"#e67e22",
        processes:[
          { id:"CVP14", code:"CVP14", name:"Alistado y Facturación",
            desc:"Preparación de pedidos en bodega (Centro de Distribución) (picking), facturación electrónica, generación de remisión y documentos fiscales. Confirma existencias y actualiza inventario en tiempo real.",
            erp:["FA","CI","CC","CG"], systems:["WMS ePrac","The Factory HKA","GTI / FE"],
            dms:["Imprenta Digital DM","eFLOW WMS"], outputs:["CVP15"] },
          { id:"CVP15", code:"CVP15", name:"Despacho y Transporte",
            desc:"Planificación de rutas, asignación de vehículos y conductores, liquidación de fletes y última milla. Trazabilidad completa del despacho hasta confirmación de entrega al cliente.",
            erp:["FA","CI"], systems:["Torre de Control","WMS ePrac","AFV","Última milla"],
            dms:["DM de Fletes","Plan de transporte eficiente","Liquidación de viajes"],
            outputs:[] },
        ],
      },
    ],
  },
  {
    id:"SO", label:"SO — Soporte", color:"#B8860B",
    bg:"#fdfaf0", border:"#e8d58a",
    processes:[
      { id:"SOP01", code:"SOP01", name:"Ejecución y control del plan financiero",
        desc:"Cierre contable periódico, estados financieros multi-empresa, diferencias cambiarias y control fiscal. Consolida todos los módulos auxiliares en Contabilidad General.",
        erp:["CG","CB","CC","CP","AF","CF"], systems:["Sage XRT","Power BI / Fabric","Réplicas SQL"],
        dms:["DM Conciliaciones","Apagado Triggers Dif. Cambiario","Reportería Contable","Flujo de pago"] },
      { id:"SOP02", code:"SOP02", name:"Registro y control de operaciones contables",
        desc:"Registro de asientos, paquetes contables, conciliaciones y cuadres auxiliares. Gestión de diferidos, activos fijos y control presupuestal integrado.",
        erp:["CG","AF","CB","CC","CP"], systems:["Power BI / Fabric","Google Workspace"],
        dms:["DM Conciliaciones","DM Presupuesto"] },
      { id:"SOP03", code:"SOP03", name:"Control de Inventario",
        desc:"Gestión de conteos físicos, ajustes de inventario, costeo y valoración. Control de lotes, series y ubicaciones. Integra WMS y módulo CI — Control de Inventarios para trazabilidad total.",
        erp:["CI","CO","CG"], systems:["WMS ePrac","SIM","Power BI / Fabric"],
        dms:["eFLOW WMS","Corrida BDF y Ajustes de Clasificación","Reporte 4 y Disponibilidad"] },
      { id:"SOP04", code:"SOP04", name:"Comercio exterior",
        desc:"Gestión de importaciones: trámites aduaneros, liquidación de costos, aranceles y fletes internacionales. Coordina con módulo CO — Compras para ingreso al inventario.",
        erp:["CO","CI","CP","CG"], systems:["Trade","EDI","Portal Proveedores"],
        dms:["DM de Fletes","Tracking OC"] },
      { id:"SOP05", code:"SOP05", name:"Logística 3PL",
        desc:"Coordinación con operadores logísticos terceros para almacenaje y distribución. Gestión de interfaces de datos y trazabilidad con sistemas externos.",
        erp:["CI","FA","CO"], systems:["Torre de Control","WMS ePrac","Última milla"],
        dms:["Procesos de logística mayoreo para 3PL","Auditorías Logística 3PL"] },
      { id:"SOP06", code:"SOP06", name:"Personal",
        desc:"Administración del talento humano: reclutamiento, nómina y desempeño. Costa Rica y Venezuela con normativas distintas. Integra Galac para nómina fiscal Venezuela.",
        erp:["CN","CB","CG","CP"], systems:["Galac","Portal Interno","GLPI","Google Workspace"],
        dms:["Automatizaciones de Personal","Atributos","Gestión Mensual","Modelo de RH Venezuela"] },
      { id:"SOP07", code:"SOP07", name:"Seguridad y salud laboral",
        desc:"Gestión de riesgos laborales, accidentes, medicina del trabajo y cumplimiento normativo. Seguimiento de indicadores de seguridad por empresa y país.",
        erp:["CN","CG"], systems:["Portal Interno","Google Workspace"], dms:[] },
      { id:"SOP08", code:"SOP08", name:"Procesos y sistemas",
        desc:"Gobierno de procesos de negocio, gestión de proyectos TI, administración del ERP y sistemas satélite. Administración de usuarios, permisos y configuraciones globales Softland.",
        erp:["AS","CG","AF"], systems:["Monday.com","GLPI","n8n","Google Workspace"],
        dms:["Gestión de Proyectos","Visualizador de Documentos","Actualización SIM"] },
      { id:"SOP09", code:"SOP09", name:"Legal",
        desc:"Gestión de contratos, cumplimiento regulatorio, propiedad intelectual y litigios. Soporte a operaciones multi-país (CR y VE) con marcos legales distintos.",
        erp:["CG"], systems:["Google Workspace"], dms:[] },
      { id:"SOP10", code:"SOP10", name:"Gestión de comunicación",
        desc:"Comunicación corporativa interna y externa: branding, redes sociales, marketing digital y omnicanal. Gestión de campañas y medición de impacto.",
        erp:["FA","CC"], systems:["Respond.io","Catálogo Digital","Google Workspace","SIM"],
        dms:["Automatización de Redes Sociales","Chatbot de Whatsapp","Amazon Lens"] },
      { id:"SOP11", code:"SOP11", name:"Gestión de Publicidad",
        desc:"Planificación, ejecución y medición de campañas publicitarias. Segmentación de mercado, análisis de efectividad y coordinación con canales de venta.",
        erp:["FA","CC"], systems:["SIM","Power BI / Fabric","Google Workspace"],
        dms:["Segmentación de mercado","Push Money"] },
    ],
  },
];

function BPAView({ onModuleClick }) {
  const [selected, setSelected] = useState(null);
  const [areaFilter, setAreaFilter] = useState("ALL");

  const allProcesses = bpaAreas.flatMap(area =>
    area.subareas ? area.subareas.flatMap(s => s.processes) : (area.processes || [])
  );
  const selectedProc = allProcesses.find(p => p.id === selected);

  const ProcNode = ({ proc, areaColor, subColor }) => {
    const isSelected = selected === proc.id;
    const col = subColor || areaColor;
    return (
      <div onClick={() => setSelected(prev => prev === proc.id ? null : proc.id)}
        style={{ background: isSelected ? col+"28" : "rgba(255,255,255,0.03)",
          border:`2px solid ${isSelected ? col : col+"55"}`, borderRadius:10,
          padding:"8px 10px", cursor:"pointer", minWidth:110, maxWidth:135,
          transition:"all 0.18s", boxShadow: isSelected ? `0 0 14px ${col}44` : "none", flexShrink:0 }}>
        <div style={{ fontSize:9, fontWeight:700, color:col, marginBottom:2, letterSpacing:0.3 }}>{proc.code}</div>
        <div style={{ fontSize:10, color:"#444", lineHeight:1.35, fontWeight: isSelected ? 600 : 400 }}>{proc.name}</div>
        <div style={{ marginTop:5, display:"flex", gap:3, flexWrap:"wrap" }}>
          {proc.erp.slice(0,3).map(m => (
            <span key={m} style={{ fontSize:8, fontWeight:700, color:erpColors[m]||"#aaa",
              background:(erpColors[m]||"#aaa")+"22", border:`1px solid ${(erpColors[m]||"#aaa")}44`,
              borderRadius:3, padding:"0 4px" }}>{m}</span>
          ))}
          {proc.erp.length > 3 && <span style={{ fontSize:8, color:"#666" }}>+{proc.erp.length-3}</span>}
        </div>
      </div>
    );
  };

  const DetailPanel = ({ proc }) => {
    const area = bpaAreas.find(a =>
      (a.processes && a.processes.find(p => p.id===proc.id)) ||
      (a.subareas && a.subareas.find(s => s.processes.find(p => p.id===proc.id)))
    );
    const col = area?.color || "#888";
    return (
      <div style={{ background:"#ffffff", border:`1px solid ${col}44`,
        borderLeft:`4px solid ${col}`, borderRadius:10, padding:"16px 20px", marginBottom:20 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
          <div>
            <span style={{ fontSize:10, fontWeight:700, color:col, letterSpacing:1, textTransform:"uppercase" }}>{proc.code}</span>
            <h3 style={{ margin:"2px 0 0", fontSize:17, fontWeight:700, color:"#1D1D1B" }}>{proc.name}</h3>
          </div>
          <button onClick={() => setSelected(null)} style={{ background:"none", border:"none", color:"#666", cursor:"pointer", fontSize:18, lineHeight:1 }}>✕</button>
        </div>
        <p style={{ fontSize:12, color:"#666", lineHeight:1.65, marginBottom:14 }}>{proc.desc}</p>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(220px, 1fr))", gap:10 }}>
          {/* Módulos ERP */}
          <div style={{ background:"#f5f5f5", borderRadius:8, padding:"10px 14px" }}>
            <div style={{ fontSize:10, fontWeight:700, color:"#f39c12", marginBottom:8, textTransform:"uppercase", letterSpacing:0.8 }}>⬡ Módulos ERP</div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
              {proc.erp.map(m => {
                const erpLabel = {CG:"Contabilidad",CB:"Bancario",CC:"C×C",CP:"C×P",CI:"Inventarios",FA:"Facturación",CO:"Compras",CN:"Nómina",AF:"Activos Fijos",CF:"Flujo Caja",AS:"Adm. Sistema",EV:"Est. Ventas"};
                const mColor = erpColors[m]||"#888";
                return (
                  <button key={m}
                    onClick={() => onModuleClick && onModuleClick(m)}
                    title={`Ver tablas y campos de ${erpLabel[m]||m}`}
                    style={{ background:mColor+"22", border:`1px solid ${mColor}55`,
                      color:mColor, borderRadius:5, padding:"4px 10px", fontSize:11, fontWeight:700,
                      cursor:"pointer", display:"flex", alignItems:"center", gap:4,
                    }}>
                    {m} — {erpLabel[m]||m}
                    <span style={{fontSize:9, opacity:0.7}}>⬡ ver tablas</span>
                  </button>
                );
              })}
            </div>
            <div style={{marginTop:8, fontSize:10, color:"#aaa"}}>
              💡 Haz clic en un módulo para ver sus tablas y campos
            </div>
          </div>
          {/* Sistemas */}
          {proc.systems?.length > 0 && (
            <div style={{ background:"#f5f5f5", borderRadius:8, padding:"10px 14px" }}>
              <div style={{ fontSize:10, fontWeight:700, color:"#3498db", marginBottom:8, textTransform:"uppercase", letterSpacing:0.8 }}>🏢 Sistemas Satélite</div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
                {proc.systems.map(s => (
                  <span key={s} style={{ background:(sysColor[s]||"#555")+"22", border:`1px solid ${(sysColor[s]||"#555")}44`,
                    color:sysColor[s]||"#aaa", borderRadius:5, padding:"3px 8px", fontSize:11 }}>{s}</span>
                ))}
              </div>
            </div>
          )}
          {/* DMs */}
          {proc.dms?.length > 0 && (
            <div style={{ background:"#f5f5f5", borderRadius:8, padding:"10px 14px" }}>
              <div style={{ fontSize:10, fontWeight:700, color:"#e67e22", marginBottom:8, textTransform:"uppercase", letterSpacing:0.8 }}>🔧 Desarrollos a Medida</div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
                {proc.dms.map(d => (
                  <span key={d} style={{ background:"#FFF3E0", border:"1px solid #FFCC80",
                    color:"#E65100", borderRadius:5, padding:"3px 8px", fontSize:11 }}>{d}</span>
                ))}
              </div>
            </div>
          )}
          {/* Activa → */}
          {proc.outputs?.length > 0 && (
            <div style={{ background:"#f5f5f5", borderRadius:8, padding:"10px 14px" }}>
              <div style={{ fontSize:10, fontWeight:700, color:"#27ae60", marginBottom:8, textTransform:"uppercase", letterSpacing:0.8 }}>→ Activa proceso(s)</div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
                {proc.outputs.map(o => (
                  <span key={o} onClick={(e)=>{e.stopPropagation();setSelected(o);}} style={{ background:"#E8F5E9", border:"1px solid #A5D6A7",
                    color:"#2E7D32", borderRadius:5, padding:"3px 10px", fontSize:11, cursor:"pointer", fontWeight:700 }}>{o} →</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const plArea = bpaAreas.find(a => a.id==="PL");
  const cvArea = bpaAreas.find(a => a.id==="CV");
  const soArea = bpaAreas.find(a => a.id==="SO");
  const areaLabels = { ALL:"Todos", PL:"Planificación", CV:"Cadena de Valor", SO:"Soporte" };

  return (
    <div>
      {/* Filtros */}
      <div style={{ display:"flex", gap:6, marginBottom:18, flexWrap:"wrap", alignItems:"center" }}>
        <span style={{ fontSize:11, color:"#777" }}>Área:</span>
        {["ALL","PL","CV","SO"].map(k => (
          <button key={k} onClick={() => { setAreaFilter(k); setSelected(null); }} style={{
            background: areaFilter===k ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.04)",
            border:`1px solid ${areaFilter===k ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.08)"}`,
            color: areaFilter===k ? "#fff" : "#888",
            padding:"5px 14px", borderRadius:6, cursor:"pointer", fontSize:11, fontWeight: areaFilter===k ? 700 : 400,
          }}>{areaLabels[k]}</button>
        ))}
        <span style={{ fontSize:10, color:"#666", marginLeft:4 }}>· Haz clic en un proceso para ver su orquestación con el ecosistema</span>
      </div>

      {selectedProc && <DetailPanel proc={selectedProc} />}

      {/* ── PL ── */}
      {(areaFilter==="ALL"||areaFilter==="PL") && (
        <div style={{ marginBottom:14 }}>
          <div style={{ background:plArea.bg, border:`1px solid ${plArea.border}`, borderRadius:12, padding:"14px 18px" }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
              <div style={{ width:4, height:26, background:plArea.color, borderRadius:2 }}/>
              <div>
                <div style={{ fontSize:13, fontWeight:700, color:plArea.color }}>{plArea.label}</div>
                <div style={{ fontSize:10, color:"#777" }}>Dirección estratégica, presupuesto y monitoreo del grupo</div>
              </div>
            </div>
            <div style={{ display:"flex", gap:10, alignItems:"flex-start", flexWrap:"wrap" }}>
              {plArea.processes.map((proc,i) => (
                <div key={proc.id} style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <ProcNode proc={proc} areaColor={plArea.color} />
                  {i < plArea.processes.length-1 && <span style={{ color:"#aaa", fontSize:20 }}>→</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── CV ── */}
      {(areaFilter==="ALL"||areaFilter==="CV") && (
        <div style={{ marginBottom:14 }}>
          <div style={{ background:cvArea.bg, border:`1px solid ${cvArea.border}`, borderRadius:12, padding:"14px 18px" }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
              <div style={{ width:4, height:26, background:cvArea.color, borderRadius:2 }}/>
              <div>
                <div style={{ fontSize:13, fontWeight:700, color:cvArea.color }}>{cvArea.label}</div>
                <div style={{ fontSize:10, color:"#777" }}>Ciclo completo order-to-cash: Disponibilidad → Venta → Entrega</div>
              </div>
              <div style={{ marginLeft:"auto", display:"flex", gap:6 }}>
                {cvArea.subareas.map(s => (
                  <span key={s.id} style={{ fontSize:9, color:s.color, background:s.color+"18", border:`1px solid ${s.color}44`, borderRadius:4, padding:"2px 8px", fontWeight:700 }}>{s.label}</span>
                ))}
              </div>
            </div>
            <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
              {cvArea.subareas.map(sub => (
                <div key={sub.id} style={{ flex:"1 1 190px", minWidth:170 }}>
                  <div style={{ background:sub.color+"15", border:`1px solid ${sub.color}44`, borderRadius:10, padding:"10px 12px" }}>
                    <div style={{ fontSize:10, fontWeight:700, color:sub.color, marginBottom:10, letterSpacing:1, textTransform:"uppercase", textAlign:"center" }}>{sub.label}</div>
                    <div style={{ display:"flex", flexDirection:"column", gap:7, alignItems:"stretch" }}>
                      {sub.processes.map(proc => (
                        <ProcNode key={proc.id} proc={proc} areaColor={cvArea.color} subColor={sub.color} />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── SO ── */}
      {(areaFilter==="ALL"||areaFilter==="SO") && (
        <div style={{ marginBottom:14 }}>
          <div style={{ background:soArea.bg, border:`1px solid ${soArea.border}`, borderRadius:12, padding:"14px 18px" }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
              <div style={{ width:4, height:26, background:soArea.color, borderRadius:2 }}/>
              <div>
                <div style={{ fontSize:13, fontWeight:700, color:soArea.color }}>{soArea.label}</div>
                <div style={{ fontSize:10, color:"#777" }}>11 procesos de soporte: finanzas, operaciones, RRHH, TI, legal y comunicación</div>
              </div>
            </div>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              {soArea.processes.map(proc => (
                <ProcNode key={proc.id} proc={proc} areaColor={soArea.color} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Leyenda */}
      <div style={{ marginTop:16, background:"#fafafa", border:"1px solid #e0e0e0", borderRadius:10, padding:"10px 16px" }}>
        <div style={{ display:"flex", gap:20, flexWrap:"wrap" }}>
          {[
            {icon:"⬡", color:"#f39c12", label:"Badge = Módulo ERP Softland activado por el proceso"},
            {icon:"🏢", color:"#3498db", label:"Sistema satélite / aplicación que soporta el proceso"},
            {icon:"🔧", color:"#e67e22", label:"DM = Desarrollo a Medida que cierra brechas funcionales"},
            {icon:"→", color:"#27ae60", label:"Clickable: navega al proceso siguiente"},
          ].map(l => (
            <div key={l.icon} style={{ display:"flex", alignItems:"center", gap:6, fontSize:11, color:"#777" }}>
              <span style={{ color:l.color }}>{l.icon}</span> {l.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════
// ════════════════════════════════════════════════════════
//  REPORTES E INDICADORES — fuente: Permisos_visualizacion_reportes.pdf
//  Página 1 = Reportes · Página 3 = Indicadores SIM
//  Página 2 (desarrollos/sistemas) excluida
// ════════════════════════════════════════════════════════

const MAYOREO_CASAS = ["Beval","Cofersa","Febeca","Mundipartes","Prisma","Sillaca"];

const REPORTES_SILOS = [

  // ═══════════════════════════════════════════════════════════════
  // VENTAS
  // ═══════════════════════════════════════════════════════════════
  {
    silo:"Ventas", color:"#1B5E20", icon:"📈",
    sistemas:[
      { nombre:"SIM", icon:"📊", color:"#f39c12",
        reportes:[
          { nombre:"SIM",                    casas:MAYOREO_CASAS, nivel:"Todos",
            desc:"Panel de indicadores clave de ventas por zona, vendedor y cliente." },
          { nombre:"Tendencia de Ventas",    casas:MAYOREO_CASAS, nivel:"Todos",
            desc:"Análisis de evolución de ventas por período, zona y categoría." },
          { nombre:"Activación de Clientes", casas:MAYOREO_CASAS, nivel:"Todos",
            desc:"Seguimiento de clientes activos vs inactivos por ruta y vendedor." },
          { nombre:"Resumen de Pedidos",     casas:MAYOREO_CASAS, nivel:"Todos",
            desc:"Consolidado de pedidos capturados por vendedor y zona." },
          { nombre:"Tendencia Logística",    casas:MAYOREO_CASAS, nivel:"Todos",
            desc:"Indicadores logísticos de la operación de ventas: tasa de despacho, tiempo de entrega, pedidos perfectos y devoluciones por ruta." },
        ],
      },
      { nombre:"Softland ERP / DM", icon:"⬡", color:"#16a085",
        reportes:[
          { nombre:"Reporte de Pedidos – Fuerza de Ventas", casas:MAYOREO_CASAS, nivel:"Todos",
            desc:"Detalle de pedidos capturados en ruta por la Fuerza de Ventas (AFV). Incluye estado, cliente, artículos, montos y condición de entrega." },
          { nombre:"Reporte de Pedidos – Ventas",           casas:MAYOREO_CASAS, nivel:"Todos",
            desc:"Vista general de pedidos activos y facturados. Seguimiento del ciclo order-to-cash desde la captura hasta la facturación." },
          { nombre:"Informe de Surtido",                    casas:MAYOREO_CASAS, nivel:"Todos",
            desc:"Estado del árbol de surtido activo por zona y cliente. Muestra artículos con Clasificación BDF, disponibilidad y cobertura del portafolio." },
          { nombre:"Avalúo Mayoreo",                        casas:MAYOREO_CASAS, nivel:"Todos",
            desc:"Valoración del inventario disponible a precio de venta Mayoreo." },
          { nombre:"133",                                   casas:MAYOREO_CASAS, nivel:"Todos",
            desc:"Reporte contable 133 de existencias. Reconcilia costos de inventario con registros contables en CG." },
        ],
      },
    ],
    indicadores:[
      { nombre:"Venta Neta",              proceso:"Venta",
        formula:"∑Venta − ∑Devoluciones − ∑Bonificaciones",
        tipo:"Resultado", frecuencia:"Diario", fuente:"Softland",
        desc:"Sumatoria de la columna Venta en moneda local o dólar, descontando devoluciones y bonificaciones. Es la base para calcular el cumplimiento del presupuesto de venta." },
      { nombre:"Venta Bruta",             proceso:"Venta",
        formula:"∑Venta − ∑Devoluciones",
        tipo:"Resultado", frecuencia:"Diario", fuente:"Softland",
        desc:"Sumatoria de ventas en moneda local o dólar antes de descontar bonificaciones. Permite aislar el efecto de las políticas de bonificación sobre el resultado." },
      { nombre:"Venta Proyectada",        proceso:"Venta",
        formula:"Ritmo ventas actual × Días hábiles del período",
        tipo:"Resultado", frecuencia:"Diario", fuente:"Softland",
        desc:"Estimación del total de ventas que se alcanzarán al cierre del período (mes o trimestre), calculando el ritmo de ventas actual multiplicado por los días hábiles." },
      { nombre:"Cumplimiento PPTO de Venta", proceso:"Venta",
        formula:"(Venta neta / PPTO) × 100",
        tipo:"Desempeño", frecuencia:"Diario", fuente:"Softland",
        desc:"Porcentaje que representa la venta neta real en relación con la meta de ventas establecida en el presupuesto. Mide el avance del vendedor o zona contra su objetivo." },
      { nombre:"Meta del Vendedor",       proceso:"Venta",
        formula:"∑ Meta (venta cliente activo últimos 6 meses × factor meta)",
        tipo:"Resultado", frecuencia:"Mensual", fuente:"Softland",
        desc:"Monto a alcanzar de venta neta asignado por vendedor. Se calcula como la sumatoria de la venta del cliente activo de los últimos 6 meses multiplicada por el factor meta." },
      { nombre:"Clientes",               proceso:"Venta",
        formula:"Número de clientes existentes en cartera",
        tipo:"Resultado", frecuencia:"Diario", fuente:"Softland",
        desc:"Total de la cartera de clientes actuales. Denominador para calcular la tasa de activación y la penetración por zona o vendedor." },
      { nombre:"Clientes Activados",     proceso:"Venta",
        formula:"Clientes con ventas > 0",
        tipo:"Resultado", frecuencia:"Diario", fuente:"Softland",
        desc:"Todos los clientes que registraron al menos una venta en el período. Mide la amplitud real de la cartera atendida." },
      { nombre:"Activación de Clientes (%)", proceso:"Venta",
        formula:"Clientes activados / Total clientes",
        tipo:"Desempeño", frecuencia:"Diario", fuente:"Softland",
        desc:"Proporción de clientes de la cartera que registraron compra en el período. Indicador clave de la cobertura comercial de la fuerza de ventas." },
      { nombre:"Cantidad de Pedidos",    proceso:"Pedido",
        formula:"∑ Pedidos generados",
        tipo:"Resultado", frecuencia:"Diario", fuente:"Softland",
        desc:"Conteo de pedidos generados en el período. Mide el volumen de actividad de la fuerza de ventas." },
      { nombre:"Días con Pedido",        proceso:"Pedido",
        formula:"∑ Días con pedido",
        tipo:"Resultado", frecuencia:"Diario", fuente:"Softland",
        desc:"Número de días en que se registraron pedidos. Indica la regularidad de visita y captura de pedidos por vendedor o zona." },
      { nombre:"Frecuencia de Pedido",   proceso:"Pedido",
        formula:"(Días último pedido − primer pedido) / ∑ Días con pedido",
        tipo:"Desempeño", frecuencia:"Diario", fuente:"Softland",
        desc:"División del rango de días desde el primer al último pedido, entre la cantidad de días que registraron pedido. Mide la regularidad de compra del cliente." },
      { nombre:"Promedio Diario de Pedidos", proceso:"Pedido",
        formula:"Pedidos creados / Días laborables",
        tipo:"Desempeño", frecuencia:"Diario", fuente:"Softland",
        desc:"Divide la cantidad de pedidos creados entre el total de días laborables del período. Permite monitorear el ritmo de captura de pedidos vs lo esperado." },
      { nombre:"SKU Activados (%)",      proceso:"Venta",
        formula:"(SKU con venta > 0 / Total SKU activos) × 100",
        tipo:"Desempeño", frecuencia:"Diario", fuente:"Softland",
        desc:"Proporción de productos o referencias que registraron venta en el período, respecto al total de artículos activos. Mide la amplitud de cobertura del árbol de surtido." },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // COMPRAS
  // ═══════════════════════════════════════════════════════════════
  {
    silo:"Compras", color:"#E65100", icon:"🛒",
    sistemas:[
      { nombre:"SIM", icon:"📊", color:"#f39c12",
        reportes:[
          { nombre:"SIM",               casas:MAYOREO_CASAS, nivel:"Todos",
            desc:"Indicadores de desempeño: Fill Rate de proveedores, OTD, órdenes pendientes, variación de costos y cobertura de inventario." },
          { nombre:"Tendencia Logística", casas:MAYOREO_CASAS, nivel:"Todos",
            desc:"Visibilidad del flujo de mercadería desde recepción hasta almacenamiento." },
        ],
      },
      { nombre:"Softland ERP", icon:"⬡", color:"#d35400",
        reportes:[
          { nombre:"Reporte de Pedidos",             casas:MAYOREO_CASAS, nivel:"Todos",
            desc:"Estado de órdenes de compra abiertas, recibidas y pendientes de facturar." },
          { nombre:"Órdenes Pendientes por Recibir", casas:MAYOREO_CASAS, nivel:"Todos",
            desc:"Listado de órdenes confirmadas pendientes de recepción en bodega (Centro de Distribución)." },
        ],
      },
    ],
    indicadores:[
      { nombre:"SKU Activados (%)",      proceso:"Compra / Venta / Mercadeo",
        formula:"(SKU activados / Total artículos activos) × 100",
        tipo:"Desempeño", frecuencia:"Diario", fuente:"Softland",
        desc:"Porcentaje de SKU facturados respecto al total de artículos activos en el período. Mide la amplitud real del árbol de surtido y la efectividad de activación de producto. Responsable: Gerente de Compras." },
      { nombre:"SKU Activados (Unidades)", proceso:"Compra / Venta / Mercadeo",
        formula:"SKU con venta > 0",
        tipo:"Desempeño", frecuencia:"Diario", fuente:"Softland",
        desc:"Cantidad total de SKU que registraron al menos una venta en el período. Base para análisis de rotación y decisiones de surtido." },
      { nombre:"GMROI",                  proceso:"Compra",
        formula:"Margen × Rotación",
        tipo:"Resultado", frecuencia:"Diario", fuente:"Softland",
        desc:"Gross Margin Return on Investment. Relación entre ventas, margen bruto y valor invertido en inventario. Un valor ≥1 indica cobertura del inventario; valor adecuado para el negocio: 1.7. Responsable: Gerente de Compras." },
      { nombre:"Margen (%)",             proceso:"Compra / Venta",
        formula:"(Renta Bruta / Venta Neta) × 100",
        tipo:"Desempeño", frecuencia:"Diario", fuente:"Softland",
        desc:"Valor porcentual de la contribución entre la renta bruta y la venta neta. Venta Neta = ∑Venta − ∑Devoluciones − ∑Bonificaciones. Principal indicador de rentabilidad por categoría y proveedor." },
      { nombre:"Margen con Rebate",      proceso:"Compra / Venta",
        formula:"((Contribución + Otros ingresos) / Venta neta) × 100",
        tipo:"Desempeño", frecuencia:"Diario", fuente:"Softland",
        desc:"Margen de contribución total sobre las ventas netas incluyendo los rebates (descuentos y bonificaciones acordadas con clientes o proveedores). Indicador de rentabilidad final." },
      { nombre:"Artículos",              proceso:"Compra / Venta",
        formula:"Número de artículos existentes",
        tipo:"Resultado", frecuencia:"Diario", fuente:"Softland",
        desc:"Cantidad total de artículos existentes en el sistema. Denominador para calcular el porcentaje de SKU activados y monitorear la amplitud del catálogo." },
      { nombre:"Compras",                proceso:"Compra / Venta",
        formula:"∑ Monto liquidado de los embarques",
        tipo:"Resultado", frecuencia:"Diario", fuente:"Softland",
        desc:"Sumatoria del monto liquidado de los embarques en moneda local y dólar. Contrasta con la demanda real para evaluar el acierto de los pedidos a proveedores." },
      { nombre:"Costo de Venta",         proceso:"Compra / Venta",
        formula:"Costo de la mercancía vendida",
        tipo:"Resultado", frecuencia:"Diario", fuente:"Softland",
        desc:"Costos incurridos al vender los artículos de inventario. Permite calcular el margen bruto por artículo, categoría y proveedor." },
      { nombre:"Contribución",           proceso:"Compra / Venta",
        formula:"Venta neta − Costo de venta",
        tipo:"Resultado", frecuencia:"Diario", fuente:"Softland",
        desc:"Resultado de restar el costo de la mercancía vendida a las ventas netas. Refleja el ingreso disponible para cubrir gastos operativos y generar utilidad." },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // LOGÍSTICA / REPOSICIÓN
  // ═══════════════════════════════════════════════════════════════
  {
    silo:"Reposición", color:"#0097A7", icon:"🔄",
    sistemas:[
      { nombre:"Softland ERP / DM — Solo Cofersa", icon:"🔧", color:"#7B1FA2",
        reportes:[
          { nombre:"Reporte de Fallas (histórico y proyectada)", casas:["Cofersa"], nivel:"Todos",
            desc:"Artículos con inventario en cero (Fallas) históricas y proyectadas. Identifica SKUs con mayor frecuencia de ruptura para priorizar el reabastecimiento." },
          { nombre:"Venta Diaria Detallada del Cliente", casas:["Cofersa"], nivel:"Todos",
            desc:"Detalle de ventas diarias por cliente, artículo y zona. Insumo para ajustar pronósticos y detectar anomalías en el patrón de consumo." },
        ],
      },
      { nombre:"Softland ERP", icon:"⬡", color:"#d35400",
        reportes:[
          { nombre:"Órdenes Pendientes por Recibir", casas:MAYOREO_CASAS, nivel:"Todos",
            desc:"Listado de órdenes confirmadas pendientes de recepción en bodega (Centro de Distribución)." },
        ],
      },
    ],
    indicadores:[
      { nombre:"Fill Rate",              proceso:"Compra",
        formula:"(∑Cant. recibida − ∑Cant. devuelta − ∑Cant. rechazada) / ∑Cant. ordenada",
        tipo:"Desempeño", frecuencia:"Mensual", fuente:"SIM — SOFTLANDPRD.DBO.OIC_EMBARQUE",
        desc:"Porcentaje de capacidad y calidad del proveedor para satisfacer los requerimientos de inventario en la primera entrega. Mercancía recibida entre mercancía solicitada. Responsable: Gerente de Reposición." },
      { nombre:"On Time",                proceso:"Compra",
        formula:"Entregas en fecha / Total entregas",
        tipo:"Desempeño", frecuencia:"Mensual", fuente:"SIM — SFL",
        desc:"Fiabilidad del proveedor para cumplir los tiempos estimados de entrega. Junto con el Fill Rate conforma el índice OTIF de desempeño del proveedor. Responsable: Gerente de Reposición." },
      { nombre:"Falla",                  proceso:"Compra",
        formula:"(∑ Falla × día) / (∑ Base total artículos × día)",
        tipo:"Desempeño", frecuencia:"Diario", fuente:"SIM — SFL",
        desc:"Mide la cantidad de artículos con inventario en cero sobre el total del árbol de surtido activo. Una falla es la cantidad de artículos con inventario en cero. Responsable: Gerente de Reposición." },
      { nombre:"Inventario",             proceso:"Recepción y Almacenaje de Mercancía",
        formula:"Inventario / Meses consultados",
        tipo:"Estado", frecuencia:"Diario", fuente:"SIM — SFL",
        desc:"Cantidad de inventario disponible por artículo en un determinado mes. Monitorea el nivel de inversión en stock y detecta sobre o sub-inventarios. Responsable: Coordinador de Logística." },
      { nombre:"Rotación",               proceso:"Compra",
        formula:"(Costo de venta / Inventario) × (12 / Meses consultados)",
        tipo:"Desempeño", frecuencia:"Mensual", fuente:"SIM — SFL",
        desc:"Métrica que mide la eficiencia con la que se gestiona el inventario. Cuántas veces se vende y repone el inventario en el año. Una rotación alta indica que el stock circula con rapidez. Responsable: Gerente de Reposición." },
      { nombre:"Backorder",              proceso:"Compra",
        formula:"OC en tránsito + backorder no recibidas por almacén",
        tipo:"Resultado", frecuencia:"Mensual", fuente:"SIM — SFL",
        desc:"Órdenes de compra en tránsito más backorder que no han sido recibidas por el almacén (Centro de Distribución). Indica el volumen de mercadería comprometida aún no disponible. Responsable: Gerente de Reposición." },
      { nombre:"Sobreinventario",        proceso:"Compra",
        formula:"Unidades / Monto en exceso sobre el nivel óptimo",
        tipo:"Resultado", frecuencia:"Mensual", fuente:"Streamline",
        desc:"Cantidad o valor de inventario que excede el nivel óptimo calculado por Streamline. Señala artículos con sobre-stock que generan costo financiero innecesario. Responsable: Gerente de Reposición." },
      { nombre:"OC por Recibir (Tránsito)", proceso:"Compra",
        formula:"∑ Órdenes de compra en estado Tránsito o Backorder",
        tipo:"Estado", frecuencia:"Mensual", fuente:"SIM — SFL",
        desc:"Mide la cantidad de órdenes de compra por recibir en estado Tránsito o Backorder. Permite anticipar llegadas y coordinar la capacidad de recepción en bodega. Responsable: Gerente de Reposición." },
      { nombre:"Líneas Canceladas",      proceso:"Alisto y Facturación",
        formula:"IF(Cant. Pedida = Cant. Facturada → Completo; si Falla > 0 → Cancelación parcial/total con o sin inventario)",
        tipo:"Desempeño", frecuencia:"Diario", fuente:"SIM — SFL",
        desc:"Mide la cantidad de líneas de pedido no despachadas por falta de inventario, falta de resurtido en Zona de Picking o diferencias en el inventario. Responsable: Coordinador de Logística." },
      { nombre:"Costo de Transporte",    proceso:"Despacho y Transporte",
        formula:"(Costo diario por ruta / Monto facturado diario por ruta) × 100",
        tipo:"Desempeño", frecuencia:"Diario", fuente:"SIM",
        desc:"Mide el costo porcentual entre el costo del transporte y el monto facturado de ventas de manera diaria. Indicador de eficiencia logística del despacho. Responsable: Coordinador de Logística." },
      { nombre:"Devoluciones",           proceso:"Atención al Cliente",
        formula:"(Valor de Devoluciones / Ventas Totales) × 100",
        tipo:"Calidad", frecuencia:"Diario", fuente:"SIM",
        desc:"Métrica que mide el porcentaje de productos devueltos respecto al total de ventas. Refleja la calidad del producto y la satisfacción del cliente. Responsable: Coordinador de Logística." },
      { nombre:"Tickets por Estado",     proceso:"Atención al Cliente",
        formula:"Suma por estado de atención (abierto, vencido, resuelto)",
        tipo:"Resultado", frecuencia:"Diario", fuente:"Monday (Funcional)",
        desc:"Mide la cantidad de tickets según el estado en el que se encuentran en el proceso de solución. Responsable: Jefe de Servicio al Cliente." },
      { nombre:"Tickets por Cliente",    proceso:"Atención al Cliente",
        formula:"Suma por cliente",
        tipo:"Resultado", frecuencia:"Diario", fuente:"Monday (Funcional)",
        desc:"Mide la cantidad de tickets generados por cada cliente. Permite identificar clientes con mayor frecuencia de incidencias. Responsable: Jefe de Servicio al Cliente." },
      { nombre:"Índice de Atención",     proceso:"Atención al Cliente",
        formula:"Suma por etapa del flujo de atención",
        tipo:"Resultado", frecuencia:"Diario", fuente:"Monday (Funcional)",
        desc:"Mide la cantidad de tickets en el flujo de atención: abierto, vencido y resuelto. Indicador de capacidad y velocidad de respuesta del equipo. Responsable: Jefe de Servicio al Cliente." },
      { nombre:"Tickets por Vendedor",   proceso:"Atención al Cliente",
        formula:"Suma por vendedor",
        tipo:"Resultado", frecuencia:"Diario", fuente:"Monday (Funcional)",
        desc:"Mide la cantidad de tickets generados asociados a cada vendedor. Permite identificar zonas o vendedores con mayor frecuencia de incidencias de servicio. Responsable: Jefe de Servicio al Cliente." },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // CONTROL
  // ═══════════════════════════════════════════════════════════════
  {
    silo:"Control", color:"#C62828", icon:"🛡",
    sistemas:[
      { nombre:"SIM", icon:"📊", color:"#f39c12",
        reportes:[
          { nombre:"S.I.M",    casas:MAYOREO_CASAS, nivel:"Supervisores en adelante",
            desc:"Tablero principal de control financiero y operacional. Consolida KPIs de ventas, inventario, cuentas por cobrar y pagar para monitoreo ejecutivo." },
          { nombre:"S.I.M QA", casas:MAYOREO_CASAS, nivel:"Todos",
            desc:"Versión de validación del SIM en ambiente QA. Permite probar nuevos indicadores y cambios antes de publicarlos en producción." },
        ],
      },
      { nombre:"Softland ERP / DM · CG", icon:"🔧", color:"#c0392b",
        reportes:[
          { nombre:"GyP – Ganancias y Pérdidas", casas:MAYOREO_CASAS, nivel:"Todos",
            desc:"Estado de resultados consolidado multi-empresa. Cruza ingresos de FA con costos de CI y gastos operativos de CG." },
          { nombre:"Balance QA",                 casas:MAYOREO_CASAS, nivel:"Supervisores en adelante",
            desc:"Balance general en ambiente de pruebas. Valida integridad de asientos contables y cuadre de auxiliares antes de publicar reportes oficiales." },
        ],
      },
      { nombre:"Softland ERP / CF · CB", icon:"⬡", color:"#0097A7",
        reportes:[
          { nombre:"Flujo de Caja", casas:MAYOREO_CASAS, nivel:"Todos",
            desc:"Proyección de entradas y salidas de efectivo. Consolida documentos pendientes de CC, CP, CB y FA." },
        ],
      },
    ],
    indicadores:[
      { nombre:"Gastos Operativos",        proceso:"Ejecución y Control del Plan Financiero",
        formula:"Monto total de los gastos operativos",
        tipo:"Resultado", frecuencia:"Mensual", fuente:"SIM — Estado de G&P",
        desc:"Suma total de los gastos incurridos en las operaciones cotidianas de la empresa." },
      { nombre:"Gastos Operativos sin Tributos", proceso:"Ejecución y Control del Plan Financiero",
        formula:"Total gastos operativos − Total tributos",
        tipo:"Resultado", frecuencia:"Mensual", fuente:"SIM — Estado de G&P",
        desc:"Gastos operativos descontando el pago de tributos. Permite aislar el costo operativo puro sin el componente fiscal." },
      { nombre:"Gastos Operativos / Renta Bruta", proceso:"Ejecución y Control del Plan Financiero",
        formula:"Gastos operativos / Renta bruta",
        tipo:"Resultado", frecuencia:"Mensual", fuente:"SIM — Estado de G&P",
        desc:"Ratio que muestra la proporción de la renta bruta consumida por los gastos operativos. Indica la eficiencia del control de costos." },
      { nombre:"Ganancia Operativa",       proceso:"Ejecución y Control del Plan Financiero",
        formula:"Monto total de la ganancia operativa",
        tipo:"Resultado", frecuencia:"Mensual", fuente:"SIM — Estado de G&P",
        desc:"Suma de las ganancias obtenidas de las operaciones principales de la empresa." },
      { nombre:"Intereses (GyP)",          proceso:"Ejecución y Control del Plan Financiero",
        formula:"Monto total de los intereses",
        tipo:"Resultado", frecuencia:"Mensual", fuente:"SIM — Estado de G&P",
        desc:"Monto total de intereses del período. Refleja el costo financiero neto de las operaciones." },
      { nombre:"Intereses / Ganancia Operativa", proceso:"Ejecución y Control del Plan Financiero",
        formula:"Total Intereses / Total Ganancia Operativa",
        tipo:"Resultado", frecuencia:"Mensual", fuente:"SIM — Estado de G&P",
        desc:"Ratio que indica la capacidad de la empresa para cubrir sus pagos de intereses con su ganancia operativa. Indicador clave de salud financiera." },
      { nombre:"Semineto",                 proceso:"Ejecución y Control del Plan Financiero",
        formula:"Total Semineto (Utilidad antes de ISLR)",
        tipo:"Resultado", frecuencia:"Mensual", fuente:"SIM — Estado de G&P",
        desc:"Utilidad neta antes del Impuesto Sobre la Renta (ISLR). Refleja el resultado del período antes del impacto fiscal." },
      { nombre:"Contribución",             proceso:"Ejecución y Control del Plan Financiero",
        formula:"Venta neta − Costo de venta",
        tipo:"Resultado", frecuencia:"Mensual", fuente:"Estado de G&P",
        desc:"Resultado de restar el costo de la mercancía vendida a las ventas netas. Refleja el ingreso disponible para cubrir gastos operativos y generar utilidad." },
      { nombre:"Contribución con Rebates", proceso:"Ejecución y Control del Plan Financiero",
        formula:"Contribución + Rebates",
        tipo:"Resultado", frecuencia:"Mensual", fuente:"SIM",
        desc:"Contribución marginal incluyendo los rebates de comercializadoras. Indicador de rentabilidad real del período." },
      { nombre:"Contribución Total",       proceso:"Ejecución y Control del Plan Financiero",
        formula:"Contribución con rebate + Rebate global",
        tipo:"Resultado", frecuencia:"Mensual", fuente:"SIM",
        desc:"Contribución marginal total incluyendo rebates globales. Es el indicador de rentabilidad más completo del período." },
      { nombre:"Margen (%)",               proceso:"Ejecución y Control del Plan Financiero",
        formula:"Renta bruta / Venta neta",
        tipo:"Resultado", frecuencia:"Mensual", fuente:"SIM — Estado de G&P",
        desc:"Valor porcentual del margen bruto sobre las ventas netas. Base para el análisis financiero mensual consolidado." },
      { nombre:"Margen con Rebates",       proceso:"Ejecución y Control del Plan Financiero",
        formula:"(Contribución + Otros ingresos) / Ventas netas × 100",
        tipo:"Resultado", frecuencia:"Mensual", fuente:"SIM — Estado de G&P",
        desc:"Margen de contribución total sobre las ventas netas incluyendo rebates de comercializadoras. Indicador de rentabilidad final." },
      { nombre:"Margen Total",             proceso:"Ejecución y Control del Plan Financiero",
        formula:"Margen con rebate global − Rebate global %",
        tipo:"Resultado", frecuencia:"Mensual", fuente:"SIM — Tabla OLO",
        desc:"Margen consolidado incluyendo el efecto neto del rebate global de la tabla comercializadora OLO." },
      { nombre:"Rebate Global",            proceso:"Ejecución y Control del Plan Financiero",
        formula:"Total descuentos recibidos de comercializadoras",
        tipo:"Resultado", frecuencia:"Mensual", fuente:"SIM — Tabla OLO",
        desc:"Suma total de los descuentos recibidos por las comercializadoras en el período." },
      { nombre:"Rebate Global (%)",        proceso:"Ejecución y Control del Plan Financiero",
        formula:"Rebate Global / Monto facturado Comercializadora",
        tipo:"Resultado", frecuencia:"Mensual", fuente:"SIM — Tabla OLO",
        desc:"Ratio del rebate global respecto al monto total facturado por las comercializadoras." },
      { nombre:"Inventario",               proceso:"Control de Inventario",
        formula:"Inventario / Meses consultados",
        tipo:"Resultado", frecuencia:"Mensual", fuente:"SIM",
        desc:"Cantidad de inventario disponible por artículo en el mes. Base para calcular la rotación y el GMROI." },
      { nombre:"Rotación de Inventario",   proceso:"Control de Inventario",
        formula:"(Costo de venta / Inventario) × (12 / Meses consultados)",
        tipo:"Resultado", frecuencia:"Mensual", fuente:"SIM",
        desc:"Rotación anual del inventario. Cuántas veces la compañía vende y reemplaza el inventario en el año." },
      { nombre:"Cuentas por Pagar",        proceso:"Ejecución y Control del Plan Financiero",
        formula:"∑ Saldo de los documentos por pagar",
        tipo:"Resultado", frecuencia:"Mensual", fuente:"SIM — ERP: DOCUMENTOS_CP",
        desc:"Suma total de las deudas de la empresa con sus proveedores." },
      { nombre:"Cuentas por Pagar Vencidas", proceso:"Ejecución y Control del Plan Financiero",
        formula:"∑ Saldo documentos por pagar vencidos",
        tipo:"Resultado", frecuencia:"Mensual", fuente:"SIM — ERP: DOCUMENTOS_CP",
        desc:"Suma total de las deudas a proveedores que ya excedieron su fecha de vencimiento." },
      { nombre:"Morosidad CxP",            proceso:"Ejecución y Control del Plan Financiero",
        formula:"Monto total facturas vencidas / Monto total facturas",
        tipo:"Resultado", frecuencia:"Mensual", fuente:"Funcional — Softland ERP",
        desc:"Porcentaje de incumplimiento de obligaciones con proveedores fuera del lapso acordado. Meta: 0%. Responsable: Jefe de Tesorería." },
      { nombre:"Meta",                     proceso:"Ejecución y Control del Plan Financiero",
        formula:"∑ Meta (venta cliente activo últimos 6 meses × factor)",
        tipo:"Resultado", frecuencia:"Mensual", fuente:"SIM",
        desc:"Monto a alcanzar de la venta neta asignado por vendedor. Base para calcular el cumplimiento del presupuesto." },
      { nombre:"Plan de Venta",            proceso:"Ejecución y Control del Plan Financiero",
        formula:"Valor esperado de venta",
        tipo:"Resultado", frecuencia:"Mensual", fuente:"SIM",
        desc:"Valor esperado de venta neta según lo establecido en el plan estratégico." },
      { nombre:"Plan de Contribución",     proceso:"Ejecución y Control del Plan Financiero",
        formula:"Valor esperado de contribución",
        tipo:"Resultado", frecuencia:"Mensual", fuente:"SIM",
        desc:"Valor esperado de contribución marginal según lo establecido en el plan estratégico." },
      { nombre:"Plan de Margen",           proceso:"Ejecución y Control del Plan Financiero",
        formula:"Valor esperado de margen",
        tipo:"Resultado", frecuencia:"Mensual", fuente:"SIM",
        desc:"Valor esperado de margen bruto según lo establecido en el plan estratégico." },
      { nombre:"Presupuesto CxP",          proceso:"Ejecución y Control del Plan Financiero",
        formula:"Monto esperado de deudas con proveedores",
        tipo:"Resultado", frecuencia:"Mensual", fuente:"SIM",
        desc:"Monto total de las deudas que la empresa espera tener con sus proveedores según el presupuesto." },
      { nombre:"Presupuesto de Contribución", proceso:"Ejecución y Control del Plan Financiero",
        formula:"Monto esperado de contribución",
        tipo:"Resultado", frecuencia:"Mensual", fuente:"",
        desc:"Monto total de la contribución que la empresa espera alcanzar según el presupuesto." },
      { nombre:"Presupuesto de Inventario", proceso:"Ejecución y Control del Plan Financiero",
        formula:"Inventario óptimo para alcanzar GMROI deseado",
        tipo:"Resultado", frecuencia:"Mensual", fuente:"",
        desc:"Presupuesto de inventario mensual necesario para alcanzar el Retorno de Inversión en Margen Bruto (GMROI) deseado." },
      { nombre:"Intereses (Tesorería)",    proceso:"Ejecución y Control del Plan Financiero",
        formula:"(Intereses pagados del mes + apartado) / Capital adeudado × 12",
        tipo:"Resultado", frecuencia:"Mensual", fuente:"Funcional — Matriz de Deuda Financiera",
        desc:"Tasa de interés promedio de los préstamos vigentes al cierre de cada mes. Responsable: Jefe de Tesorería." },
      { nombre:"Gastos Bancarios",         proceso:"Ejecución y Control del Plan Financiero",
        formula:"(Gastos bancarios / Presupuesto) × 100",
        tipo:"Resultado", frecuencia:"Mensual", fuente:"Funcional — Softland ERP (MOV_REPORTADOS, documentos tipo comisión)",
        desc:"Gastos incurridos en la gestión del dinero. Meta: >100%. Rango bueno: 100%–109%. Responsable: Jefe de Tesorería." },
      { nombre:"Ingresos Financieros",     proceso:"Ejecución y Control del Plan Financiero",
        formula:"(Ingresos financieros distintos a dif. cambiaria / Presupuesto) × 100",
        tipo:"Resultado", frecuencia:"Mensual", fuente:"Funcional — Softland ERP (DOCUMENTOS_CP, subtipo ---)",
        desc:"Ingresos generados desde la gestión del dinero: descuentos por pronto pago, intereses por inversiones. Meta: 100%. Responsable: Jefe de Tesorería." },
      { nombre:"Precisión en Informes Financieros", proceso:"Ejecución y Control del Plan Financiero",
        formula:"Cantidad de errores reportados desde distintas fuentes",
        tipo:"Resultado", frecuencia:"Mensual", fuente:"Funcional — Contabilidad",
        desc:"Cantidad de observaciones desde Beconsult, Riesgos y Planificación financiera. Meta: <5. Responsable: Jefe de Contabilidad." },
      { nombre:"Cumplimiento Plazo de Entrega", proceso:"Ejecución y Control del Plan Financiero",
        formula:"Promedio (días de entrega de reportes − Día máximo de entrega)",
        tipo:"Desempeño", frecuencia:"Mensual", fuente:"Funcional — Contabilidad",
        desc:"Porcentaje de informes financieros que se entregan dentro del plazo establecido. Meta: 0 días de retraso. Responsable: Coordinador de Planificación Financiera." },
      { nombre:"Permanencia Puntos de Auditoría", proceso:"Monitoreo",
        formula:"Cantidad de riesgos no resueltos",
        tipo:"Resultado", frecuencia:"Mensual", fuente:"Funcional — Contabilidad",
        desc:"Cantidad de riesgos financieros y fiscales señalados por la auditoría externa que persisten. Meta: <5 (siempre que no sean rojos). Responsable: Jefe de Contabilidad." },
      { nombre:"Cumplimiento Plan de Auditoría", proceso:"Monitoreo",
        formula:"(Actividades completadas / Total actividades planeadas) × 100",
        tipo:"Desempeño", frecuencia:"Mensual", fuente:"Funcional — Plan de auditoría",
        desc:"Porcentaje de cumplimiento de actividades del plan de auditoría. Meta: >90%. Rango bueno: 85%–90%. Responsable: Coordinador de Revisoría." },
      { nombre:"Efectividad del Presupuesto", proceso:"Ejecución y Control del Plan Financiero",
        formula:"(Promedio de (Resultado real / Presupuesto)) × 100",
        tipo:"Desempeño", frecuencia:"Anual", fuente:"Funcional — Presupuestos y resultados reales",
        desc:"Porcentaje de desviación con respecto al presupuesto anual. Meta: <5%. Rango bueno: 5%–10%. Responsable: Coordinador de Planificación Financiera." },
      { nombre:"Sanciones Legales",        proceso:"Legal",
        formula:"(Sanciones / Ventas netas) × 100",
        tipo:"Resultado", frecuencia:"Mensual", fuente:"Funcional — Legal",
        desc:"Monto de sanciones recibidas sobre ventas netas. Meta: <0.02%. Rango bueno: 0.02%–0.04%. Responsable: Abogado." },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // MERCADEO
  // ═══════════════════════════════════════════════════════════════
  {
    silo:"Mercadeo", color:"#7B1FA2", icon:"📣",
    sistemas:[
      { nombre:"SIM", icon:"📊", color:"#f39c12",
        reportes:[
          { nombre:"S.I.M", casas:MAYOREO_CASAS, nivel:"Supervisores en adelante",
            desc:"Métricas de activación de marcas, penetración por categoría y efectividad de promociones. Alimentado por datos de FA, AFV y Catálogo Digital." },
        ],
      },
    ],
    indicadores:[
      { nombre:"NPS — Net Promoter Score",  proceso:"MERCADEO",
        formula:"((Promotores − Detractores) / Total de respuestas) × 100",
        tipo:"Desempeño", frecuencia:"Periódica", fuente:"SIM",
        desc:"Indicador de lealtad y satisfacción del cliente. Mide la probabilidad de que un cliente recomiende las marcas y el servicio del Grupo Mayoreo. Segmenta en promotores, pasivos y detractores." },
      { nombre:"CSAT — Customer Satisfaction Score", proceso:"MERCADEO",
        formula:"(Clientes satisfechos / Total de respuestas) × 100",
        tipo:"Calidad", frecuencia:"Periódica", fuente:"SIM",
        desc:"Métrica de satisfacción del cliente. Porcentaje de clientes que reportan una experiencia positiva en la interacción con el equipo o producto." },
      { nombre:"Kaizen (Actividades de Mejora)", proceso:"MERCADEO",
        formula:"Promedio de datos enviados / Tiempo de labores administrativas",
        tipo:"Desempeño", frecuencia:"Periódica", fuente:"SIM",
        desc:"Indicador de productividad de las actividades de mejora continua del equipo de Mercadeo. Mide la velocidad y calidad de ejecución de iniciativas de campo." },
      { nombre:"Venta del Cliente",          proceso:"MERCADEO",
        formula:"Monto cargado en Softland FA",
        tipo:"Resultado", frecuencia:"Diario", fuente:"SIM — SFL",
        desc:"Monto de venta registrado por cliente en el sistema. Base para calcular el potencial de compra y la meta del vendedor." },
      { nombre:"Potencial de Compra",        proceso:"MERCADEO",
        formula:"Venta del cliente × 0.75",
        tipo:"Resultado", frecuencia:"Mensual", fuente:"SIM",
        desc:"Estimación del potencial de compra del cliente basada en su historial de ventas. Se calcula como el 75% de la venta del cliente para establecer una meta alcanzable." },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // PERSONAL
  // ═══════════════════════════════════════════════════════════════
  {
    silo:"Personal", color:"#e67e22", icon:"👥",
    sistemas:[
      { nombre:"SIM", icon:"📊", color:"#f39c12",
        reportes:[
          { nombre:"S.I.M", casas:MAYOREO_CASAS, nivel:"Todos",
            desc:"Indicadores de gestión de personal: headcount, rotación, ausentismo y cumplimiento de nómina. Alimentado por el módulo CN y DM de Atributos." },
        ],
      },
    ],
    indicadores:[
      { nombre:"Colaboradores",           proceso:"Gestión de Personal",
        formula:"Total personas con relación laboral activa (fecha de corte)",
        tipo:"Resultado", frecuencia:"Mensual", fuente:"SIM",
        desc:"Indicador de capacidad y tamaño de la fuerza laboral. Número total de personas con relación laboral activa en la organización en un momento específico." },
      { nombre:"Colaboradores (%)",        proceso:"Gestión de Personal",
        formula:"Subgrupo / Total colaboradores",
        tipo:"Resultado", frecuencia:"Mensual", fuente:"SIM",
        desc:"Indicador de composición. Mide la proporción de un subgrupo específico de colaboradores respecto al total de la fuerza laboral. Expresa el tamaño de una parte en relación con el todo." },
      { nombre:"Clima Organizacional",     proceso:"Gestión de Personal",
        formula:"Encuesta de percepción colectiva",
        tipo:"Desempeño", frecuencia:"Anual", fuente:"Encuesta",
        desc:"Métrica cuantitativa que mide la percepción colectiva de los colaboradores respecto a su ambiente de trabajo. Responsable: Gerente de Personal." },
      { nombre:"Deserción",               proceso:"Gestión de Personal",
        formula:"Colaboradores que salen antes de un año",
        tipo:"Resultado", frecuencia:"Mensual", fuente:"SIM",
        desc:"Métrica de personal que mide el porcentaje de colaboradores que abandonan la organización antes de cumplir un año." },
      { nombre:"Deserción (%)",           proceso:"Gestión de Personal",
        formula:"(Colaboradores que salen antes de 1 año / Total) × 100",
        tipo:"Resultado", frecuencia:"Mensual", fuente:"SIM",
        desc:"Expresión porcentual de la deserción. Permite comparar la tasa entre períodos y áreas de la organización." },
      { nombre:"Deserción 12M",           proceso:"Gestión de Personal",
        formula:"Deserción acumulada en los últimos 12 meses",
        tipo:"Resultado", frecuencia:"Mensual", fuente:"SIM",
        desc:"Porcentaje acumulado de deserción en los últimos 12 meses. Identifica tendencias de salida temprana y evalúa la efectividad del proceso de incorporación." },
      { nombre:"Días Posiciones Desocupadas", proceso:"Gestión de Personal",
        formula:"Total días con posiciones sin cubrir",
        tipo:"Resultado", frecuencia:"Mensual", fuente:"SIM",
        desc:"Tiempo en días que las posiciones permanecen vacantes. Mide la agilidad del proceso de reclutamiento y el impacto operativo de las posiciones sin cubrir." },
      { nombre:"Egresados",               proceso:"Gestión de Personal",
        formula:"Total colaboradores que salieron en el período",
        tipo:"Resultado", frecuencia:"Mensual", fuente:"SIM",
        desc:"Indicador de salida de talento. Número total de colaboradores que salieron de la organización (de forma voluntaria o involuntaria) en el período." },
      { nombre:"Egresados (%)",           proceso:"Gestión de Personal",
        formula:"Egresados / Promedio total colaboradores",
        tipo:"Resultado", frecuencia:"Mensual", fuente:"SIM",
        desc:"Indicador principal de retención y estabilidad. Porcentaje de colaboradores que salieron respecto al número total promedio del período." },
      { nombre:"Gasto de Personal",       proceso:"Gestión de Personal",
        formula:"Suma total de remuneraciones, beneficios e inversiones en talento",
        tipo:"Resultado", frecuencia:"Mensual", fuente:"SIM",
        desc:"Indicador financiero que representa todos los desembolsos para compensar y mantener la fuerza laboral. Es el costo total de emplear a las personas (normalmente un año o trimestre fiscal)." },
      { nombre:"Ingresados",              proceso:"Gestión de Personal",
        formula:"Total nuevos colaboradores incorporados en el período",
        tipo:"Resultado", frecuencia:"Mensual", fuente:"SIM",
        desc:"Indicador de adquisición de talento. Número total de nuevos colaboradores incorporados a través de todos los canales de reclutamiento (externos, traslados internos, practicantes)." },
      { nombre:"Ingresos 12M",            proceso:"Gestión de Personal",
        formula:"Total ingresos acumulados en los últimos 12 meses",
        tipo:"Resultado", frecuencia:"Mensual", fuente:"SIM",
        desc:"Ingresos acumulados en 12 meses. Permite analizar la dinámica de incorporación de talento y la capacidad de atracción de la organización." },
      { nombre:"Pasantes",                proceso:"Gestión de Personal",
        formula:"Total personas en práctica profesional (fecha de corte)",
        tipo:"Resultado", frecuencia:"Mensual", fuente:"SIM",
        desc:"Número total de personas realizando una práctica profesional o pasantía en la organización en un momento específico." },
      { nombre:"Rotación General (%)",    proceso:"Gestión de Personal",
        formula:"Egresados / Promedio colaboradores del período",
        tipo:"Resultado", frecuencia:"Mensual", fuente:"SIM",
        desc:"Indicador fundamental de RRHH que mide la tasa de renovación de la plantilla. Proporción de colaboradores que salieron respecto al promedio total del período." },
      { nombre:"Rotación Indeseada",      proceso:"Gestión de Personal",
        formula:"Pérdida de talento de alto valor y desempeño",
        tipo:"Calidad", frecuencia:"Mensual", fuente:"SIM",
        desc:"Indicador de calidad (KPI) que mide específicamente la pérdida de talento de alto valor y desempeño que la organización preferiría retener." },
      { nombre:"Rotación Indeseada (%)",  proceso:"Gestión de Personal",
        formula:"Egresados de alto desempeño / Total egresados",
        tipo:"Calidad", frecuencia:"Mensual", fuente:"SIM",
        desc:"Expresión porcentual de la rotación indeseada. Permite cuantificar el impacto de la pérdida de talento crítico sobre el total de salidas." },
      { nombre:"Sucesión",                proceso:"Gestión de Personal",
        formula:"% posiciones críticas con candidato interno preparado",
        tipo:"Desempeño", frecuencia:"Periódica", fuente:"SIM",
        desc:"Proceso estratégico que identifica y prepara colaboradores clave con potencial (N) y desempeño (M/P) para ocupar posiciones críticas. Asegura la continuidad del liderazgo." },
      { nombre:"Sucesión N3 (%)",         proceso:"Gestión de Personal",
        formula:"Posiciones senior con candidatos M5/N≥3 / Total posiciones senior",
        tipo:"Desempeño", frecuencia:"Periódica", fuente:"SIM",
        desc:"Indicador de profundidad del bench de talento. Proporción de posiciones de nivel senior (≥3) con candidatos internos de alto desempeño (M5) y alto potencial (N≥3) como cantera de futuros líderes." },
      { nombre:"Sucesión N3",             proceso:"Gestión de Personal",
        formula:"Colaboradores M5 en Nivel de Potencial 3, Paso {4,5}",
        tipo:"Desempeño", frecuencia:"Periódica", fuente:"SIM",
        desc:"Colaboradores con el más alto desempeño (M5) en etapa intermedia de desarrollo (Nivel de Potencial 3) en posiciones de mediano rango (Paso {4,5}). Constituyen la cantera principal para posiciones críticas de liderazgo." },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // CRÉDITO Y COBRO
  // ═══════════════════════════════════════════════════════════════
  {
    silo:"Crédito y Cobro", color:"#27ae60", icon:"💳",
    sistemas:[
      { nombre:"SIM / Softland ERP", icon:"📊", color:"#27ae60",
        reportes:[
          { nombre:"S.I.M", casas:MAYOREO_CASAS, nivel:"Supervisores en adelante",
            desc:"Tablero de indicadores de cartera, morosidad y cobros por vendedor. Alimentado desde CC — Cuentas por Cobrar y CB — Control Bancario." },
        ],
      },
    ],
    indicadores:[
      { nombre:"Cartera (CxC)",           proceso:"Gestión de Crédito y Cobranza",
        formula:"∑ Deuda por cobrar",
        tipo:"Resultado", frecuencia:"Mensual", fuente:"Softland",
        desc:"Sumatoria total de las Cuentas por Cobrar. Monto total de dinero que los clientes le deben a la compañía." },
      { nombre:"Morosidad CxC",           proceso:"Gestión de Crédito y Cobranza",
        formula:"(Monto CxC vencidas a más de 30 días / Total de la cartera) × 100",
        tipo:"Resultado", frecuencia:"Mensual", fuente:"Softland",
        desc:"Vencimiento de la cartera. Porcentaje de la cartera que ha excedido su fecha de vencimiento. Indicador clave de la salud crediticia del portafolio de clientes." },
      { nombre:"Cobros Pendientes de Conciliación", proceso:"Gestión de Crédito y Cobranza",
        formula:"(Movimientos de ingreso en bancos no conciliados / Total movimientos de ingreso en bancos) × 100",
        tipo:"Resultado", frecuencia:"Mensual", fuente:"Softland",
        desc:"Cantidad de pagos recibidos pendientes de conciliación bancaria al final del mes, excluyendo movimientos de tesorería. Mide la eficiencia del proceso de identificación de ingresos." },
      { nombre:"DSO — Días Promedio de Cobro", proceso:"Gestión de Crédito y Cobranza",
        formula:"(Promedio cartera últimos 2 meses / 12) / ((Ventas Netas + IVA%) / 365)",
        tipo:"Resultado", frecuencia:"Mensual", fuente:"Softland",
        desc:"Días promedio que le toma a la empresa convertir sus ventas a crédito en efectivo. Indicador de eficiencia del ciclo de cobro." },
      { nombre:"Cobro por Vendedor",      proceso:"Cobranza",
        formula:"Monto de cobranza realizada por vendedor distribuida por artículo",
        tipo:"Resultado", frecuencia:"Mensual", fuente:"Softland",
        desc:"Monto de cobranza realizada distribuida por vendedor y artículo. Permite evaluar la gestión de cobro de la fuerza de ventas (Agentes)." },
      { nombre:"Cartera > 30 Días",       proceso:"Gestión de Crédito y Cobranza",
        formula:"∑ Deuda por cobrar a más de 30 días",
        tipo:"Resultado", frecuencia:"Mensual", fuente:"Softland",
        desc:"Sumatoria de la deuda por cobrar que supera los 30 días de vencimiento. Señal de alerta para gestión activa de cobranza." },
      { nombre:"Incobrabilidad",          proceso:"Gestión de Crédito y Cobranza",
        formula:"(Cuentas incobrables / Ventas netas) × 100",
        tipo:"Resultado", frecuencia:"Mensual", fuente:"Softland",
        desc:"Porcentaje de ventas que la empresa debe registrar como pérdidas por cuentas irrecuperables. Indicador de calidad de la cartera de clientes." },
      { nombre:"Cartera Vencida",         proceso:"Gestión de Crédito y Cobranza",
        formula:"∑ Deuda por cobrar vencida",
        tipo:"Resultado", frecuencia:"Mensual", fuente:"Softland",
        desc:"Sumatoria de la deuda por cobrar que ha excedido su fecha de vencimiento. Base para calcular el porcentaje de morosidad." },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // COMERCIALIZACIÓN
  // ═══════════════════════════════════════════════════════════════
  {
    silo:"Comercialización", color:"#16a085", icon:"🏪",
    sistemas:[],
    indicadores:[
      { nombre:"Diferencia en Margen",    proceso:"Análisis Comercial",
        formula:"Margen real − Margen presupuestado",
        tipo:"Desempeño", frecuencia:"Mensual", fuente:"SIM",
        desc:"Variación del margen bruto vs período anterior o presupuesto. Identifica pérdidas o ganancias de rentabilidad por producto, categoría o zona." },
      { nombre:"Diferencia en Volumen",   proceso:"Análisis Comercial",
        formula:"Unidades reales − Unidades presupuestadas",
        tipo:"Desempeño", frecuencia:"Mensual", fuente:"SIM",
        desc:"Variación de unidades vendidas vs meta o período base. Descompone el resultado comercial para aislar el efecto cantidad del efecto precio." },
      { nombre:"Diferencia en Contribución", proceso:"Análisis Comercial",
        formula:"Contribución real − Contribución presupuestada",
        tipo:"Desempeño", frecuencia:"Mensual", fuente:"SIM",
        desc:"Variación en la contribución marginal total del período. Combina el efecto precio, el efecto volumen y la mezcla de productos para explicar el resultado vs presupuesto." },
      { nombre:"Sensibilidad",            proceso:"Análisis Comercial",
        formula:"Clasificación: Restringida / Interna / Pública",
        tipo:"Desempeño", frecuencia:"Mensual", fuente:"SIM",
        desc:"Clasifica los artículos según su nivel de sensibilidad al precio. Identifica qué SKUs tienen mayor impacto en el resultado ante ajustes de precio o costo, soportando decisiones de fijación de precios y negociación." },
      { nombre:"Visibilidad",             proceso:"Análisis Comercial",
        formula:"Indicador de presencia y exhibición en punto de venta",
        tipo:"Desempeño", frecuencia:"Mensual", fuente:"SIM",
        desc:"Indicador de presencia y exhibición de los artículos del portafolio en puntos de venta. Mide la efectividad del trabajo de campo del equipo comercial y del repositor." },
      { nombre:"GMROI",                   proceso:"Análisis Comercial",
        formula:"Margen × Rotación",
        tipo:"Resultado", frecuencia:"Mensual", fuente:"SIM",
        desc:"Gross Margin Return on Investment. Indica cuántos dólares de margen bruto se generan por cada dólar invertido en inventario. Valor adecuado para el negocio: 1.7." },
    ],
  },

];


// ════════════════════════════════════════════════════════
//  COMPONENTE: VISTA DE REPORTES E INDICADORES
// ════════════════════════════════════════════════════════

function ReportesView() {
  const [siloFilter, setSiloFilter] = useState("ALL");
  const [search, setSearch]         = useState("");
  const [subTab, setSubTab]         = useState("reportes"); // "reportes" | "indicadores"

  const q = search.toLowerCase();

  const silosVisible = REPORTES_SILOS.map(silo => {
    if (siloFilter !== "ALL" && siloFilter !== silo.silo) return null;

    // Filtrar reportes
    const sistemasFiltered = silo.sistemas.map(sis => {
      const reportesFil = sis.reportes.filter(r =>
        !q ||
        r.nombre.toLowerCase().includes(q) ||
        r.desc.toLowerCase().includes(q) ||
        r.nivel.toLowerCase().includes(q) ||
        sis.nombre.toLowerCase().includes(q) ||
        r.casas.some(c => c.toLowerCase().includes(q))
      );
      return reportesFil.length > 0 ? { ...sis, reportes: reportesFil } : null;
    }).filter(Boolean);

    // Filtrar indicadores
    const indicadoresFil = (silo.indicadores || []).filter(ind =>
      !q ||
      ind.nombre.toLowerCase().includes(q) ||
      ind.desc.toLowerCase().includes(q) ||
      (ind.proceso && ind.proceso.toLowerCase().includes(q)) ||
      (ind.fuente && ind.fuente.toLowerCase().includes(q))
    );

    const tieneReportes    = sistemasFiltered.length > 0;
    const tieneIndicadores = indicadoresFil.length > 0;
    if (!tieneReportes && !tieneIndicadores) return null;

    return { ...silo, sistemas: sistemasFiltered, indicadores: indicadoresFil };
  }).filter(Boolean);

  const totalReportes    = REPORTES_SILOS.reduce((a,s) => a + s.sistemas.reduce((b,sis) => b + sis.reportes.length, 0), 0);
  const totalIndicadores = REPORTES_SILOS.reduce((a,s) => a + (s.indicadores||[]).length, 0);

  const hi = (txt, color) => {
    if (!q) return txt;
    const idx = txt.toLowerCase().indexOf(q);
    if (idx === -1) return txt;
    return (
      <>
        {txt.slice(0, idx)}
        <mark style={{ background:color+"33", color, borderRadius:2, padding:"0 2px", fontWeight:700 }}>
          {txt.slice(idx, idx + q.length)}
        </mark>
        {txt.slice(idx + q.length)}
      </>
    );
  };

  const CasasBadge = ({ casas, color }) => {
    const esTodas = MAYOREO_CASAS.every(c => casas.includes(c));
    if (esTodas) return (
      <span style={{ fontSize:9, fontWeight:600, color:"#555",
        background:"#f0f0f0", border:"1px solid #ddd",
        borderRadius:10, padding:"2px 8px", whiteSpace:"nowrap" }}>
        🏢 Todas las casas
      </span>
    );
    return (
      <div style={{ display:"flex", flexWrap:"wrap", gap:3 }}>
        {casas.map(c => (
          <span key={c} style={{ fontSize:9, fontWeight:700, color,
            background:color+"18", border:`1px solid ${color}44`,
            borderRadius:10, padding:"2px 7px" }}>{c}</span>
        ))}
      </div>
    );
  };

  return (
    <div style={{ fontFamily:"'Segoe UI','Helvetica Neue',sans-serif", color:"#1D1D1B" }}>

      {/* ── KPIs ── */}
      <div style={{ display:"flex", gap:10, marginBottom:20, flexWrap:"wrap" }}>
        {[
          { label:"Reportes",              val:totalReportes,           color:"#1B5E20" },
          { label:"Indicadores documentados", val:totalIndicadores, color:"#0097A7" },
          { label:"Departamentos",         val:REPORTES_SILOS.length,   color:"#7B1FA2" },
          { label:"Casas Mayoreo",         val:MAYOREO_CASAS.length,    color:"#E65100" },
        ].map(k => (
          <div key={k.label} style={{ flex:"1 1 110px", background:"#fff",
            border:"1px solid #e0e0e0", borderRadius:10, padding:"12px 18px" }}>
            <div style={{ fontSize:26, fontWeight:800, color:k.color }}>{k.val}</div>
            <div style={{ fontSize:10, color:"#888" }}>{k.label}</div>
          </div>
        ))}
      </div>

      {/* ── Sub-tabs Reportes / Indicadores ── */}
      <div style={{ display:"flex", gap:4, marginBottom:16, borderBottom:"1px solid #e0e0e0" }}>
        {[
          { id:"reportes",    label:"📄 Reportes" },
          { id:"indicadores", label:"📊 Indicadores SIM" },
        ].map(t => (
          <button key={t.id} onClick={() => setSubTab(t.id)} style={{
            background: subTab===t.id ? "#1D1D1B" : "transparent",
            border:"none",
            borderBottom: subTab===t.id ? "2px solid #1D1D1B" : "2px solid transparent",
            color: subTab===t.id ? "#fff" : "#666",
            padding:"8px 20px", cursor:"pointer", fontSize:13,
            fontWeight: subTab===t.id ? 700 : 400,
            borderRadius:"6px 6px 0 0", transition:"all 0.15s",
          }}>{t.label}</button>
        ))}
      </div>

      {/* ── Filtros ── */}
      <div style={{ display:"flex", gap:8, marginBottom:22, flexWrap:"wrap", alignItems:"center" }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="🔍  Buscar reporte, indicador, sistema o casa…"
          style={{ flex:"1 1 220px", padding:"8px 12px",
            border:"1.5px solid #ddd", borderRadius:7,
            fontSize:12, outline:"none", boxSizing:"border-box" }}
        />
        <div style={{ display:"flex", gap:4, flexWrap:"wrap" }}>
          {["ALL", ...REPORTES_SILOS.map(s => s.silo)].map(s => {
            const meta = REPORTES_SILOS.find(x => x.silo === s);
            const active = siloFilter === s;
            return (
              <button key={s} onClick={() => setSiloFilter(s)} style={{
                background: active ? (meta?.color || "#1D1D1B") : "transparent",
                border:`1px solid ${active ? (meta?.color || "#1D1D1B") : "#ddd"}`,
                color: active ? "#fff" : "#555",
                borderRadius:6, padding:"5px 12px", fontSize:11,
                fontWeight:active?700:400, cursor:"pointer",
                whiteSpace:"nowrap", transition:"all 0.15s",
              }}>
                {s === "ALL" ? "Todos" : `${meta?.icon} ${s}`}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Vista: REPORTES ── */}
      {subTab === "reportes" && (
        silosVisible.filter(s => s.sistemas.length > 0).length === 0 ? (
          <div style={{ textAlign:"center", color:"#bbb", fontSize:13, padding:"48px 0" }}>
            Sin resultados para la búsqueda o filtro seleccionado.
          </div>
        ) : silosVisible.filter(s => s.sistemas.length > 0).map(silo => {
          const totalRep = silo.sistemas.reduce((a,s) => a + s.reportes.length, 0);
          return (
            <div key={silo.silo} style={{ marginBottom:32 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10,
                borderLeft:`5px solid ${silo.color}`, paddingLeft:14, marginBottom:12 }}>
                <span style={{ fontSize:22 }}>{silo.icon}</span>
                <div>
                  <div style={{ fontSize:16, fontWeight:800, color:silo.color }}>{silo.silo}</div>
                  <div style={{ fontSize:10, color:"#999" }}>
                    {silo.sistemas.length} sistema{silo.sistemas.length!==1?"s":""} fuente · {totalRep} reporte{totalRep!==1?"s":""}
                  </div>
                </div>
              </div>

              <div style={{ borderRadius:10, border:"1px solid #e8e8e8", overflow:"hidden", background:"#fff" }}>
                <table style={{ width:"100%", borderCollapse:"collapse" }}>
                  <thead>
                    <tr style={{ background:silo.color+"0f", borderBottom:`2px solid ${silo.color}33` }}>
                      {[{l:"Sistema fuente",w:190},{l:"Reporte",w:null},{l:"Casas",w:160},{l:"Nivel de acceso",w:155}].map(col=>(
                        <th key={col.l} style={{ padding:"10px 14px", textAlign:"left",
                          fontSize:10, fontWeight:700, color:silo.color,
                          textTransform:"uppercase", letterSpacing:0.7,
                          width:col.w||undefined, whiteSpace:"nowrap" }}>{col.l}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {silo.sistemas.map((sis, si) => (
                      <tr key={si} style={{
                        borderBottom: si < silo.sistemas.length-1 ? `1px solid #efefef` : "none",
                        verticalAlign:"top",
                        background: si%2===0 ? "#fff" : "#fafafa",
                      }}>
                        <td style={{ padding:"14px 14px", borderRight:"1px solid #f0f0f0", verticalAlign:"middle", width:190 }}>
                          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                            <span style={{ fontSize:20, flexShrink:0 }}>{sis.icon}</span>
                            <div>
                              <div style={{ fontSize:11, fontWeight:800, color:sis.color, lineHeight:1.3 }}>
                                {hi(sis.nombre, sis.color)}
                              </div>
                              <div style={{ marginTop:4, display:"inline-block",
                                background:sis.color+"18", border:`1px solid ${sis.color}33`,
                                color:sis.color, borderRadius:10, padding:"1px 8px",
                                fontSize:9, fontWeight:700 }}>
                                {sis.reportes.length} reporte{sis.reportes.length!==1?"s":""}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding:0, verticalAlign:"top" }} colSpan={3}>
                          {sis.reportes.map((rep, ri) => {
                            const isLast = ri === sis.reportes.length-1;
                            const restringido = rep.nivel !== "Todos";
                            return (
                              <div key={ri} style={{
                                display:"grid", gridTemplateColumns:"1fr 160px 155px",
                                borderBottom: !isLast ? "1px dashed #ececec" : "none",
                                alignItems:"start",
                              }}>
                                <div style={{ padding:"12px 14px" }}>
                                  <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:4 }}>
                                    <span style={{ width:7, height:7, borderRadius:"50%",
                                      background:silo.color, flexShrink:0, display:"inline-block" }}/>
                                    <span style={{ fontSize:12, fontWeight:700, color:"#1D1D1B" }}>
                                      {hi(rep.nombre, silo.color)}
                                    </span>
                                  </div>
                                  <div style={{ fontSize:11, color:"#666", lineHeight:1.65, paddingLeft:14 }}>
                                    {hi(rep.desc, silo.color)}
                                  </div>
                                </div>
                                <div style={{ padding:"14px 10px", borderLeft:"1px solid #f0f0f0" }}>
                                  <CasasBadge casas={rep.casas} color={silo.color} />
                                </div>
                                <div style={{ padding:"14px 10px", borderLeft:"1px solid #f0f0f0" }}>
                                  <span style={{
                                    display:"inline-block",
                                    background: restringido ? silo.color+"18" : "#f0f0f0",
                                    border:`1px solid ${restringido ? silo.color+"44" : "#ddd"}`,
                                    color: restringido ? silo.color : "#888",
                                    borderRadius:12, padding:"3px 9px",
                                    fontSize:9, fontWeight:restringido?700:500, whiteSpace:"nowrap",
                                  }}>
                                    {restringido ? "👤 "+rep.nivel : rep.nivel}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })
      )}

      {/* ── Vista: INDICADORES ── */}
      {subTab === "indicadores" && (
        silosVisible.filter(s => s.indicadores && s.indicadores.length > 0).length === 0 ? (
          <div style={{ textAlign:"center", color:"#bbb", fontSize:13, padding:"48px 0" }}>
            Sin resultados para la búsqueda o filtro seleccionado.
          </div>
        ) : silosVisible.filter(s => s.indicadores && s.indicadores.length > 0).map(silo => (
          <div key={silo.silo} style={{ marginBottom:28 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10,
              borderLeft:`5px solid ${silo.color}`, paddingLeft:14, marginBottom:12 }}>
              <span style={{ fontSize:22 }}>{silo.icon}</span>
              <div>
                <div style={{ fontSize:16, fontWeight:800, color:silo.color }}>{silo.silo}</div>
                <div style={{ fontSize:10, color:"#999" }}>{silo.indicadores.length} indicador{silo.indicadores.length!==1?"es":""}</div>
              </div>
            </div>

            <div style={{ borderRadius:10, border:"1px solid #e8e8e8", overflow:"hidden", background:"#fff" }}>
              <table style={{ width:"100%", borderCollapse:"collapse" }}>
                <thead>
                  <tr style={{ background:silo.color+"0f", borderBottom:`2px solid ${silo.color}33` }}>
                    {[{l:"Indicador",w:170},{l:"Proceso",w:130},{l:"Descripción / Uso",w:null},{l:"Fórmula",w:180},{l:"Tipo",w:90},{l:"Frec.",w:80},{l:"Fuente",w:100}].map(col=>(
                      <th key={col.l} style={{ padding:"10px 14px", textAlign:"left",
                        fontSize:10, fontWeight:700, color:silo.color,
                        textTransform:"uppercase", letterSpacing:0.7,
                        width:col.w||undefined, whiteSpace:"nowrap" }}>{col.l}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {silo.indicadores.map((ind, ii) => (
                    <tr key={ii} style={{
                      background: ii%2===0 ? "#fff" : "#fafafa",
                      borderBottom: ii < silo.indicadores.length-1 ? "1px solid #f0f0f0" : "none",
                      verticalAlign:"top",
                    }}>
                      <td style={{ padding:"13px 14px", borderRight:"1px solid #f0f0f0", verticalAlign:"top" }}>
                        <div style={{ display:"flex", alignItems:"flex-start", gap:8 }}>
                          <span style={{ width:8, height:8, borderRadius:"50%", marginTop:4,
                            background:silo.color, flexShrink:0, display:"inline-block" }}/>
                          <span style={{ fontSize:12, fontWeight:700, color:silo.color, lineHeight:1.4 }}>
                            {hi(ind.nombre, silo.color)}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding:"13px 14px", fontSize:10, color:"#888", lineHeight:1.5, borderRight:"1px solid #f0f0f0", verticalAlign:"top" }}>
                        {ind.proceso && <span style={{ fontStyle:"italic" }}>{hi(ind.proceso, silo.color)}</span>}
                      </td>
                      <td style={{ padding:"13px 14px", fontSize:11, color:"#555", lineHeight:1.65, borderRight:"1px solid #f0f0f0" }}>
                        {hi(ind.desc, silo.color)}
                      </td>
                      <td style={{ padding:"13px 14px", borderRight:"1px solid #f0f0f0", verticalAlign:"top" }}>
                        {ind.formula && (
                          <span style={{
                            display:"block", fontSize:10, fontFamily:"monospace",
                            color:silo.color, background:silo.color+"0a",
                            border:`1px solid ${silo.color}22`,
                            borderRadius:5, padding:"4px 8px", lineHeight:1.5,
                          }}>{ind.formula}</span>
                        )}
                      </td>
                      <td style={{ padding:"13px 14px", borderRight:"1px solid #f0f0f0", verticalAlign:"middle" }}>
                        {ind.tipo && (
                          <span style={{
                            display:"inline-block", fontSize:9, fontWeight:700,
                            background: ind.tipo==="Resultado" ? "#e3f2fd" : ind.tipo==="Calidad" ? "#fce4ec" : "#e8f5e9",
                            color: ind.tipo==="Resultado" ? "#1565C0" : ind.tipo==="Calidad" ? "#880E4F" : "#1B5E20",
                            border: `1px solid ${ind.tipo==="Resultado" ? "#90CAF9" : ind.tipo==="Calidad" ? "#F48FB1" : "#A5D6A7"}`,
                            borderRadius:10, padding:"2px 7px", whiteSpace:"nowrap",
                          }}>{ind.tipo}</span>
                        )}
                      </td>
                      <td style={{ padding:"13px 14px", verticalAlign:"middle" }}>
                        {ind.frecuencia && (
                          <span style={{ fontSize:10, color:"#888", whiteSpace:"nowrap" }}>
                            {ind.frecuencia === "Diario" ? "📅 Diario" :
                             ind.frecuencia === "Mensual" ? "📆 Mensual" :
                             ind.frecuencia === "Anual" ? "📅 Anual" : `🕐 ${ind.frecuencia}`}
                          </span>
                        )}
                      </td>
                      <td style={{ padding:"13px 10px", fontSize:9, color:"#777", lineHeight:1.5, verticalAlign:"top" }}>
                        {ind.fuente && <span style={{ background:"#f5f5f5", border:"1px solid #e0e0e0", borderRadius:4, padding:"2px 6px", display:"inline-block" }}>{ind.fuente}</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))
      )}

      {/* ── Leyenda ── */}
      <div style={{ marginTop:8, background:"#f8f9fa", border:"1px solid #e0e0e0",
        borderRadius:10, padding:"10px 16px", display:"flex", gap:20, flexWrap:"wrap" }}>
        {[
          { icon:"📊", color:"#f39c12", label:"SIM — Sistema de Información Mayoreo" },
          { icon:"⬡",  color:"#16a085", label:"Softland ERP — módulos FA, CO, CI, CG…" },
          { icon:"🔧", color:"#7B1FA2", label:"DM — Desarrollo a Medida" },
          { icon:"👤", color:"#C62828", label:"Nivel restringido — Supervisores en adelante" },
          { icon:"🏢", color:"#555",    label:"Todas las casas = Beval, Cofersa, Febeca, Mundipartes, Prisma, Sillaca" },
        ].map(l => (
          <div key={l.icon} style={{ display:"flex", alignItems:"center", gap:6, fontSize:11, color:"#777" }}>
            <span style={{ color:l.color }}>{l.icon}</span> {l.label}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SoftlandArchitecture() {
  const [tab, setTab]                   = useState("bpa");
  const [activeModulePanel, setActiveModulePanel] = useState(null); // code or null

  const openModulePanel = (code) => setActiveModulePanel(code);
  const closeModulePanel = ()     => setActiveModulePanel(null);

  return (
    <div style={{
      fontFamily:"'Segoe UI','Helvetica Neue',sans-serif",
      background:"#f8f9fa",
      color:"#e0e0e8",
      minHeight:"100vh",
      padding:"24px",
    }}>
      {/* Modal de tablas/campos de módulo ERP */}
      {activeModulePanel && (
        <ModuleTablesPanel moduleCode={activeModulePanel} onClose={closeModulePanel} />
      )}

      <div style={{ maxWidth:920, margin:"0 auto" }}>
        <h1 style={{
          fontSize:26, fontWeight:700, letterSpacing:"-0.5px",
          color:"#1D1D1B",
          marginBottom:4,
        }}>
          Arquitectura Tecnológica — Grupo Mayoreo · Softland ERP v7.00
        </h1>
        <p style={{ color:"#666", fontSize:13, marginBottom:20 }}>
          {tab==="bpa"          && "Modelo de procesos BPA · 3 áreas · 21 procesos · haz clic en cualquier proceso para ver su orquestación con el ecosistema"}
          {tab==="sistrela"     && "Relaciones entre sistemas · 6 silos · 63 procesos · flujo de sistemas, entidades y atributos por proceso · oportunidades de automatización"}
          {tab==="ecosystem"    && "Ecosistema completo: capas de infraestructura, satélites, DMs, empresas e integraciones"}
          {tab==="architecture" && "Mapa de integración entre módulos ERP · Haz clic en un módulo para ver sus relaciones"}
          {tab==="data"         && "Modelo de datos: Buscador de 1,189 tablas con campos reales · UDFs · proyectos activos · Fuente: diccionarios SQL Server"}
          {tab==="reportes"     && "Catálogo de reportes por silo de negocio · Sistemas fuente · Audiencias · Descripción de uso"}
        </p>

        {/* Tabs */}
        <div style={{ display:"flex", gap:4, marginBottom:24, borderBottom:"1px solid #e0e0e0", overflowX:"auto" }}>
          {[
            { id:"bpa",          label:"◈ BPA"                    },
            { id:"sistrela",     label:"⟳ Relaciones de Sistemas"  },
            { id:"ecosystem",    label:"◉ Ecosistema"              },
            { id:"architecture", label:"⬡ Módulos ERP"             },
            { id:"data",         label:"⊞ Datos & UDFs"            },
            { id:"reportes",     label:"📊 Reportes"               },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              background:tab===t.id?"#808080":"transparent",
              border:"none",
              borderBottom:tab===t.id?"2px solid #808080":"2px solid transparent",
              color:tab===t.id?"#ffffff":"#555",
              padding:"10px 22px", cursor:"pointer", fontSize:14,
              fontWeight:tab===t.id?700:400,
              transition:"all 0.2s", borderRadius:"8px 8px 0 0", whiteSpace:"nowrap",
            }}>
              {t.label}
            </button>
          ))}
        </div>

        {tab==="bpa"          && <BPAView onModuleClick={openModulePanel} />}
        {tab==="sistrela"     && <SistRelView onModuleClick={openModulePanel} />}
        {tab==="ecosystem"    && <EcosystemView />}
        {tab==="architecture" && <ArchitectureView />}
        {tab==="data"         && <DataModelView />}
        {tab==="reportes"     && <ReportesView />}
      </div>
    </div>
  );
}
