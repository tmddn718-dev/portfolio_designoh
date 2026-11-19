import Hero from '../components/Hero'
import { Work, Philosophy, AboutContact } from '../components/Sections'
import ScrollStory from '../motion/ScrollStory'
import { useScrollMotion } from '../motion/useScrollMotion'

export default function Home() {
  useScrollMotion()
  return <><Hero /><ScrollStory /><Work /><Philosophy /><AboutContact /></>
}
