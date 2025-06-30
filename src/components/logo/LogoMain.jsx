import PropTypes from 'prop-types';
// material-ui
// import { useTheme } from '@mui/material/styles';

// project-import
// import { ThemeMode } from 'config';

import logo from '../../assets/images/logo/logo.png';
/**
 * if you want to use image instead of <svg> uncomment following.
 *
 * import logoDark from 'assets/images/logo-dark.svg';
 * import logo from 'assets/images/logo.svg';
 *
 */

// ==============================|| LOGO SVG ||============================== //

export default function LogoMain() {
  // const theme = useTheme();

  return (
    <img src={logo} alt="PheNode" width="200" />
    /**
     * if you want to use image instead of svg uncomment following, and comment out <svg> element.
     *
     *
     *<img src={theme.palette.mode === ThemeMode.DARK ? logoDark : logo} alt="Mantis" width="100" />
     */
  );
}

LogoMain.propTypes = { reverse: PropTypes.bool };
