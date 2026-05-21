/**
 * Fiori → RDS 3.1 hot-swap data. Extracted from both Figma files via the
 * Figma MCP on 2026-05-19.
 *
 *  RDS 3.1: https://www.figma.com/design/tu2YE7Y6bmgkmcdIqCJpLk
 *  Fiori:   https://www.figma.com/design/XywZ3yPdXzBL4MnKbzP7uI
 *
 * The 132 hand-curated mappings live in this file (SWAPS). 767 additional
 * Fiori tokens with auto-mapped RDS suggestions live in `data-auto-mapped.ts`
 * and are merged into SWAPS at module-load time.
 */

import { AUTO_SWAPS } from './data-auto-mapped';

export type Conf = 'high' | 'medium' | 'low';

export type Mapping = {
  fiori: string;
  fioriLight: string;       // Morning Horizon
  fioriDark: string;        // Evening Horizon
  fioriHcWhite: string;     // High Contrast White
  fioriHcBlack: string;     // High Contrast Black
  rds: string;
  rdsLight: string;
  rdsDark: string;
  /**
   * @deprecated Confidence is now computed at render time from the actual
   * resolved hexes via `computeConfidence`. This field is retained on each row
   * because it ships in the source data but is no longer the source of truth.
   */
  conf?: Conf;
  note?: string;
};

export type Source = 'fiori' | 'rds';
export type Choices = Record<string, Source>;

export type Mode = 'morning' | 'evening' | 'hcWhite' | 'hcBlack';

export const MODES: { id: Mode; label: string; shortLabel: string; scheme: 'light' | 'dark' }[] = [
  { id: 'morning', label: 'Morning Horizon',     shortLabel: 'Morning Horizon',     scheme: 'light' },
  { id: 'evening', label: 'Evening Horizon',     shortLabel: 'Evening Horizon',     scheme: 'dark' },
  { id: 'hcWhite', label: 'High Contrast White', shortLabel: 'HC White',            scheme: 'light' },
  { id: 'hcBlack', label: 'High Contrast Black', shortLabel: 'HC Black',            scheme: 'dark' },
];

export function modeLabel(mode: Mode): string {
  return MODES.find((m) => m.id === mode)?.label ?? mode;
}

export function modeScheme(mode: Mode): 'light' | 'dark' {
  return MODES.find((m) => m.id === mode)?.scheme ?? 'light';
}

