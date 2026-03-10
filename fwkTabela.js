let tabela = document.getElementsByTagName("tabela");
for(let i=0;i<tabela.length;i++){
    let tab = tabela[i];
    let linhas= tab.getAttribute("linha");
    let colunas= tab.getAttribute("coluna");

    let novaTabela= document.createElement("table");
    
    let colspanAttr=tab.getAttribute("colspan");
    let matriz = [];
    if(colspanAttr){
        matriz = colspanAttr.split(";");
        matriz=matriz.map(l => l.trim());
        matriz=matriz.map(l => l.split(" ")) ;
    }
    console.log(matriz);

    // ADIÇÃO DA TAREFA: criando variável para conter <EXPAND> 
    let expansoes = tab.getElementsByTagName("expand");
    let ocupado = {}; // Para controlar células preenchidas por rowspan

    for(let x=0;x<linhas;x++){
        let tr=document.createElement("tr");
        for(let y=0;y<colunas;y++){
            
            // Verificando para não ter sobreposição de células na tabela
            if(ocupado[x + "," + y]) continue;

            let td=document.createElement("td");
            td.innerText = "Item " + x + "," + y;
            
            let span=1;

            for(let k =0; k<matriz.length;k++){
                if(matriz[k][0] == x && matriz[k][1]==y){
                    span=matriz[k][2];
                    break;
                }
            }
            if(span>1){
                td.setAttribute("colspan",span);
                y += span-1;
            } 

            // ADIÇÃO DA TAREFA: lógica para <EXPAND>
            for(let e=0; e < expansoes.length; e++){
                let exLinha = expansoes[e].getAttribute("linha");
                let exColuna = expansoes[e].getAttribute("coluna");
                let exTam = expansoes[e].getAttribute("tamanho");
                let exTipo = expansoes[e].getAttribute("tipo");

                if(exLinha == x && exColuna == y){
                    if(exTipo == "coluna"){
                        td.setAttribute("colspan", exTam);
                        y += (exTam - 1);
                    } else if(exTipo == "linha"){
                        td.setAttribute("rowspan", exTam);
                        
                        for(let r=1; r < exTam; r++){
                            ocupado[(parseInt(x) + r) + "," + y] = true;
                        }
                    }
                }
            }

            tr.appendChild(td);
        }
        novaTabela.appendChild(tr);
    }
    tab.appendChild(novaTabela);
}
