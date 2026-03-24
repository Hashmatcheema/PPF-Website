/**
 * Place names that appear on the base map tiles (OSM/MapTiler) in English.
 * When the site is in Urdu, we overlay these coordinates with Urdu labels
 * so all visible place names are in Urdu on the landing page map.
 */
export const MAP_PLACE_LABELS: Array<{
  coords: [number, number]
  ur: string
}> = [
  // Jammu & Kashmir, Ladakh, Himachal
  { coords: [34.0836, 74.7973], ur: "سرینگر" },
  { coords: [33.4, 75.5], ur: "جموں و کشمیر" },
  { coords: [32.7266, 74.857], ur: "جموں" },
  { coords: [34.1526, 77.5771], ur: "لداخ" },
  { coords: [32.274, 75.652], ur: "پٹھانکوٹ" },
  { coords: [31.1048, 77.1734], ur: "شملہ" },
  { coords: [31.1048, 76.5], ur: "ہماچل پردیش" },
  // Punjab (India), Chandigarh, Haryana
  { coords: [31.634, 74.8723], ur: "امرتسر" },
  { coords: [30.901, 75.8573], ur: "پنجاب" },
  { coords: [30.673, 74.7554], ur: "فریدکوٹ" },
  { coords: [30.7333, 76.7794], ur: "چندی گڑھ" },
  { coords: [30.207, 74.9489], ur: "بٹھنڈہ" },
  { coords: [29.9695, 76.8783], ur: "کروکشیتر" },
  { coords: [29.801, 76.3996], ur: "کیتھل" },
  { coords: [29.4727, 77.7085], ur: "مظفرنگر" },
  { coords: [29.5354, 75.0289], ur: "سرسہ" },
  { coords: [29.0588, 76.0856], ur: "ہریانہ" },
  { coords: [28.793, 76.1395], ur: "بھیوانی" },
  { coords: [28.6139, 77.209], ur: "نئی دہلی" },
  { coords: [28.347, 76.9358], ur: "منیسار" },
  // Rajasthan
  { coords: [28.0229, 73.3119], ur: "بیکانیر" },
  { coords: [28.3042, 75.0324], ur: "چورو" },
  { coords: [27.616, 75.1397], ur: "سیکر" },
  { coords: [28.198, 76.619], ur: "ریوڑی" },
  { coords: [27.5522, 76.6346], ur: "الور" },
  { coords: [27.2152, 77.4901], ur: "بھرت پور" },
  { coords: [26.9124, 75.7873], ur: "جے پور" },
  { coords: [26.5833, 73.8333], ur: "راجستھان" },
  { coords: [26.4499, 74.6399], ur: "اجمیر" },
  { coords: [26.2389, 73.0243], ur: "جودھ پور" },
  { coords: [25.7463, 71.3924], ur: "بارمر" },
  { coords: [26.741, 77.035], ur: "ہندون" },
  { coords: [26.4969, 78.0005], ur: "مورینہ" },
  { coords: [26.4833, 76.7167], ur: "گنگاپور" },
  { coords: [26.6978, 77.8935], ur: "دھول پور" },
  // Gujarat
  { coords: [24.1711, 72.4381], ur: "پالن پور" },
  { coords: [23.588, 72.3693], ur: "مہسانہ" },
  { coords: [23.0225, 72.5714], ur: "احمد آباد" },
  { coords: [22.2587, 71.1924], ur: "گجرات" },
]
