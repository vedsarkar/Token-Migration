// Batch 5/6 — 150 entries
const ENTRIES = [["sapIndicationColor_3_Active_BorderColor","#FFF5CC","o"],["sapIndicationColor_3_Active_TextColor","#BE520E","o"],["sapIndicationColor_3_Selected_Background","#FFFFFF","o"],["sapIndicationColor_3_Selected_BorderColor","#FFF5CC","o"],["sapIndicationColor_3_Selected_TextColor","#BE520E","o"],["sapIndicationColor_3b","#FEE0C9","o"],["sapIndicationColor_3b_Background","#FEE0C9","o"],["sapIndicationColor_3b_BorderColor","#FEE0C9","o"],["sapIndicationColor_3b_TextColor","#9E4F00","o"],["sapIndicationColor_3b_Hover_Background","#FCCAA5","o"],["sapIndicationColor_4","#2A6D47","o"],["sapIndicationColor_4_Background","#2A6D47","o"],["sapIndicationColor_4_BorderColor","#2A6D47","o"],["sapIndicationColor_4_TextColor","#FFFFFF","o"],["sapIndicationColor_4_Hover_Background","#286344","o"],["sapIndicationColor_4_Active_Background","#FFFFFF","o"],["sapIndicationColor_4_Active_BorderColor","#A9DCBA","o"],["sapIndicationColor_4_Active_TextColor","#2A6D47","o"],["sapIndicationColor_4_Selected_Background","#FFFFFF","o"],["sapIndicationColor_4_Selected_BorderColor","#A9DCBA","o"],["sapIndicationColor_4_Selected_TextColor","#2A6D47","o"],["sapIndicationColor_4b","#A9DCBA","o"],["sapIndicationColor_4b_Background","#A9DCBA","o"],["sapIndicationColor_4b_BorderColor","#A9DCBA","o"],["sapIndicationColor_4b_TextColor","#396B1A","o"],["sapIndicationColor_4b_Hover_Background","#9ED9B1","o"],["sapIndicationColor_5","#4569F9","o"],["sapIndicationColor_5_Background","#4569F9","o"],["sapIndicationColor_5_BorderColor","#4569F9","o"],["sapIndicationColor_5_TextColor","#FFFFFF","o"],["sapIndicationColor_5_Hover_Background","#4563ED","o"],["sapIndicationColor_5_Active_Background","#FFFFFF","o"],["sapIndicationColor_5_Active_BorderColor","#DCF7FE","o"],["sapIndicationColor_5_Active_TextColor","#4569F9","o"],["sapIndicationColor_5_Selected_Background","#FFFFFF","o"],["sapIndicationColor_5_Selected_BorderColor","#DCF7FE","o"],["sapIndicationColor_5_Selected_TextColor","#0000CC","o"],["sapIndicationColor_5b","#DEE7F9","o"],["sapIndicationColor_5b_Background","#DEE7F9","o"],["sapIndicationColor_5b_BorderColor","#DEE7F9","o"],["sapIndicationColor_5b_TextColor","#4564ED","o"],["sapIndicationColor_5b_Hover_Background","#C4F3FE","o"],["sapIndicationColor_6","#026971","o"],["sapIndicationColor_6_Background","#026971","o"],["sapIndicationColor_6_BorderColor","#026971","o"],["sapIndicationColor_6_TextColor","#FFFFFF","o"],["sapIndicationColor_6_Hover_Background","#025E64","o"],["sapIndicationColor_6_Active_Background","#FFFFFF","o"],["sapIndicationColor_6_Active_BorderColor","#CDFAF6","o"],["sapIndicationColor_6_Active_TextColor","#026971","o"],["sapIndicationColor_6_Selected_Background","#FFFFFF","o"],["sapIndicationColor_6_Selected_BorderColor","#CDFAF6","o"],["sapIndicationColor_6_Selected_TextColor","#026971","o"],["sapIndicationColor_6b","#CDFAF6","o"],["sapIndicationColor_6b_Background","#CDFAF6","o"],["sapIndicationColor_6b_BorderColor","#CDFAF6","o"],["sapIndicationColor_6b_TextColor","#246B55","o"],["sapIndicationColor_6b_Hover_Background","#B8E9DA","o"],["sapIndicationColor_7","#4B35FF","o"],["sapIndicationColor_7_Background","#4B35FF","o"],["sapIndicationColor_7_BorderColor","#4B35FF","o"],["sapIndicationColor_7_TextColor","#FFFFFF","o"],["sapIndicationColor_7_Hover_Background","#3415FF","o"],["sapIndicationColor_7_Active_Background","#FFFFFF","o"],["sapIndicationColor_7_Active_BorderColor","#E4E0FF","o"],["sapIndicationColor_7_Active_TextColor","#4B35FF","o"],["sapIndicationColor_7_Selected_Background","#FFFFFF","o"],["sapIndicationColor_7_Selected_BorderColor","#E4E0FF","o"],["sapIndicationColor_7_Selected_TextColor","#4B35FF","o"],["sapIndicationColor_7b","#E4E0FF","o"],["sapIndicationColor_7b_Background","#E4E0FF","o"],["sapIndicationColor_7b_BorderColor","#E4E0FF","o"],["sapIndicationColor_7b_TextColor","#4D36FF","o"],["sapIndicationColor_7b_Hover_Background","#CDC7FF","o"],["sapIndicationColor_8","#992FDA","o"],["sapIndicationColor_8_Background","#992FDA","o"],["sapIndicationColor_8_BorderColor","#992FDA","o"],["sapIndicationColor_8_TextColor","#FFFFFF","o"],["sapIndicationColor_8_Hover_Background","#70049E","o"],["sapIndicationColor_8_Active_Background","#FFFFFF","o"],["sapIndicationColor_8_Active_BorderColor","#EED3FD","o"],["sapIndicationColor_8_Active_TextColor","#992FDA","o"],["sapIndicationColor_8_Selected_Background","#FFFFFF","o"],["sapIndicationColor_8_Selected_BorderColor","#EED3FD","o"],["sapIndicationColor_8_Selected_TextColor","#992FDA","o"],["sapIndicationColor_8b","#EED3FD","o"],["sapIndicationColor_8b_Background","#EED3FD","o"],["sapIndicationColor_8b_BorderColor","#EED3FD","o"],["sapIndicationColor_8b_TextColor","#992FDA","o"],["sapIndicationColor_8b_Hover_Background","#DFAFFB","o"],["sapIndicationColor_9","#222A3F","o"],["sapIndicationColor_9_Background","#222A3F","o"],["sapIndicationColor_9_BorderColor","#222A3F","o"],["sapIndicationColor_9_TextColor","#FFFFFF","o"],["sapIndicationColor_9_Hover_Background","#121829","o"],["sapIndicationColor_9_Active_Background","#FFFFFF","o"],["sapIndicationColor_9_Active_TextColor","#222A3F","o"],["sapIndicationColor_9_Active_BorderColor","#DEDEE6","o"],["sapIndicationColor_9_Selected_Background","#FFFFFF","o"],["sapIndicationColor_9_Selected_BorderColor","#DEDEE6","o"],["sapIndicationColor_9_Selected_TextColor","#222A3F","o"],["sapIndicationColor_9b","#FFFFFF","o"],["sapIndicationColor_9b_Background","#FFFFFF","o"],["sapIndicationColor_9b_BorderColor","#DEDEE6","o"],["sapIndicationColor_9b_TextColor","#222926","o"],["sapIndicationColor_9b_Hover_Background","#F5F5FA","o"],["sapIndicationColor_10","#303F40","o"],["sapIndicationColor_10_Background","#A2A3BB","o"],["sapIndicationColor_10_BorderColor","#A2A3BB","o"],["sapIndicationColor_10_TextColor","#FFFFFF","o"],["sapIndicationColor_10_Hover_Background","#557173","o"],["sapIndicationColor_10_Active_Background","#FFFFFF","o"],["sapIndicationColor_10_Active_BorderColor","#F5F5FA","o"],["sapIndicationColor_10_Active_TextColor","#303F40","o"],["sapIndicationColor_10_Selected_Background","#FFFFFF","o"],["sapIndicationColor_10_Selected_BorderColor","#F5F5FA","o"],["sapIndicationColor_10_Selected_TextColor","#303F40","o"],["sapIndicationColor_10b","#F5F5FA","o"],["sapIndicationColor_10b_Background","#F5F5FA","o"],["sapIndicationColor_10b_BorderColor","#F5F5FA","o"],["sapIndicationColor_10b_TextColor","#2F3D3F","o"],["sapIndicationColor_10b_Hover_Background","#E0E1EB","o"],["sapField_Background","#FFFFFF","o"],["sapField_BorderColor","#646E97","o"],["sapField_TextColor","#111727","o"],["sapField_PlaceholderTextColor","#646E97","o"],["sapField_Hover_Background","#FFFFFF","o"],["sapField_Hover_BorderColor","#4563ED","o"],["sapField_Selector_Hover_Background","#E3EAF9","o"],["sapField_Active_BorderColor","#4563ED","o"],["sapField_Focus_Background","#FFFFFF","o"],["sapField_Focus_BorderColor","#31239B","o"],["sapField_RequiredColor","#BD0F6E","o"],["sapField_HelpBackground","#FFFFFF","o"],["sapField_Hover_HelpBackground","#FFFFFF","o"],["sapField_Focus_HelpBackground","#FFFFFF","o"],["sapField_InformationColor","#0000CC","o"],["sapField_InformationBackground","#E3FAFF","o"],["sapField_Selector_Hover_InformationBackground","#FFFFFF","o"],["sapField_SuccessColor","#3B9564","o"],["sapField_SuccessBackground","#F7FFE5","o"],["sapField_Selector_Hover_SuccessBackground","#FFFFFF","o"],["sapField_WarningColor","#E66409","o"],["sapField_WarningBackground","#FFF5CC","o"],["sapField_Selector_Hover_WarningBackground","#FFFFFF","o"],["sapField_InvalidColor","#EC2525","o"],["sapField_InvalidBackground","#FFE5F3","o"],["sapField_Selector_Hover_InvalidBackground","#FFFFFF","o"],["sapField_ReadOnly_Background","#F5F5FA","o"],["sapField_ReadOnly_HelpBackground","#F5F5FA","o"]];
const COL_ID = 'VariableCollectionId:153848:18325';
const MORNING = '153848:1';

