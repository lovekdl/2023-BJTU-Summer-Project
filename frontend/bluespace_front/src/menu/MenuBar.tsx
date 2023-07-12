
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
import {useStore} from '../store/index'
import {Avatar} from 'antd'
import { observer } from 'mobx-react-lite'
import { Dropdown, message, Space } from 'antd';
import '../index.tsx';
import {useTranslation} from 'react-i18next'
import {setLanguageFromLocalStorage} from "../utils/token"
import {
  UserOutlined,DownOutlined 
} from "@ant-design/icons";
import type { MenuProps } from 'antd';
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
  const {ProfileStore,loginStore} = useStore()

  const handleAvatarOnClicked = ()=> {
    navigate("/profile", {replace:false});
  }
  const {t,i18n} = useTranslation()

  const items: MenuProps['items'] = [
    {
      label: 'English',
      key: '1',
    },
    {
      label: '中文',
      key: '2',
    },
    {
      label: '日本語',
      key: '3',
    },
  ];
  const onClick: MenuProps['onClick'] = ({ key }) => {
    
    if(key === '1') {
      setLanguageFromLocalStorage('en')
      i18n.changeLanguage('en')
      message.success('change language to english')
    }
    if(key === '2') {
      setLanguageFromLocalStorage('zh')
      i18n.changeLanguage('zh')
      message.success('已切换至中文')
    }
    if(key === '3') {
      setLanguageFromLocalStorage('jp')
      i18n.changeLanguage('jp')
      message.success('日本語に切り替えました')
    }
  };
  

  return (
    
    <div className='menu'>
      
      <AppBar color='inherit' position='static'>
        <Toolbar className = 'TollBar'>
        
          
          <MenuScroll></MenuScroll>
          <Dropdown menu={{ items, onClick }} className='Dropdown'>
            <a onClick={(e) => e.preventDefault()}>
                <Space>
                  {t('lang')}
                <DownOutlined />
              </Space>
            </a>
          </Dropdown>

          <Typography variant="h6" color="inherit" className={classes.grow}>
            BLUE SPACE
          </Typography>
          {loginStore.token===''? <Button color="inherit" onClick={handleClicked}>Login</Button> : (ProfileStore.avatar===''?<Avatar className = 'MenuAvatar' size={50}  onClick ={handleAvatarOnClicked} icon={<UserOutlined />} />:<Avatar className = 'MenuAvatar' size={50} onClick ={handleAvatarOnClicked} src={<img src={ProfileStore.avatar}  alt="avatar" /> } />)}
          
        </Toolbar>
      </AppBar>
    </div>
  );
}

ButtonAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
} as any;

export default withStyles(styles)(observer(ButtonAppBar));