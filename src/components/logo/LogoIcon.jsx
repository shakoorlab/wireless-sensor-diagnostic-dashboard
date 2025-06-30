// material-ui
// import { useTheme } from '@mui/material/styles';

import logoIcon from '../../assets/images/icons/logo-icon2.png';
/**
 * if you want to use image instead of <svg> uncomment following.
 *
 * import logoIconDark from 'assets/images/logo-icon-dark.svg';
 *
 * import { ThemeMode } from 'config';
 *
 */

// ==============================|| LOGO ICON SVG ||============================== //

export default function LogoIcon() {
  // const theme = useTheme();

  return (
    <img src={logoIcon} alt="PheNode" width="30" />
    //  <img src={theme.palette.mode === ThemeMode.DARK ? logoIconDark : logoIcon} alt="Mantis" width="100" />
  );
}
