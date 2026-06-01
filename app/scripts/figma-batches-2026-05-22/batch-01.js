// Batch 1/6 — 150 entries
const ENTRIES = [["sapBrandColor","#0000CC","o"],["sapHighlightColor","#0000CC","o"],["sapBaseColor","#FFFFFF","o"],["sapSelectedColor","#0000CC","o"],["sapActiveColor","#DEE2E5","k"],["sapHoverColor","#EAECEE","k"],["sapContent_Selected_Background","#FFFFFF","k"],["sapContent_Selected_TextColor","#0000CC","o"],["sapContent_Selected_Hover_Background","#E3F0FF","k"],["sapContent_Selected_ForegroundColor","#0000CC","o"],["sapContent_HelpColor","#339158","o"],["sapContent_DragAndDropActiveColor","#0064D9","k"],["sapContent_SearchHighlightColor","#DAFDF5","k"],["sapTextColor","#111727","o"],["sapTitleColor","#111727","o"],["sapContent_ForegroundTextColor","#111727","o"],["sapContent_LabelColor","#566189","o"],["sapContent_MarkerTextColor","#02858B","o"],["sapContent_ContrastTextColor","#FFFFFF","o"],["sapContent_DisabledTextColor","#9EA1BA","o"],["sapContent_TextShadowColor","#FFFFFF","o"],["sapContent_TextShadowColor_2-4","#FFFFFF","o"],["sapContent_ContrastTextShadowColor","#000000","o"],["sapGroup_ContentBackground","#FFFFFF","o"],["sapGroup_ContentBorderColor","#E3E3F2","o"],["sapGroup_TitleBorderColor","#BABADE","o"],["sapGroup_TitleTextColor","#172133","o"],["sapBlockLayer_Background","#000000","o"],["sapGroup_TitleBackground","#FFFFFF","o"],["sapBlockLayer_Opacity","#000000","o"],["sapNegativeColor","#B40C0C","o"],["sapErrorColor","#B40C0C","o"],["sapErrorBorderColor","#E90B0B","k"],["sapErrorBackground","#FDE7E7","o"],["sapWarningColor","#EE6611","o"],["sapCriticalColor","#EE6611","o"],["sapWarningBorderColor","#CE5A07","o"],["sapWarningBackground","#FFF5CC","o"],["sapPositiveColor","#256F3A","k"],["sapSuccessColor","#256F3A","k"],["sapSuccessBorderColor","#30914C","k"],["sapSuccessBackground","#DCEFE7","o"],["sapInformativeColor","#0000CC","o"],["sapInformationColor","#0000CC","o"],["sapInformationBorderColor","#0000CC","o"],["sapInformationBackground","#E5E5FF","o"],["sapNeutralColor","#7481A8","o"],["sapNeutralBackground","#F5F5FA","o"],["sapNeutralBorderColor","#9DA6C5","o"],["sapMessage_Button_Hover_Background","#F5F5FA","o"],["sapMessage_ErrorBorderColor","#FF94CB","o"],["sapMessage_WarningBorderColor","#FFE066","o"],["sapMessage_SuccessBorderColor","#D7F38C","o"],["sapMessage_InformationBorderColor","#AACEFF","o"],["sapNegativeTextColor","#B40C0C","o"],["sapCriticalTextColor","#BE520E","o"],["sapPositiveTextColor","#2A6D47","o"],["sapInformativeTextColor","#4563ED","o"],["sapNeutralTextColor","#222A3F","o"],["sapNegativeElementColor","#EE3333","o"],["sapCriticalElementColor","#EE6611","o"],["sapPositiveElementColor","#3B9564","o"],["sapInformativeElementColor","#0000CC","o"],["sapNeutralElementColor","#9DA6C5","o"],["sapLinkColor","#2350ED","o"],["sapLink_Hover_Color","#2350ED","o"],["sapLink_Active_Color","#2350ED","o"],["sapLink_Visited_Color","#2350ED","o"],["sapLink_InvertedColor","#ACC1FF","o"],["sapLink_SubtleColor","#111727","o"],["sapButton_Emphasized_Background","#0000CC","o"],["sapButton_Emphasized_BorderColor","#0000CC","o"],["sapButton_Emphasized_TextColor","#FFFFFF","o"],["sapButton_Emphasized_Hover_Background","#0047AC","o"],["sapButton_Emphasized_Active_TextColor","#0047D3","o"],["sapButton_Negative_Background","#F53232","k"],["sapButton_Negative_Hover_Background","#E90B0B","k"],["sapButton_Critical_Background","#E76500","k"],["sapButton_Critical_Hover_Background","#DD6100","k"],["sapButton_Attention_Background","#FFF3B7","k"],["sapButton_Attention_TextColor","#8F3D0A","o"],["sapContent_FocusColor","#00228A","o"],["sapContent_ContrastFocusColor","#FFFFFF","o"],["sapContent_ShadowColor","#2A334C","o"],["sapContent_ContrastShadowColor","#FFFFFF","o"],["sapContent_ForegroundBorderColor","#828DB7","o"],["sapContent_ForegroundColor","#F5F5FA","o"],["sapShellColor","#FFFFFF","o"],["sapShell_BorderColor","#E3E3F2","o"],["sapShell_TextColor","#111727","o"],["sapShell_SubBrand_TextColor","#002B78","o"],["sapShell_InteractiveBackground","#F5F5FA","o"],["sapShell_Active_TextColor","#0000CC","o"],["sapShell_Selected_TextColor","#0000CC","o"],["sapShell_Background","#F5F5FA","o"],["sapShell_NegativeColor","#AA0808","k"],["sapShell_CriticalColor","#B44F00","k"],["sapShell_PositiveColor","#256F3A","k"],["sapShell_InformativeColor","#0047D3","o"],["sapShell_NeutralColor","#111727","o"],["sapShell_InteractiveTextColor","#111727","o"],["sapShell_InteractiveBorderColor","#646E97","o"],["sapShell_Hover_Background","#FFFFFF","o"],["sapShell_Active_Background","#FFFFFF","o"],["sapShell_Selected_Background","#FFFFFF","o"],["sapShell_Selected_Hover_Background","#FFFFFF","o"],["sapShell_GroupTitleTextColor","#111727","o"],["sapShell_Navigation_Background","#FFFFFF","o"],["sapShell_Navigation_TextColor","#111727","o"],["sapShell_Navigation_Hover_Background","#FFFFFF","o"],["sapShell_Navigation_Active_Background","#FFFFFF","o"],["sapShell_Navigation_Active_TextColor","#4563ED","o"],["sapShell_Navigation_SelectedColor","#4563ED","o"],["sapShell_Navigation_Selected_TextColor","#4563ED","o"],["sapShell_Category_1_Background","#455CEA","o"],["sapShell_Category_1_BorderColor","#455CEA","o"],["sapShell_Category_1_TextColor","#FFFFFF","o"],["sapShell_Category_2_Background","#E61381","o"],["sapShell_Category_2_BorderColor","#E61381","o"],["sapShell_Category_2_TextColor","#FFFFFF","o"],["sapShell_Category_3_Background","#EE6611","o"],["sapShell_Category_3_BorderColor","#EE6611","o"],["sapShell_Category_3_TextColor","#FFFFFF","o"],["sapShell_Category_4_Background","#63049B","o"],["sapShell_Category_4_BorderColor","#63049B","o"],["sapShell_Category_4_TextColor","#FFFFFF","o"],["sapShell_Category_5_Background","#B41D0C","o"],["sapShell_Category_5_BorderColor","#B41D0C","o"],["sapShell_Category_5_TextColor","#FFFFFF","o"],["sapShell_Category_6_Background","#048F94","o"],["sapShell_Category_6_BorderColor","#048F94","o"],["sapShell_Category_6_TextColor","#FFFFFF","o"],["sapShell_Category_7_Background","#CA34EE","o"],["sapShell_Category_7_BorderColor","#CA34EE","o"],["sapShell_Category_7_TextColor","#FFFFFF","o"],["sapShell_Category_8_Background","#4F910E","o"],["sapShell_Category_8_BorderColor","#4F910E","o"],["sapShell_Category_8_TextColor","#FFFFFF","o"],["sapShell_Category_9_Background","#201D75","o"],["sapShell_Category_9_BorderColor","#201D75","o"],["sapShell_Category_9_TextColor","#FFFFFF","o"],["sapShell_Category_10_Background","#66729B","o"],["sapShell_Category_10_BorderColor","#66729B","o"],["sapShell_Category_10_TextColor","#FFFFFF","o"],["sapShell_Category_11_Background","#C80D0D","o"],["sapShell_Category_11_BorderColor","#C80D0D","o"],["sapShell_Category_11_TextColor","#FFFFFF","o"],["sapShell_Category_12_Background","#6D5DFF","o"],["sapShell_Category_12_BorderColor","#6D5DFF","o"],["sapShell_Category_12_TextColor","#FFFFFF","o"]];
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
