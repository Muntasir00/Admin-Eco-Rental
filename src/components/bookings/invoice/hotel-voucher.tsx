import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import { format, differenceInCalendarDays } from 'date-fns';
import Logo from "@/assets/logo.png"; // আপনার লোগো ইম্পোর্ট পাথ ঠিক থাকলে এটি কাজ করবে

// ১. কালার প্যালেট
const colors = {
    primary: '#B83E26',     // Purple (Main Brand Color)
    secondary: '#f3f4f6',   // Light Gray (Backgrounds)
    textDark: '#111827',    // Dark Gray (Main Text)
    textLight: '#6b7280',   // Light Gray (Labels)
    white: '#ffffff',
    success: '#10b981',     // Green
    warning: '#f59e0b',     // Orange
    danger: '#ef4444',      // Red
    accent: '#f5f3ff'       // Very Light Purple
};

const styles = StyleSheet.create({
    page: {
        padding: 40,
        backgroundColor: colors.white,
        fontFamily: 'Helvetica',
        fontSize: 10,
        color: colors.textDark,
        // lineHeight: 1.5,
    },
    // --- হেডার সেকশন ---
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center', // Top alignment
        marginBottom: 30,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: colors.secondary,
    },
    logoImage: {
        width: 60,
        height: 60,
        objectFit: 'contain', // লোগো যেন কেটে না যায়
    },
    headerRight: {
        textAlign: 'right',
        flexDirection: 'column',
        alignItems: 'flex-end', // সবকিছু ডানদিকে চাপানো থাকবে
    },
    title: {
        color: colors.primary,
        fontSize: 22,
        fontWeight: 'heavy',
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        marginBottom: 5,
    },
    metaText: {
        fontSize: 9,
        color: colors.textLight,
        marginBottom: 3,
    },
    // --- স্ট্যাটাস ব্যাজ ---
    statusBadge: {
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 4, // Capsule Shape
        marginTop: 5,
        alignSelf: 'flex-end'
    },
    statusText: {
        color: colors.white,
        fontSize: 9,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },

    // --- সেকশন টাইটেল ---
    sectionTitle: {
        fontSize: 11,
        fontWeight: 'bold',
        color: colors.textDark,
        marginBottom: 10,
        marginTop: 15,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        borderLeftWidth: 3,
        borderLeftColor: colors.primary,
        paddingLeft: 8,
    },

    // --- ক্লায়েন্ট ইনফো ---
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    col3: {
        width: '30%',
    },
    label: {
        fontSize: 8,
        color: colors.textLight,
        marginBottom: 3,
        textTransform: 'uppercase',
    },
    value: {
        fontSize: 10,
        fontWeight: 'bold',
        color: colors.textDark,
    },

    // --- রিজার্ভেশন কার্ড ---
    reservationCard: {
        backgroundColor: '#fafafa',
        borderRadius: 8,
        padding: 15,
        borderWidth: 1,
        borderColor: colors.secondary,
        marginBottom: 20,
    },
    hotelInfoRow: {
        flexDirection: 'row',
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
        paddingBottom: 15,
    },
    roomImage: {
        width: 120,
        height: 80,
        borderRadius: 6,
        backgroundColor: '#e5e7eb',
        marginRight: 15,
        objectFit: 'cover'
    },
    hotelDetails: {
        justifyContent: 'center',
    },
    hotelName: {
        fontSize: 14,
        fontWeight: 'bold',
        color: colors.textDark,
        marginBottom: 5,
    },
    locationText: {
        fontSize: 10,
        color: colors.textLight,
    },

    // --- গ্রিড লেআউট ---
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    gridItem: {
        width: '25%', // 4 items per row perfectly
        marginBottom: 15,
    },

    // --- অ্যামেনিটিস ---
    amenitiesRow: {
        flexDirection: 'row',
        backgroundColor: colors.accent,
        padding: 12,
        borderRadius: 6,
        marginBottom: 20,
    },
    amenityItem: {
        marginRight: 20,
        fontSize: 9,
        color: colors.primary,
        fontWeight: 'bold',
    },

    // --- ফুটার ---
    footerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        backgroundColor: '#f8fafc',
        padding: 15,
        borderRadius: 8,
    },
    infoColumn: {
        width: '48%',
    },
    bulletPoint: {
        fontSize: 8,
        color: colors.textLight,
        marginBottom: 4,
        marginLeft: 4,
    }
});

