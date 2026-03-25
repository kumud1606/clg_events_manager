export function getEvents(_request, response) {
  response.json({
    message: "Event listing placeholder. Replace frontend mock data with this API later."
  });
}

export function createEvent(_request, response) {
  response.status(201).json({
    message: "Create event placeholder. Club managers will post here later."
  });
}
