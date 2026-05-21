// One-shot merge: injects fioriHcWhite/fioriHcBlack into each SWAPS row in src/data.ts.
// Run with: node scripts/merge-hc-modes.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const HC = {
  'Main/sapBrandColor': { w: '#E97624', k: '#795100' },
  'Main/sapHighlightColor': { w: '#E97624', k: '#795100' },
  'Main/sapBaseColor': { w: '#FFFFFF', k: '#000000' },
  'Interaction/sapSelectedColor': { w: '#5C93FF', k: '#0F5C93' },
  'Interaction/sapActiveColor': { w: '#E97624', k: '#795100' },
  'Interaction/sapHoverColor': { w: '#E97624', k: '#795100' },
  'Interaction/sapContent_Selected_Background': { w: '#5C93FF', k: '#0F5C93' },
  'Interaction/sapContent_Selected_TextColor': { w: '#000000', k: '#FFFFFF' },
  'Interaction/sapContent_Selected_Hover_Background': { w: '#E97624', k: '#795100' },
  'Interaction/sapContent_Selected_ForegroundColor': { w: '#000000', k: '#FFFFFF' },
  'Interaction/sapContent_HelpColor': { w: '#006800', k: '#03AE03' },
  'Interaction/sapContent_DragAndDropActiveColor': { w: '#006800', k: '#03AE03' },
  'Interaction/sapContent_SearchHighlightColor': { w: '#E97624', k: '#795100' },
  'Text/sapTextColor': { w: '#000000', k: '#FFFFFF' },
  'Text/sapTitleColor': { w: '#000000', k: '#FFFFFF' },
  'Text/sapContent_ForegroundTextColor': { w: '#000000', k: '#FFFFFF' },
  'Text/sapContent_LabelColor': { w: '#000000', k: '#FFFFFF' },
  'Text/sapContent_MarkerTextColor': { w: '#000000', k: '#FFFFFF' },
  'Text/sapContent_ContrastTextColor': { w: '#000000', k: '#FFFFFF' },
  'Text/sapContent_DisabledTextColor': { w: '#888888', k: '#666666' },
  'Container/sapGroup_ContentBackground': { w: '#FFFFFF', k: '#000000' },
  'Container/sapGroup_ContentBorderColor': { w: '#000000', k: '#FFFFFF' },
  'Container/sapGroup_TitleBorderColor': { w: '#000000', k: '#FFFFFF' },
  'Container/sapGroup_TitleTextColor': { w: '#000000', k: '#FFFFFF' },
  'Container/sapBlockLayer_Background': { w: '#FFFFFF', k: '#000000' },
  'Semantic/sapNegativeColor': { w: '#AB0000', k: '#FF5E5E' },
  'Semantic/sapErrorColor': { w: '#AB0000', k: '#FF5E5E' },
  'Semantic/Border/sapErrorBorderColor': { w: '#AB0000', k: '#FF5E5E' },
  'Semantic/Background/sapErrorBackground': { w: '#FFFFFF', k: '#000000' },
  'Semantic/sapWarningColor': { w: '#5C5C00', k: '#FFAB1D' },
  'Semantic/sapCriticalColor': { w: '#5C5C00', k: '#FFAB1D' },
  'Semantic/Border/sapWarningBorderColor': { w: '#5C5C00', k: '#FFAB1D' },
  'Semantic/Background/sapWarningBackground': { w: '#FFFFFF', k: '#000000' },
  'Semantic/sapPositiveColor': { w: '#006362', k: '#99CC99' },
  'Semantic/sapSuccessColor': { w: '#006362', k: '#99CC99' },
  'Semantic/Border/sapSuccessBorderColor': { w: '#006362', k: '#99CC99' },
  'Semantic/Background/sapSuccessBackground': { w: '#FFFFFF', k: '#000000' },
  'Semantic/sapInformativeColor': { w: '#000000', k: '#FFFFFF' },
  'Semantic/sapInformationColor': { w: '#000000', k: '#FFFFFF' },
  'Semantic/Border/sapInformationBorderColor': { w: '#000000', k: '#FFFFFF' },
  'Semantic/Background/sapInformationBackground': { w: '#FFFFFF', k: '#000000' },
  'Semantic/sapNeutralColor': { w: '#000000', k: '#FFFFFF' },
  'Semantic/Background/sapNeutralBackground': { w: '#FFFFFF', k: '#000000' },
  'Link/sapLinkColor': { w: '#000000', k: '#FFFFFF' },
  'Link/sapLink_Hover_Color': { w: '#000000', k: '#FFFFFF' },
  'Link/sapLink_Active_Color': { w: '#000000', k: '#FFFFFF' },
  'Link/sapLink_Visited_Color': { w: '#000000', k: '#FFFFFF' },
  'Link/sapLink_InvertedColor': { w: '#000000', k: '#FFFFFF' },
  'Link/sapLink_SubtleColor': { w: '#000000', k: '#FFFFFF' },
  'Button/Emphasized/sapButton_Emphasized_Background': { w: '#FFFFFF', k: '#000000' },
  'Button/Emphasized/sapButton_Emphasized_BorderColor': { w: '#000000', k: '#FFFFFF' },
  'Button/Emphasized/sapButton_Emphasized_TextColor': { w: '#000000', k: '#FFFFFF' },
  'Button/Emphasized/sapButton_Emphasized_Hover_Background': { w: '#E97624', k: '#795100' },
  'Button/Emphasized/sapButton_Emphasized_Active_TextColor': { w: '#000000', k: '#FFFFFF' },
  'Button/Negative/sapButton_Negative_Background': { w: '#FFFFFF', k: '#000000' },
  'Button/Negative/sapButton_Negative_Hover_Background': { w: '#E97624', k: '#795100' },
  'Button/Critical/sapButton_Critical_Background': { w: '#FFFFFF', k: '#000000' },
  'Button/Critical/sapButton_Critical_Hover_Background': { w: '#E97624', k: '#795100' },
  'Button/Attention/sapButton_Attention_Background': { w: '#FFFFFF', k: '#000000' },
  'Button/Attention/sapButton_Attention_TextColor': { w: '#000000', k: '#FFFFFF' },
  'Focus/sapContent_FocusColor': { w: '#000000', k: '#FFFFFF' },
  'Focus/sapContent_ContrastFocusColor': { w: '#000000', k: '#FFFFFF' },
  'Shadow/sapContent_ShadowColor': { w: '#000000', k: '#FFFFFF' },
  'Shadow/sapContent_ContrastShadowColor': { w: '#000000', k: '#FFFFFF' },
  'Foreground/sapContent_ForegroundBorderColor': { w: '#000000', k: '#FFFFFF' },
  'Foreground/sapContent_ForegroundColor': { w: '#FFFFFF', k: '#000000' },
  'Shell/sapShellColor': { w: '#FFFFFF', k: '#000000' },
  'Shell/sapShell_BorderColor': { w: '#000000', k: '#FFFFFF' },
  'Shell/sapShell_TextColor': { w: '#000000', k: '#FFFFFF' },
  'Shell/sapShell_SubBrand_TextColor': { w: '#000000', k: '#FFFFFF' },
  'Shell/sapShell_InteractiveBackground': { w: '#FFFFFF', k: '#000000' },
  'Shell/sapShell_Active_TextColor': { w: '#000000', k: '#FFFFFF' },
  'Shell/sapShell_Selected_TextColor': { w: '#000000', k: '#FFFFFF' },
  'Shell/sapShell_Background': { w: '#FFFFFF', k: '#000000' },
  'Shell/sapShell_NegativeColor': { w: '#AB0000', k: '#FF5E5E' },
  'Shell/sapShell_CriticalColor': { w: '#5C5C00', k: '#FFAB1D' },
  'Shell/sapShell_PositiveColor': { w: '#006362', k: '#99CC99' },
  'Shell/sapShell_InformativeColor': { w: '#000000', k: '#FFFFFF' },
  'Shell/sapShell_NeutralColor': { w: '#000000', k: '#FFFFFF' },
  'Accent/sapAccentColor1': { w: '#5F5800', k: '#FFC847' },
  'Accent/sapAccentColor2': { w: '#5E4101', k: '#ED884A' },
  'Accent/sapAccentColor3': { w: '#973333', k: '#DB9292' },
  'Accent/sapAccentColor4': { w: '#961D7C', k: '#E269C9' },
  'Accent/sapAccentColor5': { w: '#365892', k: '#8CA7D5' },
  'Accent/sapAccentColor6': { w: '#004CCB', k: '#6BD3FF' },
  'Accent/sapAccentColor7': { w: '#105B5B', k: '#7FC6C6' },
  'Accent/sapAccentColor8': { w: '#26340B', k: '#B2E484' },
  'Accent/sapAccentColor9': { w: '#6C32A9', k: '#B995E0' },
  'Accent/sapAccentColor10': { w: '#4A5964', k: '#B0BCC5' },
};

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataPath = resolve(__dirname, '..', 'src', 'data.ts');
let content = readFileSync(dataPath, 'utf8');

let hits = 0;
let misses = [];
for (const [token, { w, k }] of Object.entries(HC)) {
  const needle = new RegExp(`(fiori: '${token.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&')}',\\s*fioriLight: '#[0-9A-Fa-f]+', fioriDark: '#[0-9A-Fa-f]+',)(\\s+rds:)`);
  if (needle.test(content)) {
    content = content.replace(
      needle,
      `$1 fioriHcWhite: '${w}', fioriHcBlack: '${k}',$2`,
    );
    hits += 1;
  } else {
    misses.push(token);
  }
}

writeFileSync(dataPath, content);
console.log(`merged ${hits} tokens`);
if (misses.length) {
  console.log('misses:');
  for (const m of misses) console.log('  -', m);
  process.exit(1);
}
