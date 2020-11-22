import React from "react";
import { useContext } from "react";
import AppContext from "./../../contexts/AppContext";
import { AVATARS, PLAYER_STATS } from "../../utils/constants";
import "./Profile.scss";

function Profile(props) {
  const { user } = useContext(AppContext);

  return (
    <div className='Profile'>
      <div className="avatar" style={AVATARS[user.equippedSkin].style} onClick={props.onChangeAvatar}>
        <div className="avatarMouth" />
      </div>
      <br />
      <button className='button changeAvatarButton' onClick={props.onChangeAvatar}>Change Avatar</button>

      <div className='stats'>
        <div className='statsTable'>
          <table>
            <tbody>
              {Object.keys(PLAYER_STATS).map((stat, index) => (
                <tr key={index}>
                  <td className='statsLabel'>{PLAYER_STATS[stat]}:</td>
                  {/* TODO */}
                  <td>TODO</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Profile;
