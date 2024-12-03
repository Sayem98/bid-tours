interface EventPayload {
  event: string;
  data: any;
}

const SubscribeEvent = async (payload: EventPayload) => {
  const { event, data } = payload;
  console.log(`Event: ${event}, Data: ${data}`);

  //   const { userId, tour } = data;

  switch (event) {
    case "ADD_TO_WISHLIST":
      // Add tour to user's wishlist
      console.log("Add to wishlist");
      break;
    case "BOOK_TOUR":
      // Book tour for user
      break;

    default:
      break;
  }
};

export { SubscribeEvent };
