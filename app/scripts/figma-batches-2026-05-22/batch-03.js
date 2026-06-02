// Batch 3/6 — 150 entries
const ENTRIES = [["sapAvatar_8_Background","#EEFACC","o"],["sapAvatar_9_Background","#E4D0FB","o"],["sapAvatar_10_Background","#F5F5FA","o"],["sapAvatar_1_Hover_Background","#FFF4C2","o"],["sapAvatar_2_Hover_Background","#FFCCE8","o"],["sapAvatar_3_Hover_Background","#FFE5F3","o"],["sapAvatar_4_Hover_Background","#FFE1F3","o"],["sapAvatar_5_Hover_Background","#E4D0FB","o"],["sapAvatar_6_Hover_Background","#DBF7FF","o"],["sapAvatar_7_Hover_Background","#C7FEF7","o"],["sapAvatar_8_Hover_Background","#EEFACC","o"],["sapAvatar_9_Hover_Background","#E4D0FB","o"],["sapAvatar_10_Hover_Background","#F5F5FA","o"],["sapAvatar_1_BorderColor","#FFF4C2","o"],["sapAvatar_2_BorderColor","#FFCCE8","o"],["sapAvatar_3_BorderColor","#FFE5F3","o"],["sapAvatar_4_BorderColor","#FFE1F3","o"],["sapAvatar_5_BorderColor","#E4D0FB","o"],["sapAvatar_6_BorderColor","#DBF7FF","o"],["sapAvatar_7_BorderColor","#C7FEF7","o"],["sapAvatar_8_BorderColor","#EEFACC","o"],["sapAvatar_9_BorderColor","#E4D0FB","o"],["sapAvatar_10_BorderColor","#F5F5FA","o"],["sapAvatar_Hover_BorderColor","#646E97","o"],["sapAvatar_1_TextColor","#A15600","o"],["sapAvatar_2_TextColor","#B40C0C","o"],["sapAvatar_3_TextColor","#BD0F6E","o"],["sapAvatar_4_TextColor","#992FDA","o"],["sapAvatar_5_TextColor","#4630FF","o"],["sapAvatar_6_TextColor","#455CEA","o"],["sapAvatar_7_TextColor","#026971","o"],["sapAvatar_8_TextColor","#2A6D47","o"],["sapAvatar_9_TextColor","#5B239E","o"],["sapAvatar_10_TextColor","#646E97","o"],["sapAvatar_Lite_Background","#FFFFFF","o"],["sapAvatar_Lite_BorderColor","#FFFFFF","o"],["sapContent_BadgeBackground","#B40C0C","o"],["sapContent_BadgeTextColor","#FFFFFF","o"],["sapContent_BadgeBorderColor","#FFFFFF","o"],["sapContent_BusyColor","#4563ED","o"],["sapContent_Placeholderloading_Background","#D8D8E0","o"],["sapButton_Background","#FFFFFF","o"],["sapButton_BorderColor","#D1D4DF","o"],["sapButton_TextColor","#4563ED","o"],["sapButton_IconColor","#4563ED","o"],["sapButton_Hover_Background","#F5F5FA","o"],["sapButton_Hover_BorderColor","#D1D4DF","o"],["sapButton_Hover_TextColor","#4563ED","o"],["sapButton_Active_Background","#FFFFFF","o"],["sapButton_Active_BorderColor","#4563ED","o"],["sapButton_Active_TextColor","#4563ED","o"],["sapButton_Selected_Background","#F5F5FA","o"],["sapButton_Selected_BorderColor","#4563ED","o"],["sapButton_Selected_TextColor","#4563ED","o"],["sapButton_Selected_Hover_Background","#DEE8F9","o"],["sapButton_Selected_Hover_BorderColor","#4563ED","o"],["sapButton_Emphasized_Hover_BorderColor","#4563ED","o"],["sapButton_Emphasized_Hover_TextColor","#FFFFFF","o"],["sapButton_Emphasized_Active_Background","#FFFFFF","o"],["sapButton_Emphasized_Active_BorderColor","#4563ED","o"],["sapButton_Lite_Background","#000000","o"],["sapButton_Emphasized_TextShadow","#000000","o"],["sapButton_Lite_BorderColor","#000000","o"],["sapButton_Lite_TextColor","#4563ED","o"],["sapButton_Lite_Hover_Background","#F5F5FA","o"],["sapButton_Lite_Hover_BorderColor","#D1D4DF","o"],["sapButton_Lite_Hover_TextColor","#4563ED","o"],["sapButton_Lite_Active_Background","#FFFFFF","o"],["sapButton_Lite_Active_BorderColor","#4563ED","o"],["sapButton_Accept_Background","#EEFACC","o"],["sapButton_Accept_BorderColor","#DEF69D","o"],["sapButton_Accept_TextColor","#2A6D47","o"],["sapButton_Accept_Hover_Background","#EAF8C1","o"],["sapButton_Accept_Hover_BorderColor","#EAF8C1","o"],["sapButton_Accept_Hover_TextColor","#2A6D47","o"],["sapButton_Accept_Active_Background","#FFFFFF","o"],["sapButton_Accept_Active_BorderColor","#3B9564","o"],["sapButton_Accept_Active_TextColor","#2A6D47","o"],["sapButton_Accept_Selected_Background","#FFFFFF","o"],["sapButton_Accept_Selected_BorderColor","#3B9564","o"],["sapButton_Accept_Selected_TextColor","#2A6D47","o"],["sapButton_Accept_Selected_Hover_Background","#EAF8C1","o"],["sapButton_Accept_Selected_Hover_BorderColor","#3B9564","o"],["sapButton_Reject_Background","#FFD1E9","o"],["sapButton_Reject_BorderColor","#FFCCE8","o"],["sapButton_Reject_TextColor","#B40C0C","o"],["sapButton_Reject_Hover_Background","#FFC5E2","o"],["sapButton_Reject_Hover_BorderColor","#FFC5E2","o"],["sapButton_Reject_Hover_TextColor","#B40C0C","o"],["sapButton_Reject_Active_Background","#FFFFFF","o"],["sapButton_Reject_Active_BorderColor","#EC2525","o"],["sapButton_Reject_Active_TextColor","#B40C0C","o"],["sapButton_Reject_Selected_Background","#FFFFFF","o"],["sapButton_Reject_Selected_BorderColor","#EC2525","o"],["sapButton_Reject_Selected_TextColor","#B40C0C","o"],["sapButton_Reject_Selected_Hover_Background","#FFC5E2","o"],["sapButton_Reject_Selected_Hover_BorderColor","#EC2525","o"],["sapButton_Attention_BorderColor","#FFEB8F","o"],["sapButton_Attention_Hover_Background","#FFEB99","o"],["sapButton_Attention_Hover_BorderColor","#FFEB99","o"],["sapButton_Attention_Hover_TextColor","#BE520E","o"],["sapButton_Attention_Active_Background","#FFFFFF","o"],["sapButton_Attention_Active_BorderColor","#E66409","o"],["sapButton_Attention_Active_TextColor","#BE520E","o"],["sapButton_Attention_Selected_Background","#FFFFFF","o"],["sapButton_Attention_Selected_BorderColor","#E66409","o"],["sapButton_Attention_Selected_TextColor","#BE520E","o"],["sapButton_Attention_Selected_Hover_Background","#FFEB99","o"],["sapButton_Attention_Selected_Hover_BorderColor","#E66409","o"],["sapButton_Negative_BorderColor","#EE3333","o"],["sapButton_Negative_TextColor","#FFFFFF","o"],["sapButton_Negative_Hover_BorderColor","#EC2525","o"],["sapButton_Negative_Hover_TextColor","#FFFFFF","o"],["sapButton_Negative_Active_Background","#FFFFFF","o"],["sapButton_Negative_Active_BorderColor","#EE3333","o"],["sapButton_Negative_Active_TextColor","#BD0F0F","o"],["sapButton_Critical_BorderColor","#EE6611","o"],["sapButton_Critical_TextColor","#FFFFFF","o"],["sapButton_Critical_Hover_BorderColor","#E66409","o"],["sapButton_Critical_Hover_TextColor","#FFFFFF","o"],["sapButton_Critical_Active_Background","#FFFFFF","o"],["sapButton_Critical_Active_BorderColor","#E66409","o"],["sapButton_Critical_Active_TextColor","#BE520E","o"],["sapButton_Success_Background","#3B9564","o"],["sapButton_Success_BorderColor","#3B9564","o"],["sapButton_Success_TextColor","#FFFFFF","o"],["sapButton_Success_Hover_Background","#3A9062","o"],["sapButton_Success_Hover_BorderColor","#3A9062","o"],["sapButton_Success_Hover_TextColor","#FFFFFF","o"],["sapButton_Success_Active_Background","#FFFFFF","o"],["sapButton_Success_Active_BorderColor","#3B9564","o"],["sapButton_Success_Active_TextColor","#2A6D47","o"],["sapButton_Neutral_Background","#EFF4FD","o"],["sapButton_Neutral_BorderColor","#C1D2FF","o"],["sapButton_Neutral_TextColor","#4563ED","o"],["sapButton_Neutral_Hover_Background","#DCE7FF","o"],["sapButton_Neutral_Hover_BorderColor","#C1D2FF","o"],["sapButton_Neutral_Hover_TextColor","#4563ED","o"],["sapButton_Neutral_Active_Background","#FFFFFF","o"],["sapButton_Neutral_Active_BorderColor","#4563ED","o"],["sapButton_Neutral_Active_TextColor","#4563ED","o"],["sapButton_Information_Background","#EFF4FD","o"],["sapButton_Information_BorderColor","#C1D2FF","o"],["sapButton_Information_TextColor","#4563ED","o"],["sapButton_Information_Hover_Background","#DCE7FF","o"],["sapButton_Information_Hover_BorderColor","#C1D2FF","o"],["sapButton_Information_Hover_TextColor","#4563ED","o"],["sapButton_Information_Active_Background","#FFFFFF","o"],["sapButton_Information_Active_BorderColor","#4563ED","o"],["sapButton_Information_Active_TextColor","#4563ED","o"]];
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
