// Batch 6/6 — 149 entries
const ENTRIES = [["sapField_ReadOnly_BorderColor","#646E97","o"],["sapField_Picker_BorderColor","#646E97","o"],["FieldShadow_Color_1","#646E97","o"],["FieldInvalidShadow_Color_1","#FF94CB","o"],["FieldWarningShadow_Color_1","#FFD105","o"],["FieldSuccessShadow_Color_1","#3B9564","o"],["FieldInformationShadow_Color_1","#93B0FF","o"],["FieldHoverShadow_Color_1","#8CA9FF","o"],["sapPrimary1","#F5F5FA","o"],["sapPrimary2","#0000CC","o"],["sapPrimary3","#FFFFFF","o"],["sapPrimary4","#F5F5FA","o"],["sapPrimary5","#9CA5C4","o"],["sapPrimary6","#111727","o"],["sapPrimary7","#646E97","o"],["sapList_Background","#FFFFFF","o"],["sapList_BorderColor","#EDEDF0","o"],["sapList_TextColor","#111727","o"],["sapList_Active_Background","#E1E3EC","o"],["sapList_Active_TextColor","#111727","o"],["sapList_SelectionBackgroundColor","#F5F5FA","o"],["sapList_SelectionBorderColor","#4563ED","o"],["sapList_Hover_SelectionBackground","#E1F9FF","o"],["sapList_Hover_Background","#F5F5FA","o"],["sapList_GroupHeaderBackground","#FFFFFF","o"],["sapList_GroupHeaderBorderColor","#B1B7CE","o"],["sapList_GroupHeaderTextColor","#111727","o"],["sapList_FooterBackground","#FFFFFF","o"],["sapList_FooterTextColor","#111727","o"],["sapList_TableGroupHeaderBackground","#F5F5FA","o"],["sapList_TableGroupHeaderBorderColor","#B1B7CE","o"],["sapList_TableGroupHeaderTextColor","#111727","o"],["sapList_TableFooterBorder","#B1B7CE","o"],["sapList_TableFixedBorderColor","#A5A5BB","o"],["sapList_HeaderBackground","#FFFFFF","o"],["sapList_HeaderBorderColor","#B1B7CE","o"],["sapList_HeaderTextColor","#111727","o"],["sapList_AlternatingBackground","#F5F5FA","o"],["sapList_HighlightColor","#4563ED","o"],["sapObjectHeader_Background","#FFFFFF","o"],["sapObjectHeader_Hover_Background","#F5F5FA","o"],["sapObjectHeader_BorderColor","#DEDEE6","o"],["sapObjectHeader_Title_TextColor","#111727","o"],["sapObjectHeader_Subtitle_TextColor","#646E97","o"],["sapProgress_InformationBackground","#D8E8F9","o"],["sapProgress_InformationBorderColor","#D8E8F9","o"],["sapProgress_InformationTextColor","#111727","o"],["sapProgress_PositiveBackground","#EBF9C3","o"],["sapProgress_PositiveBorderColor","#EBF9C3","o"],["sapProgress_CriticalBackground","#FFF5C5","o"],["sapProgress_PositiveTextColor","#111727","o"],["sapProgress_CriticalBorderColor","#FFF5C5","o"],["sapProgress_CriticalTextColor","#111727","o"],["sapProgress_NegativeBackground","#FFE5F3","o"],["sapProgress_NegativeBorderColor","#FFE5F3","o"],["sapProgress_Background","#DCDFE8","o"],["sapProgress_Value_InformationBackground","#0000CC","o"],["sapProgress_NegativeTextColor","#111727","o"],["sapProgress_BorderColor","#DCDFE8","o"],["sapProgress_TextColor","#111727","o"],["sapProgress_Value_InformationBorderColor","#0000CC","o"],["sapProgress_Value_InformationTextColor","#0000CC","o"],["sapProgress_Value_NegativeBackground","#EE3333","o"],["sapProgress_Value_NegativeBorderColor","#EE3333","o"],["sapProgress_Value_NegativeTextColor","#EE3333","o"],["sapProgress_Value_Background","#69769F","o"],["sapProgress_Value_BorderColor","#69769F","o"],["sapProgress_Value_TextColor","#9DA6C5","o"],["sapProgress_Value_CriticalBackground","#EE6611","o"],["sapProgress_Value_PositiveBackground","#3B9564","o"],["sapProgress_Value_PositiveBorderColor","#3B9564","o"],["sapProgress_Value_PositiveTextColor","#3B9564","o"],["sapProgress_Value_CriticalBorderColor","#EE6611","o"],["sapProgress_Value_CriticalTextColor","#EE6611","o"],["sapHighlightTextColor","#FFFFFF","o"],["sapBackgroundColorDefault","#F5F5FA","o"],["sapGroup_FooterBackground","#000000","o"],["sapShell_BackgroundPatternColor","#000000","o"],["sapScrollBar_FaceColor","#9FA7C5","o"],["sapScrollBar_TrackColor","#FFFFFF","o"],["sapScrollBar_BorderColor","#9FA7C5","o"],["sapScrollBar_SymbolColor","#4563ED","o"],["sapScrollBar_Hover_FaceColor","#66719B","o"],["sapSlider_Background","#E3E3F2","o"],["sapSlider_BorderColor","#E3E3F2","o"],["sapSlider_Selected_Background","#4563ED","o"],["sapSlider_Selected_BorderColor","#4563ED","o"],["sapSlider_HandleBackground","#FFFFFF","o"],["sapSlider_HandleBorderColor","#BFD1FF","o"],["sapSlider_Hover_HandleBackground","#DEE8F9","o"],["sapSlider_Hover_HandleBorderColor","#BFD1FF","o"],["sapSlider_Active_HandleBackground","#FFFFFF","o"],["sapSlider_Active_HandleBorderColor","#4563ED","o"],["sapSlider_RangeHandleBackground","#FFFFFF","o"],["sapSlider_Hover_RangeHandleBackground","#E3EAF9","o"],["sapSlider_Active_RangeHandleBackground","#000000","o"],["sapContent_MeasureIndicatorColor","#646E97","o"],["sapContent_Selected_MeasureIndicatorColor","#4563ED","o"],["sapTab_Background","#FFFFFF","o"],["sapTab_Selected_Background","#4563ED","o"],["sapTab_TextColor","#111727","o"],["sapTab_Selected_TextColor","#4563ED","o"],["sapTab_ForegroundColor","#4563ED","o"],["sapTab_IconColor","#4563ED","o"],["sapTab_Selected_IconColor","#FFFFFF","o"],["sapTab_Negative_TextColor","#B40C0C","o"],["sapTab_Negative_Selected_TextColor","#B40C0C","o"],["sapTab_Negative_ForegroundColor","#EE3333","o"],["sapTab_Negative_IconColor","#EE3333","o"],["sapTab_Negative_Selected_Background","#EE3333","o"],["sapTab_Negative_Selected_IconColor","#FFFFFF","o"],["sapTab_Critical_TextColor","#BE520E","o"],["sapTab_Critical_Selected_TextColor","#BE520E","o"],["sapTab_Critical_ForegroundColor","#EE6611","o"],["sapTab_Critical_IconColor","#EE6611","o"],["sapTab_Critical_Selected_Background","#EE6611","o"],["sapTab_Critical_Selected_IconColor","#FFFFFF","o"],["sapTab_Positive_TextColor","#2A6D47","o"],["sapTab_Positive_Selected_TextColor","#2A6D47","o"],["sapTab_Positive_ForegroundColor","#3B9564","o"],["sapTab_Positive_IconColor","#3B9564","o"],["sapTab_Positive_Selected_Background","#3B9564","o"],["sapTab_Positive_Selected_IconColor","#FFFFFF","o"],["sapTab_Neutral_TextColor","#222A3F","o"],["sapTab_Neutral_Selected_TextColor","#222A3F","o"],["sapTab_Neutral_ForegroundColor","#9DA6C5","o"],["sapTab_Neutral_IconColor","#9DA6C5","o"],["sapTab_Neutral_Selected_Background","#9DA6C5","o"],["sapTab_Neutral_Selected_IconColor","#FFFFFF","o"],["sapTile_Background","#FFFFFF","o"],["sapTile_Hover_Background","#F5F5FA","o"],["sapTile_Hover_ContentBackground","#FFFFFF","o"],["sapTile_Active_Background","#E1E3EC","o"],["sapTile_Active_ContentBackground","#FFFFFF","o"],["sapTile_BorderColor","#000000","o"],["sapTile_TitleTextColor","#111727","o"],["sapTile_TextColor","#646E97","o"],["sapTile_IconColor","#646E97","o"],["sapTile_SeparatorColor","#D8D8E0","o"],["sapTile_Interactive_BorderColor","#CDCDD6","o"],["sapTile_OverlayBackground","#FFFFFF","o"],["sapTile_OverlayForegroundColor","#111727","o"],["sapToolbar_Background","#FFFFFF","o"],["sapToolbar_SeparatorColor","#DEDEE6","o"],["sapInfobar_Background","#C7FEF7","o"],["sapInfobar_Hover_Background","#FFFFFF","o"],["sapInfobar_Active_Background","#FFFFFF","o"],["sapInfobar_NonInteractive_Background","#F5F5FA","o"],["sapInfobar_TextColor","#026971","o"]];
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
