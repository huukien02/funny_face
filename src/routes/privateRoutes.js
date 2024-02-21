import { Route } from "react-router-dom";

import DetailVideo from "../ver2/page/Videos/DetailVideo/DetailVideo";
import MakeVideo from "../ver2/page/Videos/MakeVideo/MakeVideo";
import MyVideo from "../ver2/page/Videos/MyVideo/MyVideo";
import Videos from "../ver2/page/Videos/Videos";
import DetailImage from "../ver2/page/Images/DetailImage/DetailImage";
import DetailAlbum from "../ver2/page/Images/DetailAlbum/DetailAlbum";
import MakeImage from "../ver2/page/Images/MakeImage/MakeImage";
import MakeAlbum from "../ver2/page/Images/MakeAlbum/MakeAlbum";
import MyImage from "../ver2/page/Images/MyImage/MyImage";
import Images from "../ver2/page/Images/Images";
import EventAdd from "../ver2/page/Events/EventAdd/EventAdd";
import EventResult from "../ver2/page/Events/EventResult/EventResult";
import Events from "../ver2/page/Events/Events";
import CreateImage from "../ver2/page/CreateImage/CreateImage";
import CreateVideo from "../ver2/page/CreateVideo/CreateVideo";
import GenBaby from "../ver2/page/GenBaby/GenBaBy";
import Love from "../ver2/page/Love/Love";
import NotFound from "../ver2/components/NotFound";
import TiktokScandal from "../ver2/tiktok-scandal";
import YoutubeScandal from "../ver2/YoutubeScandal";
import Profile from "../ver2/page/Profile/Profile";
import Download from "../ver2/page/Download/Download";

import LayoutUser from "../ver2/layouts/LayoutUser";
import MainMiddleware from "../middleware/MainMiddleware";

export const privateRoutes = (
  <Route path="" element={<LayoutUser />}>
    <Route path="/events/:id/:stt" element={<EventResult />} />

    <Route path="/videos">
      <Route index element={<Videos />} />
      <Route path="detail-video/:id" element={<DetailVideo />} />
    </Route>

    <Route path="/images/*">
      <Route index element={<Images />} />
      <Route path="detail-image/:id" element={<DetailImage />} />
      <Route path="detail-album/:id" element={<DetailAlbum />} />
      <Route path="*" element={<Images />} />
    </Route>

    <Route path="/download-app" element={<Download />} />
    <Route path="/youtube/:idVideo" element={<YoutubeScandal />} />
    <Route path="/tiktok/:idVideo" element={<TiktokScandal />} />
    <Route path="/profile/:id" element={<Profile />} />

    <Route path="" element={<MainMiddleware />}>
      <Route path="/events" element={<Events />} />
      <Route path="/events/add" element={<EventAdd />} />
      <Route path="/create-video" element={<CreateVideo />} />
      <Route path="/videos/make-video" element={<MakeVideo />} />
      <Route path="videos/my-videos" element={<MyVideo />} />
      <Route path="/create-image" element={<CreateImage />} />
      <Route path="/images/make-image" element={<MakeImage />} />
      <Route path="/images/make-album" element={<MakeAlbum />} />
      {/* <Route path="/images/my-images" element={<MyVideo />} /> */}
      <Route path="/images/my-images" element={<MyImage />} />
      <Route path="/genbaby" element={<GenBaby />} />
      <Route path="/love" element={<Love />} />
      <Route path="/profile" element={<Profile />} />
    </Route>

    <Route path="*" exact={true} element={<NotFound />} />
  </Route>
);