const HAND_CURATED: Record<string, Mapping[]> = {
  Main: [
    { fiori: 'Main/sapBrandColor',     fioriLight: '#0070F2', fioriDark: '#0070F2', fioriHcWhite: '#E97624', fioriHcBlack: '#795100', rds: 'Brand/Blue/600 (Reltio Cobalt)', rdsLight: '#0000CC', rdsDark: '#0000CC', conf: 'high', note: 'Headline brand swap — Fiori Belize → Reltio Cobalt.' },
    { fiori: 'Main/sapHighlightColor', fioriLight: '#0064D9', fioriDark: '#4DB1FF', fioriHcWhite: '#E97624', fioriHcBlack: '#795100', rds: 'Brand/Blue/600 / Blue/300',       rdsLight: '#0000CC', rdsDark: '#6161FF', conf: 'high' },
    { fiori: 'Main/sapBaseColor',      fioriLight: '#FFFFFF', fioriDark: '#1D232A', fioriHcWhite: '#FFFFFF', fioriHcBlack: '#000000', rds: 'White / Grayscale/900D',          rdsLight: '#FFFFFF', rdsDark: '#0E0E25', conf: 'high' },
  ],
  Interaction: [
    { fiori: 'Interaction/sapSelectedColor',                     fioriLight: '#0064D9', fioriDark: '#4DB1FF', fioriHcWhite: '#5C93FF', fioriHcBlack: '#0F5C93', rds: 'Primary/Base',                       rdsLight: '#0000CC', rdsDark: '#6161FF', conf: 'high' },
    { fiori: 'Interaction/sapActiveColor',                       fioriLight: '#DEE2E5', fioriDark: '#020303', fioriHcWhite: '#E97624', fioriHcBlack: '#795100', rds: 'Grayscale/100 ↔ 900D',               rdsLight: '#E3E3F2', rdsDark: '#0E0E25', conf: 'high' },
    { fiori: 'Interaction/sapHoverColor',                        fioriLight: '#EAECEE', fioriDark: '#222B35', fioriHcWhite: '#E97624', fioriHcBlack: '#795100', rds: 'Grayscale/50 ↔ 800',                 rdsLight: '#F5F5FA', rdsDark: '#262640', conf: 'high' },
    { fiori: 'Interaction/sapContent_Selected_Background',       fioriLight: '#FFFFFF', fioriDark: '#1D232A', fioriHcWhite: '#5C93FF', fioriHcBlack: '#0F5C93', rds: 'Background/Surface 1',               rdsLight: '#FFFFFF', rdsDark: '#0E0E25', conf: 'high' },
    { fiori: 'Interaction/sapContent_Selected_TextColor',        fioriLight: '#0064D9', fioriDark: '#4DB1FF', fioriHcWhite: '#000000', fioriHcBlack: '#FFFFFF', rds: 'Primary/Base',                       rdsLight: '#0000CC', rdsDark: '#6161FF', conf: 'high' },
    { fiori: 'Interaction/sapContent_Selected_Hover_Background', fioriLight: '#E3F0FF', fioriDark: '#002B4D', fioriHcWhite: '#E97624', fioriHcBlack: '#795100', rds: 'Brand/Blue/50 ↔ Blue/900',           rdsLight: '#E5E5FF', rdsDark: '#000033', conf: 'high' },
    { fiori: 'Interaction/sapContent_Selected_ForegroundColor',  fioriLight: '#0064D9', fioriDark: '#4DB1FF', fioriHcWhite: '#000000', fioriHcBlack: '#FFFFFF', rds: 'Primary/Base',                       rdsLight: '#0000CC', rdsDark: '#6161FF', conf: 'high' },
    { fiori: 'Interaction/sapContent_HelpColor',                 fioriLight: '#188918', fioriDark: '#5DC122', fioriHcWhite: '#006800', fioriHcBlack: '#03AE03', rds: 'Green-Emerald/600 (Success/Default)',rdsLight: '#449977', rdsDark: '#449977', conf: 'medium', note: 'Fiori help-green is brighter forest; RDS Emerald is teal-leaning.' },
    { fiori: 'Interaction/sapContent_DragAndDropActiveColor',    fioriLight: '#0064D9', fioriDark: '#4DB1FF', fioriHcWhite: '#006800', fioriHcBlack: '#03AE03', rds: 'Primary/Base',                       rdsLight: '#0000CC', rdsDark: '#6161FF', conf: 'high' },
    { fiori: 'Interaction/sapContent_SearchHighlightColor',      fioriLight: '#DAFDF5', fioriDark: '#046C7A', fioriHcWhite: '#E97624', fioriHcBlack: '#795100', rds: 'Brand/Aqua/50 ↔ Aqua/700',           rdsLight: '#E5FFFF', rdsDark: '#009999', conf: 'medium' },
  ],
  Text: [
    { fiori: 'Text/sapTextColor',                   fioriLight: '#131E29', fioriDark: '#F5F6F7', fioriHcWhite: '#000000', fioriHcBlack: '#FFFFFF', rds: 'Fonts & Icons/Default',      rdsLight: '#0E0E25', rdsDark: '#E3E3F2', conf: 'high' },
    { fiori: 'Text/sapTitleColor',                  fioriLight: '#131E29', fioriDark: '#F5F6F7', fioriHcWhite: '#000000', fioriHcBlack: '#FFFFFF', rds: 'Fonts & Icons/Default',      rdsLight: '#0E0E25', rdsDark: '#E3E3F2', conf: 'high' },
    { fiori: 'Text/sapContent_ForegroundTextColor', fioriLight: '#131E29', fioriDark: '#F5F6F7', fioriHcWhite: '#000000', fioriHcBlack: '#FFFFFF', rds: 'Fonts & Icons/Default',      rdsLight: '#0E0E25', rdsDark: '#E3E3F2', conf: 'high' },
    { fiori: 'Text/sapContent_LabelColor',          fioriLight: '#556B82', fioriDark: '#8396A8', fioriHcWhite: '#000000', fioriHcBlack: '#FFFFFF', rds: 'Fonts & Icons/Descriptions', rdsLight: '#56568F', rdsDark: '#BABADE', conf: 'high' },
    { fiori: 'Text/sapContent_MarkerTextColor',     fioriLight: '#046C7A', fioriDark: '#64EDD2', fioriHcWhite: '#000000', fioriHcBlack: '#FFFFFF', rds: 'Brand/Aqua/700 ↔ Aqua/300',  rdsLight: '#009999', rdsDark: '#66FFFF', conf: 'medium' },
    { fiori: 'Text/sapContent_ContrastTextColor',   fioriLight: '#FFFFFF', fioriDark: '#1D232A', fioriHcWhite: '#000000', fioriHcBlack: '#FFFFFF', rds: 'White / Grayscale/900D',     rdsLight: '#FFFFFF', rdsDark: '#0E0E25', conf: 'high' },
    { fiori: 'Text/sapContent_DisabledTextColor',   fioriLight: '#7A828A', fioriDark: '#9DA3A9', fioriHcWhite: '#888888', fioriHcBlack: '#666666', rds: 'Fonts & Icons/disabled',     rdsLight: '#BABADE', rdsDark: '#56568F', conf: 'high', note: 'Fiori uses 60% alpha; RDS has a dedicated swatch.' },
  ],
  Container: [
    { fiori: 'Container/sapGroup_ContentBackground',  fioriLight: '#FFFFFF', fioriDark: '#1D232A', fioriHcWhite: '#FFFFFF', fioriHcBlack: '#000000', rds: 'Background/Surface 1',              rdsLight: '#FFFFFF', rdsDark: '#0E0E25', conf: 'high' },
    { fiori: 'Container/sapGroup_ContentBorderColor', fioriLight: '#D9D9D9', fioriDark: '#323C48', fioriHcWhite: '#000000', fioriHcBlack: '#FFFFFF', rds: 'Outline-Border/Surface Border 2',   rdsLight: '#E3E3F2', rdsDark: '#56568F', conf: 'high' },
    { fiori: 'Container/sapGroup_TitleBorderColor',   fioriLight: '#A8B3BD', fioriDark: '#758EA5', fioriHcWhite: '#000000', fioriHcBlack: '#FFFFFF', rds: 'Outline-Border/Surface Border 3',   rdsLight: '#BABADE', rdsDark: '#434370', conf: 'high' },
    { fiori: 'Container/sapGroup_TitleTextColor',     fioriLight: '#1D2D3E', fioriDark: '#F5F6F7', fioriHcWhite: '#000000', fioriHcBlack: '#FFFFFF', rds: 'Fonts & Icons/Default',             rdsLight: '#0E0E25', rdsDark: '#E3E3F2', conf: 'high' },
    { fiori: 'Container/sapBlockLayer_Background',    fioriLight: '#000000', fioriDark: '#000000', fioriHcWhite: '#FFFFFF', fioriHcBlack: '#000000', rds: 'Black',                              rdsLight: '#000000', rdsDark: '#000000', conf: 'high' },
  ],
  Semantic: [
    { fiori: 'Semantic/sapNegativeColor',                   fioriLight: '#AA0808', fioriDark: '#FA6161', fioriHcWhite: '#AB0000', fioriHcBlack: '#FF5E5E', rds: 'Brand/Red/600 (Error/Font)',            rdsLight: '#BD0F0F', rdsDark: '#EE3333', conf: 'high' },
    { fiori: 'Semantic/sapErrorColor',                      fioriLight: '#AA0808', fioriDark: '#FA6161', fioriHcWhite: '#AB0000', fioriHcBlack: '#FF5E5E', rds: 'Brand/Red/600 (Error/Font)',            rdsLight: '#BD0F0F', rdsDark: '#EE3333', conf: 'high' },
    { fiori: 'Semantic/Border/sapErrorBorderColor',         fioriLight: '#E90B0B', fioriDark: '#FA6161', fioriHcWhite: '#AB0000', fioriHcBlack: '#FF5E5E', rds: 'Brand/Red/500 (Error/Default)',         rdsLight: '#EE3333', rdsDark: '#EE3333', conf: 'high' },
    { fiori: 'Semantic/Background/sapErrorBackground',      fioriLight: '#FFEAF4', fioriDark: '#350000', fioriHcWhite: '#FFFFFF', fioriHcBlack: '#000000', rds: 'Brand/Red/100 (Error/Soft fill)',       rdsLight: '#FDE7E7', rdsDark: '#2F0404', conf: 'medium', note: 'Fiori bg is pink-tinted; RDS is salmon — visually distinct.' },
    { fiori: 'Semantic/sapWarningColor',                    fioriLight: '#E76500', fioriDark: '#FFDF72', fioriHcWhite: '#5C5C00', fioriHcBlack: '#FFAB1D', rds: 'Other/Orange/500',                      rdsLight: '#EE6611', rdsDark: '#FFE066', conf: 'medium', note: 'Fiori warning is orange-amber. Alternative: RDS Gold/500 (#FFCC00) for brand alignment.' },
    { fiori: 'Semantic/sapCriticalColor',                   fioriLight: '#E76500', fioriDark: '#FFDF72', fioriHcWhite: '#5C5C00', fioriHcBlack: '#FFAB1D', rds: 'Other/Orange/500',                      rdsLight: '#EE6611', rdsDark: '#FFE066', conf: 'medium' },
    { fiori: 'Semantic/Border/sapWarningBorderColor',       fioriLight: '#DD6100', fioriDark: '#F7BF00', fioriHcWhite: '#5C5C00', fioriHcBlack: '#FFAB1D', rds: 'Other/Orange/600 / Gold/700',           rdsLight: '#BE520E', rdsDark: '#CC7700', conf: 'medium' },
    { fiori: 'Semantic/Background/sapWarningBackground',    fioriLight: '#FFF8D6', fioriDark: '#382700', fioriHcWhite: '#FFFFFF', fioriHcBlack: '#000000', rds: 'Brand/Gold/100 (Warning/Soft fill)',    rdsLight: '#FFF5CC', rdsDark: '#3D1F00', conf: 'high' },
    { fiori: 'Semantic/sapPositiveColor',                   fioriLight: '#256F3A', fioriDark: '#97DD40', fioriHcWhite: '#006362', fioriHcBlack: '#99CC99', rds: 'Green-Emerald/700 (Success/Border)',    rdsLight: '#2F6A52', rdsDark: '#4EB189', conf: 'high' },
    { fiori: 'Semantic/sapSuccessColor',                    fioriLight: '#256F3A', fioriDark: '#97DD40', fioriHcWhite: '#006362', fioriHcBlack: '#99CC99', rds: 'Green-Emerald/700 (Success/Border)',    rdsLight: '#2F6A52', rdsDark: '#4EB189', conf: 'high' },
    { fiori: 'Semantic/Border/sapSuccessBorderColor',       fioriLight: '#30914C', fioriDark: '#6DAD1F', fioriHcWhite: '#006362', fioriHcBlack: '#99CC99', rds: 'Green-Emerald/600 (Success/Default)',   rdsLight: '#449977', rdsDark: '#4EB189', conf: 'medium', note: 'Fiori is forest; RDS Emerald is teal-leaning.' },
    { fiori: 'Semantic/Background/sapSuccessBackground',    fioriLight: '#F5FAE5', fioriDark: '#11331A', fioriHcWhite: '#FFFFFF', fioriHcBlack: '#000000', rds: 'Green-Emerald/100 (Success/Soft fill)', rdsLight: '#DCEFE7', rdsDark: '#10231B', conf: 'medium' },
    { fiori: 'Semantic/sapInformativeColor',                fioriLight: '#0070F2', fioriDark: '#4DB1FF', fioriHcWhite: '#000000', fioriHcBlack: '#FFFFFF', rds: 'Brand/Blue/600 (Reltio Cobalt)',        rdsLight: '#0000CC', rdsDark: '#6161FF', conf: 'high' },
    { fiori: 'Semantic/sapInformationColor',                fioriLight: '#0070F2', fioriDark: '#4DB1FF', fioriHcWhite: '#000000', fioriHcBlack: '#FFFFFF', rds: 'Brand/Blue/600 (Reltio Cobalt)',        rdsLight: '#0000CC', rdsDark: '#6161FF', conf: 'high' },
    { fiori: 'Semantic/Border/sapInformationBorderColor',   fioriLight: '#0070F2', fioriDark: '#4DB1FF', fioriHcWhite: '#000000', fioriHcBlack: '#FFFFFF', rds: 'Brand/Blue/600 (Reltio Cobalt)',        rdsLight: '#0000CC', rdsDark: '#6161FF', conf: 'high' },
    { fiori: 'Semantic/Background/sapInformationBackground',fioriLight: '#E1F4FF', fioriDark: '#00144A', fioriHcWhite: '#FFFFFF', fioriHcBlack: '#000000', rds: 'Brand/Blue/50 ↔ Brand/Blue/900',        rdsLight: '#E5E5FF', rdsDark: '#000033', conf: 'high' },
    { fiori: 'Semantic/sapNeutralColor',                    fioriLight: '#788FA6', fioriDark: '#A9B4BE', fioriHcWhite: '#000000', fioriHcBlack: '#FFFFFF', rds: 'Grayscale/400',                         rdsLight: '#7070A9', rdsDark: '#8D8DC8', conf: 'high' },
    { fiori: 'Semantic/Background/sapNeutralBackground',    fioriLight: '#EFF1F2', fioriDark: '#242E38', fioriHcWhite: '#FFFFFF', fioriHcBlack: '#000000', rds: 'Grayscale/50 ↔ 800',                    rdsLight: '#F5F5FA', rdsDark: '#262640', conf: 'high' },
  ],
  Link: [
    { fiori: 'Link/sapLinkColor',          fioriLight: '#0064D9', fioriDark: '#008FFF', fioriHcWhite: '#000000', fioriHcBlack: '#FFFFFF', rds: 'Fonts & Icons/Links & Text', rdsLight: '#3333FF', rdsDark: '#B2B2FF', conf: 'high', note: 'RDS uses Blue/400 for links — lighter than CTA Cobalt.' },
    { fiori: 'Link/sapLink_Hover_Color',   fioriLight: '#0064D9', fioriDark: '#008FFF', fioriHcWhite: '#000000', fioriHcBlack: '#FFFFFF', rds: 'Fonts & Icons/Links & Text', rdsLight: '#3333FF', rdsDark: '#B2B2FF', conf: 'high' },
    { fiori: 'Link/sapLink_Active_Color',  fioriLight: '#0064D9', fioriDark: '#008FFF', fioriHcWhite: '#000000', fioriHcBlack: '#FFFFFF', rds: 'Fonts & Icons/Links & Text', rdsLight: '#3333FF', rdsDark: '#B2B2FF', conf: 'high' },
    { fiori: 'Link/sapLink_Visited_Color', fioriLight: '#0064D9', fioriDark: '#008FFF', fioriHcWhite: '#000000', fioriHcBlack: '#FFFFFF', rds: 'Fonts & Icons/Links & Text', rdsLight: '#3333FF', rdsDark: '#B2B2FF', conf: 'high' },
    { fiori: 'Link/sapLink_InvertedColor', fioriLight: '#A5CFFF', fioriDark: '#BDE2FF', fioriHcWhite: '#000000', fioriHcBlack: '#FFFFFF', rds: 'Brand/Blue/200',             rdsLight: '#B2B2FF', rdsDark: '#B2B2FF', conf: 'high' },
    { fiori: 'Link/sapLink_SubtleColor',   fioriLight: '#131E29', fioriDark: '#EAECEE', fioriHcWhite: '#000000', fioriHcBlack: '#FFFFFF', rds: 'Fonts & Icons/Default',      rdsLight: '#0E0E25', rdsDark: '#E3E3F2', conf: 'high' },
  ],
  'Button Emphasized': [
    { fiori: 'Button/Emphasized/sapButton_Emphasized_Background',       fioriLight: '#0070F2', fioriDark: '#0070F2', fioriHcWhite: '#FFFFFF', fioriHcBlack: '#000000', rds: 'Primary/Base',             rdsLight: '#0000CC', rdsDark: '#0000CC', conf: 'high' },
    { fiori: 'Button/Emphasized/sapButton_Emphasized_BorderColor',      fioriLight: '#0070F2', fioriDark: '#0070F2', fioriHcWhite: '#000000', fioriHcBlack: '#FFFFFF', rds: 'Primary/Base',             rdsLight: '#0000CC', rdsDark: '#0000CC', conf: 'high' },
    { fiori: 'Button/Emphasized/sapButton_Emphasized_TextColor',        fioriLight: '#FFFFFF', fioriDark: '#FFFFFF', fioriHcWhite: '#000000', fioriHcBlack: '#FFFFFF', rds: 'White',                    rdsLight: '#FFFFFF', rdsDark: '#FFFFFF', conf: 'high' },
    { fiori: 'Button/Emphasized/sapButton_Emphasized_Hover_Background', fioriLight: '#0064D9', fioriDark: '#0064D9', fioriHcWhite: '#E97624', fioriHcBlack: '#795100', rds: 'Primary/Hover (Blue/800)', rdsLight: '#000066', rdsDark: '#000066', conf: 'high' },
    { fiori: 'Button/Emphasized/sapButton_Emphasized_Active_TextColor', fioriLight: '#0064D9', fioriDark: '#4DB1FF', fioriHcWhite: '#000000', fioriHcBlack: '#FFFFFF', rds: 'Primary/Base',             rdsLight: '#0000CC', rdsDark: '#6161FF', conf: 'high' },
  ],
  'Button Status': [
    { fiori: 'Button/Negative/sapButton_Negative_Background',       fioriLight: '#F53232', fioriDark: '#FA6161', fioriHcWhite: '#FFFFFF', fioriHcBlack: '#000000', rds: 'Error/Default (Red/500)',   rdsLight: '#EE3333', rdsDark: '#EE3333', conf: 'high' },
    { fiori: 'Button/Negative/sapButton_Negative_Hover_Background', fioriLight: '#E90B0B', fioriDark: '#FB7A7A', fioriHcWhite: '#E97624', fioriHcBlack: '#795100', rds: 'Red/600 / Red/300',         rdsLight: '#BD0F0F', rdsDark: '#F47171', conf: 'high' },
    { fiori: 'Button/Critical/sapButton_Critical_Background',       fioriLight: '#E76500', fioriDark: '#F7BF00', fioriHcWhite: '#FFFFFF', fioriHcBlack: '#000000', rds: 'Orange/500 / Gold/600',     rdsLight: '#EE6611', rdsDark: '#FFAA00', conf: 'medium', note: 'Use Gold/700 for Reltio brand alignment.' },
    { fiori: 'Button/Critical/sapButton_Critical_Hover_Background', fioriLight: '#DD6100', fioriDark: '#FFCF2B', fioriHcWhite: '#E97624', fioriHcBlack: '#795100', rds: 'Orange/600 / Gold/500',     rdsLight: '#BE520E', rdsDark: '#FFCC00', conf: 'medium' },
    { fiori: 'Button/Attention/sapButton_Attention_Background',     fioriLight: '#FFF3B7', fioriDark: '#382700', fioriHcWhite: '#FFFFFF', fioriHcBlack: '#000000', rds: 'Brand/Gold/200 / Gold/900', rdsLight: '#FFEB99', rdsDark: '#3D1F00', conf: 'high' },
    { fiori: 'Button/Attention/sapButton_Attention_TextColor',      fioriLight: '#B44F00', fioriDark: '#FFDF72', fioriHcWhite: '#000000', fioriHcBlack: '#FFFFFF', rds: 'Orange/700 / Gold/300',     rdsLight: '#8F3D0A', rdsDark: '#FFE066', conf: 'medium' },
  ],
  Focus: [
    { fiori: 'Focus/sapContent_FocusColor',         fioriLight: '#0032A5', fioriDark: '#9AD3FF', fioriHcWhite: '#000000', fioriHcBlack: '#FFFFFF', rds: 'Brand/Blue/800 ↔ Blue/200', rdsLight: '#000066', rdsDark: '#B2B2FF', conf: 'high' },
    { fiori: 'Focus/sapContent_ContrastFocusColor', fioriLight: '#FFFFFF', fioriDark: '#000000', fioriHcWhite: '#000000', fioriHcBlack: '#FFFFFF', rds: 'White ↔ Black',             rdsLight: '#FFFFFF', rdsDark: '#000000', conf: 'high' },
  ],
  Shadow: [
    { fiori: 'Shadow/sapContent_ShadowColor',         fioriLight: '#223548', fioriDark: '#000000', fioriHcWhite: '#000000', fioriHcBlack: '#FFFFFF', rds: 'Grayscale/700 ↔ Black', rdsLight: '#303050', rdsDark: '#000000', conf: 'high', note: 'Used at low alpha for elevation.' },
    { fiori: 'Shadow/sapContent_ContrastShadowColor', fioriLight: '#FFFFFF', fioriDark: '#FFFFFF', fioriHcWhite: '#000000', fioriHcBlack: '#FFFFFF', rds: 'White',                  rdsLight: '#FFFFFF', rdsDark: '#FFFFFF', conf: 'high' },
  ],
  Foreground: [
    { fiori: 'Foreground/sapContent_ForegroundBorderColor', fioriLight: '#758CA4', fioriDark: '#A9B4BE', fioriHcWhite: '#000000', fioriHcBlack: '#FFFFFF', rds: 'Fonts & Icons/Placeholder',      rdsLight: '#8D8DC8', rdsDark: '#BABADE', conf: 'medium' },
    { fiori: 'Foreground/sapContent_ForegroundColor',       fioriLight: '#EFEFEF', fioriDark: '#101418', fioriHcWhite: '#FFFFFF', fioriHcBlack: '#000000', rds: 'Grayscale/50 ↔ 900D',            rdsLight: '#F5F5FA', rdsDark: '#0E0E25', conf: 'high' },
  ],
  Shell: [
    { fiori: 'Shell/sapShellColor',                fioriLight: '#FFFFFF', fioriDark: '#1D232A', fioriHcWhite: '#FFFFFF', fioriHcBlack: '#000000', rds: 'Background/Surface 1',              rdsLight: '#FFFFFF', rdsDark: '#0E0E25', conf: 'high' },
    { fiori: 'Shell/sapShell_BorderColor',         fioriLight: '#D9D9D9', fioriDark: '#2E3742', fioriHcWhite: '#000000', fioriHcBlack: '#FFFFFF', rds: 'Outline-Border/Surface Border 2',   rdsLight: '#E3E3F2', rdsDark: '#56568F', conf: 'high' },
    { fiori: 'Shell/sapShell_TextColor',           fioriLight: '#131E29', fioriDark: '#F5F6F7', fioriHcWhite: '#000000', fioriHcBlack: '#FFFFFF', rds: 'Fonts & Icons/Default',             rdsLight: '#0E0E25', rdsDark: '#E3E3F2', conf: 'high' },
    { fiori: 'Shell/sapShell_SubBrand_TextColor',  fioriLight: '#003E87', fioriDark: '#4DB1FF', fioriHcWhite: '#000000', fioriHcBlack: '#FFFFFF', rds: 'Brand/Blue/800 ↔ Blue/300',         rdsLight: '#000066', rdsDark: '#6161FF', conf: 'high' },
    { fiori: 'Shell/sapShell_InteractiveBackground',fioriLight: '#EFF1F2', fioriDark: '#12171C', fioriHcWhite: '#FFFFFF', fioriHcBlack: '#000000', rds: 'Grayscale/50 ↔ 900D',              rdsLight: '#F5F5FA', rdsDark: '#0E0E25', conf: 'high' },
    { fiori: 'Shell/sapShell_Active_TextColor',    fioriLight: '#0070F2', fioriDark: '#4DB1FF', fioriHcWhite: '#000000', fioriHcBlack: '#FFFFFF', rds: 'Primary/Base',                       rdsLight: '#0000CC', rdsDark: '#6161FF', conf: 'high' },
    { fiori: 'Shell/sapShell_Selected_TextColor',  fioriLight: '#0070F2', fioriDark: '#4DB1FF', fioriHcWhite: '#000000', fioriHcBlack: '#FFFFFF', rds: 'Primary/Base',                       rdsLight: '#0000CC', rdsDark: '#6161FF', conf: 'high' },
    { fiori: 'Shell/sapShell_Background',          fioriLight: '#EFF1F2', fioriDark: '#12171C', fioriHcWhite: '#FFFFFF', fioriHcBlack: '#000000', rds: 'Grayscale/50 ↔ 900D',               rdsLight: '#F5F5FA', rdsDark: '#0E0E25', conf: 'high' },
    { fiori: 'Shell/sapShell_NegativeColor',       fioriLight: '#AA0808', fioriDark: '#FA6161', fioriHcWhite: '#AB0000', fioriHcBlack: '#FF5E5E', rds: 'Brand/Red/600',                      rdsLight: '#BD0F0F', rdsDark: '#EE3333', conf: 'high' },
    { fiori: 'Shell/sapShell_CriticalColor',       fioriLight: '#B44F00', fioriDark: '#FFDF72', fioriHcWhite: '#5C5C00', fioriHcBlack: '#FFAB1D', rds: 'Orange/700 ↔ Gold/300',             rdsLight: '#8F3D0A', rdsDark: '#FFE066', conf: 'medium' },
    { fiori: 'Shell/sapShell_PositiveColor',       fioriLight: '#256F3A', fioriDark: '#97DD40', fioriHcWhite: '#006362', fioriHcBlack: '#99CC99', rds: 'Green-Emerald/700',                  rdsLight: '#2F6A52', rdsDark: '#4EB189', conf: 'high' },
    { fiori: 'Shell/sapShell_InformativeColor',    fioriLight: '#0064D9', fioriDark: '#4DB1FF', fioriHcWhite: '#000000', fioriHcBlack: '#FFFFFF', rds: 'Primary/Base',                       rdsLight: '#0000CC', rdsDark: '#6161FF', conf: 'high' },
    { fiori: 'Shell/sapShell_NeutralColor',        fioriLight: '#131E29', fioriDark: '#F5F6F7', fioriHcWhite: '#000000', fioriHcBlack: '#FFFFFF', rds: 'Fonts & Icons/Default',              rdsLight: '#0E0E25', rdsDark: '#E3E3F2', conf: 'high' },
  ],
  Legend: [
    // Chart-series colors (1–20) — paired one-to-one with sapLegendBackgroundColor1–20 below.
    { fiori: 'Legend/sapLegendColor1',  fioriLight: '#C35500', fioriDark: '#FFB300', fioriHcWhite: '#5F5800', fioriHcBlack: '#FFC847', rds: 'Brand/Gold/700 ↔ Gold/300',          rdsLight: '#CC7700', rdsDark: '#FFE066', conf: 'high' },
    { fiori: 'Legend/sapLegendColor2',  fioriLight: '#D23A0A', fioriDark: '#F5734B', fioriHcWhite: '#5E4101', fioriHcBlack: '#ED884A', rds: 'Other/Orange/600 ↔ Orange/300',      rdsLight: '#BE520E', rdsDark: '#F5A370', conf: 'high' },
    { fiori: 'Legend/sapLegendColor3',  fioriLight: '#DF1278', fioriDark: '#FEABC8', fioriHcWhite: '#973333', fioriHcBlack: '#DB9292', rds: 'Other/Pink/600 ↔ Pink/200',          rdsLight: '#BD0F6E', rdsDark: '#FF99D1', conf: 'high' },
    { fiori: 'Legend/sapLegendColor4',  fioriLight: '#840606', fioriDark: '#DB7070', fioriHcWhite: '#463000', fioriHcBlack: '#FF741F', rds: 'Brand/Red/700 ↔ Red/300',            rdsLight: '#8E0B0B', rdsDark: '#F47171', conf: 'high' },
    { fiori: 'Legend/sapLegendColor5',  fioriLight: '#CC00DC', fioriDark: '#FF8AF0', fioriHcWhite: '#961D7C', fioriHcBlack: '#E269C9', rds: 'Other/Purple/500 ↔ Pink/200',        rdsLight: '#7614EB', rdsDark: '#FF99D1', conf: 'medium' },
    { fiori: 'Legend/sapLegendColor6',  fioriLight: '#0057D2', fioriDark: '#89D1FF', fioriHcWhite: '#004CCB', fioriHcBlack: '#6BD3FF', rds: 'Brand/Blue/700 ↔ Blue/200',          rdsLight: '#000099', rdsDark: '#B2B2FF', conf: 'high' },
    { fiori: 'Legend/sapLegendColor7',  fioriLight: '#07838F', fioriDark: '#2CE0BF', fioriHcWhite: '#105B5B', fioriHcBlack: '#7FC6C6', rds: 'Brand/Aqua/700 ↔ Aqua/300',          rdsLight: '#009999', rdsDark: '#66FFFF', conf: 'high' },
    { fiori: 'Legend/sapLegendColor8',  fioriLight: '#188918', fioriDark: '#97DD40', fioriHcWhite: '#26340B', fioriHcBlack: '#B2E484', rds: 'Green-Emerald/700 ↔ Lime/200',       rdsLight: '#2F6A52', rdsDark: '#E0FF99', conf: 'medium' },
    { fiori: 'Legend/sapLegendColor9',  fioriLight: '#5B738B', fioriDark: '#A9B4BE', fioriHcWhite: '#4A5964', fioriHcBlack: '#B0BCC5', rds: 'Grayscale/500 ↔ Grayscale/200',      rdsLight: '#56568F', rdsDark: '#BABADE', conf: 'high' },
    { fiori: 'Legend/sapLegendColor10', fioriLight: '#7800A4', fioriDark: '#AA7DD9', fioriHcWhite: '#6C3D62', fioriHcBlack: '#BB86B0', rds: 'Other/Purple/700 ↔ Purple/300',      rdsLight: '#460891', rdsDark: '#AD72F3', conf: 'high' },
    { fiori: 'Legend/sapLegendColor11', fioriLight: '#A93E00', fioriDark: '#F58B00', fioriHcWhite: '#383513', fioriHcBlack: '#FFE6AD', rds: 'Other/Orange/700 ↔ Orange/400',      rdsLight: '#8F3D0A', rdsDark: '#F18541', conf: 'high' },
    { fiori: 'Legend/sapLegendColor12', fioriLight: '#AA2608', fioriDark: '#FBBFAC', fioriHcWhite: '#734F00', fioriHcBlack: '#CDAF9D', rds: 'Brand/Red/700 ↔ Red/200',            rdsLight: '#8E0B0B', rdsDark: '#F9B8B8', conf: 'medium' },
    { fiori: 'Legend/sapLegendColor13', fioriLight: '#BA066C', fioriDark: '#FFA1A1', fioriHcWhite: '#723E3E', fioriHcBlack: '#FF8787', rds: 'Other/Pink/600 ↔ Red/300',           rdsLight: '#BD0F6E', rdsDark: '#F47171', conf: 'medium' },
    { fiori: 'Legend/sapLegendColor14', fioriLight: '#8D2A00', fioriDark: '#FF9E74', fioriHcWhite: '#5F5642', fioriHcBlack: '#FFB385', rds: 'Other/Orange/800 ↔ Orange/300',      rdsLight: '#5F2907', rdsDark: '#F5A370', conf: 'medium' },
    { fiori: 'Legend/sapLegendColor15', fioriLight: '#4E247A', fioriDark: '#AF9CC3', fioriHcWhite: '#60535D', fioriHcBlack: '#FFB2EF', rds: 'Other/Purple/800 ↔ Purple/200',      rdsLight: '#2F0561', rdsDark: '#C8A1F7', conf: 'medium' },
    { fiori: 'Legend/sapLegendColor16', fioriLight: '#002A86', fioriDark: '#AABCE3', fioriHcWhite: '#465878', fioriHcBlack: '#9CABC5', rds: 'Brand/Blue/800 ↔ Blue/200',          rdsLight: '#000066', rdsDark: '#B2B2FF', conf: 'high' },
    { fiori: 'Legend/sapLegendColor17', fioriLight: '#035663', fioriDark: '#DAFDF5', fioriHcWhite: '#435B5B', fioriHcBlack: '#A4EEEE', rds: 'Brand/Aqua/800 ↔ Aqua/100',          rdsLight: '#006666', rdsDark: '#CCFFFF', conf: 'medium' },
    { fiori: 'Legend/sapLegendColor18', fioriLight: '#1E592F', fioriDark: '#D5F1B1', fioriHcWhite: '#4E5A36', fioriHcBlack: '#8D9E7E', rds: 'Green-Emerald/800 ↔ Lime/200',       rdsLight: '#1F4737', rdsDark: '#E0FF99', conf: 'medium' },
    { fiori: 'Legend/sapLegendColor19', fioriLight: '#1A4796', fioriDark: '#D1EFFF', fioriHcWhite: '#4E5869', fioriHcBlack: '#ADDCF0', rds: 'Brand/Blue/700 ↔ Aqua/100',          rdsLight: '#000099', rdsDark: '#CCFFFF', conf: 'medium' },
    { fiori: 'Legend/sapLegendColor20', fioriLight: '#470CED', fioriDark: '#E2D8FF', fioriHcWhite: '#001B49', fioriHcBlack: '#629CFF', rds: 'Brand/Blue/500 ↔ Purple/100',        rdsLight: '#0A0AFF', rdsDark: '#C8A1F7', conf: 'medium' },

    // Soft-fill chart background tints (1–20) — paired with sapLegendColor1–20.
    { fiori: 'Legend/sapLegendBackgroundColor1',  fioriLight: '#FFEF9F', fioriDark: '#382700', fioriHcWhite: '#FFFFFF', fioriHcBlack: '#000000', rds: 'Brand/Gold/200 ↔ Gold/900',      rdsLight: '#FFEB99', rdsDark: '#3D1F00', conf: 'high' },
    { fiori: 'Legend/sapLegendBackgroundColor2',  fioriLight: '#FEEAE1', fioriDark: '#501605', fioriHcWhite: '#FFFFFF', fioriHcBlack: '#000000', rds: 'Other/Orange/100 ↔ Orange/800', rdsLight: '#FCE0CF', rdsDark: '#5F2907', conf: 'high' },
    { fiori: 'Legend/sapLegendBackgroundColor3',  fioriLight: '#FBF6F8', fioriDark: '#510136', fioriHcWhite: '#FFFFFF', fioriHcBlack: '#000000', rds: 'Other/Pink/50 ↔ Pink/800',      rdsLight: '#FFE5F3', rdsDark: '#5E0837', conf: 'medium' },
    { fiori: 'Legend/sapLegendBackgroundColor4',  fioriLight: '#FBEBEB', fioriDark: '#411C1C', fioriHcWhite: '#FFFFFF', fioriHcBlack: '#000000', rds: 'Brand/Red/100 ↔ Red/800',       rdsLight: '#FDE7E7', rdsDark: '#5E0808', conf: 'high' },
    { fiori: 'Legend/sapLegendBackgroundColor5',  fioriLight: '#FFE5FE', fioriDark: '#28004A', fioriHcWhite: '#FFFFFF', fioriHcBlack: '#000000', rds: 'Other/Pink/50 ↔ Purple/900',    rdsLight: '#FFE5F3', rdsDark: '#180330', conf: 'medium' },
    { fiori: 'Legend/sapLegendBackgroundColor6',  fioriLight: '#DDE6FF', fioriDark: '#00144A', fioriHcWhite: '#FFFFFF', fioriHcBlack: '#000000', rds: 'Brand/Blue/100 ↔ Blue/900',     rdsLight: '#CCCCFF', rdsDark: '#000033', conf: 'high' },
    { fiori: 'Legend/sapLegendBackgroundColor7',  fioriLight: '#C2FCEE', fioriDark: '#012931', fioriHcWhite: '#FFFFFF', fioriHcBlack: '#000000', rds: 'Brand/Aqua/100 ↔ Aqua/900',     rdsLight: '#CCFFFF', rdsDark: '#003333', conf: 'high' },
    { fiori: 'Legend/sapLegendBackgroundColor8',  fioriLight: '#F5FAE5', fioriDark: '#1F2519', fioriHcWhite: '#FFFFFF', fioriHcBlack: '#000000', rds: 'Other/Lime/100 ↔ Lime/900',     rdsLight: '#F0FFCC', rdsDark: '#243300', conf: 'high' },
    { fiori: 'Legend/sapLegendBackgroundColor9',  fioriLight: '#F5F6F7', fioriDark: '#182430', fioriHcWhite: '#FFFFFF', fioriHcBlack: '#000000', rds: 'Grayscale/50 ↔ Grayscale/800',  rdsLight: '#F5F5FA', rdsDark: '#262640', conf: 'high' },
    { fiori: 'Legend/sapLegendBackgroundColor10', fioriLight: '#FFF0FA', fioriDark: '#30164B', fioriHcWhite: '#FFFFFF', fioriHcBlack: '#000000', rds: 'Other/Purple/50 ↔ Purple/800',  rdsLight: '#E4D0FB', rdsDark: '#2F0561', conf: 'medium' },
    { fiori: 'Legend/sapLegendBackgroundColor11', fioriLight: '#FFF8D6', fioriDark: '#571400', fioriHcWhite: '#FFFFFF', fioriHcBlack: '#000000', rds: 'Brand/Gold/100 ↔ Orange/800',   rdsLight: '#FFF5CC', rdsDark: '#5F2907', conf: 'high' },
    { fiori: 'Legend/sapLegendBackgroundColor12', fioriLight: '#FFF6F6', fioriDark: '#360C03', fioriHcWhite: '#FFFFFF', fioriHcBlack: '#000000', rds: 'Brand/Red/50 ↔ Red/900',        rdsLight: '#FEF6F6', rdsDark: '#2F0404', conf: 'high' },
    { fiori: 'Legend/sapLegendBackgroundColor13', fioriLight: '#F7EBEF', fioriDark: '#3D0000', fioriHcWhite: '#FFFFFF', fioriHcBlack: '#000000', rds: 'Other/Pink/50 ↔ Red/900',       rdsLight: '#FFE5F3', rdsDark: '#2F0404', conf: 'medium' },
    { fiori: 'Legend/sapLegendBackgroundColor14', fioriLight: '#F1ECD5', fioriDark: '#421502', fioriHcWhite: '#FFFFFF', fioriHcBlack: '#000000', rds: 'Brand/Gold/100 ↔ Orange/800',   rdsLight: '#FFF5CC', rdsDark: '#5F2907', conf: 'medium' },
    { fiori: 'Legend/sapLegendBackgroundColor15', fioriLight: '#F0E7F8', fioriDark: '#332640', fioriHcWhite: '#FFFFFF', fioriHcBlack: '#000000', rds: 'Other/Purple/50 ↔ Grayscale/800',rdsLight: '#E4D0FB', rdsDark: '#262640', conf: 'medium' },
    { fiori: 'Legend/sapLegendBackgroundColor16', fioriLight: '#EBF8FF', fioriDark: '#121D35', fioriHcWhite: '#FFFFFF', fioriHcBlack: '#000000', rds: 'Brand/Blue/50 ↔ Blue/900',      rdsLight: '#E5E5FF', rdsDark: '#000033', conf: 'high' },
    { fiori: 'Legend/sapLegendBackgroundColor17', fioriLight: '#DAFDF5', fioriDark: '#013131', fioriHcWhite: '#FFFFFF', fioriHcBlack: '#000000', rds: 'Brand/Aqua/50 ↔ Aqua/900',      rdsLight: '#E5FFFF', rdsDark: '#003333', conf: 'high' },
    { fiori: 'Legend/sapLegendBackgroundColor18', fioriLight: '#EBF5CB', fioriDark: '#1E3009', fioriHcWhite: '#FFFFFF', fioriHcBlack: '#000000', rds: 'Other/Lime/100 ↔ Lime/900',     rdsLight: '#F0FFCC', rdsDark: '#243300', conf: 'high' },
    { fiori: 'Legend/sapLegendBackgroundColor19', fioriLight: '#FAFDFF', fioriDark: '#0A285C', fioriHcWhite: '#FFFFFF', fioriHcBlack: '#000000', rds: 'Brand/Blue/50 ↔ Blue/900',      rdsLight: '#E5E5FF', rdsDark: '#000033', conf: 'medium' },
    { fiori: 'Legend/sapLegendBackgroundColor20', fioriLight: '#ECEEFF', fioriDark: '#1C0C6E', fioriHcWhite: '#FFFFFF', fioriHcBlack: '#000000', rds: 'Brand/Blue/50 ↔ Blue/900',      rdsLight: '#E5E5FF', rdsDark: '#000033', conf: 'medium' },

    // Gantt / calendar specific
    { fiori: 'Legend/sapLegend_WorkingBackground',    fioriLight: '#FFFFFF', fioriDark: '#1D232A', fioriHcWhite: '#D9D9D9', fioriHcBlack: '#2E2E2E', rds: 'Background/Surface 1',           rdsLight: '#FFFFFF', rdsDark: '#0E0E25', conf: 'high' },
    { fiori: 'Legend/sapLegend_NonWorkingBackground', fioriLight: '#EBEBEB', fioriDark: '#0C0F12', fioriHcWhite: '#B3B3B3', fioriHcBlack: '#585858', rds: 'Grayscale/50 ↔ Grayscale/900D', rdsLight: '#F5F5FA', rdsDark: '#0E0E25', conf: 'high' },
    { fiori: 'Legend/sapLegend_CurrentDateTime',      fioriLight: '#A100C2', fioriDark: '#FFAFED', fioriHcWhite: '#961D7C', fioriHcBlack: '#E269C9', rds: 'Other/Purple/600 ↔ Pink/200',   rdsLight: '#6611CC', rdsDark: '#FF99D1', conf: 'medium' },
  ],
  Accent: [
    { fiori: 'Accent/sapAccentColor1',  fioriLight: '#D27700', fioriDark: '#FFDF72', fioriHcWhite: '#5F5800', fioriHcBlack: '#FFC847', rds: 'Brand/Gold/700 ↔ Gold/300',     rdsLight: '#CC7700', rdsDark: '#FFE066', conf: 'high' },
    { fiori: 'Accent/sapAccentColor2',  fioriLight: '#AA0808', fioriDark: '#FF8CB2', fioriHcWhite: '#5E4101', fioriHcBlack: '#ED884A', rds: 'Brand/Red/600 ↔ Pink/300',      rdsLight: '#BD0F0F', rdsDark: '#FF66B9', conf: 'medium' },
    { fiori: 'Accent/sapAccentColor3',  fioriLight: '#BA066C', fioriDark: '#FECBDA', fioriHcWhite: '#973333', fioriHcBlack: '#DB9292', rds: 'Pink/600 ↔ Pink/100',           rdsLight: '#BD0F6E', rdsDark: '#FFCCE8', conf: 'high' },
    { fiori: 'Accent/sapAccentColor4',  fioriLight: '#A100C2', fioriDark: '#FFAFED', fioriHcWhite: '#961D7C', fioriHcBlack: '#E269C9', rds: 'Purple/600 ↔ Pink/200',         rdsLight: '#6611CC', rdsDark: '#FF99D1', conf: 'medium' },
    { fiori: 'Accent/sapAccentColor5',  fioriLight: '#5D36FF', fioriDark: '#D3B6FF', fioriHcWhite: '#365892', fioriHcBlack: '#8CA7D5', rds: 'Purple/500 ↔ Purple/200',       rdsLight: '#7614EB', rdsDark: '#C8A1F7', conf: 'medium' },
    { fiori: 'Accent/sapAccentColor6',  fioriLight: '#0057D2', fioriDark: '#A6E0FF', fioriHcWhite: '#004CCB', fioriHcBlack: '#6BD3FF', rds: 'Brand/Blue/700 ↔ Blue/200',     rdsLight: '#000099', rdsDark: '#B2B2FF', conf: 'high' },
    { fiori: 'Accent/sapAccentColor7',  fioriLight: '#046C7A', fioriDark: '#64EDD2', fioriHcWhite: '#105B5B', fioriHcBlack: '#7FC6C6', rds: 'Brand/Aqua/700 ↔ Aqua/300',     rdsLight: '#009999', rdsDark: '#66FFFF', conf: 'high' },
    { fiori: 'Accent/sapAccentColor8',  fioriLight: '#256F3A', fioriDark: '#BDE986', fioriHcWhite: '#26340B', fioriHcBlack: '#B2E484', rds: 'Green-Emerald/700 ↔ Lime/200',  rdsLight: '#2F6A52', rdsDark: '#E0FF99', conf: 'high' },
    { fiori: 'Accent/sapAccentColor9',  fioriLight: '#6C32A9', fioriDark: '#B995E0', fioriHcWhite: '#6C32A9', fioriHcBlack: '#B995E0', rds: 'Purple/700 ↔ Purple/300',       rdsLight: '#460891', rdsDark: '#AD72F3', conf: 'high' },
    { fiori: 'Accent/sapAccentColor10', fioriLight: '#5B738B', fioriDark: '#D5DADD', fioriHcWhite: '#4A5964', fioriHcBlack: '#B0BCC5', rds: 'Grayscale/500 ↔ Grayscale/200', rdsLight: '#56568F', rdsDark: '#BABADE', conf: 'high' },
  ],
};

