// import React, { useState } from 'react';
// import ProfileContainer from './components/ProfileContainer';
// import GameContainer from './components/GameContainer';
// import './App.css';
// import './components/styles/MasterContainer.css';

// function App() {
//     const [isProfileCollapsed, setIsProfileCollapsed] = useState(false);

//     const toggleProfileCollapse = () => {
//         setIsProfileCollapsed(prevState => !prevState);
//     };

//     return (
//         <div className="master-container">
//             {!isProfileCollapsed && <ProfileContainer />}
//             <GameContainer toggleProfileCollapse={toggleProfileCollapse} />
//         </div>
//     );
// }

// export default App;



import React from 'react';
import MasterContainer from './components/MasterContainer';
import './App.css';

function App() {
    return <MasterContainer />;
}

export default App;
