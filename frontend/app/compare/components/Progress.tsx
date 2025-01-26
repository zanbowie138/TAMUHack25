import React from "react"
import CircularProgress from "@mui/joy/CircularProgress"

export default function Progress({ value }: { value: number }) {
  return (
    <CircularProgress
      determinate
      value={value}
      sx={{
        "--CircularProgress-trackThickness": "3px",
        "--CircularProgress-progressThickness": "3px",
        color: "white",
      }}
    >
      <div className="text-lg font-medium text-white">{value}</div>
    </CircularProgress>
  )
}