/**
 * Final SWAPS: hand-curated entries first, then auto-mapped ones appended
 * to their respective categories. Categories that only exist in AUTO_SWAPS
 * (Indication, Avatar, Input, Tab, Illustrative, Progress, List, Tile, etc.)
 * appear after the hand-curated ones.
 */
export const SWAPS: Record<string, Mapping[]> = (() => {
  const merged: Record<string, Mapping[]> = {};
  // Preserve insertion order of hand-curated categories first.
  for (const [cat, items] of Object.entries(HAND_CURATED)) {
    merged[cat] = [...items];
  }
  for (const [cat, items] of Object.entries(AUTO_SWAPS)) {
    merged[cat] = merged[cat] ? [...merged[cat], ...items] : [...items];
  }
  return merged;
})();

export const CATEGORIES = Object.keys(SWAPS);

export type RdsColor = {
  /** Stable identifier: `${ramp}/${stop}`. Empty string means "use the suggested mapping". */
  id: string;
  ramp: string;
  stop: string;
  /** Human label suitable for dropdowns: `Brand / Blue · 600`. */
  label: string;
  hex: string;
};

export const RDS_RAMPS: Record<string, [string, string][]> = {
  'Brand / Blue': [
    ['50', '#E5E5FF'], ['100', '#CCCCFF'], ['200', '#B2B2FF'], ['300', '#6161FF'], ['400', '#3333FF'],
    ['500', '#0A0AFF'], ['600', '#0000CC'], ['700', '#000099'], ['800', '#000066'], ['900', '#000033'],
  ],
  'Brand / Red': [
    ['50', '#FEF6F6'], ['100', '#FDE7E7'], ['200', '#F9B8B8'], ['300', '#F47171'], ['400', '#F14E4E'],
    ['500', '#EE3333'], ['600', '#BD0F0F'], ['700', '#8E0B0B'], ['800', '#5E0808'], ['900', '#2F0404'],
  ],
  'Brand / Gold': [
    ['50', '#FFFAE5'], ['100', '#FFF5CC'], ['200', '#FFEB99'], ['300', '#FFE066'], ['400', '#FFD733'],
    ['500', '#FFCC00'], ['600', '#FFAA00'], ['700', '#CC7700'], ['800', '#9E4F00'], ['900', '#3D1F00'],
  ],
  'Brand / Aqua': [
    ['50', '#E5FFFF'], ['100', '#CCFFFF'], ['200', '#99FFFF'], ['300', '#66FFFF'], ['400', '#33FFFF'],
    ['500', '#00FFFF'], ['600', '#00CCCC'], ['700', '#009999'], ['800', '#006666'], ['900', '#003333'],
  ],
  'Green-Emerald': [
    ['50', '#EDF7F3'], ['100', '#DCEFE7'], ['200', '#B8E0D0'], ['300', '#95D0B8'], ['400', '#72C0A1'],
    ['500', '#4EB189'], ['600', '#449977'], ['700', '#2F6A52'], ['800', '#1F4737'], ['900', '#10231B'],
  ],
  Orange: [
    ['50', '#FDF0E7'], ['100', '#FCE0CF'], ['200', '#F8C2A0'], ['300', '#F5A370'], ['400', '#F18541'],
    ['500', '#EE6611'], ['600', '#BE520E'], ['700', '#8F3D0A'], ['800', '#5F2907'], ['900', '#301403'],
  ],
  Purple: [
    ['50', '#E4D0FB'], ['100', '#C8A1F7'], ['200', '#C8A1F7'], ['300', '#AD72F3'], ['400', '#9143EF'],
    ['500', '#7614EB'], ['600', '#6611CC'], ['700', '#460891'], ['800', '#2F0561'], ['900', '#180330'],
  ],
  Pink: [
    ['50', '#FFE5F3'], ['100', '#FFCCE8'], ['200', '#FF99D1'], ['300', '#FF66B9'], ['400', '#FF44AA'],
    ['500', '#EC1389'], ['600', '#BD0F6E'], ['700', '#8E0B52'], ['800', '#5E0837'], ['900', '#2F041B'],
  ],
  Lime: [
    ['50', '#F7FFE5'], ['100', '#F0FFCC'], ['200', '#E0FF99'], ['300', '#CCFF55'], ['400', '#C2FF33'],
    ['500', '#B2FF00'], ['600', '#8FCC00'], ['700', '#6B9900'], ['800', '#476600'], ['900', '#243300'],
  ],
  Grayscale: [
    ['50', '#F5F5FA'], ['100', '#E3E3F2'], ['200', '#BABADE'], ['300', '#8D8DC8'], ['400', '#7070A9'],
    ['500', '#56568F'], ['600', '#434370'], ['700', '#303050'], ['800', '#262640'], ['900D', '#0E0E25'],
  ],
};

