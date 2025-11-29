package com.levelupgamer.backend.config;

import com.levelupgamer.backend.entity.Product;
import com.levelupgamer.backend.entity.Role;
import com.levelupgamer.backend.entity.User;
import com.levelupgamer.backend.repository.ProductRepository;
import com.levelupgamer.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

        private final UserRepository userRepository;
        private final ProductRepository productRepository;
        private final PasswordEncoder passwordEncoder;

        @Override
        @SuppressWarnings("null")
        public void run(String... args) throws Exception {
                // Create Admin
                if (userRepository.findByEmail("admin@levelupgamer.com").isEmpty()) {
                        userRepository.save(User.builder()
                                        .fullName("Admin User")
                                        .email("admin@levelupgamer.com")
                                        .password(passwordEncoder.encode("admin123"))
                                        .age(30)
                                        .duocEmail(false)
                                        .role(Role.ADMIN)
                                        .points(0)
                                        .build());
                }

                // Create Client (Duoc)
                if (userRepository.findByEmail("cliente@duoc.cl").isEmpty()) {
                        userRepository.save(User.builder()
                                        .fullName("Cliente Duoc")
                                        .email("cliente@duoc.cl")
                                        .password(passwordEncoder.encode("duoc123"))
                                        .age(20)
                                        .duocEmail(true)
                                        .role(Role.CLIENT)
                                        .points(0)
                                        .build());
                }

                // Create Products
                if (productRepository.count() == 0) {
                        // Juegos de Mesa
                        productRepository.save(Product.builder()
                                        .code("JM001")
                                        .name("Catan")
                                        .category("Juegos de Mesa")
                                        .price(29990)
                                        .img("https://ansaldo.cl/cdn/shop/files/17645_66f20db0-ba69-416f-af76-dfbe9486ea3c.jpg?v=1745861121")
                                        .stock(20)
                                        .build());

                        productRepository.save(Product.builder()
                                        .code("JM002")
                                        .name("Carcassonne")
                                        .category("Juegos de Mesa")
                                        .price(24990)
                                        .img("https://devirinvestments.s3.eu-west-1.amazonaws.com/img/catalog/product/8436017222593-1200-frontflat-copy.jpg")
                                        .stock(15)
                                        .build());

                        // Accesorios
                        productRepository.save(Product.builder()
                                        .code("AC001")
                                        .name("Control Xbox Series X")
                                        .category("Accesorios")
                                        .price(59990)
                                        .img("https://sniper.cl/cdn/shop/files/D_970114-MLA45317791910_032021-O_500x.jpg?v=1731960960")
                                        .stock(30)
                                        .build());

                        productRepository.save(Product.builder()
                                        .code("AC002")
                                        .name("Auriculares HyperX Cloud II")
                                        .category("Accesorios")
                                        .price(79990)
                                        .img("https://todoclick.cl/6730623-large_default/audifonosgamerhyperxcloudiiwirelessredusb71ps4xboxonepcymac.jpg")
                                        .stock(25)
                                        .build());

                        // Consolas
                        productRepository.save(Product.builder()
                                        .code("CO001")
                                        .name("PlayStation 5")
                                        .category("Consolas")
                                        .price(549990)
                                        .img("https://t4.ftcdn.net/jpg/03/57/13/43/360_F_357134347_AztRpwYCjbtgeM9l6u1NbRSvGOiATjxT.jpg")
                                        .stock(10)
                                        .build());

                        // Computadores Gamers
                        productRepository.save(Product.builder()
                                        .code("CG001")
                                        .name("PC Gamer ASUS ROG Strix")
                                        .category("Computadores Gamers")
                                        .price(1299990)
                                        .img("https://m.media-amazon.com/images/I/61nHcNSJQRL._AC_SL1175_.jpg")
                                        .stock(5)
                                        .build());

                        // Sillas Gamers
                        productRepository.save(Product.builder()
                                        .code("SG001")
                                        .name("Secretlab Titan")
                                        .category("Sillas Gamers")
                                        .price(349990)
                                        .img("https://m.media-amazon.com/images/I/612PFdruQ-L._AC_SL6000_.jpg")
                                        .stock(8)
                                        .build());

                        // Mouse
                        productRepository.save(Product.builder()
                                        .code("MS001")
                                        .name("Logitech G502 HERO")
                                        .category("Mouse")
                                        .price(49990)
                                        .img("https://media.falabella.com/falabellaCL/6876288_1/w=1500,h=1500,fit=pad")
                                        .stock(40)
                                        .build());

                        // Mousepad
                        productRepository.save(Product.builder()
                                        .code("MP001")
                                        .name("Razer Goliathus Extended")
                                        .category("Mousepad")
                                        .price(29990)
                                        .img("https://media.spdigital.cl/thumbnails/products/tmpo1xo4uaj_f95b13b4_thumbnail_4096.jpg")
                                        .stock(50)
                                        .build());

                        // Poleras
                        productRepository.save(Product.builder()
                                        .code("PP001")
                                        .name("Polera 'Level-Up'")
                                        .category("Poleras Personalizadas")
                                        .price(14990)
                                        .img("https://www.tricot.cl/dw/image/v2/BGHZ_PRD/on/demandware.static/-/Sites-master-catalog-tricot/default/dw015e5f23/images/large/PD551820.jpg")
                                        .stock(100)
                                        .build());
                }
        }
}
