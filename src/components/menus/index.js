import "./menu.css";

const BunnyMenu = ({className, id}) => {
  return (
    <ul className={`${className} bunny-menu`} id={id}>
      <li><a href="#home-view">Home</a></li>
      <li><a href="#mint-section">Stake</a></li>
      <li><a href="#no-video-section">Inventory</a></li>
    </ul>
  );
};

export default BunnyMenu;
