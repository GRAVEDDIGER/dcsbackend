export interface Welcome {
  id?: string
  title: string
  description: string
  timeStamp: number
  render: boolean
  images: string[]
}
export interface Member {
  id?: string
  name: string
  function: string
  description: string
  render: boolean
  images: string[]
  timeStamp: number
}
export interface Post {
  id?: string
  title: string
  content: string
  author: string
  render: boolean
  images: string[]
  timeStamp: number
}

export interface Learning {
  id?: string
  title: string
  content: string
  render: boolean
  images: string[]
  timeStampo: number
}
export interface GenericItem {
  id?: string
  item: Post | Welcome | Member | Learning
}
export interface DataResponse {
  data: GenericItem[]
  status: number
  statusText: string
  err: string
}
