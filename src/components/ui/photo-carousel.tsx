"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

const PHOTOS = [
  { img: "https://cdn.josetxu.com/img/gp-tonin-rocodromo.jpg", climber: "Carlos Rubio", photo: "Josetxu López", route: "Toñin (7b)", sector: "El Rocodromo", zone: "La Pedriza" },
  { img: "https://cdn.josetxu.com/img/gp-normal-caliz.jpg", climber: "Josetxu López", photo: "Uge Garcia", route: "Normal (Ae)", sector: "El Caliz", zone: "La Pedriza" },
  { img: "https://cdn.josetxu.com/img/gp-cumbre-totem.jpg", climber: "Antonio, Aitor & Josefer", photo: "Josetxu López", route: "Sur Clasica (6a)", sector: "El Totem", zone: "La Pedriza" },
  { img: "https://cdn.josetxu.com/img/gp-oscar-raul-hueco-hoces2.jpg", climber: "Aitor Saz", photo: "Tximo", route: "Oscar & Raul (6a)", sector: "Hueco de las Hoces", zone: "La Pedriza" },
];

export default function PhotoCarousel() {
  return (
    <div className="w-full py-10 overflow-hidden">
      <Swiper
        effect={"coverflow"}
        grabCursor={true}
        centeredSlides={true}
        loop={true}
        slidesPerView={1}
        breakpoints={{
          640: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
        }}
        coverflowEffect={{
          rotate: 50,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: true,
        }}
        pagination={{ el: ".custom-pagination", clickable: true }}
        modules={[EffectCoverflow, Pagination]}
        className="mySwiper"
      >
        {PHOTOS.map((item, index) => (
          <SwiperSlide key={index} className="relative w-[300px] h-[450px] rounded-xl overflow-hidden group">
            <div 
              className="w-full h-full bg-center bg-cover"
              style={{ backgroundImage: `url(${item.img})` }}
            >
              <div className="info-overlay">
                <span title="Climber">{item.climber}</span>
                <span title="Photo">{item.photo}</span>
                <span title="Route">{item.route}</span>
                <span title="Sector">{item.sector}</span>
                <span title="Zone">{item.zone}</span>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      
      {/* Paginación personalizada */}
      <div className="custom-pagination flex justify-center gap-2 mt-8"></div>

      <style jsx global>{`
        .swiper-slide {
          width: 350px !important;
          height: 480px !important;
          border-radius: 15px;
        }

        .info-overlay {
          position: absolute;
          width: 100%;
          height: 50%;
          background: linear-gradient(180deg, transparent 0, rgba(0,0,0,0.8) 100%);
          bottom: -100%;
          left: 0;
          padding: 20px;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          transition: bottom 0.5s ease;
          box-sizing: border-box;
        }

        .swiper-slide-active .info-overlay {
          bottom: 0;
        }

        .info-overlay span {
          color: #e6e6e6;
          font-size: 11px;
          text-transform: uppercase;
          margin: 4px 0;
          padding-left: 35px;
          position: relative;
          display: block;
        }

        /* Re-implementación de tus iconos en CSS puro */
        .info-overlay span::before {
          content: "";
          position: absolute;
          left: 10px;
          top: 0;
          background: rgba(255,255,255,0.2);
          width: 20px;
          height: 20px;
          border-radius: 4px;
        }

        /* Paginación estilo barra */
        .custom-pagination .swiper-pagination-bullet {
          background: #696969;
          width: 10px;
          height: 10px;
          opacity: 1;
          transition: all 0.3s ease;
        }
        .custom-pagination .swiper-pagination-bullet-active {
          background: #ffc107;
          width: 30px;
          border-radius: 5px;
        }
      `}</style>
    </div>
  );
}