/**
 * Flat list of every selectable RDS color (every ramp stop + pure white/black).
 * Built once from RDS_RAMPS so adding a stop above is enough to grow the dropdown.
 */
export const RDS_COLORS: RdsColor[] = (() => {
  const out: RdsColor[] = [];
  for (const [ramp, stops] of Object.entries(RDS_RAMPS)) {
    for (const [stop, hex] of stops) {
      out.push({
        id: `${ramp}/${stop}`,
        ramp,
        stop,
        label: `${ramp} · ${stop}`,
        hex,
      });
    }
  }
  out.push({ id: 'Pure/White', ramp: 'Pure', stop: 'White', label: 'Pure · White', hex: '#FFFFFF' });
  out.push({ id: 'Pure/Black', ramp: 'Pure', stop: 'Black', label: 'Pure · Black', hex: '#000000' });
  return out;
})();

export function lookupRdsColor(id: string): RdsColor | undefined {
  if (!id) return undefined;
  return RDS_COLORS.find((c) => c.id === id);
}

/**
 * Find the RDS primitive with the smallest perceptual distance (CIE76 ΔE) to
 * the given hex. Kept for future "snap to nearest primitive" features.
 */
export function findClosestRdsColor(targetHex: string): {
  color: RdsColor;
  deltaE: number;
} {
  let best = RDS_COLORS[0];
  let bestDe = Infinity;
  for (const c of RDS_COLORS) {
    const dE = deltaE76(targetHex, c.hex);
    if (dE < bestDe) {
      best = c;
      bestDe = dE;
    }
  }
  return { color: best, deltaE: Math.round(bestDe * 10) / 10 };
}

