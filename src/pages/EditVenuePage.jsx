import React from "react";
import { useParams } from "react-router-dom";
import VenueForm from "../components/Venues/VenueForm";

const EditVenuePage = () => {
  const { id } = useParams();
  return <VenueForm mode="edit" venueId={id} />;
};

export default EditVenuePage;