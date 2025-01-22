import { View, Text, SafeAreaView, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import RenderHtml from "react-native-render-html";
import { useWindowDimensions } from "react-native";

export default function TOS() {
  const { width } = useWindowDimensions();

  const { goBack } = useNavigation();

  const enTos = `<p>Contract creation date: 15.11.2023</p>
  <p>Please read our terms, conditions and disclaimer before using the Web and mobile device application (Service, Services) operated by LivelyPencil (we, us or our).</p>
  <p>The content of the contract informs you that your access to the services we offer is subject to conditions. As soon as you start using our application and website, you are deemed to have accepted all the terms specified in this agreement.</p>
  <p>About our community guidelines</p>
  <p>We strictly adhere to the community guidelines set out below and there is zero tolerance. If you are reported to have violated the community rules, your account will be disabled without any warning and re-creation will not be allowed.</p>
  <p>All content on LivelyPencil is created and published by our users, and suspicious content that misleads the community and/or contains incomplete information is removed when we detect it. It is among our basic principles that any content that we have doubts about its accuracy and impartiality is not included on our platform.</p>
  <p>Our Basic Community Rules</p>
  <p>- Threatening, intimidating and blackmailing,</p>
  <p>- Harassment, bullying and spamming,</p>
  <p>- Plagiarism, producing provocative publications, provocative publications that agitate the public,</p>
  <p>- Creating and publishing misleading publications for commercial, political or individual interests,</p>
  <p>It is considered unwanted community behavior on LivelyPencil. The rules mentioned above and below also apply to real-time content broadcasts.</p>
  <p>The contents mentioned below cannot be shared. (Violence)</p>
  <p>- Human, animal bodies, limbs, bloody photographs/videos with lost integrity (publications for medical education purposes are exceptionally allowed after control)</p>
  <p>- Publications encouraging acts of violence, knives, guns and equipment that can be used as weapons. (Exceptional permission is given after control for publications for educational purposes within the scope of defense sciences)</p>
  <p>Rules for posting Explicit Conduct and Content (Nudity, Pornography)</p>
  <p>- Publications cannot be created for this purpose to promote sexual services.</p>
  <p>- Posting pornographic photos/videos, texts and writing comments is not allowed.</p>
  <p>- Do not share naked or underwear photos/videos of yourself or others.</p>
  <p>- Any posts and accounts that encourage pedophilia, talk about or normalize pedophilia acts will be deleted as soon as they are detected.</p>
  <p>Account creation, profile area, post covers</p>
  <p>- Using account information that impersonates persons or institutions,</p>
  <p>- Your profile picture must belong to you, it is forbidden to use pictures of other people, institutions, or well-known figures.</p>
  <p>- The account created is personal. It cannot be transferred to anyone else, cannot be loaned or sold. The legal obligations specified in this agreement are directed to the user who creates the account. In case the account is stolen or compromised in any way, the responsibility belongs to the user.</p>
  <p>- The copyright responsibility of the publication covers you add belongs to the user. As a result of applications made for images in which copyrights are violated, your image will be deleted after the copyright of the relevant applicant is checked. The same rule will apply to the images you use on the page.</p>
  <p>Our disclaimer regarding copyright infringement and published content.</p>
  <p>LivelyPencil content is created and published by its users. All responsibility for the content produced belongs to the user. Users have copyrights to the content they create. LivelyPencil does not claim any rights to these contents.</p>
  <p>LivelyPencil is not responsible for any violations of rights suffered by third parties arising from the content created by users. The action to be taken regarding the loss of rights suffered by third parties is to remove the content after checks*. *Controls are the process of reviewing the documents submitted by the rights holder by contacting <a data-fr-linked="true" href="mailto:destek@livelypencil.com">destek@livelypencil.com</a> with information providing evidence of official documents regarding the relevant content and making decisions. The decision to be taken; It is the process of removing content from the account of the user who published the relevant content.</p>
  <p>In case of repeated violations, the relevant user&apos;s account will be permanently deleted.</p>
  <p>Legal processes subject to legal cases</p>
  <p>Our users cannot claim that they do not know or are not in a position to know the responsibilities imposed on the parties by the laws in force in their countries. LivelyPencil may refrain from publishing content that it determines to be unlawful (even though it has been detected). In this case, users accept in advance LivelyPencil&apos;s disposition of the account and related contents.</p>
  <p>LivelyPencil is not a party or witness in any litigation arising from published content or disputes between users. If requested by the courts in legal processes, technical information and documents are provided within the scope of LivelyPencil&apos;s capabilities and capacity.</p>
  <p>Since LivelyPencil does not process or monitor users&apos; behavior and content, it cannot testify in any legal process, does not have any data other than the basic member information required to maintain the services, and cannot provide any information other than this information.</p>
  <p>Users are subject to the obligation to create and publish content in accordance with the laws of the countries in which they reside and to comply with the relevant laws imposed in the countries in which they communicate between users.</p>
  <p>LivelyPencil supports freedom of expression by adhering to the principle of impartiality in publishing content by its users. Content that does not violate our publishing principles and is not subject to legal frameworks will remain on air as long as our platform provides service.</p>
  <p>We are not affiliated with any political, religious or social views, all content that complies with our content policies is accepted equally.</p>
  <p>About protecting your data</p>
  <p>Your name, e-mail address and password, which are required to create an account on LivelyPencil, as well as the content you create as long as you use your account, are stored on the servers of third party companies that provide services to us. We strive to keep your information secure in the best possible conditions, but no system is 100% secure. Therefore, you are likely to experience data loss due to situations including force majeure, cyber attacks or technical malfunctions. LivelyPencil is not responsible for any losses you may have incurred due to this or similar reasons.</p>
  <p>About Our Privacy Policy</p>
  <p>Our Company officials, employees, partners, users, customers, suppliers, institutions/individuals we cooperate with, and the employees and officials of these institutions, as well as all persons whose personal data are processed by our Company, about our processes regarding the collection, storage, processing, sharing and transfer of personal data by LivelyPencil. to inform.</p>
  <p>Information about your personal data and the content you create;</p>
  <p>As long as you use our services, along with your name, e-mail and password, which are the basic information required to create an account, the content and data you create are stored on the servers of third-party companies that provide services to LivelyPencil.</p>
  <p>We do not process your personal data, we do not sell or transfer the information you provide to create an account to a third party, we do not process the content you create and we do not sell it to third party persons or institutions or allow it to be processed.</p>
  <p>Contract issue date: 15.11.2023</p>
  <p>For your questions: <a data-fr-linked="true" href="mailto:destek@livelypencil.com">destek@livelypencil.com</a></p>
  <p><br></p>`;
  const trTos = `<p>S&ouml;zleşmenin oluşturulma tarihi: 15.11.2023&nbsp;</p>
  <p>LivelyPencil (biz, bizler veya bizim) Tarafından işletilen Web ve mobil cihaz uygulaması (Hizmet, Hizmetleri) kullanmadan &ouml;nce l&uuml;tfen şartlar, koşullar ve sorumluluk reddi beyanımızı okuyunuz.</p>
  <p>S&ouml;zleşmede i&ccedil;eriği size sunduğumuz hizmetlere erişiminizin koşullara bağlı olduğunu bildirir. Uygulama ve web sitemizi kullanmaya başladığınız anda bu s&ouml;zleşmede belirtilen t&uuml;m şartları kabul etmiş sayılırsınız.</p>
  <p>Topluluk kurallarımız hakkında</p>
  <p>Aşağıda belirtilen topluluk kurallarına sıkı bir şekilde bağlıyız ve sıfır tolerans g&ouml;sterilmektedir. Topluluk kurallarını ihlal ettiğiniz raporlandığı takdirde hi&ccedil; bir uyarı olmaksızın hesabınızın devre dışı bırakılmasına neden olur ve yeniden hesap oluşturmaya izin verilmez.</p>
  <p>LivelyPencil&rsquo;da yer alan &nbsp;t&uuml;m i&ccedil;erikler kullanıcılarımız tarafından oluşturulmakta ve yayınlanmakta olup topluluğu yanlış y&ouml;nlendiren ve/veya eksik bilgi i&ccedil;eren ş&uuml;pheli i&ccedil;erikler tarafımızca tespit edildiğinde kaldırılır. Doğruluğu ve tarafsızlığı konusunda ş&uuml;phe duyduğumuz hi&ccedil;bir i&ccedil;eriğin &nbsp;platformumuzda yer almaması temel prensiplerimiz arasındadır.</p>
  <p>Temel Topluluk Kurallarımız</p>
  <p>Tehdit etmek, g&ouml;zdağı vermek ve şantaj yapmak,</p>
  <p>Taciz, zorbalık ve spam g&ouml;ndermek,</p>
  <p>İhtihal yapmak, provokatif yayınlar &uuml;retmek, halkı galeyana getiren kışkırtıcı yayınlar,</p>
  <p>Ticari, siyasi, bireysel &ccedil;ıkarlar amacıyla yanıltıcı yayınlar oluşturmak, yayınlamak,</p>
  <p>LivelyPencil&rsquo;da istenmeyen topluluk davranışı olarak kabul edilmektedir. Yukarıda ve aşağıda belirtilen kurallar aynı şekilde ger&ccedil;ek zamanlı i&ccedil;erik yayınlarını da kapsamaktadır.</p>
  <p>Aşağıda belirtilen i&ccedil;erikler paylaşılamaz. (Şiddet)</p>
  <p>B&uuml;t&uuml;nl&uuml;ğ&uuml; kaybolmuş insan, hayvan bedenleri, uzuvlar, kanlı fotoğraf/video (tıbbi eğitim ama&ccedil;lı yayınlar kontrol sonrası istisnai izin verilir)</p>
  <p>Şiddet eylemleri, bı&ccedil;ak, silah ve silah olarak kullanılabilen ara&ccedil; gere&ccedil;leri teşvik eden yayınlar. (Savunma bilimleri kapsamında eğitim ama&ccedil;lı yayınlarda kontrol sonrası istisnai izin verilir)</p>
  <p>M&uuml;stehcen Davranış ve İ&ccedil;erik yayınlarına y&ouml;nelik kurallar (&Ccedil;ıplaklık, Pornografi)</p>
  <p>Cinsel hizmetlerin tanıtımı yapmak bu ama&ccedil;la yayınlar oluşturulamaz.</p>
  <p>Pornografik fotoğraf/video, metinler yayınlamak ve yorumlar yazmaya izin verilmemektedir.</p>
  <p>Kendinize veya başkasına ait &ccedil;ıplak, i&ccedil; &ccedil;amaşırlı fotoğraf/video paylaşmayın.</p>
  <p>Pedofili &ouml;zendirici pedofili eylemlerinden bahseden ve normalleştiren herhangi yayınlar ve hesaplar tespit edildiği anda silinir.</p>
  <p><br></p>
  <p><br></p>
  <p>Hesap oluşturma, profil alanı, yayın kapakları&nbsp;</p>
  <p>Kişi veya kurumları taklit eden hesap bilgileri kullanmak,</p>
  <p>Profil resminiz size ait olmalıdır, başka kişilerin, kurumların, tanınmış şahsiyetlerin resimlerini kullanmak yasaktır.&nbsp;</p>
  <p>Oluşturulan hesap kişiseldir. Başkasına devredilemez, &ouml;d&uuml;n&ccedil; verilmez ve satılamaz. &nbsp;İş bu s&ouml;zleşmede belirtilen yasal y&uuml;k&uuml;ml&uuml;l&uuml;kler hesabı oluşturan kullanıcıya y&ouml;neliktir. Hesabın &ccedil;alınması veya herhangi bir şekilde ele ge&ccedil;irilmesi durumunda sorumluluk kullanıcıya aittir.&nbsp;</p>
  <p>Eklediğiniz yayın kapaklarının telif sorumluluğu kullanıcıya aittir. Telif haklarının ihlal edildiği g&ouml;rseller i&ccedil;in yapılan başvurular sonucunda, ilgili başvurucunun telif hakları kontrol edildikten sonra g&ouml;rseliniz silinir. Aynı kural sayfa i&ccedil;inde kullandığınız g&ouml;rseller i&ccedil;inde ge&ccedil;erli olacaktır.</p>
  <p>Telif hakları ihlali ve yayınlanan i&ccedil;eriklere dair sorumluluk reddi beyanımız.</p>
  <p>LivelyPencil i&ccedil;eriği kullanıcıları tarafından oluşturulup yayımlanmaktadır. &Uuml;retilen i&ccedil;eriğin t&uuml;m sorumluluğu kullanıcıya aittir. Kullanıcılar oluşturdukları i&ccedil;eriğin telif haklarına sahiptir LivelyPencil bu i&ccedil;eriklere dair herhangi bir hak talebinde bulunmaz.&nbsp;</p>
  <p>Kullanıcıların oluşturdukları i&ccedil;eriklerden kaynaklı &uuml;&ccedil;&uuml;nc&uuml; tarafların uğradığı hak kaybı ihlalinden dolayı LivelyPencil sorumlu değildir. &Uuml;&ccedil;&uuml;nc&uuml; tarafların uğradıkları hak kayıplarına ilişkin yapılacak işlem kontroller* sonrası i&ccedil;eriğin kaldırılmasıdır. *Kontroller, hak sahibinin ilgili i&ccedil;eriğe dair resmi belgelerle kanıtlayıcı i&ccedil;erikler sunan bilgilerle <a data-fr-linked="true" href="mailto:destek@livelypencil.com">destek@livelypencil.com</a> adresine başvurarak ilettiği belgelerin incelenmesi ve karar alınması s&uuml;recidir. Alınacak karar; ilgili i&ccedil;eriği yayınlayan kullanıcının hesabından i&ccedil;eriğin kaldırılması işlemidir.</p>
  <p>Tekrar eden ihlallerde ilgili kullanıcının hesabı kalıcı olarak silinir.</p>
  <p>Hukuki davalara konu olan yasal s&uuml;re&ccedil;ler</p>
  <p>Kullanıcılarımız, bulundukları &uuml;lkelerde y&uuml;r&uuml;rl&uuml;kte olan kanunların taraflara y&uuml;klediği sorumlulukları bilmediği veya bilebilecek durumda olmadığını ileri s&uuml;remez. LivelyPencil, yasalara aykırı olduğunu tespit ettiği i&ccedil;erikleri (tepit edildiği halde) &nbsp;yayımlamaktan imtina edebilir. Bu durumda kullanıcılar, LivelyPencil&rsquo;ın hesap ve ilgili i&ccedil;erikler &uuml;st&uuml;ndeki tasarrufunu peşinen kabul eder.</p>
  <p>Yayınlanmış i&ccedil;erikler veya kullanıcılar arası anlaşmazlıklar sonucu oluşan her t&uuml;r davada LivelyPencil&rsquo;ın taraf veya tanık değildir. Hukuki s&uuml;re&ccedil;lerde mahkemeler talep ettiği takdirde teknik bilgiler LivelyPencil&rsquo;ın imkan ve kapasitesi &ccedil;er&ccedil;evesinde bilgi ve belgeler sağlanmaktadır.&nbsp;</p>
  <p>LivelyPencil kullanıcıların davranışlarını, i&ccedil;eriğini işlemeyip takip etmediği i&ccedil;in herhangi bir hukuki s&uuml;re&ccedil;te tanıklık edemez, hizmetlerin s&uuml;rd&uuml;r&uuml;lmesi i&ccedil;in gerekli olan temel &uuml;ye bilgileri dışında herhangi bir veriye sahip değildir ve bu bilgiler dışında herhangi bir bilgi sağlayamaz.</p>
  <p>Kullanıcılar bulundukları &uuml;lkelerin yasalarına uygun şekilde i&ccedil;erik oluşturmak, yayınlamak ve kullanıcılar arası iletişimde bulundukları &uuml;lkelerde konulan bağlantılı yasalara uyma y&uuml;k&uuml;ml&uuml;ğ&uuml;ne tabidir.&nbsp;</p>
  <p>LivelyPencil, kullanıcılarının i&ccedil;erik yayınlamasında tarafsızlık ilkesine bağlı kalarak, ifade &ouml;zg&uuml;rl&uuml;ğ&uuml;n&uuml; destekler. Yayın ilkelerimizi ihlal etmeyen ve yasal &ccedil;er&ccedil;eveye konu olmayan i&ccedil;eriklerin platformumuz hizmet sunduğu s&uuml;rece yayında kalır.&nbsp;</p>
  <p>Herhangi bir siyasi, dini, toplumsal g&ouml;r&uuml;şe bağlı değiliz, i&ccedil;erik politikalarımızla uyumlu t&uuml;m i&ccedil;erikler eşit olarak kabul edilmektedir.&nbsp;</p>
  <p>Verilerinizin korunması hakkında</p>
  <p>LivelyPencil&rsquo;da hesap oluşturmanız i&ccedil;in gerekli olan İsim, e-posta adresi ve parolanız bunlarla birlikte hesabınızı kullandığınız s&uuml;rece oluşturduğunuz i&ccedil;erikler, bizlere hizmet sunan &uuml;&ccedil;&uuml;nc&uuml; taraflar şirketlerin sunucularında saklanmaktadır. &nbsp;Bilgilerinizi en iyi koşullarda g&uuml;venli bir şekilde tutmak i&ccedil;in &ccedil;abalıyoruz ancak hi&ccedil;bir sistem %100 g&uuml;venli değildir. Bu nedenle m&uuml;cbir sebepler, siber saldırılar veya teknik arızalar dahil olmak &uuml;zere oluşan durumlar sebebiyle veri kaybı yaşamanız muhtemeldir. Bu veya benzer nedenlerden dolayı oluşan her t&uuml;rl&uuml; kayıplarınızdan dolayı LivelyPencil sorumlu değildir.&nbsp;</p>
  <p>Gizlilik Politikamız Hakkında</p>
  <p>LivelyPencil tarafından kişisel verilerin toplanması, saklanması, işlenmesi, paylaşılması ve aktarılmasına ilişkin s&uuml;re&ccedil;lerimiz hakkında Şirket yetkililerimizi, &ccedil;alışanlarımızı, ortaklarımızı, kullanıcılarımızı, m&uuml;şterilerimizi, tedarik&ccedil;ilerimizi, işbirliği i&ccedil;inde olduğumuz kurumları/kişileri ve bu kurumların &ccedil;alışanlarını ve yetkililerini ve ayrıca kişisel verileri Şirketimiz tarafından işlenen t&uuml;m kişileri bilgilendirmektir.&nbsp;</p>
  <p>Kişisel verilerinizin ve oluşturduğunuz i&ccedil;eriklere dair bilgiler;</p>
  <p>Hesap oluşturmak i&ccedil;in gerekli olan temel bilgiler olan isim, e-posta ve parolanızla birlikte hizmetlerimizi kullandığınız s&uuml;rece oluşturduğunuz i&ccedil;erik ve veriler LivelyPencil&rsquo;a hizmet sağlayan &uuml;&ccedil;&uuml;nc&uuml; taraf şirketlerin sunucularında saklanır.</p>
  <p>Kişisel verilerinizi işlemiyoruz, hesap oluşturmak i&ccedil;in sunduğunuz bilgileri &uuml;&ccedil;&uuml;nc&uuml; bir tarafa satmıyor ve devretmiyoruz, oluşturduğunuz i&ccedil;erikleri işlemiyoruz ve &uuml;&ccedil;&uuml;nc&uuml; taraf kişi veya kurumlarla satmıyoruz ve işlenmesine izin vermiyoruz.</p>
  <p>S&ouml;zleşme d&uuml;zenleme tarihi: 15.11.2023&nbsp;</p>
  <p>Sorularınız i&ccedil;in : <a data-fr-linked="true" href="mailto:destek@livelypencil.com">destek@livelypencil.com</a></p>
  <p><br></p>`;

  const [tos, setTos] = useState(enTos);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#fff", paddingHorizontal: 20 }}
    >
      <View className="flex-row items-center justify-end mt-4">
        <View className="flex-row space-x-2 mr-2">
          <Text
            onPress={() => setTos(enTos)}
            className="text-xs font-Inter-bold border rounded-sm py-0.5 px-1 bg-blue-500 text-white"
          >
            English
          </Text>
          <Text
            onPress={() => setTos(trTos)}
            className="text-xs font-Inter-bold border rounded-sm py-0.5 px-1 bg-red text-white "
          >
            Türkçe
          </Text>
        </View>
      </View>

      <ScrollView className="mt-2">
        <View>
          <RenderHtml contentWidth={width} source={{ html: tos }} />
          {/* <Text className="mx-2 text-sm font-Inter-Black">{tos}</Text> */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
