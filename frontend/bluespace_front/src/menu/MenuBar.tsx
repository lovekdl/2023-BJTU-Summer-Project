
import PropTypes from 'prop-types';
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { useNavigate } from 'react-router-dom';
import "./menu.css"
import MenuScroll from './MenuScroll';
const styles = createStyles({
  root: {
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
});

export interface Props extends WithStyles<typeof styles> {}

function ButtonAppBar(props: Props) {
  const { classes } = props;
  const navigate = useNavigate()
  const handleClicked = () =>{
    console.log("clicked")
    navigate('/login', {replace:false})
  }

  return (
    <div className='menu'>
      <AppBar color='inherit' position='static'>
        <Toolbar className = 'TollBar'>
          <IconButton  color="inherit" aria-label="Menu">
            <MenuIcon />
          </IconButton>
          
          <MenuScroll></MenuScroll>


          <Typography variant="h6" color="inherit" className={classes.grow}>
            BLUE SPACE
          </Typography>
          <Button color="inherit" onClick={handleClicked}>Login</Button>
        </Toolbar>
      </AppBar>
    </div>
  );
}

ButtonAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
} as any;

export default withStyles(styles)(ButtonAppBar);