import Hero from '../components/Hero'
import { Work, Philosophy, AboutContact } from '../components/Sections'
import ScrollStory from '../motion/ScrollStory'

export default function Home() {
  return <><Hero /><ScrollStory /><Work /><Philosophy /><AboutContact /></>
}
