import { SendOutlined, TwitterOutlined } from "@ant-design/icons";
import './social-menu.css';

const SocialMenu = ({ className, id }) => {
  return (
    <ul className={`${className} social-menu`} id={id}>
      <li>
        <a href="https://t.me/NOWMETA" target="_blank">
          <SendOutlined />
        </a>
      </li>
      <li>
        <a href="https://twitter.com/NowMetaNews" target="_blank">
          <TwitterOutlined />
        </a>
      </li>
    </ul>
  )
}

export default SocialMenu;