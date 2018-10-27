import subprocess
import args


PICARD='/Users/uwvirongs/downloads/picard-2.18.7/picard/build/libs/picard.jar'
GATK='/Users/uwvirongs/downloads/gatk-4.0.5.1/gatk'
VARSCAN='/Users/uwvirongs/Downloads/VarScan.v2.3.9.jar'
ANNOVAR='/Users/uwvirongs/Downloads/annovar'

VERSION = 'v0.9rs'

new_dir = ''
control_fastq = ''

#hard code to ul23 spacers and ul30
reference_fasta = args.f
#annotations for fasta
reference_gff = args.g

print('Indexing reference...')
# do once makes it binary
subprocess.call('bwa index ' + reference_fasta + ' 2> ' + new_dir + '/lava.log', shell=True)
print('Done indexing.')
subprocess.call('samtools faidx ' + reference_fasta + ' 2>> ' + new_dir + '/lava.log', shell=True)
subprocess.call(GATK + ' CreateSequenceDictionary -R ' + reference_fasta + ' --VERBOSITY ERROR 2>> ' + new_dir + '/lava.log', shell=True)

sample = ''
print('Aligning reads for sample ' + sample)
#aligning sample to reference fasta
subprocess.call('bwa mem -M -R \'@RG\\tID:group1\\tSM:' + sample + '\\tPL:illumina\\tLB:lib1\\tPU:unit1\' -p -t 6 -L [17,17] ' + 
    reference_fasta + ' ' + sample + ' > ' + sample + '.sam' + ' 2>> ' + new_dir + '/lava.log', shell=True)

#PICARD to sort sam file into bam file
subprocess.call('java -jar ' + PICARD + ' SortSam INPUT=' + sample + '.sam OUTPUT=' + sample + 
    '.bam SORT_ORDER=coordinate VERBOSITY=ERROR 2>> ' + new_dir + '/lava.log', shell=True)
subprocess.call('java -jar ' + PICARD + ' BuildBamIndex INPUT=' + sample + '.bam VERBOSITY=ERROR 2>> ' + new_dir + '/lava.log', shell=True)
#samtools mpileup indexed bam file creates .pileup
subprocess.call('samtools mpileup -f ' + reference_fasta + ' ' + sample + '.bam > ' + sample + '.pileup' + ' 2>> ' + 
    new_dir + '/lava.log', shell=True)

#do once, save output
subprocess.call('gff3ToGenePred ' + reference_gff + ' ' + new_dir + '/AT_refGene.txt -warnAndContinue -useName -allowMinimalGenes 2>> ' + new_dir 
    + '/lava.log', shell=True)
subprocess.call('../retrieve_seq_from_fasta.pl --format refGene --seqfile ' + reference_fasta + ' ' + new_dir + '/AT_refGene.txt --out AT_refGeneMrna.fa 2>> ' 
    + new_dir + '/lava.log', shell=True)

# TODO: Re-write these in python 
# make dataframe
subprocess.call('echo "Sample,Amino Acid Change,Position,AF,Change,Protein,NucleotideChange,LetterChange,Syn,Depth,Passage" > ' + 
    new_dir + '/merged.csv', shell=True)

#do once
subprocess.call('grep "ID=transcript:" ' + reference_gff + ' | awk -F\'[\t;:]\' \'{print $12 "," $4 "," $5}\' | sort -t \',\' -k2 -n > ' + 
    new_dir + '/proteins.csv', shell=True)

ref_done = False
#loop not needed - just one
if sample != control_fastq:
    #varscan looks for changes in sample relative to reference - creates vcf file (sample.vcf)
    subprocess.call('java -jar ' +  VARSCAN + ' somatic ' + control_fastq + '.pileup ' + sample + '.pileup ' + sample + 
        '.vcf --validation 1 --output-vcf 1 --min-coverage 2 2>> ' + new_dir + '/lava.log', shell=True)

    
    subprocess.call('mv ' + sample + '.vcf.validation ' + sample + '.vcf', shell=True)

    #changes vcf into another format sample_p.vcf
    subprocess.call('awk -F $\'\t\' \'BEGIN {FS=OFS="\t"}{gsub("0/0","0/1",$10)gsub("0/0","1/0",$11)}1\' ' + 
                    sample + '.vcf > ' + sample + '_p.vcf', shell=True)

    #converting vcf into .avinput using annovar
    subprocess.call('convert2annovar.pl -withfreq -format vcf4 -includeinfo ' + sample + '_p.vcf > ' + sample + '.avinput 2>> ' + new_dir + '/lava.log', shell=True)
    #annotates all mutations with codon changes - perl file that comes with annovar
    subprocess.call('annotate_variation.pl -outfile ' + sample + ' -v -buildver AT ' + sample + '.avinput ' + new_dir + '/db/ 2>> ' + new_dir + '/lava.log', shell=True)

    subprocess.call('printf ' + sample + '"," >> ' + new_dir + '/reads.csv', shell=True)
    subprocess.call('samtools flagstat ' + sample + '.bam | awk \'NR==1{printf $1","} NR==5{printf $1","} NR==5{print substr($5,2)}\' >> ' 
        + new_dir + '/reads.csv 2>> ' + new_dir + '/lava.log', shell=True)
    subprocess.call('awk -F":" \'($24+0)>=5{print}\' ' + sample + '.exonic_variant_function > ' + sample + '.txt', shell=True)

    # subprocess.call('grep "SNV" ' + sample + '.txt > a.tmp ', shell=True)
    # subprocess.call('grep "stop" ' + sample + '.txt >> a.tmp', shell=True)
    # subprocess.call('mv a.tmp ' + sample + '.txt', shell=True)
    # subprocess.call('SAMPLE="$(awk -F"," -v name=' + sample + ' \'$1==name {print $2}\' ' + metadata_location + ')" ', shell=True)
    # subprocess.call('awk -v name=' + sample + ' -v sample=$SAMPLE -F\'[\t:,]\' \'{print name","$6" "substr($9,3)","$12","$49+0","substr($9,3)","$6","substr($8,3)","substr($8,3,1)" to "substr($8,length($8))","$2","$46","sample}\' ' + 
    # 	sample + '.txt > ' + sample + '.csv', shell = True)
    # subprocess.call('cat ' + sample + '.csv >> ' + new_dir + '/merged.csv', shell=True)