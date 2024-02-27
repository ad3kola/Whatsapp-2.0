import {
  UserGroupIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  ViewfinderCircleIcon,
  FolderPlusIcon,
  EllipsisVerticalIcon,
  MagnifyingGlassIcon,
  VideoCameraIcon,
  MicrophoneIcon,
} from "@heroicons/react/24/outline";
import { NavLinksProps } from "./typings";

export const navLinks: NavLinksProps[] = [
  { Icon: UserGroupIcon },
  { Icon: ViewfinderCircleIcon },
  { Icon: ChatBubbleOvalLeftEllipsisIcon },
  { Icon: FolderPlusIcon },
];

export const chatLinks: NavLinksProps[] = [
	{ Icon: VideoCameraIcon },
	{ Icon: MagnifyingGlassIcon },
	{ Icon: MicrophoneIcon },
]