export default function HotelVoucher({ booking }: { booking: any }) {
    // ১. ডেটা প্রসেসিং এবং ক্যালকুলেশন
    const checkInDate = new Date(booking.checkIn);
    const checkOutDate = new Date(booking.checkOut);

    // অটোমেটিক কত রাত সেটা বের করা হচ্ছে
    const nights = differenceInCalendarDays(checkOutDate, checkInDate);

    return (
        <Document>
            <Page size="A4" style={styles.page}>

                {/* --- HEADER --- */}
                <View style={styles.header}>
                    {/* বাম পাশে লোগো */}
                    <Image src={Logo} style={styles.logoImage} />

                    {/* ডান পাশে টাইটেল এবং স্ট্যাটাস */}
                    <View style={styles.headerRight}>
                        <Text style={styles.title}>HOTEL VOUCHER</Text>
                        <Text style={styles.metaText}>
                            Booking Ref: {booking._id?.slice(-8).toUpperCase()}
                        </Text>
                        <Text style={styles.metaText}>
                            Issued Date: {format(new Date(booking.createdAt), "dd MMM yyyy")}
                        </Text>

                        {/* Status Badge */}
                        <View style={[
                            styles.statusBadge,
                            {
                                backgroundColor:
                                    booking.status === 'completed' ? colors.success :
                                        booking.status === 'pending' ? colors.warning :
                                            booking.status === 'cancelled' ? colors.danger :
                                                colors.textLight
                            }
                        ]}>
                            <Text style={styles.statusText}>{booking.status}</Text>
                        </View>
                    </View>
                </View>

                {/* --- CLIENT INFO --- */}
                <Text style={styles.sectionTitle}>Client Information</Text>
                <View style={styles.row}>
                    <View style={styles.col3}>
                        <Text style={styles.label}>Guest Name</Text>
                        <Text style={styles.value}>{booking.name}</Text>
                    </View>
                    <View style={styles.col3}>
                        <Text style={styles.label}>Phone Number</Text>
                        <Text style={styles.value}>{booking.phoneNumber}</Text>
                    </View>
                    <View style={styles.col3}>
                        <Text style={styles.label}>Email Address</Text>
                        <Text style={styles.value}>{booking.email}</Text>
                    </View>
                </View>

                {/* --- RESERVATION DETAILS --- */}
                <Text style={styles.sectionTitle}>Reservation Details</Text>

                <View style={styles.reservationCard}>
                    {/* Hotel Header */}
                    <View style={styles.hotelInfoRow}>
                        <Image
                            style={styles.roomImage}
                            src="https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=400&auto=format&fit=crop"
                        />
                        <View style={styles.hotelDetails}>
                            <Text style={styles.hotelName}>{booking.room?.name}</Text>
                            <Text style={styles.locationText}>📍 {booking.room?.location}</Text>
                        </View>
                    </View>

                    {/* Details Grid */}
                    <View style={styles.gridContainer}>
                        <View style={styles.gridItem}>
                            <Text style={styles.label}>Check-in Date</Text>
                            <Text style={styles.value}>{format(checkInDate, "dd MMM yyyy")}</Text>
                        </View>
                        <View style={styles.gridItem}>
                            <Text style={styles.label}>Check-out Date</Text>
                            <Text style={styles.value}>{format(checkOutDate, "dd MMM yyyy")}</Text>
                        </View>
                        <View style={styles.gridItem}>
                            <Text style={styles.label}>Duration</Text>
                            <Text style={styles.value}>{nights} Nights</Text>
                        </View>
                        <View style={styles.gridItem}>
                            <Text style={styles.label}>Total Price</Text>
                            <Text style={[styles.value, { color: colors.primary, fontSize: 11 }]}>
                                $ {booking.totalPrice?.toLocaleString()}
                            </Text>
                        </View>

                        {/* Row 2 */}
                        <View style={styles.gridItem}>
                            <Text style={styles.label}>Guests</Text>
                            <Text style={styles.value}>{booking.totalGuest} Persons</Text>
                        </View>
                        <View style={styles.gridItem}>
                            <Text style={styles.label}>Rooms</Text>
                            <Text style={styles.value}>{booking.roomsBooked} Room(s)</Text>
                        </View>
                        <View style={[styles.gridItem, { width: '50%' }]}>
                            <Text style={styles.label}>Room Type</Text>
                            <Text style={styles.value}>Deluxe Ocean View</Text>
                        </View>
                    </View>
                </View>

                {/* --- AMENITIES --- */}
                <View>
                    <Text style={[styles.label, { marginBottom: 5, fontWeight: 'bold', color: colors.textDark }]}>
                        INCLUDED AMENITIES:
                    </Text>
                    <View style={styles.amenitiesRow}>
                        <Text style={styles.amenityItem}>✓ Free WiFi</Text>
                        <Text style={styles.amenityItem}>✓ Breakfast</Text>
                        <Text style={styles.amenityItem}>✓ Swimming Pool</Text>
                        <Text style={styles.amenityItem}>✓ Gym Access</Text>
                    </View>
                </View>

                {/* --- FOOTER (Info & Contact) --- */}
                <View style={styles.footerContainer}>
                    {/* Important Info */}
                    <View style={styles.infoColumn}>
                        <Text style={{ fontSize: 9, fontWeight: 'bold', marginBottom: 5 }}>Important Information</Text>
                        <Text style={styles.bulletPoint}>• Check-in time: 12:00 PM</Text>
                        <Text style={styles.bulletPoint}>• Valid ID proof required on arrival.</Text>
                        <Text style={styles.bulletPoint}>• Non-refundable booking policy.</Text>
                    </View>

                    {/* Contact Support */}
                    <View style={styles.infoColumn}>
                        <Text style={{ fontSize: 9, fontWeight: 'bold', marginBottom: 5 }}>Need Help?</Text>
                        <View style={{ marginBottom: 4 }}>
                            <Text style={styles.label}>Hotline</Text>
                            <Text style={styles.value}>+880 1700 000000</Text>
                        </View>
                        <View>
                            <Text style={styles.label}>Email</Text>
                            <Text style={styles.value}>support@lonhotel.com</Text>
                        </View>
                    </View>
                </View>

            </Page>
        </Document>
    );
}