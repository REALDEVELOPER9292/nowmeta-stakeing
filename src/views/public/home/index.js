import { useEffect, useState } from "react";
import { Layout, Row, Col } from "antd";
import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import Swal from "sweetalert2";
import { injected } from "configs/connectors";
import { accountProcess } from "components/utils";
import { SharedMedia } from "constants/media-contstant";
import {
  HeaderImage,
  SharedImage,
  Mint,
  Inventory
} from "constants/image-constant";

import WOW from "wowjs";

import Spinner from "components/spinner";
import Card from "components/card";

import "./home.css";

import TokenArtifact from '../../../abi/NowMeta.json';
import StakingArtifact from '../../../abi/Staking.json';
import { getConfirmLocale } from "antd/lib/modal/locale";

const { Content } = Layout;
const { Smoke } = SharedMedia;
const { DarkJungle, BannerText } = HeaderImage;
const { ConnectBtn, DiscordBtn } = SharedImage;
const { InventoryLabel, ArrowUp } = Inventory;

const { Hero } = Mint;

let token, staking;
const tokenAddress = "0x113fe181730C9eE8351BA86b1B511d6bCf8C15e6";
const stakingAddress = "0xFdFAFc987D9E7AB4e10e2BD8bc593D7D005fA641";

const HomeView = () => {

  const { activate, account, library } = useWeb3React();

  const [stakeAmount, setStakeAmount] = useState(1);
  const [pending, setPending] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [stakes, setStakes] = useState(null);
  const [inventoryOpen, setInventoryOpen] = useState(false);


  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 5000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  })

  const connectWallet = () => {
    if (window.ethereum) {
      try {
        activate(injected);
        Toast.fire({
          icon: 'success',
          title: 'Wallet connected.'
        })
      } catch (e) {
        console.log(e);
        Toast.fire({
          icon: 'error',
          title: 'Faild to connect wallet.'
        })
        window.open('https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en', '_blank', 'popup')
      }
    }
    else {
      Toast.fire({
        icon: 'warning',
        title: 'Please install Metamask.'
      })
    }
  }

  const inventoryControl = () => {
    if (account) {
      setInventoryOpen(!inventoryOpen);
    }
    else {
      connectWallet();
    }
  }

  const stakeToken = async () => {
    setPending(true);
    try {
      var tx = await token.approve(stakingAddress, ethers.utils.parseUnits(String(stakeAmount), 8));
      await tx.wait();
      tx = await staking.stakeToken(ethers.utils.parseUnits(String(stakeAmount), 8));
      await tx.wait();
      setPending(false);
      Swal.fire({
        color: '#666666',
        title: 'Sucessfully staked.',
        icon: 'info',
        html:
          'You can view transaction on explorer.',
        showCloseButton: true,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: 'View on Explorer',
        cancelButtonText: 'Close'
      }).then(res => {
        if (res.isConfirmed) {
          window.open(`https://${window.ethereum.networkVersion == '56' ? 'bscscan.com/tx/' : 'testnet.bscscan.com/tx/'}${tx.hash}`, '_blank');
        }
      })
      fetchStakes();
    } catch (err) {
      console.log(err);
      setPending(false);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something was long.',
        showConfirmButton: true,
        confirmButtonColor: '#777777',
        confirmButtonText: 'Close'
      })
    }
  }

  const getClaimable = async (id) => {
    console.log('ID', id);
    const fetchedClaimable = await staking.getClaimable(id);
    console.log("Claimable", fetchedClaimable);
    return fetchedClaimable.toNumber();
  }

  const fetchStakes = async () => {
    if (account) {
      const fetchedStakes = await staking.getStakesByStaker(account);
      console.log(fetchedStakes);
      const correctedStakes = [];
      fetchedStakes.map((stake, index) => {
        console.log("Stake", stake);
        getClaimable(stake.id.toNumber()).then(claimable_ => {
          correctedStakes.push({ index: index, claimable: claimable_, stakeObj: stake });
        }).catch(e => {
          console.log(e);
        });
      })
      setStakes(correctedStakes);
      console.log(stakes);
      setInventoryOpen(false);
    }
  }

  const claimToken = async (id) => {
    try {
      setClaiming(true);
      const tx = await staking.claimReward(id);
      await tx.wait();
      Swal.fire({
        color: '#666666',
        title: 'Sucessfully claimed.',
        icon: 'info',
        html:
          'You can view transaction on explorer.',
        showCloseButton: true,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: 'View on Explorer',
        cancelButtonText: 'Close'
      }).then(res => {
        if (res.isConfirmed) {
          window.open(`https://${window.ethereum.networkVersion == '56' ? 'bscscan.com/tx/' : 'testnet.bscscan.com/tx/'}${tx.hash}`, '_blank');
        }
      })
      fetchStakes();
      setClaiming(false);
    } catch (e) {
      setClaiming(false);
      Toast.fire({
        icon: 'error',
        title: 'Faild to claim reward. Try again later.'
      });
      console.log(e);
    }
  }

  const unStake = async (id, claimable) => {
    try {
      if (claimable > 0) {
        Toast.fire({
          icon: 'info',
          title: 'You can claim reward before unstake.'
        })
      }
      setClaiming(true);
      const tx = await staking.unStake(id);
      await tx.wait();
      Swal.fire({
        color: '#666666',
        title: 'Sucessfully unstaked.',
        icon: 'info',
        html:
          'You can view transaction on explorer.',
        showCloseButton: true,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: 'View on Explorer',
        cancelButtonText: 'Close'
      }).then(res => {
        if (res.isConfirmed) {
          window.open(`https://${window.ethereum.networkVersion == '56' ? 'bscscan.com/tx/' : 'testnet.bscscan.com/tx/'}${tx.hash}`, '_blank');
        }
      })
      fetchStakes();
      setClaiming(false);
    } catch (e) {
      setClaiming(false);
      Toast.fire({
        icon: 'error',
        title: 'Faild to unstake. Try again later.'
      });
      console.log(e);
    }
  }

  useEffect(async () => {
    if (account) {
      const TOKEN = await new ethers.ContractFactory(TokenArtifact.abi, TokenArtifact.deployedBytecode, library?.getSigner());
      const STAKING = await new ethers.ContractFactory(StakingArtifact.abi, StakingArtifact.deployedBytecode, library?.getSigner());

      token = await TOKEN.attach(tokenAddress);
      staking = await STAKING.attach(stakingAddress);

      fetchStakes();
      getClaimable(0);
    }

    new WOW.WOW().init();
  }, [account]);
  return (
    <Content id="home-view">
      {/* Landing Section */}

      <Row id="landing-section" justify="center">
        <video id="banner-video" src={Smoke} muted autoPlay loop />
        <img id="banner-video" alt="dark-jungle" className="dark-jungle" src={DarkJungle} />
        <a className="wow fadeInUp" id="connect-discord" href="https://discord.gg/u9JY9kAQy5" target="_blank">
          <img
            src={DiscordBtn}
            alt="connect-discord"
          />
        </a>
        <Col align="middle" className="bunny-in-row wow zoomInUp">
          {/* <h1>Blase bunny universe is arriving</h1> */}
          <img className="banner-text" src={BannerText} alt="Banner Text" />
          <div onClick={connectWallet}>
            {
              account ? <div className="disconnect-account"><a href="#mint-section">{`STAKE NOW: ${accountProcess(account)}`}</a></div> : <img src={ConnectBtn} id="connect-btn" alt="wallet-connect" />
            }
          </div>
        </Col>
      </Row>

      <Row className="staking-section" id="mint-section" justify="center" align="middle">
        <Col className="mint-box" align="center" span={8}>
          <span className="mint-border"></span>
          <span className="mint-border"></span>
          <span className="mint-border"></span>
          <span className="mint-border"></span>
          <div className="mint-board">
            <img alt="mint-hero" src={Hero} width="400px" style={{ border: "1px solid #ffffff", borderRadius: "3px" }} />
          </div>
          {
            pending ? <Spinner /> : <div className="flex row stake-confirm">
              <input min={1} type="number" value={stakeAmount} onChange={e => setStakeAmount(e.target.value)} className="flex stake-value" disabled={account ? false : true} />
              <button className="flex mint-button" disabled={account ? false : true} onClick={stakeToken}>PLACE STAKE</button>
            </div>
          }
        </Col>
      </Row>
      <Row className="inventory-header" justify="center" align="middle">
        <div className="flex col inventory-label" onClick={inventoryControl}>
          <img alt="My Staking Inventory" src={InventoryLabel} className="flex inventory-label-image" />
        </div>
      </Row>
      <Row id="no-video-section" justify="center" align="middle" style={inventoryOpen ? { height: '600px' } : { height: '0px', border: '0px' }}>
        {
          stakes === null ? <>
            <Card loading={true} />
            <Card loading={true} />
            <Card loading={true} />
            <Card loading={true} />
            <Card loading={true} />
            <Card loading={true} />
            <Card loading={true} />
          </> : stakes.map((stake, key) => (
            <Card key={key} loading={false} stakedAmount={stake.stakeObj.amount.toNumber()} stakeTime={stake.stakeObj.stakeTimeStamp.toNumber()} lastUpdateTime={stake.stakeObj.lastClaimTimeStamp.toNumber()} claimable={stake.claimable} onClaim={() => claimToken(stake.stakeObj.id.toNumber())} onUnstake={() => unStake(stake.stakeObj.id.toNumber(), stake.claimable)} pending={claiming} />
          ))
        }
      </Row>
    </Content>
  );
};

export default HomeView;
