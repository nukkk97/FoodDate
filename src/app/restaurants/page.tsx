"use client";
import {
  APIProvider,
  AdvancedMarker,
  Map,
  Marker,
} from "@vis.gl/react-google-maps";
import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { keyframes } from '@emotion/react';

const pulseAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.3); }
  100% { transform: scale(1); }
`
import {
  Divider,
  Stack,
  SpeedDial,
  SpeedDialAction,
  Typography,
  Modal,
  Box,
  Button,
  Tooltip
} from "@mui/material";
import NavigationIcon from '@mui/icons-material/Navigation';
import SettingsIcon from '@mui/icons-material/Settings';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SwapHorizontalCircleIcon from '@mui/icons-material/SwapHorizontalCircle';
import FavoriteIcon from '@mui/icons-material/Favorite';
import DensitySmallIcon from '@mui/icons-material/DensitySmall';
import QuizIcon from '@mui/icons-material/Quiz';
import CancelIcon from '@mui/icons-material/Cancel';

import SearchBar from "./_components/SearchBar";
import RestaurantCard from "./_components/RestaurantCard";
import { grey, red } from "@mui/material/colors";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const Wheel = dynamic(
  () => import('react-custom-roulette').then(mod => mod.Wheel),
  { ssr: false }
)
interface Restaurant {
  placeId: string,
  name: string,
  address: string,
  latitude: string,
  longitude: string,
  imageUrls: string,
}
interface Detail {
  placeId: string,
  type: string
}
type User = {
  avatarUrl: string;
  bio: string;
  coins: number;
  hashedPassword: string;
  ntuEmail: string;
  userId: string;
  username: string;
};
type Reviewer = {
  reviewId: string;
  placeId: string;
  reviewerId: string;
  stars: number;
  content: string;
  expense: number;
  createdAt: string;
};
type Review = {
  users: User;
  reviews: Reviewer;
};
type stringsOfPlaces = {
  placeId: string;
}
export default function RestaurantPage() {
  const [position, setPosition] = useState({
    lat: 25.01834354450372,
    lng: 121.53977457666448,
  });
  const [userPosition, setUserPosition] = useState({
    lat: 25.01834354450372,
    lng: 121.53977457666448,
  });
  const [restaurantName, setRestaurantName] = useState<string>("");
  const [restaurantAddress, setRestaurantAddress] = useState<string>("");
  const [types, setTypes] = useState<string[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selectRestaurant, setSelectRestaurant] = useState(false);
  const [SelectRestaurantDetail, setSelectRestaurantDetail] = useState<Detail[]>([]); //use selectRestaurantDetail[i].type to get types
  const [selectRestaurantName, setSelectRestaurantName] = useState("");
  const [selectRestaurantAddress, setSelectRestaurantAddress] = useState("");
  const [selectRestaurantLat, setSelectRestaurantLat] = useState<number>();
  const [selectRestaurantLng, setSelectRestaurantLng] = useState<number>();
  const [selectRestaurantPlaceId, setSelectRestaurantPlaceId] = useState("");
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant>();
  const [selectImageUrls, setSelectImageUrls] = useState([]);
  const initialized = useRef(false);
  const {data: session, status} = useSession();
  useEffect(() => {

    const fetchRestaurants = async () => {
      try {
        const response = await fetch('/api/restaurants');
        const data = await response.json();
        setRestaurants(data);
      } catch (error) {
        console.error('Error fetching restaurants:', error);
      }
    };

    fetchRestaurants();

  }, []);
  //useEffect(() => {
  //  console.log('Restaurants updated:', restaurants);
  //}, [restaurants]);

  useEffect(() => {
    let watcher: number | null = null;

    if (navigator.geolocation) {
      watcher = navigator.geolocation.watchPosition(
        (position) => {
          setUserPosition({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error Code = " + error.code + " - " + error.message);
        },
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
      );
    }

    // Cleanup function
    return () => {
      if (watcher !== null) {
        navigator.geolocation.clearWatch(watcher);
      }
    };
  }, [userPosition]);


  const [showRoulette, setShowRoulette] = useState<boolean>(false);

  const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "60%",
    height: "75%",
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  const [mustSpin, setMustSpin] = useState<boolean>(false);

  const wheelData = [
    { option: '0', style: { backgroundColor: 'green', textColor: 'black' } },
    { option: '1', style: { backgroundColor: 'white' } },
    { option: '2' },
  ]

  useEffect(() => {
    setMustSpin(true)
  }, [])

  const [showAllRes, setAllRes] = useState(false);
  const [showOnlySel, setOnlySel] = useState(true);
  const [showTags, setShowTags] = useState(false);
  const [isSetting, setIsSetting] = useState(false);
  const actions = [
    { icon: <SwapHorizontalCircleIcon />, name: "幫抽要吃啥 Food Lottery", onClick: () => setShowRoulette(true) },
    { icon: <SettingsIcon />, name: isSetting ? "關閉顯示設定 Settings Off" : "開啟顯示設定 Settings On", onClick: () => setIsSetting(!isSetting) },
    ...isSetting ? [
      { icon: <DensitySmallIcon />, name: "顯示全部餐廳 Show All Restaurants", onClick: () => handleShowAllClick() },
      { icon: <NavigationIcon />, name: "顯示精選餐廳 Show Only Selected", onClick: () => handleShowOnlySel() },
      { icon: <FavoriteIcon />, name: "顯示我的最愛 Show Your Favourite", onClick: () => handleShowTags() },
    ] : []
  ];
  const handleNewImage = (newImageUrl: string, placeId: string) => {
    setRestaurants(currentRestaurants => 
      currentRestaurants.map(restaurant => 
        restaurant.placeId === placeId
          ? { ...restaurant, imageUrls: JSON.stringify([newImageUrl, ...(JSON.parse(restaurant.imageUrls || '[]'))]) }
          : restaurant
      )
    );
  };
  const handleRemoveLike = (placeIdToRemove: string) => {
    setTaggedRestaurants(currentTaggedRestaurants => {
      if (currentTaggedRestaurants) {
        return currentTaggedRestaurants.filter(place => place.placeId !== placeIdToRemove);
      }
      return currentTaggedRestaurants;
    });
  }
  

  const handleShowAllClick = () => {
    setAllRes(true);
    setOnlySel(false);
    setShowTags(false);
  }
  const handleShowOnlySel = () => {
    setAllRes(false);
    setOnlySel(true);
    setShowTags(false);
  }
  const handleShowTags = () => {
    setAllRes(false);
    setOnlySel(false);
    setShowTags(true);
  }

  const blueMarkerIcon = {
    url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png', // URL to a blue marker icon
  };
  const handleMarkerClick = async (placeId: any, name: any, address: any, lat: any, lng: any) => {
    //setSelectRestaurant(false)
    try{
      const res = await fetch('api/restaurants',{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          placeId
        }),
      });
      if (!res.ok){
        return;
      }
      const data = await res.json();
      const imageUrls = JSON.parse(data[0].imageUrls);
      //console.log(imageUrls);
      setSelectImageUrls(imageUrls);
    }catch(error){
      
    }
    const foundRestaurant = restaurants.find(restaurant => restaurant.name === name);
    setSelectedRestaurant(foundRestaurant);
    try {
      const res = await fetch('/api/getRestaurantDetail', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          placeId
        }),
      });
      if (!res.ok) {
        return;
      }
      const data = await res.json();
      const restaurantDetail = data.restaurantDetail;
      setSelectRestaurantDetail(restaurantDetail);
      setSelectRestaurantName(name);
      setSelectRestaurantAddress(address);
      setSelectRestaurantLat(lat);
      setSelectRestaurantLng(lng);
      setSelectRestaurantPlaceId(placeId);
    } catch (error) {
      console.error(error);
    }
    try {
      const res2 = await fetch('/api/listReview', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        }, body: JSON.stringify({
          placeId
        })
      });
      if (!res2.ok) {
        return;
      }
      const data2 = await res2.json();
      //console.log(data2.listReviews)
      setReviews(data2.listReviews);
      //todo
    } catch (error) {
      console.error(error);
    }
    setSelectRestaurant(true);
  };

  const [taggedRestaurants, setTaggedRestaurants] = useState<stringsOfPlaces[]>();


  const fetchTagInfo = async () => {
    const taggedPlaces = new Set();/*
    for (const restaurant of restaurants) {
      const response = await fetch('/api/tag/checkTags', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: session?.user?.id,
          placeId: restaurant.placeId,
          tagName: 'like',
        }),
      });
      const data = await response.json();
      if (data.message === "true") {
        taggedPlaces.add(restaurant.placeId);
      }
    }*/
    const response = await fetch('/api/tag/countTags', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: session?.user?.id,
        tagName: 'like',
      }),
    });
    const data = await response.json();
    //console.log(data[0].placeId);
    setTaggedRestaurants(data);
    //console.log(taggedRestaurants)
  };
  useEffect(() => {
    if (showTags) {
      fetchTagInfo();
    }
  }, [showTags]);



  const handleMapClick = async (event: any) => {
    // TODO: fix event type
    const placeId = event.detail.placeId;
    //console.log("placeId", placeId);
    if (!placeId) return;

    try { // The API to get place details
      const res = await fetch(
        `https://places.googleapis.com/v1/places/${placeId}?fields=id,displayName,formattedAddress,types&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
      );
      const data = await res.json();
      //console.log("data", data);
      /* 
        {
          displayName: {
            language: "zh-TW"
            text: "Restautant Name"
          }
          formattedAddress: "Address"
          id: "placeId"
          types: [

          ]
        }
      */
      /* Below are useless. Just for future reference if needed
      
      await fetch(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&language=zh-TW&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`, {
        method: "GET",
        headers: {
          "Data-Type": "application/jsonp",
          "Access-Control-Allow-Origin": "*",
        },        
      });*/
      const addr: string = data.formattedAddress;
      const name: string = data.displayName.text;


      if (addr.includes("大安區") || addr.includes("大安区") || addr.includes("中正區") || addr.includes("中正区")) {
        if (data.types.includes("restaurant")) {
          // the only correct use operation
          setPosition({ lat: event.detail.latLng.lat, lng: event.detail.latLng.lng });
          setRestaurantName(name);
          setRestaurantAddress(addr);
          setTypes(data.types);
        } else {
          setRestaurantName("你沒越界但是不是餐廳給我滾回去");
          setRestaurantAddress("");
          setTypes(data.types);
        }
      } else {
        setRestaurantName("你越界了給我滾回去");
        setRestaurantAddress("");
        setTypes([]);
      }
    } catch (error) {
      console.error("Error fetching place details:", error);
    }
  };
  const [displayRestaurants, setDisplayRestaurants] = useState<Restaurant[]>([]);
  const shuffledRef = useRef(false);
  useEffect(() => {
    // Only shuffle the restaurants if they haven't been shuffled yet
    if (!shuffledRef.current && restaurants.length > 0) {
      const shuffled = shuffleArray(restaurants);
      setDisplayRestaurants(shuffled);
      shuffledRef.current = true; // Mark as shuffled
    }
  }, [restaurants]);
  function shuffleArray(array: any) {
    let shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }


  return (
    <>
      <main className="flex h-full items-center justify-center w-full">
        <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
          {(selectRestaurant&&
            <div className="flex flex-col h-full w-2/5 p-1 gap-3">
              <button
                onClick={() => setSelectRestaurant(false)}
                className="self-end text-sm px-2 py-1 cursor-pointer" // Style as desired
              >
                <CancelIcon />
              </button>
              <div className="flex w-full p-2">
                <SearchBar />
              </div>
              <Divider />
              <div className="h-full overflow-y-scroll p-3">
                <Stack spacing={2}>
                  {<RestaurantCard
                    key={selectRestaurantName}
                    name={selectRestaurantName}
                    address={selectRestaurantAddress}
                    types={SelectRestaurantDetail.map((item) => item.type)}
                    lat={selectRestaurantLat}
                    lng={selectRestaurantLng}
                    userPositionLat={userPosition.lat}
                    userPositionLng={userPosition.lng}
                    rating={4.6}
                    userRatingsTotal={100}
                    priceLevel={"$$"}
                    photoReference={
                      selectImageUrls ? selectImageUrls
                        : []
                    }
                    placeId={selectRestaurantPlaceId}
                    reviews={reviews}
                    onNewImage={handleNewImage}
                    onRemoveLike={handleRemoveLike}
                  />}
                  {/*Array.from({ length: 0 }).map((_, index) => (
                    <RestaurantCard
                      key={index}
                      name="壽司漢堡123"
                      address="台北市大安區忠孝東路四段 123 號"
                      types = {SelectRestaurantDetail.map((item) => item.type)}
                      rating={4.6}
                      userRatingsTotal={100}
                      priceLevel={"$$"}
                      photoReference={["/food1.jpeg", "/food2.jpeg", "/food3.jpeg"]}
                    />
                  ))*/}
                </Stack>
              </div>
            </div>
          )}

          <div className="h-full w-full">
            <Map
              center={position}
              zoom={15}
              onClick={handleMapClick}
              mapId={process.env.NEXT_PUBLIC_MAP_ID}
              class="h-full"
              disableDefaultUI
            >
              <Marker position={userPosition} icon={blueMarkerIcon} />
              {displayRestaurants.map((restaurant, index) => {
                const threshold = Math.ceil(displayRestaurants.length * 0.05);
                if (restaurant.address.includes("大安區") || restaurant.address.includes("大安区") || restaurant.address.includes("中正區") || restaurant.address.includes("中正区")) {
                  let truncatedName = restaurant.name;

                  if (restaurant.name.length > 10) {
                    const match = restaurant.name.match(/(《|\||-|\s[^a-zA-Z])/);

                    if (match && typeof match.index === 'number') {
                      truncatedName = restaurant.name.substring(0, match.index);
                    }
                  }
                  const isFullDesign = index < threshold;
                  return ((isFullDesign && showOnlySel) || showAllRes || (showTags &&taggedRestaurants&& taggedRestaurants.some(taggedRestaurant => taggedRestaurant.placeId === restaurant.placeId))) &&
                    <AdvancedMarker
                      key={restaurant.placeId}
                      position={{ lat: restaurant.latitude, lng: restaurant.longitude }}
                      onClick={() => handleMarkerClick(restaurant.placeId, restaurant.name, restaurant.address, restaurant.latitude, restaurant.longitude)}
                    >
                      <div style={{
                        padding: '10px',
                        backgroundColor: 'white',
                        border: '1px solid #ddd',
                        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
                        borderRadius: '8px',
                        textAlign: 'center',
                        maxWidth: '150px',
                      }}>
                        <img
                          src={restaurant.imageUrls && JSON.parse(restaurant.imageUrls).length > 0
                            ? JSON.parse(restaurant.imageUrls)[0]
                            : "/food_default.jpg"} // Replace withdefault image path
                          alt="Restaurant"
                          style={{
                            width: '100%',
                            height: 'auto',
                            borderRadius: '4px'
                          }}
                        />
                        <div style={{
                          marginTop: '5px',
                          fontWeight: 'bold',
                          fontSize: '14px',
                          color: '#333',
                        }}>{truncatedName}</div>
                      </div>
                    </AdvancedMarker>
                  
                }
                return null;
              })}

            </Map>

            <Tooltip title="功能列表 Functions" placement="bottom">
              <SpeedDial
                ariaLabel="SpeedDial basic example"
                sx={{
                  position: 'absolute',
                  bottom: 64,
                  right: 36,
                  '& .MuiFab-primary': {
                    backgroundColor: '#b0aeae',
                    color: 'black',
                    width: 80,
                    height: 80,
                    '&:hover': {
                      backgroundColor: 'gray',
                      animation: `${pulseAnimation} 0.5s ease-in-out`, // Apply the pulse animation on hover
                    },
                  },
                  '& svg': {
                    fontSize: '3rem',
                  }
                }}
                icon={<QuizIcon />}
              >
                {actions.map((action) => (
                  <SpeedDialAction
                    key={action.name}
                    icon={action.icon}
                    tooltipTitle={action.name}
                    onClick={action.onClick}
                    sx={{
                      width: 64,
                      height: 64,
                      backgroundColor: "lightgray !important",
                      '&:hover': {
                        backgroundColor: 'gray !important',
                      },
                    }}
                  />
                ))}
              </SpeedDial>
            </Tooltip>



            <Modal
              open={showRoulette}
              onClose={() => setShowRoulette(false)}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style}>
                <Typography
                  id="modal-modal-title"
                  variant="h4"
                  className="text-center"
                >
                  讓我幫你抽要吃什麼吧
                </Typography>
                <Typography
                  id="modal-modal-description"
                  className="mt-2 text-center"
                >
                  每次抽籤花費 20 金幣
                </Typography>
                <Wheel
                  mustStartSpinning={false}
                  prizeNumber={3}
                  data={wheelData}
                  backgroundColors={['#3e3e3e', '#df3428']}
                  textColors={['#ffffff']}
                  onStopSpinning={() => {
                    setMustSpin(false);
                  }}
                />
                <Button onClick={() => setMustSpin(true)}>Spin</Button>
              </Box>
            </Modal>
          </div>
        </APIProvider>
      </main>
    </>
  );
}