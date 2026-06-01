// Batch 4/6 — 150 entries
const ENTRIES = [["sapButton_TokenBackground","#FFFFFF","o"],["sapButton_ReadOnly_TokenBackground","#FFFFFF","o"],["sapButton_TokenBorderColor","#D1D4DF","o"],["sapButton_Track_Background","#9DA6C5","o"],["sapButton_Track_BorderColor","#9DA6C5","o"],["sapButton_Track_TextColor","#FFFFFF","o"],["sapButton_Track_Hover_Background","#6A77A0","o"],["sapButton_Track_Hover_BorderColor","#6A77A0","o"],["sapButton_Track_Selected_Background","#4563ED","o"],["sapButton_Track_Selected_BorderColor","#4563ED","o"],["sapButton_Track_Selected_TextColor","#FFFFFF","o"],["sapButton_Track_Selected_Hover_Background","#3D57A9","o"],["sapButton_Track_Selected_Hover_BorderColor","#3D57A9","o"],["sapButton_Handle_Background","#FFFFFF","o"],["sapButton_Handle_BorderColor","#FFFFFF","o"],["sapButton_Handle_TextColor","#111727","o"],["sapButton_Handle_Hover_Background","#FFFFFF","o"],["sapButton_Handle_Hover_BorderColor","#FFFFFF","o"],["sapButton_Handle_Selected_Background","#F5F5FA","o"],["sapButton_Handle_Selected_BorderColor","#F5F5FA","o"],["sapButton_Handle_Selected_TextColor","#4563ED","o"],["sapButton_Handle_Selected_Hover_Background","#F5F5FA","o"],["sapButton_Handle_Selected_Hover_BorderColor","#F5F5FA","o"],["sapButton_Track_Negative_Background","#EE3333","o"],["sapButton_Track_Negative_BorderColor","#EE3333","o"],["sapButton_Track_Negative_TextColor","#FFFFFF","o"],["sapButton_Track_Negative_Hover_Background","#EC2525","o"],["sapButton_Track_Negative_Hover_BorderColor","#EC2525","o"],["sapButton_Handle_Negative_Background","#FFFFFF","o"],["sapButton_Handle_Negative_BorderColor","#FFFFFF","o"],["sapButton_Handle_Negative_TextColor","#B40C0C","o"],["sapButton_Handle_Negative_Hover_Background","#FFFFFF","o"],["sapButton_Handle_Negative_Hover_BorderColor","#FFFFFF","o"],["sapButton_Track_Positive_Background","#3B9564","o"],["sapButton_Track_Positive_BorderColor","#3B9564","o"],["sapButton_Track_Positive_TextColor","#FFFFFF","o"],["sapButton_Track_Positive_Hover_Background","#3A9062","o"],["sapButton_Track_Positive_Hover_BorderColor","#3A9062","o"],["sapButton_Handle_Positive_Background","#FFFFFF","o"],["sapButton_Handle_Positive_BorderColor","#FFFFFF","o"],["sapButton_Handle_Positive_TextColor","#2A6D47","o"],["sapButton_Handle_Positive_Hover_Background","#FFFFFF","o"],["sapButton_Handle_Positive_Hover_BorderColor","#FFFFFF","o"],["sapChart_OrderedColor_1","#83A1FF","o"],["sapChart_OrderedColor_2","#CC7700","o"],["sapChart_OrderedColor_3","#6B9900","o"],["sapChart_Bad","#EE3333","o"],["sapChart_Critical","#EE6611","o"],["sapChart_OrderedColor_4","#E61381","o"],["sapChart_Good","#3B9564","o"],["sapChart_OrderedColor_5","#8E45E3","o"],["sapChart_OrderedColor_6","#009999","o"],["sapChart_OrderedColor_7","#0000CC","o"],["sapChart_OrderedColor_8","#B22FE6","o"],["sapChart_OrderedColor_9","#5D7C67","o"],["sapChart_OrderedColor_10","#E76F6F","o"],["sapChart_Neutral","#9CA5C4","o"],["sapChart_OrderedColor_11","#4B35FF","o"],["sapChart_OrderedColor_12","#D4A983","o"],["sapHC_HighlightBackground","#D22FF7","o"],["sapHC_NeutralColor","#D22FF7","o"],["sapHC_InformativeColor","#D22FF7","o"],["sapHC_StandardForeground","#D22FF7","o"],["sapHC_StandardBackground","#D22FF7","o"],["sapHC_ReducedBackground","#D22FF7","o"],["sapHC_HighlightAltBackground","#D22FF7","o"],["sapHC_ReducedAltForeground","#D22FF7","o"],["sapHC_PositiveColor","#D22FF7","o"],["sapHC_CriticalColor","#D22FF7","o"],["sapHC_NegativeColor","#D22FF7","o"],["sapHC_ReducedForeground","#D22FF7","o"],["sapHC_EnhancedForeground","#D22FF7","o"],["sapHC_ReducedAltBackground","#D22FF7","o"],["sapContent_IconColor","#111727","o"],["sapContent_ContrastIconColor","#FFFFFF","o"],["sapContent_MarkerIconColor","#4B35FF","o"],["sapContent_NonInteractiveIconColor","#9CA5C4","o"],["sapContent_ImagePlaceholderBackground","#F5F5FA","o"],["sapContent_ImagePlaceholderForegroundColor","#66729B","o"],["sapContent_RatedColor","#CC7700","o"],["sapContent_UnratedColor","#9CA5C4","o"],["sapContent_Illustrative_Color1","#950658","o"],["sapContent_Illustrative_Color2","#8EB8FF","o"],["sapContent_Illustrative_Color3","#F88247","o"],["sapContent_Illustrative_Color4","#000B40","o"],["sapContent_Illustrative_Color5","#B2B7CF","o"],["sapContent_Illustrative_Color6","#DCDFE8","o"],["sapContent_Illustrative_Color7","#DFEAF9","o"],["sapContent_Illustrative_Color8","#FFFFFF","o"],["sapContent_Illustrative_Color9","#0499A0","o"],["sapContent_Illustrative_Color10","#DFEAF9","o"],["sapContent_Illustrative_Color11","#E61381","o"],["sapContent_Illustrative_Color12","#4DA100","o"],["sapContent_Illustrative_Color13","#0000CC","o"],["sapContent_Illustrative_Color14","#312EA1","o"],["sapContent_Illustrative_Color15","#BE520E","o"],["sapContent_Illustrative_Color16","#8E3405","o"],["sapContent_Illustrative_Color17","#026972","o"],["sapContent_Illustrative_Color18","#D2E5FF","o"],["sapContent_Illustrative_Color19","#C8E0FF","o"],["sapContent_Illustrative_Color20","#AFCFFF","o"],["sapContent_Illustrative_Color21","#83A2FF","o"],["sapContent_Illustrative_Color22","#000B40","o"],["sapContent_Illustrative_Color23","#C80D0D","o"],["sapContent_Illustrative_Color24","#FFC0DD","o"],["sapContent_Illustrative_Color25","#FFE5F3","o"],["sapContent_Illustrative_Color26","#FFE06C","o"],["sapContent_Illustrative_Color27","#FFF5CC","o"],["sapContent_Illustrative_Color28","#B44907","o"],["sapContent_Illustrative_Color29","#530A04","o"],["sapContent_Illustrative_Color30","#2F0404","o"],["sapContent_Illustrative_Color31","#FAA782","o"],["sapIndicationColor_1","#8E0B0B","o"],["sapIndicationColor_1_Background","#8E0B0B","o"],["sapIndicationColor_1_BorderColor","#8E0B0B","o"],["sapIndicationColor_1_TextColor","#FFFFFF","o"],["sapIndicationColor_1_Hover_Background","#650707","o"],["sapIndicationColor_1_Active_Background","#FFFFFF","o"],["sapIndicationColor_1_Active_BorderColor","#FAABAB","o"],["sapIndicationColor_1_Active_TextColor","#8E0B0B","o"],["sapIndicationColor_1_Selected_Background","#FFFFFF","o"],["sapIndicationColor_1_Selected_BorderColor","#FAABAB","o"],["sapIndicationColor_1_Selected_TextColor","#8E0B0B","o"],["sapIndicationColor_1b","#FAABAB","o"],["sapIndicationColor_1b_Background","#FAABAB","o"],["sapIndicationColor_1b_BorderColor","#FAABAB","o"],["sapIndicationColor_1b_TextColor","#8E0B0B","o"],["sapIndicationColor_1b_Hover_Background","#F77C7C","o"],["sapIndicationColor_2","#B40C0C","o"],["sapIndicationColor_2_Background","#B40C0C","o"],["sapIndicationColor_2_BorderColor","#B40C0C","o"],["sapIndicationColor_2_TextColor","#FFFFFF","o"],["sapIndicationColor_2_Hover_Background","#8E0B0B","o"],["sapIndicationColor_2_Active_Background","#FFFFFF","o"],["sapIndicationColor_2_Active_BorderColor","#FBBEBE","o"],["sapIndicationColor_2_Active_TextColor","#B40C0C","o"],["sapIndicationColor_2_Selected_Background","#FFFFFF","o"],["sapIndicationColor_2_Selected_BorderColor","#FBBEBE","o"],["sapIndicationColor_2_Selected_TextColor","#B40C0C","o"],["sapIndicationColor_2b","#FBBEBE","o"],["sapIndicationColor_2b_Background","#FBBEBE","o"],["sapIndicationColor_2b_BorderColor","#FBBEBE","o"],["sapIndicationColor_2b_TextColor","#B40C0C","o"],["sapIndicationColor_2b_Hover_Background","#FAB2B2","o"],["sapIndicationColor_3","#BE520E","o"],["sapIndicationColor_3_Background","#EE6611","o"],["sapIndicationColor_3_BorderColor","#EE6611","o"],["sapIndicationColor_3_TextColor","#FFFFFF","o"],["sapIndicationColor_3_Hover_Background","#E36209","o"],["sapIndicationColor_3_Active_Background","#FFFFFF","o"]];
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
