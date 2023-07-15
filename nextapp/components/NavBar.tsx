import React from 'react';
import { IconButton } from '@fluentui/react/lib/Button';
import { IButtonStyles , Layer , Text ,FontWeights,Panel } from '@fluentui/react';
import { useBoolean} from '@fluentui/react-hooks';
import { mergeStyles, AnimationClassNames, Customizer } from '@fluentui/react';
//import { mergeStyles, AnimationClassNames } 
//import { Customizer } from '@fluentui/lib/Utilities';

//import './Navbar.scss';

interface NavbarProps{
  layerHostId : string
}
const NavBar = (props:NavbarProps) => {
  const [isPanelOpen, { setTrue: showPanel, setFalse: dismissPanel }] = useBoolean(false);
  
  const [scrollState, setScrollState] = React.useState("top");
  const [colorOpacity,setColorOpacity] = React.useState(0);

  const iconStyles: IButtonStyles = {
    root: {
      color: 'blue',
      fontSize: 16,
      fontWeight: FontWeights.regular,
      
    },
  };
  const layerStyles = mergeStyles([
    {
        backgroundColor:"",
        color:"black",
        lineHeight:'50px',
        padding:'0 20px',
        opacity:'0'

    },
    AnimationClassNames.scaleUpIn100,
]);
//rgba(255, 0, 0, ${colorOpacity})
  return(
      <div>
    <Layer hostId = {props.layerHostId} >
      <div className = {layerStyles} style = {{backgroundColor:"whitesmoke"}}>
        <div style={{margin:"0 20px"}}>
        <Text className='brand'> 
          Dev & Ops
        </Text>
        <div style = {{float:"right"}}>
      {/* <IconButton iconProps={{ iconName: 'ShoppingCart' }} onClick = {showPanel} styles={iconStyles} title="Add" ariaLabel="Add" aria-hidden = {false} /> */}
      </div>
      </div>
      </div>
      
        
    </Layer>

    <Customizer >
        {isPanelOpen && (
          <Panel
            isOpen
            hasCloseButton
            headerText="Cart"
            onDismiss={dismissPanel}
          >
            <h2>Panel</h2>
          </Panel>
        )}
      </Customizer>
      </div>
    );
    
    
     
}

export default NavBar;