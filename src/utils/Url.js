
export class Url {
  constructor() {
    this.home = '/'
    this.love = '/love'
    this.events = '/events'
    this.videos = '/videos'

    this.createVideo = '/create-video'
    this.createImage = '/create-image'
    this.genbaby = '/genbaby'

    this.downloadApp = '/download-app'
  }

  getEventsResult = (id, stt) => `/events/${id}/${stt}`
  getEventsAdd = () => `/events/add`

  getVideoDetail = (id) => `videos/detail-video/${id}`
  getVideoMake = () => `/videos/add`
  getVideoMy = () => '/videos/my-video'
}
