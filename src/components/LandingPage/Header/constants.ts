export const menu = {
  open: {
    width: "250px",
    height: "300px",
    top: "-15px",
    right: "-15px",
    transition: { duration: 0.3, type: "spring", stiffness: 200, damping: 30 }
  },
  closed: {
    width: "45px",
    height: "45px",
    top: "0px",
    right: "0px",
    transition: { 
      duration: 0.3,
      type: "spring",
      stiffness: 200,
      damping: 30
    }
  }
};
export const links = [
  {
    url: "/",
    linkTo: "Home",
  },
  {
    url: "/team",
    linkTo: "Team",
  },
  {
    url: "/events",
    linkTo: "Events",
  },
  {
    url: "/about",
    linkTo: "About",
  },
  {
    url: "/join",
    linkTo: "Join Us",
  },
];
