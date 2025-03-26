
const FREE_COUNCELLING_CALL_URL = "tel:918122002172";
const MENTORSHIP_APPOINTMETN_LINK = "https://rzp.io/rzp/mentoring-appointment";



const useCouncelling = () => {
  const handleFreeCouncellingCall = () => {
    window.open(FREE_COUNCELLING_CALL_URL);
  };
  const handleMentorshipAppointment = () => {
    window.open(MENTORSHIP_APPOINTMETN_LINK);
  };

  return { handleFreeCouncellingCall, handleMentorshipAppointment };
};

export default useCouncelling;
