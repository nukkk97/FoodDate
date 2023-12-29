"use client"

import { Alert, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Snackbar, Typography, useMediaQuery, useTheme } from "@mui/material";
import PaidIcon from "@mui/icons-material/Paid";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type Props = {
  missionId: string;
  missionName: string;
  missionDescription: string;
  prize: number;
  finished: boolean;
  startAt: Date;
  endAt: Date;
}

export default function MissionCard({ missionId, missionName, missionDescription, prize, finished, startAt, endAt }: Props) {
  const [open, setOpen] = useState<boolean>(false);
  
  return (
    <>
      <div 
        className={`border border-gray-500 rounded-xl w-full p-4 pb-12 ${finished ? "bg-gray-300 text-gray-600" : "hover:bg-gray-100 hover: cursor-pointer active:bg-gray-200"}`}
        onClick={() => {
          if(!finished) {            
            setOpen(true);
          }        
        }}
      >
        <Typography variant="h4" className="text-center pt-12">
          {missionName}
        </Typography>
        <Typography variant="subtitle1" className="text-center mr-6 pt-2">
          {finished ? (
            "已完成"
          ) : (<>
            <span className="text-xl mr-2"> + </span>
            <PaidIcon sx={{ color: 'gold', width: 32, height: 32, marginBottom: 1 }}/>
            {` ${prize}`}
          </>)}
        </Typography>
      </div>
      <MissionDialog 
        open={open}
        handleClose={() => {
          console.log("close!", open);
          setOpen(false);
        }}
        missionId={missionId}
        missionName={missionName}
        missionDescription={missionDescription}
        prize={prize}
        startAt={startAt}
        endAt={endAt}
      />
    </>
  )
}

type DialogProps = {
  open: boolean;
  handleClose: () => void;

  missionId: string;
  missionName: string;
  prize: number;
  missionDescription: string;
  startAt: Date;
  endAt: Date;
}

function MissionDialog({ open, handleClose, missionId, missionName, prize, missionDescription, startAt, endAt }: DialogProps) {
  const { update } = useSession();
  const router = useRouter();

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const [loading, setLoading] = useState<boolean>(false);
  const [successSubmit, setSuccessSubmit] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [hasError, setHasError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const handleCloseError = () => {
    setHasError(false);
  }
  const handleCloseSuccess = () => {
    setSuccessSubmit(false);
  }

  const handleVerify = async () => {
    setLoading(true);

    if(!(startAt <= new Date() && endAt > new Date())) {
      setErrorMessage("還沒到任務時間！");
      setHasError(true);
      setLoading(false);
      handleClose();
      return;
    }

    const res = await fetch("/api/mission", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        missionId: missionId
      })
    });

    if (!res.ok) {
      setErrorMessage("你已經做過此任務了啦");
      setHasError(true);
      setLoading(false);
      handleClose();
      return;
    } else {
      const addCoinRes = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          coins: prize,
        })
      });      
      if (!addCoinRes.ok) {
        const mes = await addCoinRes.json();
        console.log("fail to add coin: " + mes);
        setErrorMessage("系統忙碌中，請稍後再試");
        setHasError(true);
        setLoading(false);
        handleClose();
        return;
      } else {
        setSuccessMessage(`任務成功，你獲得了 ${prize} 金幣！`);
        setSuccessSubmit(true);
        setLoading(false);
        handleClose();
        update();
        router.refresh();
        return;
      }      
    }    
  }
  
  return (
    <>
      <Snackbar
        open={hasError}
        autoHideDuration={2000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseError}
          severity="error"
          sx={{ width: "100%" }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>   
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
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
        PaperProps={{ className: `${fullScreen ? "" : "max-w-2xl"}` }} // set the max width here
      >
        <DialogTitle 
          id="responsive-dialog-title" 
          variant="h4"
          className="text-center pt-6"
        >
          {missionName + " "}
          <PaidIcon sx={{ color: 'gold', width: 32, height: 32, marginBottom: 1 }}/> {prize}
        </DialogTitle>
        <DialogContent>
          <DialogContentText variant="subtitle1" className="text-black">
            <Typography variant="h6">
              活動期間：{startAt.toLocaleString()} ~ {endAt.toLocaleString()}
            </Typography>
            <Typography variant="h6">
              任務說明：{missionDescription}
            </Typography>          
          </DialogContentText>
        </DialogContent>
        <DialogActions>        
          <Button 
            onClick={handleVerify} 
            variant="contained" 
            className="bg-blue-500"
            disabled={loading}
          >
            我完成任務了我要驗證！
          </Button>
          <Button 
            onClick={handleClose} 
            variant="contained" 
            className="bg-blue-500"
            disabled={loading}
          >
            去做任務，稍後再回來！
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}