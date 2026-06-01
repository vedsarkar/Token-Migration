// Batch 2/6 — 150 entries
const ENTRIES = [["sapShell_Category_13_Background","#AF0C72","o"],["sapShell_Category_13_BorderColor","#AF0C72","o"],["sapShell_Category_13_TextColor","#FFFFFF","o"],["sapShell_Category_14_Background","#0B5E61","o"],["sapShell_Category_14_BorderColor","#0B5E61","o"],["sapShell_Category_14_TextColor","#FFFFFF","o"],["sapShell_Category_15_Background","#242E44","o"],["sapShell_Category_15_BorderColor","#242E44","o"],["sapShell_Category_15_TextColor","#FFFFFF","o"],["sapShell_Category_16_Background","#276243","o"],["sapShell_Category_16_BorderColor","#276243","o"],["sapShell_Category_16_TextColor","#FFFFFF","o"],["Shell_ShadowColor_1","#242E44","o"],["Shell_ShadowColor_2","#242E44","o"],["sapLegendColor1","#C86800","o"],["sapLegendColor2","#C8470C","o"],["sapLegendColor3","#CF1173","o"],["sapLegendColor4","#8E0B0B","o"],["sapLegendColor5","#A80BE4","o"],["sapLegendColor6","#003EB8","o"],["sapLegendColor7","#048F94","o"],["sapLegendColor8","#257B3D","o"],["sapLegendColor9","#59668D","o"],["sapLegendColor10","#63049B","o"],["sapLegendColor11","#9D3E05","o"],["sapLegendColor12","#9D1C0A","o"],["sapLegendColor13","#BD0F6E","o"],["sapLegendColor14","#792A04","o"],["sapLegendColor15","#41196E","o"],["sapLegendColor16","#001C77","o"],["sapLegendColor17","#025E65","o"],["sapLegendColor18","#1F5133","o"],["sapLegendColor19","#103298","o"],["sapLegendColor20","#330BF6","o"],["sapLegendBackgroundColor1","#FFEB99","o"],["sapLegendBackgroundColor2","#FDE5D8","o"],["sapLegendBackgroundColor3","#FDEEF6","o"],["sapLegendBackgroundColor4","#FDE7E7","o"],["sapLegendBackgroundColor5","#FFE5F9","o"],["sapLegendBackgroundColor6","#D5DAFF","o"],["sapLegendBackgroundColor7","#C7FEF7","o"],["sapLegendBackgroundColor8","#F3FDD9","o"],["sapLegendBackgroundColor9","#F5F5FA","o"],["sapLegendBackgroundColor10","#F2E1FB","o"],["sapLegendBackgroundColor11","#FFF5CC","o"],["sapLegendBackgroundColor12","#FEF6F6","o"],["sapLegendBackgroundColor13","#FBE8F1","o"],["sapLegendBackgroundColor14","#F8F1D1","o"],["sapLegendBackgroundColor15","#EADCFA","o"],["sapLegendBackgroundColor16","#E8EFFF","o"],["sapLegendBackgroundColor17","#E0FEFA","o"],["sapLegendBackgroundColor18","#EEFACC","o"],["sapLegendBackgroundColor19","#F0F1FF","o"],["sapLegendBackgroundColor20","#E9EAFF","o"],["sapLegend_WorkingBackground","#FFFFFF","o"],["sapLegend_NonWorkingBackground","#F5F5FA","o"],["sapLegend_CurrentDateTime","#8809C7","o"],["sapAccentColor1","#CC7700","o"],["sapAccentColor2","#B40C0C","o"],["sapAccentColor3","#BD0F6E","o"],["sapAccentColor4","#8809C7","o"],["sapAccentColor5","#6A29F5","o"],["sapAccentColor6","#000099","o"],["sapAccentColor7","#02858B","o"],["sapAccentColor8","#2A6D47","o"],["sapAccentColor9","#5B239E","o"],["sapAccentColor10","#59668D","o"],["sapAccentBackgroundColor1","#FFF4C2","o"],["sapAccentBackgroundColor2","#FFCCE8","o"],["sapAccentBackgroundColor3","#FFE5F3","o"],["sapAccentBackgroundColor4","#FFE1F3","o"],["sapAccentBackgroundColor5","#E4D0FB","o"],["sapAccentBackgroundColor6","#DBF7FF","o"],["sapAccentBackgroundColor7","#C7FEF7","o"],["sapAccentBackgroundColor8","#EEFACC","o"],["sapAccentBackgroundColor9","#E4D0FB","o"],["sapAccentBackgroundColor10","#F5F5FA","o"],["Shadow0_Color_1","#242E44","o"],["Shadow0_Color_2","#242E44","o"],["Shadow1_Color_1","#242E44","o"],["Shadow1_Color_2","#242E44","o"],["Lite_Shadow_Color_1","#242E44","o"],["Lite_Shadow_Color_2","#242E44","o"],["Shadow2_Color_1","#242E44","o"],["Shadow2_Color","#FFFFFF","o"],["Shadow2_Color_2","#242E44","o"],["Shadow3_Color","#FFFFFF","o"],["Shadow3_Color_1","#242E44","o"],["Shadow3_Color_2","#242E44","o"],["HeaderShadow_Color_1","#242E44","o"],["HeaderShadow_Color_2","#DEDEE6","o"],["Success_HeaderShadow_Color_1","#242E44","o"],["Success_HeaderShadow_Color_2","#3B9564","o"],["Warning_HeaderShadow_Color_1","#242E44","o"],["Warning_HeaderShadow_Color_2","#E66409","o"],["Error_HeaderShadow_Color_1","#242E44","o"],["Error_HeaderShadow_Color_2","#EC2525","o"],["Information_HeaderShadow_Color_1","#242E44","o"],["Information_HeaderShadow_Color_2","#0000CC","o"],["HeaderShadow_Color","#FFFFFF","o"],["TextShadow_Color","#FFFFFF","o"],["InteractionShadow_Color_1","#646E97","o"],["ContrastTextShadow_Color","#FFFFFF","o"],["SelectedShadow_Color_1","#8CA9FF","o"],["NegativeShadow_Color_1","#FF94BE","o"],["CriticalShadow_Color_1","#FFD105","o"],["PositiveShadow_Color_1","#3B9564","o"],["InformativeShadow_Color_1","#93B0FF","o"],["NeutralShadow_Color_1","#9DA6C5","o"],["Interaction_Shadow_Color","#FFFFFF","o"],["Selected_Shadow_Color","#FFFFFF","o"],["Negative_Shadow_Color","#FFFFFF","o"],["Critical_Shadow_Color","#FFFFFF","o"],["Popover Border","#646E97","o"],["Avatar Shadow","#646E97","o"],["Placeholder Middle Color","#ABABC0","o"],["colorPalette_FillColor_Swatch","#FFFFFF","o"],["Tooltip_Stroke_Color","#FFFFFF","o"],["sapBackgroundColor","#F5F5FA","o"],["sapPageHeader_Background","#FFFFFF","o"],["sapPageHeader_BorderColor","#DEDEE6","o"],["sapPageHeader_TextColor","#111727","o"],["sapPageFooter_Background","#FFFFFF","o"],["sapPageFooter_BorderColor","#DEDEE6","o"],["sapPageFooter_TextColor","#111727","o"],["sapAssistant_Color1","#4B35FF","o"],["sapAssistant_Color2","#992FDA","o"],["sapAssistant_Background","#4B35FF","o"],["sapAssistant_BorderColor","#4B35FF","o"],["sapAssistant_TextColor","#FFFFFF","o"],["sapAssistant_Hover_Background","#0000CC","o"],["sapAssistant_Hover_BorderColor","#0000CC","o"],["sapAssistant_Hover_TextColor","#FFFFFF","o"],["sapAssistant_Active_Background","#FFFFFF","o"],["sapAssistant_Active_BorderColor","#4B35FF","o"],["sapAssistant_Active_TextColor","#4B35FF","o"],["sapAssistant_Question_Background","#E5E5FF","o"],["sapAssistant_Question_BorderColor","#E5E5FF","o"],["sapAssistant_Question_TextColor","#111727","o"],["sapAssistant_Answer_Background","#F5F5FA","o"],["sapAssistant_Answer_BorderColor","#F5F5FA","o"],["sapAssistant_Answer_TextColor","#111727","o"],["sapShell_Assistant_ForegroundColor","#4B35FF","o"],["sapAvatar_1_Background","#FFF4C2","o"],["sapAvatar_2_Background","#FFCCE8","o"],["sapAvatar_3_Background","#FFE5F3","o"],["sapAvatar_4_Background","#FFE1F3","o"],["sapAvatar_5_Background","#E4D0FB","o"],["sapAvatar_6_Background","#DBF7FF","o"],["sapAvatar_7_Background","#C7FEF7","o"]];
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
