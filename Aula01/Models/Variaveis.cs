namespace Aula01.Models
{
    public class Variaveis
    {
        // Tipos implicitos
        // var teste = 10

        // Anotação de Tipos
        public int userCount = 10;

        //Uma variavel pode ser declarada
        // e nao inicializada
        public int totalCount;

        //constantes
        //para declarar uma constante
        //utilizamos a palavra-chave CONST
        //no entanto a CONST deve ser inicializada qunado declarada
        const int interestRate = 10;

        public byte minByte = 0;
        public byte maxByte = 255;

        public sbyte minSbyte = -128;
        public sbyte maxSbyte = 127;

        public short minShort = -32768;
        public short maxShort = 32767;

        public ushort minUshort = 0;
        public ushort maxUshort = 65535;

        public int minInt = -2147483648;
        public int maxInt = 2147483647;

        public uint minUint = 0;
        public uint maxUint = 4294967295;

        public long minLong = -9223372036854775808;
        public long maxLong = 9223372036854775807;


        //O método construtor é invocado
        //na instanciação do objeto por meio
        //da palavra reservada new
        //por regra, o construtor sempre tem 
        // o mesmo nome da classe

        //Pareteses é procedimento
        //Colchetes é Matriz

        public Variaveis()
        {
            totalCount = 0;

            // tipo implicito
            // a palavra chave var se encarrega
            // de definir o tipo da variavel
            // na instruçao de atribuicao
            // o sinal de "=" é atribuição
            var signalStrength = 22;
            var companyName = "ACME";

        }

       
    }
}