/**
 * Blend two hex colors in linear-light RGB (gamma correct) and return the
 * result as a hex. `t` is the weight of `hex2` (0 = pure hex1, 1 = pure hex2,
 * 0.5 = perceptual midpoint).
 */
export function blendHex(hex1: string, hex2: string, t = 0.5): string {
  const c1 = hexToRgb(hex1);
  const c2 = hexToRgb(hex2);
  const lerpLin = (a: number, b: number) =>
    srgbToLinear(a) * (1 - t) + srgbToLinear(b) * t;
  const r = linearToSrgb(lerpLin(c1.r, c2.r));
  const g = linearToSrgb(lerpLin(c1.g, c2.g));
  const b = linearToSrgb(lerpLin(c1.b, c2.b));
  const toHex = (n: number) => n.toString(16).padStart(2, '0').toUpperCase();
  return '#' + toHex(r) + toHex(g) + toHex(b);
}

/** Linear-light (0–1) back to sRGB (0–255). */
function linearToSrgb(c: number): number {
  const clamped = Math.max(0, Math.min(1, c));
  const v =
    clamped <= 0.0031308
      ? 12.92 * clamped
      : 1.055 * Math.pow(clamped, 1 / 2.4) - 0.055;
  return Math.round(v * 255);
}

/** Group RDS colors by ramp for grouped dropdown rendering. */
export function rdsColorsByRamp(): { ramp: string; colors: RdsColor[] }[] {
  const map = new Map<string, RdsColor[]>();
  for (const c of RDS_COLORS) {
    const arr = map.get(c.ramp);
    if (arr) arr.push(c);
    else map.set(c.ramp, [c]);
  }
  return Array.from(map.entries()).map(([ramp, colors]) => ({ ramp, colors }));
}

