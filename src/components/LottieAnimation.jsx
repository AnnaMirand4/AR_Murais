import Lottie from "react-lottie";
import animationData from "../assets/peixe.svg"

const LottieAnimation = () => {
    return (
      <Lottie
        options={{
          animationData,
          loop: true,
          autoplay: true, 
        }}
        height={100}
        width={100}
      />
    );
  };

  export default LottieAnimation