import { Text, SafeAreaView, ScrollView, Pressable } from "react-native";
import RenderHtml from "react-native-render-html";
import { useWindowDimensions } from "react-native";
import { useState } from "react";
import clsx from "clsx";

export default function AboutUs() {
  const aboutusTextEn = `<p><strong>PREFACE</strong></p>
<p>We love reading and writing. All we needed was a good pen and plenty of pages. LivelyPencil was developed for this purpose and is a candidate to become one of the world&apos;s largest content platforms in the future, where hundreds of thousands of writers produce millions of stories.</p>
<p>In 2019, we experienced an extraordinary journey from a dream to reality. At the end of the 5th year, we are finally ready to serve you with the beta version of LivelyPencil.</p>
<p>Most of the features we planned are not included in the LivelyPencil Beta version. We regret to inform you that we would like to offer you more features, but due to excessive costs we had to carry out controlled development. We promise you; Our adventure of improving the road with amazing features will continue.</p>
<p>We want to build a great community with your support. We are glad you are with us and thank you.</p>
<p><strong>ABOUT US</strong></p>
<p>LivelyPencil content creation and publishing model was designed by Ayhan Ergezen. Our development team is led by Shahroon Farooqi. Frontend Imran KHAN and Backend Mohammad Subnan are sharing duties.</p>
<p>(BE OUR VOLUNTEER: LivelyPencil needs your support in many matters such as auditing products and services, user satisfaction and testing new features. If you would like to join our volunteer supporter team, send a message to <a data-fr-linked="true" href="mailto:destek@livelypencil.com">destek@livelypencil.com</a>)</p>
<p><br></p>
<p>FEATURES AND DEVELOPMENT SCHEDULE</p>
<p>Beta Version: Released on November 28, 2023.</p>
<p>In the first release, basic account and content creation functions were activated. Creating posts, adding pages, commenting and liking features are among the basic functions.</p>
<p>2024 -2025 DEVELOPMENT CALENDAR</p>
<p>Use page short code</p>
<p>&bull; Short codes used within the page to link to other users and their pages.</p>
<p>Content listing by country</p>
<p>&bull; Encountering content created in your country</p>
<p>Multilanguage</p>
<p>&bull; Language support will be increased gradually.</p>
<p>Quoting Feature (Retells)</p>
<p>&bull; You will share quotes from the page content by tagging them.</p>
<p>&bull; Add your comment to quotes and get comments on your quote.</p>
<p>&bull; Tag list creates live topic list.</p>
<p>&bull; You will be able to post comments directly to the tags.</p>
<p>Community Streams</p>
<p>&bull; Ability to create community posts where multiple authors can add pages. Accept users you approve to community posts, as authors, readers</p>
<p>Subscription System (For your followers)</p>
<p>&bull; Make money from your content.</p>
<p>Verified Accounts</p>
<p>&bull; Verified account badges</p>
<p>Survey System</p>
<p>&bull; Adding surveys to pages.</p>
<p>Messaging</p>
<p>&bull; Message with your friends.</p>
<p>GENERAL FEATURES</p>
<p>&bull; Refutation feature</p>
<p>&bull; Active Camera use</p>
<p>&bull; Video adding feature</p>
<p>&bull; Google translate</p>
<p>&bull; Sign In With Apple and Google</p>
<p>&bull; Short menu for content creation</p>
<p>&bull; Drawing feature on the pages</p>
<p>&bull; Share other user pages to your users</p>
<p>&bull; Share pages other platforms</p>
<p>&bull; Provide page preview option</p>
<p>&bull; Gif Box, add gifs to pages.</p>
<p>&bull; E-book store (make Money your contents)</p>
<p>&bull; Wordpress Extensions</p>
<p>&bull; API System</p>
<p><br></p>
<p>For your questions, send us a message from the Contact screen.</p>
<p>e-mail: support@livelypencil.com</p>
<p><br></p>`;
  const aboutusTextTr = `<p><strong>&Ouml;NS&Ouml;Z</strong> &nbsp; &nbsp;</p>
<p>Okumayı ve yazmayı seviyoruz. İhtiyacımız olan tek şey iyi bir kalem ve bolca sayfaydı.. LivelyPencil bu ama&ccedil;la geliştirildi ve &nbsp;gelecekte y&uuml;z binlerce yazarın milyonlarca hikaye &uuml;rettiği d&uuml;nyanın en b&uuml;y&uuml;k i&ccedil;erik platformlarından birisi olmaya adaydır.</p>
<p>2019 yılında bir hayalden ger&ccedil;ekliğe doğru sıra dışı bir yolculuk yaşadık. &nbsp;5.yılın sonunda nihayet LivelyPencil&rsquo;ın beta s&uuml;r&uuml;m&uuml; sizlere hizmet vermeye hazır gale geldik. &nbsp;</p>
<p>LivelyPencil Beta s&uuml;r&uuml;m&uuml;nde planladığımız &ouml;zelliklerin b&uuml;y&uuml;k bir b&ouml;l&uuml;m&uuml; yer almamaktadır. &Uuml;z&uuml;lerek bildiririz ki sizlere daha fazla &ouml;zellik sunmak isterdik fakat aşırı maliyetler nedeniyle kontroll&uuml; geliştirme yapmak zorunda kaldık. Size s&ouml;z veriyoruz; şaşırtıcı &ouml;zelliklerle yolu geliştirme maceramız devam edecektir. &nbsp;</p>
<p>Sizlerin desteğiyle birlikte b&uuml;y&uuml;k bir topluluk inşa etmek istiyoruz. &nbsp;Bizimle olduğunuz i&ccedil;in mutluyuz ve teşekk&uuml;r ederiz.</p>
<p>HAKKIMIZDA</p>
<p>LivelyPencil i&ccedil;erik oluşturma ve yayınlama modeli Ayhan Ergezen tarafından tasarlandı. &nbsp;Geliştirme ekibimize Shahroon Farooqi liderlik etmektedir. Frontend Imran KHAN, Backend Mohammad Subnan g&ouml;rev paylaşımı yapmaktadır. &nbsp;</p>
<p>(G&Ouml;N&Uuml;LL&Uuml;M&Uuml;Z OLUN: LivelyPencil&rsquo;da &uuml;r&uuml;n ve hizmetlerin denetlenmesi, kullanıcı memnuniyeti ve yeni &ouml;zelliklerin test edilmesi gibi bir &ccedil;ok konuda desteğinize ihtiya&ccedil; duyuyor. G&ouml;n&uuml;ll&uuml; destek&ccedil;i ekibimize katılmak isterseniz; destek@livelypencil.com adresine mesaj g&ouml;nderin.)</p>
<p><strong>&Ouml;ZELLİKLER VE GELİŞTİRME TAKVİMİ</strong></p>
<p>Beta S&uuml;r&uuml;m&uuml; : 28 Kasım 2023&rsquo;te yayınlandı.&nbsp;</p>
<p>İlk s&uuml;r&uuml;mde temel hesap ve i&ccedil;erik oluşturma işlevleri aktive edildi. Yayın oluşturma, sayfalar ekleme, yorum ve beğenme &ouml;zellikleri temel işlevler arasında yer almaktadır.</p>
<p>2024 -2025 &nbsp;GELİŞTİRME TAKVİMİ</p>
<p>Sayfada kısa kod kullanma</p>
<p>&bull; Sayfa i&ccedil;inde başka kullanıcılara ve sayfalarına bağlantı vermek i&ccedil;in kullanılan kısa kodlar.</p>
<p>İ&ccedil;erikleri &uuml;lkeye g&ouml;re listele.</p>
<p>&bull; Bulunduğunuz &uuml;lkede oluşturulmuş i&ccedil;eriklerle karşılaşmak</p>
<p><br></p>
<p>&Ccedil;oklu Dil Desteği</p>
<p>&bull; Aşamalı olarak dil desteği arttırılacak.</p>
<p><br></p>
<p>Altıla Paylaş &Ouml;zelliği (Retells)</p>
<p>&bull; Sayfa i&ccedil;eriklerinden yapılan alıntıları etiketleyerek paylaşacaksınız.</p>
<p>&bull; Alıntılara yorumunuzu ekleyin ve alıntınıza yorumlar alın.</p>
<p>&bull; Etiket listesi canlı konu listesi oluşturur.&nbsp;</p>
<p>&bull; Etiketlere doğrudan yorum g&ouml;nderebileceksiniz.</p>
<p>Topluluk &Ouml;zelliği</p>
<p>&bull; Birden fazla yazarın sayfa ekleyebildiği topluluk yayınları oluşturma &ouml;zelliği. Topluluk yayınlarına onayladığınız kullanıcıları kabul etme, yazar, okuyucu olarak</p>
<p>Abonelik Sistemi (Para kazanın)</p>
<p>&bull; İ&ccedil;eriklerinizden para kazanın</p>
<p>Onaylı hesaplar</p>
<p>&bull; Doğrulanmış hesap rozetleri</p>
<p>Anket Sistemi</p>
<p>&bull; Sayfalara anketler ekleyin</p>
<p>Mesajlaşma</p>
<p>&bull; Arkadaşlarınızla mesajlaşın</p>
<p><br></p>
<p>DİĞER &Ouml;ZELLİKLER</p>
<p>&bull; Tekzip sistemi</p>
<p>&bull; Etkin Kamera kullanımı</p>
<p>&bull; Video ekleme &ouml;zelliği</p>
<p>&bull; Google translate</p>
<p>&bull; Apple ve Google Hesabınla oturum a&ccedil;</p>
<p>&bull; İ&ccedil;erik oluşturma kısa yol men&uuml;s&uuml;</p>
<p>&bull; &Ccedil;izim yapma &ouml;zelliği</p>
<p>&bull; Sayfaları başkalarıyla paylaş</p>
<p>&bull; Sayfaları başka platformlarda paylaş</p>
<p>&bull; Sayfa &ouml;nizleme se&ccedil;enekleri</p>
<p>&bull; Gif Kutusu, sayfalara gif ekleyin.</p>
<p>&bull; E-kitap mağazası (para kazanmanız i&ccedil;in)</p>
<p>&bull; Wordpress bileşeni</p>
<p>&bull; API Sistemi</p>
<p><br></p>
<p>Sorularınız i&ccedil;in Contact ekranından bize mesaj atın.</p>
<p>e-posta : destek@livelypencil.com</p>
<p><br></p>`;
  const { width } = useWindowDimensions();
  const [toggle, setToggle] = useState(true);
  return (
    <SafeAreaView style={{ backgroundColor: "white", flex: 1 }}>
      <Pressable
        onPress={() => setToggle(!toggle)}
        className={clsx(
          "absolute bottom-8 right-8 rounded-full p-4 bg-red z-20",
          {
            "bg-blue-500": !toggle,
          }
        )}
      >
        <Text className="font-Inter-bold text-white">
          {!toggle ? `EN` : `TR`}
        </Text>
      </Pressable>
      <ScrollView className="h-screen px-3">
        <RenderHtml
          contentWidth={width}
          source={{ html: toggle ? aboutusTextEn : aboutusTextTr }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