export type RdsResolution = {
  /** Empty string means "using the suggested mapping". */
  id: string;
  hex: string;
  label: string;
  /** True when the user explicitly picked a primitive; false when falling back to the row's suggestion. */
  isExplicit: boolean;
};

export type RdsChoices = Record<string, string>;

/**
 * Resolve the RDS color the user wants to apply to a given Fiori token.
 *
 *   - Empty / missing → the row's suggested mapping (mode-aware: rdsLight for
 *     light schemes, rdsDark for dark).
 *   - Matches an RDS primitive id (e.g. `Brand / Blue/600`) → that primitive.
 *   - Starts with `#` → treat as a custom hex (e.g. a blended midpoint from the
 *     Enhanced column). Labeled as `Custom · #XXXXXX`.
 */
export function resolveRds(
  m: Mapping,
  mode: Mode,
  rdsChoices: RdsChoices,
): RdsResolution {
  const id = rdsChoices[m.fiori];
  if (id) {
    const c = lookupRdsColor(id);
    if (c) return { id, hex: c.hex, label: c.label, isExplicit: true };
    if (id.startsWith('#')) {
      return {
        id,
        hex: id.toUpperCase(),
        label: `Custom · ${id.toUpperCase()}`,
        isExplicit: true,
      };
    }
  }
  const hex = modeScheme(mode) === 'light' ? m.rdsLight : m.rdsDark;
  return { id: '', hex, label: m.rds, isExplicit: false };
}

