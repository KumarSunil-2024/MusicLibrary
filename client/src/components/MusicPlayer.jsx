import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Button,
  Stack,
  Chip,
} from "@mui/material";
import Grid from "@mui/material/Grid"; // Import standard Grid from its own path

function MusicPlayer({ currentSong, nextSong, previousSong }) {
  if (!currentSong) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h5" align="center">
            🎵 Select a Song
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      elevation={3}
      sx={{
        borderRadius: 3,
        p: 2,
      }}
    >
      {/* Artwork */}{" "}
      <Grid container spacing={2} alignItems="center">
        <Grid size={{ xs: 12, sm: 2 }}>
          <Avatar
            variant="rounded"
            src={currentSong.artworkUrl100}
            sx={{
              width: 90,
              height: 90,
            }}
          />
        </Grid>

        {/* Song Info */}
        <Grid size={{ xs: 12, sm: 3 }}>
          <Chip
            label="NOW PLAYING"
            color="success"
            size="small"
            sx={{ mb: 1 }}
          />

          <Typography variant="h6" noWrap>
            {currentSong.trackName}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            {currentSong.artistName}
          </Typography>
        </Grid>

        {/* Audio */}
        <Grid size={{ xs: 12, sm: 4 }}>
          <audio
            key={currentSong.trackId}
            controls
            style={{
              width: "100%",
            }}
            onEnded={nextSong}
          >
            <source src={currentSong.previewUrl} type="audio/mpeg" />
          </audio>
        </Grid>

        {/* Buttons */}
        <Grid size={{ xs: 12, sm: 3 }}>
          <Stack direction="row" spacing={1} justifyContent="center">
            <Button variant="outlined" onClick={previousSong}>
              Prev
            </Button>

            <Button variant="contained" onClick={nextSong}>
              Next
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </Card>
  );
}

export default MusicPlayer;
