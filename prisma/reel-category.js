function inferCategory(title) {
  const value = String(title || "").toLowerCase();

  if (/(bed|headboard|bedroom|mattress)/.test(value)) {
    return "Bedroom";
  }

  if (/(sofa|couch|recliner|sofa cum bed)/.test(value)) {
    return "Sofas";
  }

  if (/(chair|stool|bench)/.test(value)) {
    return "Chairs";
  }

  if (/(table|desk|dining|stand \(for plant\)|stand\b)/.test(value)) {
    return "Tables & Stands";
  }

  if (/(cabinet|wardrobe|closet|drawer|dresser|almirah|shelf|rack|showcase|tv panel|tv unit|basin cabinet|header\b)/.test(value)) {
    return "Storage & Cabinets";
  }

  if (/(wallpaper|panel|gypsum|border|wall mount|wallboards|room|decor)/.test(value)) {
    return "Interior Decor";
  }

  if (/(epoxy|coating|varnish|polish|color|damp|stone coating|tiles clear|tiles cutting|floor|resin)/.test(value)) {
    return "Finishes & Coatings";
  }

  if (/(foam|fabric|cotton filling|upholstery|cover for furniture|net\b|swing for bag|fabric swing|foam swing|foam setup|foam staple)/.test(value)) {
    return "Upholstery & Foam";
  }

  if (/(board|plywood|wood|timber|veneer|laminate|sheet|surface|marble|glass|mirror|pvc film|rock slab|wood grain film|wr[ae]ping paper|wallboards minimal|balfour wood|wood join|panel sandwich)/.test(value)) {
    return "Boards & Surfaces";
  }

  if (/(door|window|shutter|gate|grill)/.test(value)) {
    return "Doors & Security";
  }

  if (/(connector|bracket|hinge|mechanism|hardware|staple|stapler|angle\b|tool|measurement|contour|gauge|join\b)/.test(value)) {
    return "Hardware & Fittings";
  }

  if (/(machine|compressor|drill|cutter|welding|bending|laser|milling|router bit|sanding|sawing|folding machine|swing machine|printer|sewing|generator|lift|ladder|cordless)/.test(value)) {
    return "Machinery & Tools";
  }

  if (/(car delivey|delivery|port|cargo lift)/.test(value)) {
    return "Logistics & Handling";
  }

  if (/(solar light|tube light chip|lightning safety)/.test(value)) {
    return "Lighting & Electrical";
  }

  if (/(modern furniture|package-house furniture|furniture\b|set\b)/.test(value)) {
    return "General Furniture";
  }

  return "Specialty";
}

function inferContentTypeFromImportType(type, url) {
  const value = String(type || "").toLowerCase();
  const link = String(url || "").toLowerCase();

  if (value === "post" || link.includes("/posts/") || link.includes("story.php")) {
    return "POST";
  }

  if (value === "video" || link.includes("/videos/") || link.includes("watch/?v=") || link.includes("watch?v=")) {
    return "VIDEO";
  }

  return "REEL";
}

module.exports = { inferCategory, inferContentTypeFromImportType };