const coll = await figma.variables.getVariableCollectionByIdAsync(COL_ID);
const leafOf = (n) => n.split('/').pop().trim();
const hexToRgb01 = (hex) => {
  const v = hex.replace('#', '');
  return {
    r: parseInt(v.slice(0, 2), 16) / 255,
    g: parseInt(v.slice(2, 4), 16) / 255,
    b: parseInt(v.slice(4, 6), 16) / 255,
  };
};

// Build leaf -> variable map once for this batch (~1146 vars in the collection).
const byLeaf = new Map();
for (const id of coll.variableIds) {
  const v = await figma.variables.getVariableByIdAsync(id);
  if (!v || v.resolvedType !== 'COLOR') continue;
  byLeaf.set(leafOf(v.name), v);
}

const out = { overridden: 0, kept: 0, missing: [], mutatedIds: [], renamed: [] };

for (const [leaf, hex, action] of ENTRIES) {
  // Some entries in the spec might be Reltio-prefixed after prior migrations;
  // when looking up we try both the spec leaf and its Reltio counterpart.
  let v = byLeaf.get(leaf);
  if (!v && leaf.startsWith('sap')) v = byLeaf.get('Reltio' + leaf.slice(3));
  if (!v) { out.missing.push(leaf); continue; }

  const currentLeaf = leafOf(v.name);
  const folder = v.name.includes('/') ? v.name.slice(0, v.name.lastIndexOf('/') + 1) : '';
  const rgb = hexToRgb01(hex);

  // Always set the Morning Horizon value to the spec hex.
  v.setValueForMode(MORNING, rgb);

  if (action === 'o') {
    // Override path — rename sap* -> Reltio* and update code-syntax.
    if (leaf.startsWith('sap')) {
      const newLeaf = 'Reltio' + leaf.slice(3);
      if (currentLeaf !== newLeaf) {
        v.name = folder + newLeaf;
        out.renamed.push({ from: currentLeaf, to: newLeaf });
      }
      // Reltio web code-syntax mirrors the rename.
      const newWeb = 'var(--Reltio' + leaf.slice(3) + ')';
      const currentWeb = (v.codeSyntax && v.codeSyntax.WEB) || null;
      if (currentWeb !== newWeb) v.setVariableCodeSyntax('WEB', newWeb);
    }
    // Non-sap-prefixed leaves (Shadow0_Color_1, Popover Border, etc.) keep
    // their original names; we only update the value.
    out.overridden++;
  } else {
    // Keep path — self-heal name + code-syntax back to sap* if a prior
    // pass renamed them.
    if (currentLeaf.startsWith('Reltio') && leaf.startsWith('sap')) {
      v.name = folder + leaf;
      out.renamed.push({ from: currentLeaf, to: leaf });
    }
    if (leaf.startsWith('sap')) {
      const sapWeb = 'var(--' + leaf + ')';
      const currentWeb = (v.codeSyntax && v.codeSyntax.WEB) || null;
      if (currentWeb !== sapWeb) v.setVariableCodeSyntax('WEB', sapWeb);
    }
    out.kept++;
  }
  out.mutatedIds.push(v.id);
}

return out;
