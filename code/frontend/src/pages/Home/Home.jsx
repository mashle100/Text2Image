import React,{useState,useEffect} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
function NewComponent(){
  const navigate = useNavigate();
  const username = localStorage.getItem("username"); // Get the logged-in username
  const [imageCount, setImageCount] = useState(0);
  const [images, setImages] = useState([]);
  
  const handleGenerate = () => {
    
    navigate('/detail');

  };
  const handleSetting = () => {
    navigate('/settings');
  };

  const handlehistory=()=>{
    navigate('/history');
  }

  const handleLogin =()=>{
     navigate('/login');
  }
    
    useEffect(() => {
      const fetchImageCount = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/image-count/${username}`);
          setImageCount(response.data);
        } catch (error) {
          console.error("Error fetching image count:", error);
          alert("Could not fetch the image count. Please try again later.");
        }
      };
      const fetchImages = async () => {
        try {
          const response = await axios.get(`http://localhost:8000/images/${username}`);
          const fetchedImages = response.data.images.map((image) => `data:image/png;base64,${image.image}`);
          setImages(fetchedImages);
        } catch (error) {
          console.error("Error fetching images:", error);
        }
      };
  
      
      if (username) {
        fetchImages();
        fetchImageCount();
      }
    }, [username]);
    return (
      <div>
        <link rel="preconnect" href="https://fonts.gstatic.com/" crossOrigin />
        <link rel="stylesheet" as="style" onload="this.rel='stylesheet'" href="https://fonts.googleapis.com/css2?display=swap&family=Inter%3Awght%40400%3B500%3B700%3B900&family=Noto+Sans%3Awght%40400%3B500%3B700%3B900" />
        <title>Artify</title>
        <link rel="icon" type="image/x-icon" href="data:image/x-icon;base64," />
        <div className="relative flex size-full min-h-screen flex-col bg-[#FFFFFF] group/design-root overflow-x-hidden" style={{fontFamily: 'Inter, "Noto Sans", sans-serif'}}>
          <div className="layout-container flex h-full grow flex-col">
            <div className="gap-1 px-6 flex flex-1  py-5">
              <div className="layout-content-container flex flex-col w-80">
                <div className="flex h-full min-h-[700px] flex-col justify-between bg-[#FFFFFF] p-4">
                  <div className="flex flex-col gap-4">
                    <div className="flex gap-3">
                      <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10" style={{backgroundImage: 'url("https://cdn.usegalileo.ai/stability/c6f349e0-fbfb-45f8-a4e1-25df5204718c.png")'}} />
                      <div className="flex flex-col">
                        <h1 className="text-black text-base font-medium leading-normal">Open Art</h1>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button className="flex items-center gap-3 px-3 py-2 rounded-xl bg-[#EEEEEE]"><p className="text-black text-sm font-medium leading-normal">Dashboard</p></button>
                      <button onClick ={handleGenerate} className="flex items-center gap-3 px-3 py-2"><p className="text-black text-sm font-medium leading-normal">Generate</p></button>
                      <button onClick={handlehistory} className="flex items-center gap-3 px-3 py-2"><p className="text-black text-sm font-medium leading-normal">History</p></button>
                      <button onClick={handleLogin} className="flex items-center gap-3 px-3 py-2"><p className="text-black text-sm font-medium leading-normal">Login</p></button>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div onClick ={handleSetting} className="flex items-center gap-3 px-3 py-2"><p className="text-black text-sm font-medium leading-normal">Settings</p></div>
                    <div className="flex items-center gap-3 px-3 py-2"><p className="text-black text-sm font-medium leading-normal">Help</p></div>
                    <div className="flex items-center gap-3 px-3 py-2"><p className="text-black text-sm font-medium leading-normal">Feedback</p></div>
                  </div>
                </div>
              </div>
              <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
                <div className="flex flex-wrap justify-between gap-3 p-4"><p className="text-black tracking-light text-[32px] font-bold leading-tight min-w-72">Dashboard</p></div>
                <h3 className="text-black text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">Recently generated images</h3>
                <div className="grid grid-cols-[repeat(auto-fit,minmax(100px,1fr))] gap-1 p-4">
  {images.slice(0, 4).map((image, index) => (
    <div key={index} className="flex items-center justify-center">
      <img
        src={image}
        alt={`Generated Image ${index + 1}`}
        className="object-cover rounded-xl"
      />
    </div>
  ))}
</div>
                <h3 className="text-black text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">New Image Generation</h3>
                <div className="flex items-center px-4 py-3 gap-3 @container">
                  <label className="flex flex-col min-w-40 h-full flex-1">
                    <div className="flex w-full flex-1 items-stretch rounded-xl h-full">
                      <div className="flex flex-1 flex-col">
                        <textarea placeholder="Tell us what to generate..." className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-black focus:outline-0 focus:ring-0 border border-[#DEDEDE] bg-[#FFFFFF] focus:border-[#DEDEDE] h-auto placeholder:text-[#C4C4C4] rounded-b-none border-b-0 text-base font-normal leading-normal" defaultValue={""} />
                        <div className="flex border border-[#DEDEDE] bg-[#FFFFFF] justify-end pr-[15px] rounded-br-xl border-l-0 border-t-0 px-[15px] pb-[15px]">
                          <div className="flex items-center gap-4 justify-end">
                            <div className="flex items-center gap-1">
                              <button className="flex items-center justify-center p-1.5">
                                <div className="text-[#6B6B6B]" data-icon="Lightbulb" data-size="20px" data-weight="regular">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" left= "10px" fill="currentColor" viewBox="0 0 256 256">
                                    <path d="M176,232a8,8,0,0,1-8,8H88a8,8,0,0,1,0-16h80A8,8,0,0,1,176,232Zm40-128a87.55,87.55,0,0,1-33.64,69.21A16.24,16.24,0,0,0,176,186v6a16,16,0,0,1-16,16H96a16,16,0,0,1-16-16v-6a16,16,0,0,0-6.23-12.66A87.59,87.59,0,0,1,40,104.49C39.74,56.83,78.26,17.14,125.88,16A88,88,0,0,1,216,104Zm-16,0a72,72,0,0,0-73.74-72c-39,.92-70.47,33.39-70.26,72.39a71.65,71.65,0,0,0,27.64,56.3A32,32,0,0,1,96,186v6h64v-6a32.15,32.15,0,0,1,12.47-25.35A71.65,71.65,0,0,0,200,104Zm-16.11-9.34a57.6,57.6,0,0,0-46.56-46.55,8,8,0,0,0-2.66,15.78c16.57,2.79,30.63,16.85,33.44,33.45A8,8,0,0,0,176,104a9,9,0,0,0,1.35-.11A8,8,0,0,0,183.89,94.66Z" />
                                  </svg>
                                </div>
                              </button>
                            </div>
                            <button onClick ={handleGenerate} className="min-w-[84px] px-4 h-8 bg-black text-white text-sm font-medium rounded-xl" style={{width:"135px"}}>
                              Generate
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </label>
                </div>
                <h3 className="text-black text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">Usage</h3>
                <div className="flex flex-wrap gap-4 p-4">
                  <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-6 border border-[#DEDEDE]">
                    <p className="text-black text-base font-medium leading-normal">Images generated</p>
                    <p className="text-black tracking-light text-2xl font-bold leading-tight">{imageCount}</p>
                  </div>
                  <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-6 border border-[#DEDEDE]">
                    <p className="text-black text-base font-medium leading-normal">Most popular prompts</p>
                    <p className="text-black tracking-light text-2xl font-bold leading-tight">cat, dog, landscape, abstract, flowers</p>
                  </div>
                </div>
                <h3 className="text-black text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">Account</h3>
                <div className="flex items-center gap-4 bg-[#FFFFFF] px-4 min-h-14 justify-between">
                  <p className="text-black text-base font-normal leading-normal flex-1 truncate">Upgrade plan</p>
                  <div className="shrink-0">
                    <div className="text-black flex size-7 items-center justify-center" data-icon="CaretRight" data-size="24px" data-weight="regular">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 bg-[#FFFFFF] px-4 min-h-14 justify-between">
                  <p className="text-black text-base font-normal leading-normal flex-1 truncate">Invite friends</p>
                  <div className="shrink-0">
                    <div className="text-black flex size-7 items-center justify-center" data-icon="CaretRight" data-size="24px" data-weight="regular">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 bg-[#FFFFFF] px-4 min-h-14 justify-between">
                  <p className="text-black text-base font-normal leading-normal flex-1 truncate">API keys</p>
                  <div className="shrink-0">
                    <div className="text-black flex size-7 items-center justify-center" data-icon="CaretRight" data-size="24px" data-weight="regular">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 bg-[#FFFFFF] px-4 min-h-14 justify-between">
                  <p className="text-black text-base font-normal leading-normal flex-1 truncate">Change plan</p>
                  <div className="shrink-0">
                    <div className="text-black flex size-7 items-center justify-center" data-icon="CaretRight" data-size="24px" data-weight="regular">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 bg-[#FFFFFF] px-4 min-h-14 justify-between">
                  <p className="text-black text-base font-normal leading-normal flex-1 truncate">Payment method</p>
                  <div className="shrink-0">
                    <div className="text-black flex size-7 items-center justify-center" data-icon="CaretRight" data-size="24px" data-weight="regular">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 bg-[#FFFFFF] px-4 min-h-14 justify-between">
                  <p className="text-black text-base font-normal leading-normal flex-1 truncate">Billing history</p>
                  <div className="shrink-0">
                    <div className="text-black flex size-7 items-center justify-center" data-icon="CaretRight" data-size="24px" data-weight="regular">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 bg-[#FFFFFF] px-4 min-h-14 justify-between">
                  <p className="text-black text-base font-normal leading-normal flex-1 truncate">Redeem coupon</p>
                  <div className="shrink-0">
                    <div className="text-black flex size-7 items-center justify-center" data-icon="CaretRight" data-size="24px" data-weight="regular">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 bg-[#FFFFFF] px-4 min-h-14 justify-between">
                  <p className="text-black text-base font-normal leading-normal flex-1 truncate">Use credits</p>
                  <div className="shrink-0">
                    <div className="text-black flex size-7 items-center justify-center" data-icon="CaretRight" data-size="24px" data-weight="regular">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
export default NewComponent;