 const router = useRouter();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const docRef = doc(db, "orders", typeof id === "string" ? id : Array.isArray(id) ? id[0] : "");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setOrder(docSnap.data());
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching food:", error);
      } finally {
        // setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const formatDate = (inputDate: any): string => {
    let date: Date;

    // 🟢 Firestore Timestamp handle kare
    if (inputDate?.toDate) {
      date = inputDate.toDate();
    }
    // 🟢 String handle kare (remove unwanted spaces/symbols)
    else if (typeof inputDate === "string") {
      // Non-breaking spaces aur special characters clean kar de
      const cleaned = inputDate.replace(/[^\x00-\x7F]/g, " ");
      date = new Date(cleaned);
    }
    // 🟢 Already JS Date object
    else {
      date = new Date(inputDate);
    }

    if (isNaN(date.getTime())) {
      console.warn("⚠️ Invalid date format:", inputDate);
      return "Invalid Date";
    }

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
  };
