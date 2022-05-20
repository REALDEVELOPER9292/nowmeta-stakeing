import { Layout, Row, Col } from "antd";
import { FooterImage } from "constants/image-constant";
import "./footer.css";
import BunnyMenu from "components/menus";
import SocialMenu from "components/social-menu";

const { Footer } = Layout;
const {FooterLogo, Bunny } = FooterImage;

const BunnyFooter = () => {
  return (
    <Footer id="bunny-footer">
      <Col className="bunny-in-row">
        <Row id="footer-main-row" align="middle" className="space-between">
          <img src={FooterLogo} alt="logo" className="bunny-logo" />
          <BunnyMenu id="footer-menu"/>
        </Row>
        <Row id="social-row" justify="end">
         <SocialMenu id="social-menu"/>
        </Row>
      </Col>
    </Footer>
  );
};

export default BunnyFooter;
