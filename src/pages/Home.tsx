import Hero from '../components/Hero'
import { Work, Philosophy, AboutContact } from '../components/Sections'
import Marquee from '../motion/Marquee'
import ScrollStory from '../motion/ScrollStory'
import Cursor from '../motion/Cursor'
import { useMagnetic, useSmoothScroll } from '../motion/useMotion'

export default function Home() {
  useSmoothScroll()
  useMagnetic()
  return <><Cursor /><Hero /><Marquee /><ScrollStory /><Work /><Philosophy /><AboutContact /></>
}