/* ---------- Helpers ---------- */

export function hexLuminance(hex: string): number {
  const v = hex.replace('#', '');
  if (v.length < 6) return 0.5;
  const r = parseInt(v.slice(0, 2), 16) / 255;
  const g = parseInt(v.slice(2, 4), 16) / 255;
  const b = parseInt(v.slice(4, 6), 16) / 255;
  const lin = (c: number) =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

export function readableTextOn(hex: string): string {
  return hexLuminance(hex) > 0.55 ? '#0E0E25' : '#FFFFFF';
}

/* ---------- Color science: ΔE in CIELAB ---------- */

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const v = hex.replace('#', '');
  if (v.length < 6) return { r: 0, g: 0, b: 0 };
  return {
    r: parseInt(v.slice(0, 2), 16),
    g: parseInt(v.slice(2, 4), 16),
    b: parseInt(v.slice(4, 6), 16),
  };
}

/** sRGB channel → linear-light value. */
function srgbToLinear(c: number): number {
  const x = c / 255;
  return x <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
}

/** sRGB (0–255) → CIE XYZ (D65 reference white). */
function rgbToXyz(r: number, g: number, b: number): { x: number; y: number; z: number } {
  const lr = srgbToLinear(r);
  const lg = srgbToLinear(g);
  const lb = srgbToLinear(b);
  return {
    x: lr * 0.4124564 + lg * 0.3575761 + lb * 0.1804375,
    y: lr * 0.2126729 + lg * 0.7151522 + lb * 0.072175,
    z: lr * 0.0193339 + lg * 0.119192 + lb * 0.9503041,
  };
}

/** XYZ → CIELAB (D65). */
function xyzToLab(x: number, y: number, z: number): { L: number; a: number; b: number } {
  const xn = 0.95047;
  const yn = 1.0;
  const zn = 1.08883;
  const f = (t: number) =>
    t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116;
  const fx = f(x / xn);
  const fy = f(y / yn);
  const fz = f(z / zn);
  return {
    L: 116 * fy - 16,
    a: 500 * (fx - fy),
    b: 200 * (fy - fz),
  };
}

export function hexToLab(hex: string): { L: number; a: number; b: number } {
  const { r, g, b } = hexToRgb(hex);
  const { x, y, z } = rgbToXyz(r, g, b);
  return xyzToLab(x, y, z);
}

/**
 * CIE76 ΔE — Euclidean distance in CIELAB space. Simpler than ΔE 2000 but
 * sufficient for "are these colors visually similar?" classification.
 *
 * Rule of thumb:
 *   ΔE  1   — just-noticeable difference (lab conditions)
 *   ΔE  2–3 — noticeable to a careful observer
 *   ΔE  5   — clearly different in side-by-side comparison
 *   ΔE 10+  — different at a glance
 *   ΔE 50+  — opposite colors
 */
export function deltaE76(hex1: string, hex2: string): number {
  const a = hexToLab(hex1);
  const b = hexToLab(hex2);
  const dL = a.L - b.L;
  const da = a.a - b.a;
  const db = a.b - b.b;
  return Math.sqrt(dL * dL + da * da + db * db);
}

export type ConfDescriptor = {
  conf: Conf;
  /** Raw ΔE value (rounded to 1 decimal for display). */
  deltaE: number;
  description: string;
};

/**
 * Translate a Fiori-vs-RDS hex pair into a high/medium/low confidence rating
 * driven by perceptual color distance. Thresholds picked for design-systems
 * use: high means the swap is visually neutral, low means the colors are
 * clearly different and need brand/QA sign-off.
 */
export function computeConfidence(fioriHex: string, rdsHex: string): ConfDescriptor {
  const dE = Math.round(deltaE76(fioriHex, rdsHex) * 10) / 10;
  if (dE < 5) {
    return {
      conf: 'high',
      deltaE: dE,
      description: 'Visually very close to the Fiori original — most users will not notice the swap.',
    };
  }
  if (dE < 15) {
    return {
      conf: 'medium',
      deltaE: dE,
      description: 'Same semantic role with a perceptible shift in hue, saturation, or lightness.',
    };
  }
  return {
    conf: 'low',
    deltaE: dE,
    description: 'Substantially different color — the brand intent is preserved but the visual reads differently.',
  };
}

export function allMappings(): Mapping[] {
  return Object.values(SWAPS).flat();
}

export function leafName(token: string): string {
  const parts = token.split('/');
  return parts[parts.length - 1];
}

export function resolvedHex(
  m: Mapping,
  mode: Mode,
  src: Source,
  rdsChoices: RdsChoices = {},
): string {
  if (src === 'fiori') {
    switch (mode) {
      case 'morning': return m.fioriLight;
      case 'evening': return m.fioriDark;
      case 'hcWhite': return m.fioriHcWhite;
      case 'hcBlack': return m.fioriHcBlack;
    }
  }
  return resolveRds(m, mode, rdsChoices).hex;
}

export function getChoice(choices: Choices, token: string): Source {
  return choices[token] ?? 'rds';
}

/**
 * RDS semantic intent tokens — extracted in full from the RDS 3.1
 * "Color Mode Token" collection (75 opaque tokens; alpha-only variants
 * are excluded since they don't participate in opaque hex matching).
 *
 * Source: Figma file `tu2YE7Y6bmgkmcdIqCJpLk` · re-pulled 2026-05-20.
 */
export type RdsSemanticToken = { name: string; light: string; dark: string };

