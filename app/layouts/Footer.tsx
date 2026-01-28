import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const Footer: React.FC = () => {
  return (
    <View style={styles.footer}>
      <Text style={styles.footerText}>© 2023 Shaka Bank. All rights reserved.</Text>
      <View style={styles.footerLinks}>
        <TouchableOpacity style={styles.footerLink}>
          <Text style={styles.footerLinkText}>Privacy Policy</Text>
        </TouchableOpacity>
        <Text style={styles.separator}>•</Text>
        <TouchableOpacity style={styles.footerLink}>
          <Text style={styles.footerLinkText}>Terms of Service</Text>
        </TouchableOpacity>
        <Text style={styles.separator}>•</Text>
        <TouchableOpacity style={styles.footerLink}>
          <Text style={styles.footerLinkText}>Contact Us</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    backgroundColor: '#1A5FB4',
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  footerText: {
    color: 'white',
    fontSize: 12,
    marginBottom: 8,
  },
  footerLinks: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerLink: {
    paddingHorizontal: 8,
  },
  footerLinkText: {
    color: 'white',
    fontSize: 12,
    textDecorationLine: 'underline',
  },
  separator: {
    color: 'white',
    fontSize: 12,
  },
});

export default Footer;