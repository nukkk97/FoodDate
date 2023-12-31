import { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import {
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  Collapse,
  Avatar,
  IconButton,
  IconButtonProps,
  Typography,
  Stack,
  Rating,
  Paper,
  Box,
  Divider,
  Tooltip,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
} from "@mui/material";
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CreateIcon from '@mui/icons-material/Create';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import PaidIcon from '@mui/icons-material/Paid';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import ReviewCard from './ReviewCard';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { CldUploadWidget } from 'next-cloudinary';
import { publicEnv } from '@/lib/env/public';
import React from 'react';


const translateTypeToChinese = (type: string): string => {
  const translations: { [key: string]: string } = {
    'chinese_restaurant': '中式餐館',
    'restaurant': '餐廳',
    'mexican_restaurant': '墨西哥餐廳',
    'american_restaurant': '美式餐廳',
    'japanese_restaurant': '日本料理',
    'brunch_restaurant': '好ㄘ的早午餐',
    'breakfast_restaurant': '活力早餐',
    'store': '附商店',
    'sushi_restaurant': '有賣壽司',
    'korean_restaurant': '韓式料理',
    'consultant': '有聘請顧問',
    'grocery_store': '含雜貨店',
    'health': '注重健康',
    'ramen_restaurant': '拉麵洗腎幫',
    'thai_restaurant': '泰式料理',
    'vegetarian_restaurant': '主打蔬食',
    'event_venue': '有在辦活動',
    'italian_restaurant': '義式餐廳',
    'vietnamese_restaurant': '越南餐館',
    'vegan_restaurant': '素食至上',
    'art_gallery': '裝文青勝地',
    'bar': '酒鬼聚會所',
    'indian_restaurant': '印度料理',
    'seafood_restaurant': '主打海鮮',
    'coffee_shop': '咖啡店',
    'cafe': '咖啡廳',
    'spanish_restaurant': '西班牙菜',
    'middle_eastern_restaurant': '中東風味餐',
    'fast_food_restaurant': '速食店',
    'hamburger_restaurant': '有賣漢堡',
    'pizza_restaurant': '披薩專賣',
    'french_restaurant': '法式料理',
    'indonesian_restaurant': '印尼料理',
    'steak_house': '牛排館',
    'meal_takeaway': '歡迎外帶',
    'liquor_store': '酒鬼避難所',
    'wholesaler': '食物批發',
    'mediterranean_restaurant': '地中海料理',
    'bakery': '麵包店',
    'barbecue_restaurant': '燒烤店',
    'meal_delivery': '歡迎外送',
    'night_club': '歡樂夜總會',
    'greek_restaurant': '希臘餐廳',
    'ice_cream_shop': '冰淇淋店',
    'home_goods_store': '有賣家居用品',
    'furniture_store': '有賣傢俱',
    'home_improvement_store': '家庭改造服務',
    'market': '市場',
    'turkish_restaurant': '土耳其料理',
    'sandwich_shop': '三明治！！',
    'banquet_hall': '宴會所',
    'convention_center': '會議廳',
    'clothing_store': '有賣衣服',
    'wedding_venue': '婚禮現場',
    'performing_arts_theater': '表演藝術中心'
  };

  return translations[type] || type;
};
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}





function calculateDistance(lat1: number, lng1: number, lat2: number | undefined, lng2: number | undefined) {
  // Radius of the Earth in km
  if (!lat1 || !lng1 || !lat2 || !lng2)
    return 0;
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLng = (lng2 - lng1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance; // distance in kilometers
}


interface ExpandMoreProps {
  expand: boolean;
  // Include other props as needed
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return (
    <Tooltip title="展開/關閉評論" placement="top">
      <IconButton {...other} />
    </Tooltip>
  );
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));


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


type RestaurantProps = {
  name: string;
  address: string;
  types: string[];
  lat: number | undefined;
  lng: number | undefined;
  userPositionLat: number;
  userPositionLng: number;
  rating: number;
  userRatingsTotal: number;
  priceLevel: string;
  photoReference: string[];
  placeId: string;
  reviews: Review[];
  onNewImage: (newImageUrl: string, placeId: string) => void;
  onRemoveLike: (placeId: string) => void;
  onAddLike: (placeId: string) => void;
}