export const RDS_SEMANTICS: RdsSemanticToken[] = [
  { name: 'Brand/Reltio Blue',     light: '#000066', dark: '#FFFFFF' },
  { name: 'Brand/Reltio Cobalt',   light: '#0000CC', dark: '#FFFFFF' },
  { name: 'Brand/Reltio Midnight', light: '#000033', dark: '#FFFFFF' },
  { name: 'Brand/Reltio Gold',     light: '#FFCC00', dark: '#FFCC00' },
  { name: 'Brand/Reltio Aqua',     light: '#00FFFF', dark: '#00FFFF' },

  { name: 'Background/Base Section', light: '#F5F5FA', dark: '#000000' },
  { name: 'Background/Surface 1',    light: '#FFFFFF', dark: '#0E0E25' },
  { name: 'Background/Surface 2',    light: '#F5F5FA', dark: '#262640' },
  { name: 'Background/Surface 3',    light: '#E3E3F2', dark: '#434370' },
  { name: 'Background/Surface 4',    light: '#FFFFFF', dark: '#303050' },
  { name: 'Background/Dark BG',      light: '#56568F', dark: '#E3E3F2' },
  { name: 'Background/Darker BG',    light: '#303050', dark: '#F5F5FA' },
  { name: 'Background/Black BG',     light: '#0E0E25', dark: '#FFFFFF' },
  { name: 'Background/Forced White', light: '#FFFFFF', dark: '#FFFFFF' },

  { name: 'Outline-Border/Surface Border 1', light: '#F5F5FA', dark: '#262640' },
  { name: 'Outline-Border/Surface Border 2', light: '#E3E3F2', dark: '#56568F' },
  { name: 'Outline-Border/Surface Border 3', light: '#BABADE', dark: '#434370' },
  { name: 'Outline-Border/Surface Border 4', light: '#F5F5FA', dark: '#7070A9' },
  { name: 'Outline-Border/Dark Container',   light: '#434370', dark: '#BABADE' },
  { name: 'Outline-Border/Darker Container', light: '#262640', dark: '#E3E3F2' },
  { name: 'Outline-Border/Black Container',  light: '#0E0E25', dark: '#FFFFFF' },

  { name: 'Fonts & Icons/Default',      light: '#0E0E25', dark: '#E3E3F2' },
  { name: 'Fonts & Icons/Descriptions', light: '#56568F', dark: '#BABADE' },
  { name: 'Fonts & Icons/Placeholder',  light: '#7070A9', dark: '#8D8DC8' },
  { name: 'Fonts & Icons/disabled',     light: '#BABADE', dark: '#56568F' },
  { name: 'Fonts & Icons/White',        light: '#FFFFFF', dark: '#0E0E25' },
  { name: 'Fonts & Icons/Forced White', light: '#FFFFFF', dark: '#FFFFFF' },
  { name: 'Fonts & Icons/Forced Black', light: '#0E0E25', dark: '#0E0E25' },
  { name: 'Fonts & Icons/Links & Text', light: '#3333FF', dark: '#B2B2FF' },

  { name: 'Primary/Base',           light: '#0000CC', dark: '#6161FF' },
  { name: 'Primary/Hover',          light: '#000066', dark: '#0A0AFF' },
  { name: 'Primary/CTA Black Font', light: '#0000CC', dark: '#FFFFFF' },
  { name: 'Secondary/Default',      light: '#000033', dark: '#000033' },
  { name: 'Secondary/Hover',        light: '#000066', dark: '#000066' },
  { name: 'Secondary/Border',       light: '#000033', dark: '#000033' },
  { name: 'Secondary/Soft fill',    light: '#B2B2FF', dark: '#B2B2FF' },

  { name: 'Success/Default',   light: '#449977', dark: '#449977' },
  { name: 'Success/Hover',     light: '#1F4737', dark: '#10231B' },
  { name: 'Success/Border',    light: '#2F6A52', dark: '#2F6A52' },
  { name: 'Success/Soft fill', light: '#DCEFE7', dark: '#1F4737' },
  { name: 'Success/Font',      light: '#2F6A52', dark: '#449977' },

  { name: 'Error/Default',   light: '#EE3333', dark: '#EE3333' },
  { name: 'Error/Hover',     light: '#8E0B0B', dark: '#8E0B0B' },
  { name: 'Error/Border',    light: '#5E0808', dark: '#5E0808' },
  { name: 'Error/Soft fill', light: '#FDE7E7', dark: '#FDE7E7' },
  { name: 'Error/Font',      light: '#BD0F0F', dark: '#EE3333' },

  { name: 'Warning/Default',   light: '#FFCC00', dark: '#FFCC00' },
  { name: 'Warning/Hover',     light: '#9E4F00', dark: '#FFAA00' },
  { name: 'Warning/Border',    light: '#CC7700', dark: '#CC7700' },
  { name: 'Warning/Soft fill', light: '#FFF5CC', dark: '#FFF5CC' },
  { name: 'Warning/Font',      light: '#CC7700', dark: '#FFCC00' },

  { name: 'Pink/Base',      light: '#FF44AA', dark: '#FF44AA' },
  { name: 'Pink/Hover',     light: '#8E0B52', dark: '#8E0B52' },
  { name: 'Pink/Border',    light: '#BD0F6E', dark: '#BD0F6E' },
  { name: 'Pink/Soft fill', light: '#FFE5F3', dark: '#FFE5F3' },
  { name: 'Pink/Font',      light: '#EC1389', dark: '#FF44AA' },

  { name: 'Purple/Default',  light: '#6611CC', dark: '#6611CC' },
  { name: 'Purple/Hover',    light: '#2F0561', dark: '#2F0561' },
  { name: 'Purple/Border',   light: '#460891', dark: '#460891' },
  { name: 'Purple/Soft fill',light: '#E4D0FB', dark: '#E4D0FB' },
  { name: 'Purple/Font',     light: '#6611CC', dark: '#AD72F3' },

  { name: 'Orange/Default',  light: '#EE6611', dark: '#EE6611' },
  { name: 'Orange/Hover',    light: '#5F2907', dark: '#5F2907' },
  { name: 'Orange/Border',   light: '#BE520E', dark: '#BE520E' },
  { name: 'Orange/Soft fill',light: '#FCE0CF', dark: '#F18541' },
  { name: 'Orange/Font',     light: '#BE520E', dark: '#EE6611' },

  { name: 'Lime/Default',  light: '#6B9900', dark: '#CCFF55' },
  { name: 'Lime/Hover',    light: '#6B9900', dark: '#6B9900' },
  { name: 'Lime/Border',   light: '#B2FF00', dark: '#B2FF00' },
  { name: 'Lime/Soft fill',light: '#F0FFCC', dark: '#F0FFCC' },
  { name: 'Lime/Font',     light: '#6B9900', dark: '#CCFF55' },

  { name: 'Aqua/Default',  light: '#00FFFF', dark: '#00FFFF' },
  { name: 'Aqua/Hover',    light: '#006666', dark: '#006666' },
  { name: 'Aqua/Border',   light: '#009999', dark: '#009999' },
  { name: 'Aqua/Soft fill',light: '#66FFFF', dark: '#66FFFF' },
  { name: 'Aqua/Font',     light: '#009999', dark: '#00FFFF' },
];

export type RdsTokenRef = { kind: 'primitive' | 'semantic'; name: string };

/**
 * Index every RDS token (primitive + semantic) by its hex value for the given
 * mode scheme. Powers the RDS palette swatch tooltips.
 */
export function buildRdsInternalHexIndex(
  scheme: 'light' | 'dark',
): Map<string, RdsTokenRef[]> {
  const map = new Map<string, RdsTokenRef[]>();
  const push = (hex: string, ref: RdsTokenRef) => {
    const key = hex.toUpperCase();
    const arr = map.get(key);
    if (arr) arr.push(ref);
    else map.set(key, [ref]);
  };
  for (const c of RDS_COLORS) {
    push(c.hex, { kind: 'primitive', name: c.label });
  }
  for (const sem of RDS_SEMANTICS) {
    push(scheme === 'light' ? sem.light : sem.dark, {
      kind: 'semantic',
      name: sem.name,
    });
  }
  return map;
}

/**
 * Index every mapped Fiori token by its resolved hex for the given mode.
 * Powers the Fiori palette swatch tooltips ("which other Fiori tokens share
 * this hex?"). Limited to the ~89 tokens currently in `SWAPS`.
 */
export function buildFioriHexIndex(mode: Mode): Map<string, Mapping[]> {
  const map = new Map<string, Mapping[]>();
  for (const m of allMappings()) {
    let hex: string;
    switch (mode) {
      case 'morning': hex = m.fioriLight; break;
      case 'evening': hex = m.fioriDark; break;
      case 'hcWhite': hex = m.fioriHcWhite; break;
      case 'hcBlack': hex = m.fioriHcBlack; break;
    }
    const key = hex.toUpperCase();
    const arr = map.get(key);
    if (arr) arr.push(m);
    else map.set(key, [m]);
  }
  return map;
}

export function countByConf(conf: Conf): number {
  return Object.values(SWAPS).reduce(
    (sum, arr) => sum + arr.filter((m) => m.conf === conf).length,
    0,
  );
}

export type ExportFormat = 'css' | 'overrides' | 'json';

export function buildExport(
  format: ExportFormat,
  mode: Mode,
  choices: Choices,
  rdsChoices: RdsChoices = {},
): string {
  const all = allMappings();
  const fioriKept = all.filter((m) => getChoice(choices, m.fiori) === 'fiori').length;
  const rdsSwapped = all.length - fioriKept;
  const label = modeLabel(mode);
  const header = [
    '/* Fiori → RDS 3.1 hot-swap · token names preserved from Fiori */',
    `/* Mode: ${label} · ${rdsSwapped} swapped to RDS, ${fioriKept} kept from Fiori */`,
  ];

  if (format === 'css' || format === 'overrides') {
    const lines: string[] = [...header];
    if (format === 'overrides') {
      lines.push(
        '/* Only tokens swapped to RDS - drop into your Fiori theme override sheet. */',
      );
    }
    lines.push(':root {');
    for (const m of all) {
      const src = getChoice(choices, m.fiori);
      if (format === 'overrides' && src === 'fiori') continue;
      const hex = resolvedHex(m, mode, src, rdsChoices);
      const name = leafName(m.fiori);
      let note: string;
      if (src === 'fiori') {
        note = 'kept from Fiori';
      } else {
        const r = resolveRds(m, mode, rdsChoices);
        if (r.id.startsWith('#')) {
          note = `→ Blended midpoint ${r.hex}`;
        } else if (r.isExplicit) {
          note = `→ RDS ${r.label} (custom)`;
        } else {
          note = `→ RDS ${r.label}`;
        }
      }
      lines.push(`  --${name}: ${hex}; /* ${note} */`);
    }
    lines.push('}');
    return lines.join('\n');
  }

  const obj: Record<
    string,
    {
      value: string;
      source: 'fiori' | 'rds-3.1' | 'custom-blend';
      rdsReference?: string;
      rdsCustom?: boolean;
    }
  > = {};
  for (const m of all) {
    const src = getChoice(choices, m.fiori);
    const hex = resolvedHex(m, mode, src, rdsChoices);
    const name = leafName(m.fiori);
    if (src === 'fiori') {
      obj[name] = { value: hex, source: 'fiori' };
    } else {
      const r = resolveRds(m, mode, rdsChoices);
      if (r.id.startsWith('#')) {
        obj[name] = { value: hex, source: 'custom-blend' };
      } else {
        obj[name] = {
          value: hex,
          source: 'rds-3.1',
          rdsReference: r.label,
          ...(r.isExplicit ? { rdsCustom: true } : {}),
        };
      }
    }
  }
  return [
    `// Mode: ${label}`,
    `// ${rdsSwapped} swapped to RDS, ${fioriKept} kept from Fiori`,
    JSON.stringify(obj, null, 2),
  ].join('\n');
}