export default function RestaurantCard({ name, address, types, lat, lng, userPositionLat, userPositionLng, rating, userRatingsTotal, priceLevel, photoReference, placeId, reviews, onNewImage, onRemoveLike, onAddLike }: RestaurantProps) {
  const { data: session, status, update } = useSession();
  const isLoggedIn = status === 'authenticated';
  const [expanded, setExpanded] = useState<boolean>(false);
  const [isWithinDistance, setIsWithinDistance] = useState(false);
  const [content, setContent] = useState<string>("");
  const [expense, setExpense] = useState(1);
  const [stars, setStars] = useState(5);
  const [reviewArray, setReviewArray] = useState<Review[]>(reviews);
  const [url, setUrl] = useState(photoReference);
  const [isLiked, setIsLiked] = useState<boolean>();
  const [isCopied, setIsCopied] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkTag = async () => {
      try {
        const response = await fetch('/api/tag/checkTags', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: session?.user?.id,
            placeId: placeId,
            tagName: 'like'
          }),
        });
        if (response.ok) {
          const data = await response.json();
          //console.log(data.message)
          setIsLiked(data.message === 'true');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    checkTag();
  }, []);
  const handleCopy = () => {
    navigator.clipboard.writeText(name + " " + address);
    setIsCopied(true);
    // Optionally, reset after a few seconds
    setTimeout(() => setIsCopied(false), 3000); // Reset after 3 seconds
  };
  const handleLike = async () => {
    if (!isLiked) {
      try {
        const res = await fetch('api/tag/useTags', {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: session?.user?.id,
            placeId: placeId,
            tagName: 'like'
          })
        });
        if (!res.ok) {
          return;
        }
        setIsLiked(true);
        onAddLike(placeId);
      } catch (error) {
        return;
      }
    }
    else {
      const res = await fetch('api/tag/useTags', {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: session?.user?.id,
          placeId: placeId,
          tagName: 'like'
        })
      });
      if (!res.ok) {
        return;
      }
      setIsLiked(false);
      onRemoveLike(placeId);
    }
  }







  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setContent(event.target.value);
  };
  //const router = useRouter();
  useEffect(() => {
    if (photoReference.length === 0) {
      return;
    }
    if (photoReference.length > url.length) {
      setUrl(photoReference);
    } else {
      setUrl(url);
    }
    router.refresh();
  }, [photoReference, url]);
  const handlePost = async () => {
    if (content == '') return;
    const reviewerId = session?.user?.id;
    //console.log("reviewer:"+reviewerId);
    try {
      const res = await fetch('/api/review', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          placeId,
          reviewerId,
          stars,
          content,
          expense
        })
      });
      if (!res.ok) {
        return;
      }

      const data = await res.json();
      const newReview = data.newReview[0] as Reviewer;
      const reviewWithUserDetails = {
        reviews: newReview,
        users: {
          username: session?.user?.username || '',
          avatarUrl: session?.user?.avatarUrl || '',
          coins: 0,
          bio: "",
          hashedPassword: "",
          ntuEmail: "",
          userId: session?.user?.id || '',
        }
      };
      setContent('');
      setStars(5);
      //console.log(reviewWithUserDetails)
      setReviewArray(prevReviews => [...prevReviews, reviewWithUserDetails]);

      const prize = 5 + Math.floor(Math.random() * 5);
      const resp = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          coins: prize
        })
      })
      if (!resp.ok) {
        return;
      }
      setSuccessMessage(`留言成功，你獲得了 ${prize} 金幣！`);
      setSuccessSubmit(true);
      update();



    } catch (error) {
      console.error(error);
    }
  };



  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const [currentPhotoIndex, setCurrentPhotoIndex] = useState<number>(0);

  const handleBeforePhoto = () => {
    setCurrentPhotoIndex(currentPhotoIndex == 0 ? currentPhotoIndex : currentPhotoIndex - 1);
  };

  const handleNextPhoto = () => {
    setCurrentPhotoIndex(currentPhotoIndex === url.length - 1 ? currentPhotoIndex : currentPhotoIndex + 1);
  };

  const [showLeftArrow, setShowLeftArrow] = useState<boolean>(false);
  const [showRightArrow, setShowRightArrow] = useState<boolean>(false);
  const [successSubmit, setSuccessSubmit] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const handleCloseSuccess = () => {
    setSuccessSubmit(false);
  }
  useEffect(() => {
    //console.log(userPositionLat)
    setShowLeftArrow(currentPhotoIndex !== 0);
    setShowRightArrow(currentPhotoIndex !== url.length - 1);
  }, [currentPhotoIndex, url.length]);
  useEffect(() => {
    // Calculate the distance and set isWithinDistance
    if (lat && lng) {
      const distance = calculateDistance(lat, lng, userPositionLat, userPositionLng);
      setIsWithinDistance(distance <= publicEnv.NEXT_PUBLIC_VERIFY_DISTANCE_BASE);
    }
  }, [lat, lng, userPositionLat, userPositionLng]);
  useEffect(() => {
    setReviewArray(reviews);
  }, [reviews]);
  const getAverageStars = (reviews: any) => {
    const totalStars = reviews.reduce((acc: any, review: any) => acc + review.reviews.stars, 0);
    const average = reviews.length > 0 ? totalStars / reviews.length : 0;
    return parseFloat(average.toFixed(1));
  };
  const getAverageExpense = (reviews: any) => {
    const totalExpense = reviews.reduce((acc: any, review: any) => acc + review.reviews.expense, 0);
    const average = reviews.length > 0 ? totalExpense / reviews.length : 0;
    return parseFloat(average.toFixed(0));
  };
  const displayExpense = (value: number) => {
    switch (value) {
      case 1: return '$（200元以內）';
      case 2: return '$$（400元以內）';
      case 3: return '$$$（600元以內）';
      case 4: return '$$$$（600元以上）';
      default: return '尚無消費資訊';
    }
  };
  const averageStars = getAverageStars(reviewArray);
  const averageExpense = getAverageExpense(reviewArray);


  function handleChangeExpense(event: any) {
    setExpense(event.target.value);
  };

  return (

    <Paper elevation={5}>
      <Snackbar
        open={successSubmit}
        autoHideDuration={2000}
        onClose={handleCloseSuccess}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSuccess}
          severity="success"
          sx={{ width: "100%" }}
        >
          {successMessage}
        </Alert>
      </Snackbar>
      <Card>
        <CardHeader
          title={name}
          subheader={
            <Box display="flex" flexDirection="row" alignItems="center" gap={1}>
              <div className="mt-px">
                {averageStars}
              </div>
              <Rating
                value={averageStars}
                readOnly
                precision={0.1}
              />
              <div>
                {`(${reviewArray.length})`}
              </div>
            </Box>
          }
        />
        <div
          className="relative"
          onMouseEnter={() => {
            // Show the next arrow when the mouse enters the photo
            setShowLeftArrow(currentPhotoIndex !== 0);
            setShowRightArrow(url.length !== 0 && currentPhotoIndex !== url.length - 1);
            //console.log(url.length)
          }}
          onMouseLeave={() => {
            // Hide the next arrow when the mouse leaves the photo
            setShowLeftArrow(false);
            setShowRightArrow(false);
          }}
        ><CldUploadWidget
          options={{
            sources: ['local', 'url', 'camera', 'google_drive', 'dropbox'],
            resourceType: 'image',
            clientAllowedFormats: ['gif', 'png', 'jpg', 'jpeg', 'heif'],
          }}
          uploadPreset={publicEnv.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
          onSuccess={async (result) => {
            //console.log(result);

            if (result && typeof result.info === 'object' && 'secure_url' in result.info) {
              const newImageUrl: string = String(result.info.secure_url);
              const res = await fetch("/api/restaurants", {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  placeId: placeId,
                  imageUrl: newImageUrl,
                }),
              });
              //if(!res.ok) {
              //  console.log("error");
              //} else {
              if (url.length == 0) {
                const prize = 100 + Math.floor(Math.random() * 200);
                const res = await fetch("/api/profile", {
                  method: "PUT",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    coins: prize
                  })
                })
                if (!res.ok) {
                  return;
                }
                setSuccessMessage(`成為第一位上傳成功的人，你獲得了 ${prize} 金幣！`);
                setSuccessSubmit(true);
                update();
              }
              setUrl(currentUrls => [...currentUrls, newImageUrl]);
              onNewImage(newImageUrl, placeId);
              //}
            }
          }}
        >{({ open }) => {
          return (
            <Tooltip title={
              <React.Fragment>
                {isLoggedIn ? (
                  isWithinDistance
                    ? <span style={{ display: 'block', textAlign: 'center' }}>點擊上傳圖片 Click to Upload!<br />(It takes some time to display on the map)</span>
                    : <span>靠近餐廳可上傳圖片 Get Closer!</span>
                ) : (
                  <span>登入並靠近餐廳可上傳圖片 Login to Upload!</span>
                )}
              </React.Fragment>
            } placement="bottom" arrow>
              <CardMedia
                className="relative"
                component="img"
                height="120"
                // Use the current photo index to get the current photo URL
                image={url.length > 0 && currentPhotoIndex < url.length ? url[currentPhotoIndex] : "/food_default.jpg"}
                alt="Restaurant Photo"
                onClick={isLoggedIn && isWithinDistance ? () => open() : undefined}
              /></Tooltip>);
        }}</CldUploadWidget>
          {showLeftArrow && <IconButton
            className="absolute left-0 top-0 bottom-0 my-auto mx-0 z-10"
            onClick={handleBeforePhoto}
          >
            <NavigateBeforeIcon className="text-white" />
          </IconButton>}
          {showRightArrow && <IconButton
            className="absolute right-0 top-0 bottom-0 my-auto mx-0 z-10"
            onClick={handleNextPhoto}
          >
            <NavigateNextIcon className="text-white" />
          </IconButton>}
        </div>
        <CardContent>
          <Stack spacing={1} className="flex flex-col items-start w-full">
            <Item className="flex items-center gap-3 w-full">
              <LocationOnIcon />
              <div className="text-start">
                {address}
              </div>
            </Item>
            <Item className="flex flex-start items-center justify-start gap-3 w-full">
              <RestaurantIcon />
              <div className="text-start">
                {types.map((type) => (
                  <span key={type}>{translateTypeToChinese(type)} </span>
                ))}
              </div>
            </Item>
            <Item className="flex items-center gap-3 w-full">
              <PaidIcon />
              <div className="text-start">
                {displayExpense(averageExpense)}
              </div>
            </Item>
          </Stack>
        </CardContent>
        <CardActions disableSpacing>
          <Tooltip title={isLiked ? "取消最愛" : "加到最愛"} placement="top">
            <IconButton style={{ color: isLiked ? 'red' : 'gray' }} aria-label="add to favorites" onClick={handleLike}>
              <FavoriteIcon
              />
            </IconButton>
          </Tooltip>
          <Tooltip title={isCopied ? "" : "分享"} placement="top">
            <div style={{ position: 'relative' }}>
              <IconButton aria-label="share" onClick={handleCopy}>
                <ShareIcon />
              </IconButton>
              {isCopied && (
                <div style={{
                  position: 'absolute',
                  left: '50%',
                  transform: 'translateX(-50%) scale(1.2)',
                  top: '-30px',
                  fontSize: '10px',
                  background: '#555', // Soft background color
                  color: '#f2f2f2', // Font color
                  borderRadius: '10px', // Rounded corners
                  padding: '5px 10px',
                  boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.16)', // Subtle shadow
                  animation: 'pop-in 0.3s ease-out',
                }}>
                  Copied!
                </div>
              )}
            </div>
          </Tooltip>

          <ExpandMore
            expand={expanded}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <CreateIcon />
          </ExpandMore>

        </CardActions>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <Divider />
          <CardContent>
            <Typography
              variant="subtitle1"
              className="font-semibold pb-4 text-center"
            >
              評價
            </Typography>
            {isLoggedIn ?
              (isWithinDistance ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                  <Rating value={stars} onChange={(_, value) => {
                    setStars(value !== null ? value : 5);
                  }} /><p>&nbsp;</p><FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">消費金額</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={expense}
                      label="Expense"
                      onChange={handleChangeExpense}
                    >
                      <MenuItem value={1}>$（200元以內）</MenuItem>
                      <MenuItem value={2}>$$（400元以內）</MenuItem>
                      <MenuItem value={3}>$$$（600元以內）</MenuItem>
                      <MenuItem value={4}>$$$$（600元以上）</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField
                    label="留下您的評論..."
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={content}
                    onChange={handleChange}
                  />
                  <Button disabled={content == ""} onClick={handlePost}>發表！</Button>
                </div>

              ) : (
                <TextField
                  label="請靠近餐廳以撰寫評論..."
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  disabled
                />
              )) : (
                <TextField
                  label="請登入並靠近餐廳以撰寫評論..."
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  disabled
                />

              )
            }

            <div>&nbsp;
              <Stack gap={2}>
                {reviewArray.map((review) => (
                  <ReviewCard
                    key={review.reviews.reviewId}
                    reviewId={review.reviews.reviewId}
                    username={review.users.username}
                    userAvatarUrl={review.users.avatarUrl}
                    reviewerId={review.reviews.reviewerId}
                    reviewDate={review.reviews.createdAt}
                    starsCount={review.reviews.stars}
                    content={review.reviews.content}
                    expense={review.reviews.expense} // If you want to show the expense too
                  />
                ))}
              </Stack></div>
          </CardContent>
        </Collapse>
      </Card>
    </Paper>
  );
}
